﻿/***************\
   controller
\***************/
gp.Controller = function ( config, model, requestModel ) {
    var self = this;
    this.config = config;
    this.model = model;
    this.requestModel = requestModel;
    this.$n = $( config.node );
    if ( config.pager ) {
        this.requestModel.top = 25;
    }
    this.handlers = {
        readHandler: self.read.bind( self ),
        commandHandler: self.commandHandler.bind( self ),
        rowSelectHandler: self.rowSelectHandler.bind( self ),
        httpErrorHandler: self.httpErrorHandler.bind( self ),
        toolbarChangeHandler: self.toolbarChangeHandler.bind( self ),
        toolbarEnterKeyHandler: self.toolbarEnterKeyHandler.bind( self )
    };
    this.done = false;
    this.eventDelegates = {};
    this.addBusyDelegates();
};

gp.Controller.prototype = {

    init: function () {
        var self = this;
        this.addCommandHandlers( this.config.node );
        this.addRowSelectHandler( this.config );
        this.addRefreshEventHandler( this.config );
        this.addToolbarChangeHandler();
        this.done = true;
        this.invokeDelegates( gp.events.ready, this.config.node.api );
    },

    addBusyDelegates: function () {
        this.addDelegate( gp.events.beforeRead, this.addBusy );
        this.addDelegate( gp.events.onRead, this.removeBusy );
        this.addDelegate( gp.events.beforeEdit, this.addBusy );
        this.addDelegate( gp.events.onEdit, this.removeBusy );
        this.addDelegate( gp.events.httpError, this.removeBusy );
    },

    addBusy: function () {
        // this function executes with the api as its context
        this.$n.addClass( 'busy' );
    },

    removeBusy: function () {
        // this function executes with the api as its context
        this.$n.removeClass( 'busy' );
    },

    ready: function ( callback ) {
        if ( this.done ) {
            gp.applyFunc( callback, this.config.node.api, this.config.node.api );
        }
        else {
            this.addDelegate( gp.events.ready, callback );
        }
    },

    addDelegate: function ( event, delegate ) {
        this.eventDelegates[event] = this.eventDelegates[event] || [];
        this.eventDelegates[event].push( delegate );
    },

    invokeDelegates: function ( event, args ) {
        var self = this,
            proceed = true,
            delegates = this.eventDelegates[event];
        if ( Array.isArray( delegates ) ) {
            delegates.forEach( function ( delegate ) {
                if ( proceed === false ) return;
                proceed = gp.applyFunc( delegate, self.config.node.api, args );
            } );
        }
        return proceed;
    },

    addToolbarChangeHandler: function () {
        // monitor changes to search, sort, and paging
        var selector = '.table-toolbar [name], thead input, .table-pager input';
        this.$n.on( 'change', selector, this.handlers.toolbarChangeHandler );
        this.$n.on( 'keydown', selector, this.handlers.toolbarChangeHandler );
    },

    removeToolbarChangeHandler: function () {
        this.$n.off( 'change', this.handlers.toolbarChangeHandler );
        this.$n.off( 'keydown', this.handlers.toolbarChangeHandler );
    },

    toolbarEnterKeyHandler: function ( evt ) {
        if ( evt.keyCode == 13 ) {
            // trigger change event
            evt.target.blur();
            return;
        }
    },

    toolbarChangeHandler: function ( evt ) {
        var name = evt.target.name,
            val = evt.target.value,
            model = this.config.pageModel;

        if ( name === 'sort' ) {
            if ( model[name] === val ) {
                model.desc = !model.desc;
            }
            else {
                model[name] = val;
                model.desc = false;
            }
        }
        else {
            gp.syncChange( evt.target, model, this.config.columns );
        }

        this.read();
    },

    addCommandHandlers: function () {
        // listen for command button clicks at the grid level
        this.$n.on( 'click', 'button[value]', this.handlers.commandHandler );
    },

    removeCommandHandlers: function () {
        this.$n.off( 'click', this.handlers.commandHandler );
    },

    commandHandler: function ( evt ) {
        // this function handles all the button clicks for the entire grid
        var lower,
            node = this.config.node,
            elem = gp.closest( evt.selectedTarget, 'tr[data-uid],div.modal', node ),
            dataItem = elem ? this.config.map.get( elem ) : null,
            command = gp.attr( evt.selectedTarget, 'value' ),
            model = this.config.pageModel;

        if ( gp.hasValue( command ) ) lower = command.toLowerCase();

        switch ( lower ) {
            case 'addrow':
                this.addRow();
                break;
            case 'edit':
                // the button is inside either a table row or a modal
                this.editRow( dataItem, elem );
                break;
            case 'delete':
            case 'destroy':
                this.deleteRow( dataItem, elem );
                break;
            case 'page':
                var page = gp.attr( evt.selectedTarget, 'data-page' );
                model.page = parseInt( page );
                this.read();
                break;
            case 'search':
                model.search = this.config.node.querySelector( '.table-toolbar input[name=search]' ).value;
                this.read();
                break;
            case 'sort':
                var sort = gp.attr( evt.selectedTarget, 'data-sort' );
                if ( model.sort === sort ) {
                    model.desc = !model.desc;
                }
                else {
                    model.sort = sort;
                    model.desc = false;
                }
                this.read();
                break;
            default:
                // look for a custom command
                var fn = gp.getObjectAtPath( command );
                if ( typeof fn == 'function' ) {
                    gp.applyFunc( fn, this.config.node.api, [dataItem] );
                }
                break;
        }
    },

    getEditor: function ( mode ) {
        var self = this, editor;

        if ( mode == undefined ) {
            editor = new gp.Editor( this.config, this.model );
        }
        else if ( mode == 'modal' ) {
            editor = new gp.ModalEditor( this.config, this.model );
        }
        else {
            editor = new gp.TableRowEditor( this.config, this.model );
        }

        editor.beforeEdit = function ( model ) {
            self.invokeDelegates( gp.events.beforeEdit, model );
        };

        editor.afterEdit = function ( model ) {
            self.invokeDelegates( gp.events.onEdit, model );
        };

        editor.editReady = function ( model ) {
            self.invokeDelegates( gp.events.editReady, model );
        };

        return editor;
    },

    addRowSelectHandler: function ( config ) {
        if ( this.$n.hasClass( 'selectable' ) ) {
            // add click handler
            this.$n.on( 'click', 'div.table-body > table > tbody > tr > td.body-cell', this.handlers.rowSelectHandler );
        }
    },

    removeRowSelectHandler: function () {
        this.$n.off( 'click', this.handlers.rowSelectHandler );
    },

    rowSelectHandler: function ( evt ) {
        var config = this.config,
            $target = $( evt.target ),
            tr = $target.closest( 'tr' ),
            trs = config.node.querySelectorAll( 'div.table-body > table > tbody > tr.selected' ),
            type = typeof config.rowselected,
            dataItem,
            proceed;

        if ( type === 'string' && config.rowselected.indexOf( '{{' ) !== -1 ) type = 'urlTemplate';

        // remove previously selected class
        this.$n.find( 'div.table-body > table > tbody > tr.selected' ).each( function () {
            $( this ).removeClass( 'selected' );
        } );

        // add selected class
        tr.addClass( 'selected' );
        // get the dataItem for this tr
        dataItem = config.map.get( tr[0] );

        // ensure dataItem selection doesn't interfere with button clicks in the dataItem
        // by making sure the evt target is a body cell
        if ( $( evt.target ).is( 'td' ) == false ) return;

        proceed = this.invokeDelegates( gp.events.rowselected, {
            dataItem: dataItem,
            elem: tr
        } );

        if ( proceed === false ) return;

        if ( type === 'function' ) {
            gp.applyFunc( config.rowselected, tr, [dataItem] );
        }
        else {
            // it's a urlTemplate
            window.location = gp.supplant.call( this.config.node.api, config.rowselected, dataItem );
        }
    },

    addRefreshEventHandler: function ( config ) {
        if ( config.refreshevent ) {
            $( document ).on( config.refreshevent, this.handlers.readHandler );
        }
    },

    removeRefreshEventHandler: function ( config ) {
        if ( config.refreshevent ) {
            $( document ).off( config.refreshevent, this.handlers.readHandler );
        }
    },

    search: function ( searchTerm, callback ) {
        this.config.pageModel.search = searchTerm;
        var searchBox = this.$n.find( 'div.table-toolbar input[name=search]' );
        searchBox.val( searchTerm );
        this.read( null, callback );
    },

    sort: function ( field, desc, callback ) {
        this.config.pageModel.sort = field;
        this.config.pageModel.desc = ( desc == true );
        this.read( null, callback );
    },

    read: function ( requestModel, callback ) {
        var self = this, proceed = true;
        if ( requestModel ) {
            gp.shallowCopy( requestModel, this.config.pageModel );
        }
        proceed = this.invokeDelegates( gp.events.beforeRead, this.config.node.api );
        if ( proceed === false ) return;
        this.model.read( this.config.pageModel, function ( model ) {
            try {
                // standardize capitalization of incoming data
                gp.shallowCopy( model, self.config.pageModel, true );
                self.config.map.clear();
                self.refresh( self.config );
                self.invokeDelegates( gp.events.onRead, self.config.node.api );
                gp.applyFunc( callback, self.config.node, self.config.pageModel );
            } catch ( e ) {
                self.removeBusy();
                self.httpErrorHandler( e );
            }
        }, this.handlers.httpErrorHandler );
    },

    addRow: function ( dataItem ) {

        var editor = this.getEditor( this.config.editmode );

        var model = editor.add();

        return editor;

    },

    // elem is either a tabel row or a modal
    createRow: function ( dataItem, elem, callback ) {
        try {
            var self = this,
                returnedRow,
                editor = this.getEditor();

            // if there is no create configuration setting, we're done here
            if ( !gp.hasValue( this.config.create ) ) {
                gp.applyFunc( callback, self.config.node );
                return;
            }

            editor.add( dataItem );

            editor.save( callback, this.httpErrorHandler.bind( this ) );
        }
        catch ( ex ) {
            this.removeBusy();
            this.httpErrorHandler( e );
        }
    },

    editRow: function ( dataItem, elem ) {

        var editor = this.getEditor( this.config.editmode );
        var model = editor.edit( dataItem, elem[0] );

        return editor;
    },

    updateRow: function ( dataItem, callback ) {

        try {
            var self = this,
                editor = this.getEditor();

            // if there is no update configuration setting, we're done here
            if ( !gp.hasValue( this.config.update ) ) {
                gp.applyFunc( callback, self.config.node );
                return;
            }

            editor.edit( dataItem );

            editor.save( callback, this.httpErrorHandler.bind( this ) );
        }
        catch ( ex ) {
            this.removeBusy();
            this.httpErrorHandler( e );
        }
    },

    // we don't require a tr parameter because it may not be in the grid
    deleteRow: function ( dataItem, callback, skipConfirm ) {
        try {
            if ( !gp.hasValue( this.config.destroy ) ) {
                gp.applyFunc( callback, this.config.node );
                return;
            }

            var self = this,
                confirmed = skipConfirm || confirm( 'Are you sure you want to delete this item?' ),
                message,
                tr = gp.getTableRow( this.config.map, dataItem, this.config.node );

            if ( !confirmed ) {
                gp.applyFunc( callback, this.config.node );
                return;
            }

            this.invokeDelegates( gp.events.beforeEdit, {
                type: 'destroy',
                dataItem: dataItem,
                elem: tr
            } );

            this.model.destroy( dataItem, function ( response ) {

                try {
                    if ( !response || !response.errors ) {
                        // if it didn't error out, we'll assume it succeeded
                        // remove the dataItem from the model
                        var index = self.config.pageModel.data.indexOf( dataItem );
                        if ( index != -1 ) {
                            self.config.pageModel.data.splice( index, 1 );
                            // if the dataItem is currently being displayed, refresh the grid
                            if ( tr ) {
                                self.refresh( self.config );
                            }
                        }
                    }
                }
                catch ( err ) {
                    gp.error( err );
                }

                self.invokeDelegates( gp.events.onEdit, {
                    type: 'destroy',
                    dataItem: dataItem,
                    elem: tr
                } );

                gp.applyFunc( callback, self.config.node.api, response );
            },
            self.handlers.httpErrorHandler );
        }
        catch ( e ) {
            this.removeBusy();
            this.httpErrorHandler( e );
        }
    },

    refresh: function () {
        try {
            // inject table rows, footer, pager and header style.
            var body = this.$n.find( 'div.table-body' ),
                footer = this.$n.find( 'div.table-footer' ),
                pager = this.$n.find( 'div.table-pager' );

            this.config.map.clear();

            body.html( gp.templates['gridponent-body']( this.config ) );
            if ( footer ) {
                footer.html( gp.templates['gridponent-table-footer']( this.config ) );
            }
            if ( pager ) {
                pager.html( gp.templates['gridponent-pager']( this.config ) );
            }
            gp.helpers.sortStyle( this.config );
        }
        catch ( e ) {
            gp.error( e );
        }
    },

    httpErrorHandler: function ( e ) {
        this.invokeDelegates( gp.events.httpError, e );
        alert( 'An error occurred while carrying out your request.' );
        gp.error( e );
    },

    dispose: function () {
        this.removeRefreshEventHandler( this.config );
        this.removeRowSelectHandler();
        this.removeCommandHandlers( this.config.node );
        this.removeToolbarChangeHandler();
    }

};