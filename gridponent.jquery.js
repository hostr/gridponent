﻿
/***************\
   Gridponent
\***************/

var gridponent = gridponent || function ( elem, options ) {

    // check for a selector
    if ( typeof elem == 'string' ) {
        elem = document.querySelector( elem );
    }
    if ( elem instanceof HTMLElement ) {
        var tblContainer = elem.querySelector( '.table-container' );
        // has this already been initialized?
        if ( tblContainer && tblContainer.api ) return tblContainer.api;

        if ( options ) {
            var init = new gridponent.Initializer( elem );
            var config = init.initializeOptions( options );
            return config.node.api;
        }
    }

    var obj = {
        api: null,
        callback: function () { },
        ready: function ( callback ) {
            if ( obj.api ) {
                obj.api.ready(callback);
            }
            else obj.callback = callback;
        }
    };

    gridponent.ready( function () {
        // check for a selector
        if ( typeof elem == 'string' ) {
            elem = document.querySelector( elem );
        }
        if ( elem instanceof HTMLElement ) {
            var tblContainer = elem.querySelector( '.table-container' );
            // has this already been initialized?
            if ( tblContainer && tblContainer.api ) {
                if (obj.callback) {
                    tblContainer.api.ready(obj.callback);
                }
                else {
                    obj.api = tblContainer.api;
                }
            }

            if ( options ) {
                var init = new gridponent.Initializer( elem );
                var config = init.initializeOptions( options );
                if (obj.callback) {
                    config.node.api.ready(obj.callback);
                }
                else {
                    obj.api = config.node.api;
                }
            }
        }
    } );

    return obj;

};

(function(gp) { 

/***************\
      API
\***************/

gp.events = {

    rowSelected: 'rowselected',
    beforeinit: 'beforeinit',
    // turn progress indicator on
    beforeRead: 'beforeread',
    // turn progress indicator on
    beforeEdit: 'beforeedit',
    // turn progress indicator off
    onRead: 'onread',
    // turn progress indicator off
    // raised after create, update and delete
    onEdit: 'onedit',
    // gives external code the opportunity to initialize UI elements (e.g. datepickers)
    editReady: 'editready',
    // turn progress indicator off
    httpError: 'httpError',
    // happens once after the grid is fully initialized and databound
    ready: 'ready'
};


gp.api = function ( controller ) {
    this.controller = controller;
    this.config = controller.config;
};

gp.api.prototype = {

    create: function ( dataItem, callback ) {
        var model = this.controller.addRow( dataItem );
        if ( model != null ) this.controller.createRow( dataItem, model.elem, callback );
        else callback( null );
    },
    
    destroy: function ( dataItem, callback ) {
        this.controller.deleteRow( dataItem, callback, true );
    },

    dispose: function () {
        this.controller.dispose();
    },

    find: function ( selector ) {
        return this.controller.config.node.querySelector( selector );
    },

    findAll: function ( selector ) {
        return this.controller.config.node.querySelectorAll( selector );
    },

    getCommandIndex: function ( value ) {
        for ( var i = 0; i < this.config.commands.length; i++ ) {
            if ( this.config.commands[i].value === value ) {
                return i;
            }
        }
    },

    getData: function ( uidOrTableRow ) {
        if ( uidOrTableRow != undefined ) return this.config.map.get( uidOrTableRow );
        return this.controller.config.pageModel.data;
    },

    getTableRow: function( dataItem ) {
        return gp.getTableRow(
            this.controller.config.map,
            dataItem,
            this.controller.config.node
        );
    },

    read: function ( requestModel, callback ) {
        this.controller.read( requestModel, callback );
    },

    refresh: function ( callback ) {
        this.controller.read( null, callback );
    },

    saveChanges: function ( dataItem, done ) {
        this.controller.updateRow( dataItem, done );
    },

    search: function ( searchTerm, callback ) {
        // make sure we pass in a string
        searchTerm = gp.isNullOrEmpty( searchTerm ) ? '' : searchTerm.toString();
        this.controller.search( searchTerm, callback );
    },

    sort: function ( name, desc, callback ) {
        // validate the args
        name = gp.isNullOrEmpty( name ) ? '' : name.toString();
        typeof desc == 'boolean' ? desc : desc === 'false' ? false : !!desc;
        this.controller.sort( name, desc, callback );
    },

    toggleBusy: function ( isBusy ) {

        isBusy = ( isBusy === true || isBusy === false ? isBusy : !gp.hasClass( this.config.node, 'busy' ) );

        if ( isBusy ) {
            gp.addClass( this.config.node, 'busy' );
        }
        else {
            gp.removeClass( this.config.node, 'busy' );
        }

        return this;
    },

    update: function ( dataItem, done ) {
        this.controller.updateRow( dataItem, done );
    }

};

Object.getOwnPropertyNames( gp.events ).forEach( function ( evt ) {

    gp.api.prototype[evt] = function (callback) {
        this.controller.addDelegate( gp.events[evt], callback );;
        return this;
    };

} );

gp.api.prototype.ready = function ( callback ) {
    this.controller.ready( callback );
    return this;
};

/***************\
controller.jquery
\***************/
gp.Controller = function ( config, model, requestModel ) {
    var self = this;
    this.config = config;
    this.$n = $( config.node );
    this.model = model;
    this.requestModel = requestModel;
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
        this.$n.on( 'keydown', selector, this.handlers.toolbarEnterKeyHandler );
    },

    removeToolbarChangeHandler: function () {
        this.$n.off( 'change', this.handlers.toolbarChangeHandler );
        this.$n.off( 'keydown', this.handlers.toolbarEnterKeyHandler );
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

        // reset the radio inputs
        this.$n.find( 'thead input[type=radio], .table-pager input[type=radio]' ).each( function () {
            this.checked = false;
        } );
    },

    addCommandHandlers: function ( node ) {
        // listen for command button clicks at the grid level
        $(node).on( 'click', 'button[value]', this.handlers.commandHandler );
    },

    removeCommandHandlers: function ( node ) {
        $(node).off( 'click', this.handlers.commandHandler );
    },

    commandHandler: function ( evt ) {
        // this function handles all the button clicks for the entire grid
        var lower,
            $btn = $(evt.selectedTarget),
            rowOrModal = $btn.closest( 'tr[data-uid],div.modal' ),
            dataItem = rowOrModal ? this.config.map.get( rowOrModal ) : null,
            cmd = gp.getCommand( this.config.columns, $btn.attr('value') ),
            model = this.config.pageModel;

        // check for a user-defined command
        if ( cmd && typeof cmd.func === 'function' ) {
            cmd.func.call( this.config.node.api, dataItem );
            return;
        };

        lower = $btn.attr('value').toLowerCase();

        switch ( lower ) {
            case 'addrow':
                this.addRow();
                break;
            case 'edit':
                // the button is inside either a table row or a modal
                this.editRow( dataItem, rowOrModal );
                break;
            case 'delete':
            case 'destroy':
                this.deleteRow( dataItem, rowOrModal );
                break;
            case 'page':
                var page = $btn.attr( 'data-page' );
                model.page = parseInt( page );
                this.read();
                break;
            case 'search':
                model.search = this.$n.find( '.table-toolbar input[name=search]' ).val();
                this.read();
                break;
            case 'sort':
                var sort = $btn.attr( 'data-sort' );
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
            tr = $(evt.selectedTarget).closest( 'tr' ),
            trs = this.$n.find( 'div.table-body > table > tbody > tr.selected' ),
            type = typeof config.rowselected,
            dataItem,
            proceed;

        if ( type === 'string' && config.rowselected.indexOf( '{{' ) !== -1 ) type = 'urlTemplate';

        // remove previously selected class
        trs.removeClass( 'selected' );

        // add selected class
        $(tr).addClass( 'selected' );
        // get the dataItem for this tr
        dataItem = config.map.get( tr[0] );

        //// ensure dataItem selection doesn't interfere with button clicks in the dataItem
        //// by making sure the evt target is a body cell
        //if ( evt.target != evt.selectedTarget ) return;

        proceed = this.invokeDelegates( gp.events.rowselected, {
            dataItem: dataItem,
            elem: tr
        } );

        if ( proceed === false ) return;

        if ( type === 'function' ) {
            gp.applyFunc( config.rowselected, this.config.node.api, [dataItem] );
        }
        else {
            // it's a urlTemplate
            window.location = gp.supplant.call( this.config.node.api, config.rowselected, dataItem );
        }
    },

    addRefreshEventHandler: function ( config ) {
        if ( config.refreshevent ) {
            $(document).on( config.refreshevent, this.handlers.readHandler );
        }
    },

    removeRefreshEventHandler: function ( config ) {
        if ( config.refreshevent ) {
            $(document).off( config.refreshevent, this.handlers.readHandler );
        }
    },

    search: function ( searchTerm, callback ) {
        this.config.pageModel.search = searchTerm;
        var searchBox = this.$n.find( 'div.table-toolbar input[name=search' ).val( searchBox );
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
                gp.resolveTypes( self.config );
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

    // elem is either a table row or a modal
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
        var model = editor.edit( dataItem, elem );

        //this.invokeDelegates( gp.events.editReady, model );

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
                tr = gp.getTableRow( this.config.map, dataItem, this.$n[0] );

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
            footer.html( gp.templates['gridponent-table-footer']( this.config ) );
            pager.html( gp.templates['gridponent-pager']( this.config ) );

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

/***************\
   DataLayer
\***************/
gp.DataLayer = function ( config ) {
    this.config = config;
    this.reader = null;
    var type = gp.getType( config.read );
    switch ( type ) {
        case 'string':
            this.reader = new gp.ServerPager( config.read );
            break;
        case 'function':
            this.reader = new gp.FunctionPager( config );
            break;
        case 'object':
            // read is a PagingModel
            this.config.pageModel = config.read;
            this.reader = new gp.ClientPager( this.config );
            break;
        case 'array':
            this.config.pageModel.data = this.config.read;
            this.reader = new gp.ClientPager( this.config );
            break;
        default:
            throw 'Unsupported read configuration';
    }
};

gp.DataLayer.prototype = {

    read: function ( requestModel, done, fail ) {
        var self = this;

        this.reader.read(
            requestModel,
            // make sure we wrap result in an array when we return it
            // if result is an array of data, then applyFunc will end up only grabbing the first dataItem
            function ( result ) {
                result = self.resolveResult( result );
                gp.applyFunc( done, self, [result] );
            },
            function ( result ) { gp.applyFunc( fail, self, [result] ); }
        );
    },

    create: function ( dataItem, done, fail) {
        var self = this, url;

        // config.create can be a function or a URL
        if ( typeof this.config.create === 'function' ) {
            // call the function, set the API as the context
            gp.applyFunc(this.config.create, this.config.node.api, [dataItem, done, fail], fail);
        }
        else {
            // the url can be a template
            url = gp.supplant( this.config.create, dataItem );
            // call the URL
            var http = new gp.Http();
            http.post(
                url,
                dataItem,
                function ( arg ) { gp.applyFunc( done, self, arg ); },
                function ( arg ) { gp.applyFunc( fail, self, arg ); }
            );
        }
    },

    update: function (dataItem, done, fail) {
        var self = this, url;

        // config.update can be a function or URL
        if ( typeof this.config.update === 'function' ) {
            gp.applyFunc(this.config.update, this.config.node.api, [dataItem, done, fail], fail);
        }
        else {
            // the url can be a template
            url = gp.supplant( this.config.update, dataItem );
            var http = new gp.Http();
            http.post(
                url,
                dataItem,
                function ( arg ) { gp.applyFunc( done, self, arg ); },
                function ( arg ) { gp.applyFunc( fail, self, arg ); }
            );
        }
    },

    destroy: function (dataItem, done, fail) {
        var self = this, url;
        if ( typeof this.config.destroy === 'function' ) {
            gp.applyFunc(this.config.destroy, this.config.node.api, [dataItem, done, fail], fail);
        }
        else {
            // the url can be a template
            url = gp.supplant( this.config.destroy, dataItem );
            var http = new gp.Http();
            http.destroy(
                url,
                dataItem,
                function ( arg ) { gp.applyFunc( done, self, arg ); },
                function ( arg ) { gp.applyFunc( fail, self, arg ); }
            );
        }
    },

    resolveResult: function ( result ) {
        if ( gp.hasValue( result ) && Array.isArray( result ) ) {
            //  wrap the array in a PagingModel
            return new gp.PagingModel( result );
        }
        return result;
    }


};

/***************\
    datamap
\***************/
gp.DataMap = function () {

    this.uid = 0;
    this.map = {};

};

gp.DataMap.prototype = {

    assign: function ( dataItem, elem ) {
        var i = ++this.uid;

        this.map[i] = dataItem;

        if ( elem && elem.setAttribute ) {
            elem.setAttribute( 'data-uid', i.toString() );
        }

        return i;
    },

    get: function ( uidOrElem ) {

        var uid = this.resolveUid(uidOrElem);

        return this.map[uid];
    },

    getUid: function ( dataItem ) {
        var uid, 
            uids = Object.getOwnPropertyNames(this.map);

        for (var i = 0; i < uids.length; i++) {
            uid = uids[i];
            if (this.map[uid] === dataItem) return uid;
        }

        return -1;
    },

    resolveUid: function ( uidOrElem ) {

        var uid = -1;

        if ( uidOrElem.attributes ) {
            if ( uidOrElem.attributes['data-uid'] && uidOrElem.attributes['data-uid'].value ) {
                uid = parseInt( uidOrElem.attributes['data-uid'].value );
            }
        }
        else {
            uid = parseInt( uidOrElem );
        }

        if ( isNaN( uid ) ) return -1;

        return uid;
    },

    remove: function ( uidOrElem ) {
        var uid = this.resolveUid( uidOrElem );

        if ( uid in this.map ) {
            delete this.map[uid];
        }
    },

    clear: function () {
        this.uid = 0;
        this.map = {};
    }

};

/***************\
 editors.jquery
\***************/

gp.Editor = function ( config, dal ) {

    this.config = config;
    this.dal = dal;
    this.dataItem = null;
    this.originalDataItem = null;
    this.mode = null;
    this.beforeEdit = null;
    this.afterEdit = null;
    this.editReady = null;
    this.button = null;
    this.$n = $( config.node );

};

gp.Editor.prototype = {

    add: function ( dataItem ) {
        this.dataItem = dataItem || this.createDataItem();
        this.mode = 'create';
        return {
            dataItem: this.dataItem
        };
    },

    edit: function ( dataItem ) {
        this.dataItem = dataItem;
        this.originalDataItem = gp.shallowCopy( dataItem );
        this.mode = 'update';
        return {
            dataItem: dataItem,
        };
    },

    save: function ( done, fail ) {
        // create or update
        var self = this,
            returnedDataItem,
            fail = fail || gp.error;

        this.addBusy();

        if ( this.elem ) {
            gp.syncModel( this.elem, this.dataItem, this.config.columns );
        }

        if ( typeof this.beforeEdit == 'function' ) {
            this.beforeEdit( {
                type: this.mode,
                dataItem: this.dataItem,
                elem: this.elem
            } );
        }

        if ( this.mode == 'create' ) {

            this.dal.create( this.dataItem, function ( updateModel ) {

                try {
                    // standardize capitalization of incoming data
                    updateModel = gp.shallowCopy( updateModel, null, true );

                    if ( gp.hasValue( updateModel.errors )) {
                        self.validate( updateModel );
                    }
                    else {
                        returnedDataItem = gp.hasValue( updateModel.dataItem ) ? updateModel.dataItem : ( updateModel.data && updateModel.data.length ) ? updateModel.data[0] : self.dataItem;

                        // add the new dataItem to the internal data array
                        self.config.pageModel.data.push( returnedDataItem );

                        // copy to local dataItem so updateUI will bind to current data
                        gp.shallowCopy( returnedDataItem, self.dataItem );

                        // It's important to map the dataItem after it's saved because user could cancel.
                        // Also the returned dataItem will likely have additional information added by the server.
                        uid = self.config.map.assign( returnedDataItem, self.elem );

                        self.updateUI( self.config, self.dataItem, self.elem );

                        if (self.removeCommandHandler) self.removeCommandHandler();
                    }
                }
                catch ( err ) {
                    var error = fail || gp.error;
                    error( err );
                }

                if ( self.button instanceof HTMLElement ) gp.enable( self.button );

                self.removeBusy();

                if ( typeof self.afterEdit == 'function' ) {
                    self.afterEdit( {
                        type: self.mode,
                        dataItem: self.dataItem,
                        elem: self.elem
                    } );
                }

                gp.applyFunc( done, self.config.node.api, updateModel );
            },
            fail );

        }
        else {

            // call the data layer with just the dataItem
            // the data layer should respond with an updateModel
            this.dal.update( this.dataItem, function ( updateModel ) {

                try {
                    // standardize capitalization of incoming data
                    updateModel = gp.shallowCopy( updateModel, null, true );

                    if ( gp.hasValue( updateModel.errors ) ) {
                        self.validate( updateModel );
                    }
                    else {
                        // copy the returned dataItem back to the internal data array
                        // use the existing dataItem if the response is empty
                        returnedDataItem = gp.hasValue( updateModel.dataItem ) ? updateModel.dataItem :
                            ( updateModel.data && updateModel.data.length ) ? updateModel.data[0] : self.dataItem;
                        gp.shallowCopy( returnedDataItem, self.dataItem );

                        if ( self.elem ) {
                            // refresh the UI
                            self.updateUI( self.config, self.dataItem, self.elem );

                            if ( self.removeCommandHandler ) self.removeCommandHandler();
                        }
                    }
                }
                catch ( err ) {
                    fail( err );
                }

                if ( self.button instanceof HTMLElement ) gp.enable( self.button );

                self.removeBusy();

                if ( typeof self.afterEdit == 'function' ) {
                    self.afterEdit( {
                        type: self.mode,
                        dataItem: self.dataItem,
                        elem: self.elem
                    } );
                }

                gp.applyFunc( done, self.config.node, updateModel );
            },
            fail );

        }
    },

    addBusy: function () { },

    removeBusy: function () { },

    updateUI: function () { },

    validate: function() {},

    createDataItem: function () {
        var field,
            dataItem = {};

        // set defaults
        this.config.columns.forEach( function ( col ) {
            var field = col.field || col.sort;
            if ( gp.hasValue( field ) ) {
                if ( gp.hasValue( col.Type ) ) {
                    dataItem[field] = gp.getDefaultValue( col.Type );
                }
                else {
                    dataItem[field] = '';
                }
            }
        } );

        // overwrite defaults with a model if specified
        if ( typeof this.config.model == 'object' ) {
            gp.shallowCopy( this.config.model, dataItem );
        }

        return dataItem;
    }

};

/***************\
 TableRowEditor
\***************/

gp.TableRowEditor = function ( config, dal ) {

    var self = this;

    gp.Editor.call( this, config, dal );

    this.elem = null;
    this.commandHandler = function ( evt ) {
        // handle save or cancel
        var command = $( this ).val();

        if ( /^(create|update|save)$/i.test( command ) ) {
            self.button = this;
            // prevent double clicking
            gp.disable( self.button, 5 );
            self.save();
        }
        else if ( /^cancel$/i.test( command ) ) self.cancel();
    };

};

gp.TableRowEditor.prototype = {

    addCommandHandler: function() {
        $(this.elem).on( 'click', 'button[value]', this.commandHandler );
    },

    removeCommandHandler: function () {
        $(this.elem).off( 'click', this.commandHandler );
    },

    add: function () {
        var self = this,
            tbody = this.$n.find( 'div.table-body > table > tbody' ),
            bodyCellContent = gp.helpers['bodyCellContent'],
            editCellContent = gp.helpers['editCellContent'],
            builder = new gp.NodeBuilder(),
            cellContent;

        gp.Editor.prototype.add.call( this );

        builder.create( 'tr' ).addClass( 'create-mode' ),

        // add td.body-cell elements to the tr
        this.config.columns.forEach( function ( col ) {
            cellContent = col.readonly ?
                bodyCellContent.call( self.config, col, self.dataItem ) :
                editCellContent.call( self.config, col, self.dataItem, 'create' );
            builder.create( 'td' ).addClass( 'body-cell' ).addClass( col.bodyclass ).html( cellContent ).endElem();
        } );

        this.elem = builder.close();

        this.addCommandHandler();

        tbody.prepend( this.elem );

        this.invokeEditReady();

        return {
            dataItem: this.dataItem,
            elem: this.elem
        };
    },

    edit: function (dataItem, tr) {

        // replace the cell contents of the table row with edit controls

        var col,
            editCellContent = gp.helpers['editCellContent'],
            cells = $(tr).find( 'td.body-cell' ),
            uid;

        gp.Editor.prototype.edit.call( this, dataItem );

        this.elem = tr;

        this.addCommandHandler();

        // IE9 can't set innerHTML of tr, so iterate through each cell and set its innerHTML
        // besides, that way we can just skip readonly cells
        cells.each( function (i) {
            col = this.config.columns[i];
            if ( !col.readonly ) {
                $(this).html( editCellContent.call( this.config, col, dataItem, 'edit' ) );
            }
        } );

        $( tr ).addClass( 'edit-mode' );

        this.invokeEditReady();

        return {
            dataItem: dataItem,
            elem: this.elem
        };
    },

    save: gp.Editor.prototype.save,

    cancel: function () {

        try {
            var tbl = $(this.elem).closest( 'table', this.$n ),
                index;

            if ( $( this.elem ).hasClass( 'create-mode' ) ) {
                // remove elem
                tbl.deleteRow( this.elem.rowIndex );
            }
            else {
                // restore the dataItem to its original state
                gp.shallowCopy( this.originalDataItem, this.dataItem );
                this.updateUI();
            }

            this.removeCommandHandler();

        }
        catch ( ex ) {
            gp.error( ex );
        }

    },

    validate: function ( updateModel ) {

        if ( typeof this.config.validate === 'function' ) {
            gp.applyFunc( this.config.validate, this, [this.elem, updateModel] );
        }
        else {

            var self = this,
                builder = new gp.StringBuilder(),
                input,
                errors,
                msg;

            builder.add( 'Please correct the following errors:\r\n' );

            // remove error class from inputs
            $( self.elem ).find( '[name].error' ).removeClass( 'error' );

            Object.getOwnPropertyNames( updateModel.errors ).forEach( function ( e ) {

                $(self.elem).find( '[name="' + e + '"]' ).addClass( 'error' );

                errors = updateModel.errors[e].errors;

                builder
                    .add( e + ':\r\n' )
                    .add(
                    // extract the error message
                    errors.map( function ( m ) { return '    - ' + m + '\r\n'; } ).join( '' )
                );
            } );

            alert( builder.toString() );
        }

    },

    createDataItem: gp.Editor.prototype.createDataItem,

    addBusy: function () { },
    removeBusy: function() {},

    updateUI: function () {
        // take the table row out of edit mode
        var col,
            bodyCellContent = gp.helpers['bodyCellContent'],
            cells = $(this.elem).find( 'td.body-cell' );

        cells.each( function ( i ) {
            col = this.config.columns[i];
            $(this).html( bodyCellContent.call( this.config, col, this.dataItem ) );
        } );
        $( this.elem ).removeClass( 'edit-mode create-mode' );
    },

    invokeEditReady: function() {
        if (typeof this.editReady == 'function') {
            this.editReady({
                dataItem: this.dataItem,
                elem: this.elem
            });
        }
    }

};


/***************\
   ModalEditor
\***************/

gp.ModalEditor = function ( config, dal ) {

    gp.TableRowEditor.call( this, config, dal );

};

gp.ModalEditor.prototype = {

    addCommandHandler: gp.TableRowEditor.prototype.addCommandHandler,

    removeCommandHandler: gp.TableRowEditor.prototype.removeCommandHandler,

    add: function () {
        var self = this,
            html,
            modal;

        gp.Editor.prototype.add.call( this );

        // mode: create or update
        html = gp.helpers.bootstrapModal( this.config, this.dataItem, 'create' );

        // append the modal to the top node so button clicks will be picked up by commandHandlder
        modal = $( html )
            .appendTo( this.config.node )
            .one('shown.bs.modal', self.invokeEditReady.bind(self) )
            .modal( {
                show: true,
                keyboard: true
            }
        );

        this.elem = modal[0];

        modal.one( 'hidden.bs.modal', function () {
            $( modal ).remove();
        } );

        this.addCommandHandler();

        return {
            dataItem: this.dataItem,
            elem: this.elem
        };
    },

    edit: function (dataItem) {

        var self = this;

        gp.Editor.prototype.edit.call( this, dataItem );

        // mode: create or update
        var html = gp.helpers.bootstrapModal( this.config, dataItem, 'udpate' );

        // append the modal to the top node so button clicks will be picked up by commandHandlder
        var modal = $( html )
            .appendTo( this.config.node )
            .one( 'shown.bs.modal', self.invokeEditReady.bind( self ) )
            .modal( {
                show: true,
                keyboard: true
            }
        );

        this.elem = modal[0];

        modal.one( 'hidden.bs.modal', function () {
            $( modal ).remove();
        } );

        this.addCommandHandler();

        return {
            dataItem: dataItem,
            elem: this.elem
        };

    },

    save: gp.Editor.prototype.save,

    cancel: function () {
        $( this.elem ).modal('hide');
        //restore the dataItem to its original state
        if ( this.mode == 'update' && this.originalDataItem ) {
            gp.shallowCopy( this.originalDataItem, this.dataItem );
        }
        this.removeCommandHandler();
    },

    addBusy: function () {
        $( this.elem ).addClass( 'busy' );
    },

    removeBusy: function() {
        $( this.elem ).removeClass( 'busy' );
    },

    updateUI: function () {

        var self = this,
            tbody = this.$n.find( 'div.table-body > table > tbody' ),
            bodyCellContent = gp.helpers['bodyCellContent'],
            tableRow,
            cells,
            col,
            uid,
            builder,
            cellContent;

        $( this.elem ).modal( 'hide' );

        // if we added a row, add a row to the top of the table
        if ( this.mode == 'create' ) {

            // the save method should have added a uid attr to the modal
            uid = this.config.map.resolveUid( this.elem );
            
            // make sure we have a uid
            if ( uid == -1 ) {
                uid = this.config.map.assign( this.dataItem );
            }
            
            builder = new gp.NodeBuilder().create( 'tr' ).attr( 'data-uid', uid );

            // add td.body-cell elements to the tr
            this.config.columns.forEach( function ( col ) {
                cellContent = bodyCellContent.call( self.config, col, self.dataItem );
                builder.create( 'td' ).addClass( 'body-cell' ).addClass( col.bodyclass ).html( cellContent ).endElem();
            } );

            tableRow = builder.close();

            $( tbody ).prepend( tableRow );
        }
        else {
            tableRow = gp.getTableRow( this.config.map, this.dataItem, this.config.node );
    
            if ( tableRow ) {
                $( tableRow ).find( 'td.body-cell' ).each( function ( i ) {
                    col = this.config.columns[i];
                    $(this).html( bodyCellContent.call( this.config, col, this.dataItem ) );
                } );
            }
        }

    },

    validate: gp.TableRowEditor.prototype.validate,

    createDataItem: gp.Editor.prototype.createDataItem,

    invokeEditReady: gp.TableRowEditor.prototype.invokeEditReady

};

/***************\
   formatter
\***************/

// Use moment.js to format dates.
// Use numeral.js to format numbers.
gp.Formatter = function () {};

gp.Formatter.prototype = {
    format: function (val, format) {
        var type = gp.getType( val );

        try {
            if ( /^(date|datestring)$/.test( type ) ) {
                format = format || 'M/D/YYYY h:mm a';
                return moment( val ).format( format );
            }
            if ( type === 'timestamp' ) {
                format = format || 'M/D/YYYY h:mm a';
                val = parseInt( val.match( gp.rexp.timestamp )[1] );
                return moment( val ).format( format );
            }
            if ( type === 'number' ) {
                // numeral's defaultFormat option doesn't work as of 3/25/2016
                format = format || '0,0';
                return numeral( val ).format( format );
            }
        }
        catch ( e ) {
            gp.error( e );
        }
        return val;
    }
};

/***************\
 helpers.jquery
\***************/

gp.helpers = {

    bootstrapModal: function ( config, dataItem, mode ) {

        var model = {
            title: ( mode == 'create' ? 'Add' : 'Edit' ),
            body: '',
            footer: null
        };

        var html = new gp.StringBuilder();

        // not using a form element here because the modal is added as a child node of the grid component
        // this will cause problems if the grid is inside another form (e.g. jQuery.validate will behave unexpectedly)
        html.add( '<div class="form-horizontal">' );

        config.columns.forEach( function ( col ) {
            if ( col.commands ) {
                model.footer = gp.helpers.editCellContent.call( config, col, dataItem, mode );
                return;
            }
            var canEdit = !col.readonly && ( gp.hasValue( col.field ) || gp.hasValue( col.edittemplate ) );
            if ( !canEdit ) return;

            var formGroupModel = {
                label: null,
                input: gp.helpers.editCellContent.call( config, col, dataItem, mode )
            };

            // headers become labels
            // check for a template
            if ( col.headertemplate ) {
                if ( typeof ( col.headertemplate ) === 'function' ) {
                    formGroupModel.label = ( gp.applyFunc( col.headertemplate, self, [col] ) );
                }
                else {
                    formGroupModel.label = ( gp.supplant.call( this, col.headertemplate, [col] ) );
                }
            }
            else {
                formGroupModel.label = gp.escapeHTML( gp.coalesce( [col.header, col.field, ''] ) );
            }

            html.add( gp.helpers.formGroup( formGroupModel ) );
        } );

        html.add( '</div>' );

        model.body = html.toString();

        return gp.templates['bootstrap-modal']( model );
    },

    bodyCellContent: function ( col, dataItem ) {
        var self = this,
            template,
            format,
            val,
            glyphicon,
            btnClass,
            hasDeleteBtn = false,
            dataItem = dataItem || this.Row,
            type = ( col.Type || '' ).toLowerCase(),
            html = new gp.StringBuilder();

        if ( dataItem == null ) return;

        val = gp.getFormattedValue( dataItem, col, true );

        // check for a template
        if ( col.bodytemplate ) {
            if ( typeof ( col.bodytemplate ) === 'function' ) {
                html.add( gp.applyFunc( col.bodytemplate, this, [dataItem, col] ) );
            }
            else {
                html.add( gp.supplant.call( this, col.bodytemplate, dataItem, [dataItem, col] ) );
            }
        }
        else if ( col.commands && col.commands.length ) {
            html.add( '<div class="btn-group btn-group-xs" role="group">' );
            col.commands.forEach( function ( cmd, index ) {
                html.add( gp.helpers.button( cmd ) );
            } );
            html.add( '</div>' );
        }
        else if ( gp.hasValue( val ) ) {
            // show a checkmark for bools
            if ( type === 'boolean' ) {
                if ( val === true ) {
                    html.add( '<span class="glyphicon glyphicon-ok"></span>' );
                }
            }
            else {
                // getFormattedValue has already escaped html
                html.add( val );
            }
        }
        return html.toString();
    },

    button: function ( model, arg ) {
        var template = '<button type="button" class="btn {{btnClass}}" value="{{value}}"><span class="glyphicon {{glyphicon}}"></span>{{text}}</button>';
        return gp.supplant( template, model );
    },

    columnWidthStyle: function () {
        var self = this,
            html = new gp.StringBuilder(),
            index = 0,
            bodyCols = document.querySelectorAll( '#' + this.ID + ' .table-body > table > tbody > tr:first-child > td' );

        // even though the table might not exist yet, we still should render width styles because there might be fixed widths specified
        this.columns.forEach( function ( col ) {
            if ( col.width ) {
                // fixed width should include the body
                html.add( '#' + self.ID + ' .table-header th.header-cell:nth-child(' + ( index + 1 ) + '),' )
                    .add( '#' + self.ID + ' .table-footer td.footer-cell:nth-child(' + ( index + 1 ) + ')' )
                    .add( ',' )
                    .add( '#' + self.ID + ' > .table-body > table > thead th:nth-child(' + ( index + 1 ) + '),' )
                    .add( '#' + self.ID + ' > .table-body > table > tbody td:nth-child(' + ( index + 1 ) + ')' )
                    .add( '{ width:' )
                    .add( col.width );
                if ( isNaN( col.width ) == false ) html.add( 'px' );
                html.add( ';}' );
            }
            else if ( bodyCols.length && ( self.fixedheaders || self.fixedfooters ) ) {
                // sync header and footer to body
                width = bodyCols[index].offsetWidth;
                html.add( '#' + self.ID + ' .table-header th.header-cell:nth-child(' + ( index + 1 ) + '),' )
                    .add( '#' + self.ID + ' .table-footer td.footer-cell:nth-child(' + ( index + 1 ) + ')' )
                    .add( '{ width:' )
                    .add( bodyCols[index].offsetWidth )
                    .add( 'px;}' );
            }
            index++;
        } );

        return html.toString();
    },

    containerClasses: function () {
        var html = new gp.StringBuilder();
        if ( this.fixedheaders ) {
            html.add( ' fixed-headers' );
        }
        if ( this.fixedfooters ) {
            html.add( ' fixed-footers' );
        }
        if ( this.pager ) {
            html.add( ' pager-' + this.pager );
        }
        if ( this.responsive ) {
            html.add( ' table-responsive' );
        }
        if ( this.search ) {
            html.add( ' search-' + this.search );
        }
        if ( this.rowselected ) {
            html.add( ' selectable' );
        }
        return html.toString();
    },

    editCellContent: function ( col, dataItem, mode ) {
        var template, html = new gp.StringBuilder();

        // check for a template
        if ( col.edittemplate ) {
            if ( typeof ( col.edittemplate ) === 'function' ) {
                html.add( gp.applyFunc( col.edittemplate, this, [dataItem, col] ) );
            }
            else {
                html.add( gp.supplant.call( this, col.edittemplate, dataItem, [dataItem, col] ) );
            }
        }
        else if ( col.commands ) {
            html.add( '<div class="btn-group' )
                .add( this.editmode == 'inline' ? ' btn-group-xs' : '' )
                .add('">')
                .add( gp.helpers.button( {
                    btnClass: 'btn-primary',
                    value: ( mode == 'create' ? 'create' : 'update' ),
                    glyphicon: 'glyphicon-save',
                    text: 'Save'
                } ) )
                .add( '<button type="button" class="btn btn-default" data-dismiss="modal" value="cancel">' )
                .add( '<span class="glyphicon glyphicon-remove"></span>Cancel' )
                .add( '</button>' )
                .add( '</div>' );
        }
        else {
            var val = dataItem[col.field];
            // render undefined/null as empty string
            if ( !gp.hasValue( val ) ) val = '';
            html.add( gp.helpers.input( col.Type, col.field, gp.escapeHTML( val ) ) );
        }
        return html.toString();
    },

    footerCell: function ( col ) {
        var html = new gp.StringBuilder();
        if ( col.footertemplate ) {
            if ( typeof ( col.footertemplate ) === 'function' ) {
                html.add( gp.applyFunc( col.footertemplate, this, [col, this.pageModel.data] ) );
            }
            else {
                html.add( gp.supplant.call( this, col.footertemplate, col, [col, this.pageModel.data] ) );
            }
        }
        return html.toString();
    },

    formGroup: function ( model, arg ) {
        var template = '<div class="form-group"><label class="col-sm-4 control-label">{{{label}}}</label><div class="col-sm-6">{{{input}}}</div></div>';
        return gp.supplant( template, model );
    },

    input: function ( type, name, value ) {
        var obj = {
            type: ( type == 'boolean' ? 'checkbox' : ( type == 'number' ? 'number' : 'text' ) ),
            name: name,
            value: ( type == 'boolean' ? 'true' : ( type == 'date' ? gp.formatter.format( value, 'YYYY-MM-DD' ) : gp.escapeHTML( value ) ) ),
            checked: ( type == 'boolean' && value ? ' checked' : '' ),
            // Don't bother with the date input type.
            // Indicate the type using data-type attribute so a custom date picker can be used.
            // This sidesteps the problem of polyfilling browsers that don't support the date input type
            // and provides a more consistent experience across browsers.
            dataType: ( /^date/.test( type ) ? ' data-type="date"' : '' )
        };

        return gp.supplant( '<input type="{{type}}" name="{{name}}" value="{{value}}" class="form-control"{{{dataType}}}{{checked}} />', obj );
    },

    setPagerFlags: function () {
        this.pageModel.IsFirstPage = this.pageModel.page === 1;
        this.pageModel.IsLastPage = this.pageModel.page === this.pageModel.pagecount;
        this.pageModel.HasPages = this.pageModel.pagecount > 1;
        this.pageModel.PreviousPage = this.pageModel.page === 1 ? 1 : this.pageModel.page - 1;
        this.pageModel.NextPage = this.pageModel.page === this.pageModel.pagecount ? this.pageModel.pagecount : this.pageModel.page + 1;
    },

    sortStyle: function ( config ) {
        // remove glyphicons from sort buttons
        var spans = $( config.node )
            .find( 'button.table-sort > spn.glyphicon-chevron-up,button.table-sort > span.glyphicon-chevron-down' )
            .removeClass( 'glyphicon-chevron-up glyphicon-chevron-down' );
        if ( !gp.isNullOrEmpty( config.pageModel.sort ) ) {
            $( config.node )
                .find( 'button.table-sort[data-sort="' + config.pageModel.sort + '"] > span' )
                .addClass(( config.pageModel.desc ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up' ));
        }
    },

    tableRows: function () {
        var self = this,
            html = new gp.StringBuilder(),
            map = this.map,
            uid;
        if ( !map ) {
            map = this.map = new gp.DataMap();
        }
        this.pageModel.data.forEach( function ( dataItem, index ) {
            uid = map.assign( dataItem );
            self.Row = dataItem;
            html.add( '<tr data-uid="' )
            .add( uid )
            .add( '">' )
            .add( gp.templates['gridponent-cells']( self ) )
            .add( '</tr>' );
        } );
        return html.toString();
    },

    thead: function () {
        var self = this;
        var html = new gp.StringBuilder();
        var sort, template, classes;
        html.add( '<thead>' );
        html.add( '<tr>' );
        this.columns.forEach( function ( col ) {
            sort = '';
            if ( self.sorting ) {
                // if sort isn't specified, use the field
                sort = gp.escapeHTML( gp.coalesce( [col.sort, col.field] ) );
            }
            else {
                // only provide sorting where it is explicitly specified
                if ( gp.hasValue( col.sort ) ) {
                    sort = gp.escapeHTML( col.sort );
                }
            }

            html.add( '<th class="header-cell ' + ( col.headerclass || '' ) + '"' );

            if ( gp.hasValue( sort ) ) {
                html.add( ' data-sort="' + sort + '"' );
            }

            html.add( '>' );

            // check for a template
            if ( col.headertemplate ) {
                if ( typeof ( col.headertemplate ) === 'function' ) {
                    html.add( gp.applyFunc( col.headertemplate, self, [col] ) );
                }
                else {
                    html.add( gp.supplant.call( this, col.headertemplate, col, [col] ) );
                }
            }
            else if ( !gp.isNullOrEmpty(sort) ) {
                html.add( '<button class="table-sort" value="sort" data-sort="' )
                    .escape( sort )
                    .add( '">' )
                    .escape( gp.coalesce( [col.header, col.field, sort] ) )
                    .add( '<span class="glyphicon"></span>' )
                    .add( '</button>' );
            }
            else {
                html.escape( gp.coalesce( [col.header, col.field, ''] ) );
            }
            html.add( '</th>' );
        } );
        html.add( '</tr>' )
            .add( '</thead>' );
        return html.toString();
    },

    toolbartemplate: function () {
        var html = new gp.StringBuilder();
        if ( typeof ( this.toolbartemplate ) === 'function' ) {
            html.add( gp.applyFunc( this.toolbartemplate, this ) );
        }
        else {
            html.add( this.toolbartemplate );
        }
        return html.toString();
    }

};


/****************\
Initializer.jquery
\****************/
gp.Initializer = function ( node ) {
    this.parent = $( node );
};

gp.Initializer.prototype = {

    initialize: function ( callback ) {
        this.config = this.getConfig( this.parent );
        return this.initializeOptions( this.config, callback );
    },

    initializeOptions: function ( options, callback ) {
        var self = this;
        options.pageModel = {};
        options.ID = gp.createUID();
        this.config = options;
        this.renderLayout( this.config, this.parent );
        this.config.node = this.parent.find( '.table-container' );
        this.$n = this.parent.find( '.table-container' );

        this.config.map = new gp.DataMap();
        var dal = new gp.DataLayer( this.config );
        var requestModel = new gp.PagingModel();
        var controller = new gp.Controller( self.config, dal, requestModel );
        this.config.node.api = new gp.api( controller );
        this.config.footer = this.hasFooterTemplate( this.config );
        this.config.preload = this.config.preload === false ? this.config.preload : true;

        setTimeout( function () {
            self.addEventDelegates( self.config, controller );

            // provides a hook for extensions
            controller.invokeDelegates( gp.events.beforeInit, self.config );

            if ( self.config.preload ) {
                // we need both beforeinit and beforeread because beforeread is used after every read in the controller
                // and beforeinit happens just once after the node is created, but before first read
                controller.invokeDelegates( gp.events.beforeRead, self.config.pageModel );

                dal.read( requestModel,
                    function ( data ) {
                        try {
                            gp.shallowCopy( data, self.config.pageModel, true );
                            gp.resolveTypes( self.config );
                            self.resolveCommands( self.config );
                            self.render( self.config );
                            controller.init();
                            if ( typeof callback === 'function' ) callback( self.config );
                        } catch ( e ) {
                            gp.error( e );
                        }
                        controller.invokeDelegates( gp.events.onRead, self.config.pageModel );
                    },
                    function ( e ) {
                        controller.invokeDelegates( gp.events.httpError, e );
                        alert( 'An error occurred while carrying out your request.' );
                        gp.error( e );
                    }
                );
            }
            else {
                self.resolveCommands( self.config );
                controller.init();
            }

        } );

        return this.config;
    },

    getConfig: function ( parentNode ) {
        var self = this,
            obj,
            colConfig,
            templates,
            config = gp.getAttributes( parentNode ),
            gpColumns = $(parentNode).find( 'gp-column' );

        // modal or inline
        config.editmode = config.editmode || 'inline';

        config.columns = [];

        // create the column configurations
        templates = 'header body edit footer'.split( ' ' );
        gpColumns.each( function () {
            colConfig = gp.getAttributes( this );
            config.columns.push( colConfig );
            this.resolveTemplates( templates, colConfig, this );
        } );

        // resolve the top level configurations
        var options = 'rowselected searchfunction read create update destroy validate model'.split( ' ' );
        options.forEach( function ( option ) {

            if ( gp.hasValue( config[option] ) ) {
                // see if this config option points to an object
                // otherwise it must be a URL
                obj = gp.getObjectAtPath( config[option] );

                if ( gp.hasValue( obj ) ) config[option] = obj;
            }

        } );


        // resolve the various templates
        this.resolveTemplates( ['toolbar', 'footer'], config, parentNode );

        return config;
    },

    addEventDelegates: function ( config, controller ) {
        var self = this, name, fn, api = config.node.api;
        Object.getOwnPropertyNames( gp.events ).forEach( function ( event ) {
            name = gp.events[event];
            fn = config[name];
            if ( typeof fn === 'string' ) {
                fn = gp.getObjectAtPath( fn );
            }

            // event delegates must point to a function
            if ( typeof fn == 'function' ) {
                config[name] = fn;
                controller.addDelegate( name, fn );
            }
        } );
    },

    renderLayout: function ( config, parentNode ) {
        try {
            $(parentNode).html( gp.templates['gridponent']( config ) );
        }
        catch ( e ) {
            gp.error( e );
        }
    },

    render: function ( config ) {
        var self = this;
        try {
            // inject table rows, footer, pager and header style.

            var body = this.$n.find( 'div.table-body' );
            var footer = this.$n.find( 'div.table-footer' );
            var pager = this.$n.find( 'div.table-pager' );

            body.html( gp.templates['gridponent-body']( config ) );
            footer.html( gp.templates['gridponent-table-footer']( config ) );
            pager.html( gp.templates['gridponent-pager']( config ) );
            gp.helpers.sortStyle( config );

            // sync column widths
            if ( config.fixedheaders || config.fixedfooters ) {
                var nodes = this.$n.find( '.table-body > table > tbody > tr:first-child > td' );

                if ( gp.hasPositiveWidth( nodes ) ) {
                    // call syncColumnWidths twice because the first call causes things to shift around a bit
                    self.syncColumnWidths( config )
                    self.syncColumnWidths( config )
                }

                window.addEventListener( 'resize', function () {
                    self.syncColumnWidths( config );
                } );
            }
        }
        catch ( ex ) {
            gp.error( ex );
        }
    },

    syncColumnWidths: function ( config ) {
        var html = gp.helpers.columnWidthStyle.call( config );
        this.$n.find( 'style.column-width-style' ).html( html );
    },

    hasFooterTemplate: function ( config ) {
        for ( var i = 0; i < config.columns.length; i++ ) {
            if ( config.columns[i].footertemplate ) return true;
        }
        return false;
    },

    resolveTemplates: function ( names, config, node ) {
        var selector,
            template,
            prop,
            selectorTemplate = 'script[type="text/html"][data-template*="{{name}}"],template[data-template*="{{name}}"]';
        names.forEach( function ( n ) {
            selector = gp.supplant( selectorTemplate, { name: n } );
            template = node.querySelector( selector );
            if ( template != null ) {
                for ( var i = 0; i < node.children.length; i++ ) {
                    if ( node.children[i] == template ) {
                        prop = gp.camelize( n ) + 'template';
                        config[prop] = template.innerHTML;
                        return;
                    }
                }
            }
        } );
    },

    resolveCommands: function ( config ) {
        var match, val, commands, index = 0;
        config.columns.forEach( function ( col ) {
            if ( typeof col.commands == 'string' ) {
                commands = [];
                col.commands.split( ',' ).forEach( function ( cmd ) {
                    match = cmd.split( ':' );
                    commands.push( {
                        text: match[0],
                        value: match[1],
                        btnClass: match[2],
                        glyphicon: match[3],
                    } );
                } );
                col.commands = commands;
            }
            if ( Array.isArray( col.commands ) ) {
                col.commands.forEach( function ( cmd ) {
                    cmd.text = cmd.text || cmd.value;
                    cmd.value = cmd.value || cmd.text;
                    cmd.btnClass = cmd.btnClass || ( /delete|destroy/i.test( cmd.text ) ? 'btn-danger' : 'btn-default' );
                    cmd.glyphicon = cmd.glyphicon || ( /delete|destroy/i.test( cmd.text ) ? 'glyphicon-remove' : ( /edit/i.test( cmd.text ) ? 'glyphicon-edit' : 'glyphicon-cog' ) );
                    cmd.func = cmd.func || gp.getObjectAtPath( cmd.value );
                } );
            }
        } );
    }
};

/***************\
   mock-http
\***************/
(function (gp) {
    gp.Http = function () { };

    // http://stackoverflow.com/questions/1520800/why-regexp-with-global-flag-in-javascript-give-wrong-results
    var routes = {
        read: /read/i,
        update: /update/i,
        create: /create/i,
        destroy: /Delete/i
    };

    gp.Http.prototype = {
        //serialize: function (obj, props) {
        //    // creates a query string from a simple object
        //    var self = this;
        //    props = props || Object.getOwnPropertyNames(obj);
        //    var out = [];
        //    props.forEach(function (prop) {
        //        out.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
        //    });
        //    return out.join('&');
        //},
        //deserialize: function (queryString) {
        //    var nameValue, split = queryString.split( '&' );
        //    var obj = {};
        //    if ( !queryString ) return obj;
        //    split.forEach( function ( s ) {
        //        nameValue = s.split( '=' );
        //        var val = nameValue[1];
        //        if ( !val ) {
        //            obj[nameValue[0]] = null;
        //        }
        //        else if ( /true|false/i.test( val ) ) {
        //            obj[nameValue[0]] = ( /true/i.test( val ) );
        //        }
        //        else if ( parseFloat( val ).toString() === val ) {
        //            obj[nameValue[0]] = parseFloat( val );
        //        }
        //        else {
        //            obj[nameValue[0]] = val;
        //        }
        //    } );
        //    return obj;
        //},
        //get: function (url, callback, error) {
        //    if (routes.read.test(url)) {
        //        var index = url.substring(url.indexOf('?'));
        //        if (index !== -1) {
        //            var queryString = url.substring(index + 1);
        //            var model = this.deserialize(queryString);
        //            this.post(url.substring(0, index), model, callback, error);
        //        }
        //        else {
        //            this.post(url, null, callback, error);
        //        }
        //    }
        //    else if (routes.create.test(url)) {
        //        var result = { "ProductID": 0, "Name": "", "ProductNumber": "", "MakeFlag": false, "FinishedGoodsFlag": false, "Color": "", "SafetyStockLevel": 0, "ReorderPoint": 0, "StandardCost": 0, "ListPrice": 0, "Size": "", "SizeUnitMeasureCode": "", "WeightUnitMeasureCode": "", "Weight": 0, "DaysToManufacture": 0, "ProductLine": "", "Class": "", "Style": "", "ProductSubcategoryID": 0, "ProductModelID": 0, "SellStartDate": "2007-07-01T00:00:00", "SellEndDate": null, "DiscontinuedDate": null, "rowguid": "00000000-0000-0000-0000-000000000000", "ModifiedDate": "2008-03-11T10:01:36.827", "Markup": null };
        //        callback(result);
        //    }
        //    else {
        //        throw 'Not found: ' + url;
        //    }
        //},
        post: function (url, model, callback, error) {
            model = model || {};
            if (routes.read.test(url)) {
                getData(model, callback);
            }
            else if ( routes.create.test( url ) ) {
                data.products.push( model );
                callback( new gp.UpdateModel( model ) );
            }
            else if ( routes.update.test( url ) ) {
                callback( new gp.UpdateModel(model) );
            }
            else {
                throw '404 Not found: ' + url;
            }
        },
        destroy: function ( url, model, callback, error ) {
            model = model || {};
            var index = data.products.indexOf( model );
            callback( {
                Success: true,
                Message: ''
            } );
        }
    };

    var getData = function (model, callback) {
        var count, d = data.products.slice( 0, this.data.length );

        if (!gp.isNullOrEmpty(model.search)) {
            var props = Object.getOwnPropertyNames(d[0]);
            var search = model.search.toLowerCase();
            d = d.filter(function (row) {
                for (var i = 0; i < props.length; i++) {
                    if (row[props[i]] && row[props[i]].toString().toLowerCase().indexOf(search) !== -1) {
                        return true;
                    }
                }
                return false;
            });
        }
        if (!gp.isNullOrEmpty(model.sort)) {
            if (model.desc) {
                d.sort(function (row1, row2) {
                    var a = row1[model.sort];
                    var b = row2[model.sort];
                    if (a === null) {
                        if (b != null) {
                            return 1;
                        }
                    }
                    else if (b === null) {
                        // we already know a isn't null
                        return -1;
                    }
                    if (a > b) {
                        return -1;
                    }
                    if (a < b) {
                        return 1;
                    }

                    return 0;
                });
            }
            else {
                d.sort(function (row1, row2) {
                    var a = row1[model.sort];
                    var b = row2[model.sort];
                    if (a === null) {
                        if (b != null) {
                            return -1;
                        }
                    }
                    else if (b === null) {
                        // we already know a isn't null
                        return 1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    if (a < b) {
                        return -1;
                    }

                    return 0;
                });
            }
        }
        count = d.length;
        if (model.top !== -1) {
            model.data = d.slice(model.skip).slice(0, model.top);
        }
        else {
            model.data = d;
        }
        model.errors = [];
        setTimeout(function () {
            callback(model);
        });

    };

})(gridponent);

/***************\
    modeling
\***************/
gp.Modeler = function () {

};

var rexp = {
	segments: /[^\[\]\.\s]+|\[\d+\]/g,
	indexer: /\[\d+\]/
};

gp.Modeler.prototype = {
	syncChange: function ( parent, target, model, columns ) {
		var name = target.name;
		if ( gp.isNullOrEmpty( name ) ) return;

		// there could be more than one element with this name, find them all
		var elems = parent.querySelectorAll( '[name="' + name + '"]' );

		var o = {
			target: evt.target,
			name: name,
			value: target.value,
			model: model
		};

		this.setModelProperty( parent, o.model, elems );
	},

	getPathSegments: function ( path ) {
		return path.match( rexp.segments );
	},

	resolvePathSegment: function ( segment ) {
	    // is this segment an array index?
	    if ( rexp.indexer.test( segment ) ) {
	        return parseInt( /\d+/.exec( segment ) );
	    }
	    return segment;
	},

	setModelProperty: function ( context, model, elems ) {
		var obj,
            prop,
            type,
            val;

		// get the raw value
		val = this.getValue( elems );

		// grab the object we're setting
		obj = gp.getObjectAtPath( model, segments, Array.isArray( val ) );

		// grab the object property name
		prop = this.resolvePathSegment( segments[segments.length - 1] );

		// attempt to resolve the data type in the model
		// if we can't get a type from the model
		// rely on the server to resolve it
		if ( prop in obj ) {
			type = $.type( obj[prop] );
		}
		else if ( Array.isArray( obj ) && obj.length ) {
			type = $.type( obj[0] );
		}

		// cast the raw value to the appropriate type
		val = this.castValues( val, type );

		if ( Array.isArray( val ) && Array.isArray( obj ) ) {
			// preserve the object reference in case it's referenced elsewhere
			// clear out the array and repopulate it
			obj.splice( 0, obj.length );
			val.forEach( function ( v ) {
				obj.push( v );
			} );
		}
		else {
			obj[prop] = val;
		}
	},
	getValue: function ( elem, parent ) {
		if ( elem.length === 0 ) return null;
		var val,
		    type = elem.type,
            node = elem.nodeName,
		    name = elem.name,
            input;

		if ( type == 'radio' ) {
            input = parent.querySelector( 'input[type=radio][name="' + name + '"][checked]' );
            return input ? input.value : null;
		}
		else {
		    input = parent.querySelectorAll( '[name="' + name + '"]' );
		}

		if ( input && input.length == 1 ) {
		    return input[0].value;
		}

		var ret = [];


		// it's supposed to be an array if they're all the same type and they're not radios
		var isArray = elem.length > 1
            && type !== 'radio'
            && elem.filter( '[type="' + type + '"]' ).length === elem.length;
		if ( type === 'checkbox' ) {
			if ( isArray ) {
				// this will only include checked boxes
				val = elem.serializeArray().map( function ( nv ) { return nv.value; } );
			}
			else {
				// this returns the checkbox value, not whether it's checked
				val = elem.val();
				// check for boolean, otherwise return val if it's checked, null if not checked
				if ( val.toLowerCase() == 'true' ) val = ( elem[0].checked ).toString();
				else if ( val.toLowerCase() == 'false' ) val = ( !elem[0].checked ).toString();
				else val = elem[0].checked ? val : null;
			}
		}
		else if ( type === 'radio' ) {
			val = elem.serializeArray()[0].value;
		}
		else {
			val = ( isArray ) ? elem.serializeArray().map( function ( nv ) { return nv.value; } ) : elem.val();
		}
		if ( !isArray && val === '' ) return null;
		return val;
	},
	castValues: function ( val, type ) {
		var isArray = Array.isArray( val );
		var arr = isArray ? val : [val];
		switch ( type ) {
			case 'number':
				arr = arr.filter( $.isNumeric ).map( parseFloat );
				break;
			case 'boolean':
				arr = arr.map( function ( v ) {
					return v.toLowerCase() == 'true';
				} );
				break;
			case 'null':
			case 'undefined':
				arr = arr.map( function ( v ) {
					if ( /true|false/i.test( v ) ) {
						// assume boolean
						return v.toLowerCase() === 'true';
					}
					return v === '' ? null : v;
				} );
				break;
			default:
				arr = arr.map( function ( v ) {
					return v === '' ? null : v;
				} );
				break;
		}
		return isArray ? arr : arr[0];
	},


	serializeArray: function ( parent ) {
	    var self = this,
            inputs = parent.querySelectorAll( '[name]' ),
	        arr = [],
            rCRLF = /\r?\n/g,
	        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
            rsubmittable = /^(?:input|select|textarea|keygen)/i,
            rcheckableType = /^(?:checkbox|radio)$/i;

	    for ( var i = 0; i < inputs.length; i++ ) {
	        arr.push( inputs[i] );
	    }

	    // jQuery's version of this fails when there's a checkbox with a value of true
	    // and a hidden with a value of false.
	    // That's how ASP.NET sends false when the box is not checked.
        // In this case jQuery always sends true even if the box is not checked.

	    return arr.filter( function () {
		    var type = this.type;

		    return rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function ( i, elem ) {
		    var val = self.getValue(elem, parent);

		    return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function ( val ) {
					    return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} );
	}

};

/***************\
   ModelSync
\***************/

gp.ModelSync = {

    rexp: {
        rCRLF: /\r?\n/g,
        rsubmitterTypes: /^(?:submit|button|image|reset|file)$/i,
        rsubmittable: /^(?:input|select|textarea|keygen)/i,
        rcheckableType: /^(?:checkbox|radio)$/i
    },

    isDisabled: function ( elem ) {
        return elem.disabled == true;
    },

    isNumeric: function ( obj ) {
        return !Array.isArray( obj ) && ( obj - parseFloat( obj ) + 1 ) >= 0;
    },

    toArray: function ( arrayLike ) {
        if ( arrayLike !== undefined && arrayLike.length != undefined ) {
            var arr = [];
            for ( var i = 0; i < arrayLike.length; i++ ) {
                arr[i] = arrayLike[i];
            }
            return arr;
        }
        return null;
    },

    /*
        jQuery's serializeArray function fails under the following scenario:
        There are two inputs with the same name.
        One of them is a checkbox with a value of true, the other is a hidden with a value of false.

        What should happen:
        If the checkbox is checked, both are submitted and only the first one (checkbox) is used by the server resulting in a value of true.
        If the checkbox is unchecked, only the hidden is submitted resulting in a value of false.
        ASP.NET uses this technique to submit an explicit true or false instead of true or nothing.

        What actually happens:
        jQuery's serializeArray function always submits true regardless of checked state.
    */

    serialize: function ( form ) {
        var inputs = form.querySelectorAll( '[name]' ),
            arr = this.toArray( inputs ),
            obj = {};

        arr.filter( function (elem) {
                var type = elem.type;

                return elem.name && !this.isDisabled( elem ) &&
                    this.rexp.rsubmittable.test( elem.nodeName ) && !this.rexp.rsubmitterTypes.test( type ) &&
                    ( elem.checked || !this.rexp.rcheckableType.test( type ) );
            }.bind(this) )
		    .forEach( function ( elem ) {

                // if there are multiple inputs with this name, take the first one
		        if ( elem.name in obj ) return;

		        var val = elem.value;
		        obj[elem.name] =
                    ( val == null ?
				    null :
    			    val.replace( this.rexp.rCRLF, "\r\n" ) );
		    }.bind(this)
        );

        return obj;
    },

    bindElements: function ( model, context ) {
        var value,
            elem;

        Object.getOwnPropertyNames( model ).forEach( function ( prop ) {

            value = gp.hasValue( model[prop] ) ? model[prop].toString() : '';

            clean = gp.escapeHTML( value ).replace( this.rexp.rCRLF, "\r\n" );

            // is there a checkbox or radio with this name and value?
            elem = context.querySelector( '[type=checkbox][name="' + prop + '"][value="' + clean + '"],[type=radio][name="' + prop + '"][value="' + clean + '"]' );

            if ( elem != null )
            {
                elem.checked = true;
                return;
            }

            // check for boolean
            if ( /^(true|false)$/i.test( value ) )
            {
                elem = context.querySelector( '[type=checkbox][name="' + prop + '"][value=true]' );

                if ( elem != null ) {
                    elem.checked = /^true$/i.test( value );
                    return;
                }
            }

            elem = context.querySelector( '[name="' + prop + '"]' );
            if ( elem != null ) {

                // inputs with a value attribute
                if ( elem.value !== undefined ) {
                    elem.value = value;
                }
                    // inputs with no value attribute (e.g. textarea)
                else if ( elem.innerHTML !== undefined ) {
                    elem.innerHTML = ( value == null ? '' : gp.escapeHTML( value ) );
                }

            }

        }.bind( this ) );
    },

    castValues: function ( model, columns ) {
        var col;

        Object.getOwnPropertyNames( model ).forEach( function ( prop ) {
            col = gp.getColumnByField( columns, prop );

            if ( col && col.Type ) {
                model[prop] = this.cast( model[prop], col.Type );
            }
        }.bind(this) );
    },

    cast: function ( val, dataType ) {
        var isArray = Array.isArray( val );
        var arr = isArray ? val : [val];
        switch ( dataType ) {
            case 'number':
                arr = arr.filter( this.isNumeric ).map( parseFloat );
                break;
            case 'boolean':
                arr = arr.map( function ( v ) {
                    return v.toLowerCase() == 'true';
                } );
                break;
            case 'null':
            case 'undefined':
                arr = arr.map( function ( v ) {
                    if ( /true|false/i.test( v ) ) {
                        // assume boolean
                        return v.toLowerCase() === 'true';
                    }
                    return v === '' ? null : v;
                } );
                break;
            default:
                arr = arr.map( function ( v ) {
                    return v === '' ? null : v;
                } );
                break;
        }
        return isArray ? arr : arr[0];
    }
};

/***************\
   NodeBuilder
\***************/

gp.NodeBuilder = function ( parent ) {
    this.node = parent || null;
};

gp.NodeBuilder.prototype = {

    create: function ( tagName ) {
        var n = document.createElement( tagName );

        if ( this.node ) {
            this.node.appendChild( n );
        }

        this.node = n;

        return this;
    },

    addClass: function ( name ) {
        if ( gp.isNullOrEmpty( name ) ) return this;

        var hasClass = ( ' ' + this.node.className + ' ' ).indexOf( ' ' + name + ' ' ) !== -1;

        if ( !hasClass ) {
            this.node.className = ( this.node.className === '' ) ? name : this.node.className + ' ' + name;
        }

        return this;
    },

    html: function ( html ) {
        this.node.innerHTML = gp.hasValue( html ) ? html : '';
        return this;
    },

    endElem: function () {
        if ( this.node.parentElement ) {
            this.node = this.node.parentElement;
        }
        return this;
    },

    attr: function ( name, value ) {
        this.node.setAttribute( name, value );
        return this;
    },

    close: function () {
        while ( this.node.parentElement ) {
            this.node = this.node.parentElement;
        }
        return this.node;
    }

};

/***************\
  pagers.jquery
\***************/

/***************\
server-side pager
\***************/
gp.ServerPager = function (url) {
    this.url = url;
};

gp.ServerPager.prototype = {
    read: function ( model, callback, error ) {
        var copy = gp.shallowCopy( model );
        // delete anything we don't want to send to the server
        var props = Object.getOwnPropertyNames( copy ).forEach(function(prop){
            if ( /^(page|top|sort|desc|search)$/i.test( prop ) == false ) {
                delete copy[prop];
            }
        } );
        var url = gp.supplant( this.url, copy, copy );
        var h = new gp.Http();
        h.post(url, copy, callback, error);
    }
};


/***************\
client-side pager
\***************/
gp.ClientPager = function (config) {
    var value, self = this;
    this.data = config.pageModel.data;
    this.columns = config.columns.filter(function (c) {
        return c.field !== undefined || c.sort !== undefined;
    });
    if (typeof config.searchfunction === 'function') {
        this.searchFilter = config.searchfunction;
    }
    else {
        this.searchFilter = function (row, search) {
            var s = search.toLowerCase();
            for (var i = 0; i < self.columns.length; i++) {
                value = gp.getFormattedValue( row, self.columns[i], false );
                if (gp.hasValue(value) && value.toString().toLowerCase().indexOf(s) !== -1) {
                    return true;
                }
            }
            return false;
        };
    }
};

gp.ClientPager.prototype = {
    read: function (model, callback, error) {
        try {
            var self = this,
                search,
                skip = this.getSkip( model );

            // don't modify the original array
            model.data = this.data.slice(0, this.data.length);

            // filter first
            if ( !gp.isNullOrEmpty( model.search ) ) {
                // make sure searchTerm is a string and trim it
                search = $.trim( model.search.toString() );
                model.data = model.data.filter(function (row) {
                    return self.searchFilter(row, search);
                });
            }

            // set totalrows after filtering, but before paging
            model.totalrows = model.data.length;

            model.pagecount = this.getPageCount( model );

            // then sort
            if (gp.isNullOrEmpty(model.sort) === false) {
                var col = gp.getColumnByField( this.columns, model.sort );
                if (gp.hasValue(col)) {
                    var sortFunction = this.getSortFunction( col, model.desc );
                    model.data.sort( function ( row1, row2 ) {
                        return sortFunction( row1[model.sort], row2[model.sort] );
                    });
                }
            }

            // then page
            if (model.top !== -1) {
                model.data = model.data.slice(skip).slice(0, model.top);
            }
        }
        catch (ex) {
            gp.error( ex );
        }
        callback(model);
    },
    getSkip: function ( model ) {
        var data = model;
        if ( data.pagecount == 0 ) {
            return 0;
        }
        if ( data.page < 1 ) {
            data.page = 1;
        }
        else if ( data.page > data.pagecount ) {
            return data.page = data.pagecount;
        }
        return ( data.page - 1 ) * data.top;
    },
    getPageCount: function (model) {
        if ( model.top > 0 ) {
            return Math.ceil( model.totalrows / model.top );
        }
        if ( model.totalrows === 0 ) return 0;
        return 1;
    },
    getSortFunction: function (col, desc) {
        if ( /^(number|date|boolean)$/.test( col.Type ) ) {
            if ( desc ) {
                return this.diffSortDesc;
            }
            return this.diffSortAsc;
        }
        else {
            if ( desc ) {
                return this.stringSortDesc;
            }
            return this.stringSortAsc;
        }
    },
    diffSortDesc: function(a, b) {
        return b - a;
    },
    diffSortAsc: function(a, b) {
        return a - b;
    },
    stringSortDesc: function (a, b) {
        if ( gp.hasValue( a ) === false ) {
            if ( gp.hasValue( b ) ) {
                return 1;
            }
            return 0;
        }
        else if ( gp.hasValue( b ) === false ) {
            // we already know a isn't null
            return -1;
        }

        // string sorting is the default if no type was detected
        // so make sure what we're sorting is a string

        if ( a.toString().toLowerCase() > b.toString().toLowerCase() ) {
            return -1;
        }
        if ( a.toString().toLowerCase() < b.toString().toLowerCase() ) {
            return 1;
        }

        return 0;
    },
    stringSortAsc: function (a, b) {
        if (gp.hasValue(a) === false) {
            if (gp.hasValue(b)) {
                return -1;
            }
            return 0;
        }
        else if (gp.hasValue(b) === false) {
            // we already know a isn't null
            return 1;
        }

        // string sorting is the default if no type was detected
        // so make sure what we're sorting is a string

        if ( a.toString().toLowerCase() > b.toString().toLowerCase() ) {
            return 1;
        }
        if ( a.toString().toLowerCase() < b.toString().toLowerCase() ) {
            return -1;
        }

        return 0;
    }
};

/***************\
  FunctionPager
\***************/

gp.FunctionPager = function ( config ) {
    this.config = config;
};

gp.FunctionPager.prototype = {
    read: function ( model, callback, error ) {
        try {
            var self = this,
                result = this.config.read( model, callback.bind( this ) );
            // check if the function returned a value instead of using the callback
            if ( gp.hasValue( result ) ) {
                callback( result );
            }
        }
        catch (ex) {
            if (typeof error === 'function') {
                gp.applyFunc( error, this, ex );
            }
            else {
                gp.applyFunc( callback, this, this.config );
            }
            gp.error( ex );
        }
    }
};

/***************\
  PagingModel
\***************/
gp.PagingModel = function (data) {
    var self = this;
    // properites are capitalized here because that's the convention for server-side classes (C#)
    // we want the serialized version of the corresponding server-side class to look exactly like this prototype

    this.top = -1; // this is a flag to let the pagers know if paging is enabled
    this.page = 1;
    this.sort = '';
    this.desc = false;
    this.search = '';
    this.data = data;
    this.totalrows = ( data != undefined && data.length ) ? data.length : 0;
    this.pagecount = 0;

    Object.defineProperty(self, 'pageindex', {
        get: function () {
            return self.page - 1;
        }
    });

    Object.defineProperty(self, 'skip', {
        get: function () {
            if (self.top !== -1) {
                if (self.pagecount === 0) return 0;
                if (self.page < 1) self.page = 1;
                else if (self.page > self.pagecount) return self.page = self.pagecount;
                return self.pageindex * self.top;
            }
            return 0;
        }
    });
};


/***************\
  StringBuilder
\***************/

gp.StringBuilder = function () {
    this.out = [];
};

gp.StringBuilder.prototype = {

    add: function ( str ) {
        this.out.push( str );
        return this;
    },

    escape: function(str) {
        this.out.push( gp.escapeHTML( str ) );
        return this;
    },

    toString: function ( ) {
        return this.out.join('');
    }

};

/***************\
    templates
\***************/
gp.templates = gp.templates || {};
gp.templates['bootstrap-modal'] = function(model, arg) {
    var out = [];
    out.push('<div class="modal fade" tabindex="-1" role="dialog" data-uid="');
    out.push(model.uid);
    out.push('">');
    out.push('<div class="modal-dialog" role="document">');
    out.push('<div class="modal-content">');
    out.push('<div class="modal-header">');
    out.push('<button type="button" class="close" aria-label="Close" value="cancel"><span aria-hidden="true">&times;</span></button>');
    out.push('                <h4 class="modal-title">');
    out.push(model.title);
    out.push('</h4>');
    out.push('</div>');
    out.push('<div class="modal-body">');
                        out.push(model.body);
        out.push('</div>');
    out.push('<div class="modal-footer">');
                        if (model.footer) {
                                out.push(model.footer);
                            } else {
        out.push('<div class="btn-group">');
    out.push('<button type="button" class="btn btn-default" value="cancel">');
    out.push('<span class="glyphicon glyphicon-remove"></span>Close');
    out.push('</button>');
    out.push('<button type="button" class="btn btn-primary" value="save">');
    out.push('<span class="glyphicon glyphicon-save"></span>Save changes');
    out.push('</button>');
    out.push('</div>');
                        }
        out.push('</div>');
    out.push('</div>');
    out.push('<div class="gp-progress-overlay">');
    out.push('<div class="gp-progress gp-progress-container">');
    out.push('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>');
    out.push('</div>');
    out.push('</div>');
    out.push('</div>');
    out.push('</div>');
    return out.join('');
};
gp.templates['gridponent-body'] = function(model, arg) {
    var out = [];
    out.push('<table class="table" cellpadding="0" cellspacing="0">');
            if (!model.fixedheaders) {
                    out.push(gp.helpers['thead'].call(model));
                }
        out.push('<tbody>');
                out.push(gp.helpers['tableRows'].call(model));
        out.push('</tbody>');
            if (model.footer && !model.fixedfooters) {
                    out.push(gp.templates['gridponent-tfoot'](model));
                }
        out.push('</table>');
    return out.join('');
};
gp.templates['gridponent-cells'] = function(model, arg) {
    var out = [];
    model.columns.forEach(function(col, index) {
            out.push('    <td class="body-cell ');
    if ((col.commands)) {
    out.push('commands ');
    }
        out.push(col.bodyclass);
    out.push('">');
                out.push(gp.helpers['bodyCellContent'].call(model, col));
        out.push('</td>');
    });
            return out.join('');
};
gp.templates['gridponent-pager'] = function(model, arg) {
    var out = [];
    out.push(gp.helpers['setPagerFlags'].call(model));
            if (model.pageModel.HasPages) {
            out.push('<div class="btn-group">');
    out.push('    <button class="ms-page-index btn btn-default ');
    if (model.pageModel.IsFirstPage) {
    out.push(' disabled ');
    }
    out.push('" title="First page" value="page" data-page="1">');
    out.push('<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>');
    out.push('</button>');
        out.push('    <button class="ms-page-index btn btn-default ');
    if (model.pageModel.IsFirstPage) {
    out.push(' disabled ');
    }
    out.push('" title="Previous page" value="page" data-page="');
    out.push(model.pageModel.PreviousPage);
    out.push('">');
    out.push('<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>');
    out.push('</button>');
    out.push('</div>');
    out.push('<input type="number" name="page" value="');
    out.push(model.pageModel.page);
    out.push('" class="form-control" style="width:75px;display:inline-block;vertical-align:middle" />');
    out.push('<span class="page-count">');
    out.push('    of ');
    out.push(model.pageModel.pagecount);
        out.push('</span>');
    out.push('<div class="btn-group">');
    out.push('    <button class="ms-page-index btn btn-default ');
    if (model.pageModel.IsLastPage) {
    out.push(' disabled ');
    }
    out.push('" title="Next page" value="page" data-page="');
    out.push(model.pageModel.NextPage);
    out.push('">');
    out.push('<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>');
    out.push('</button>');
        out.push('    <button class="ms-page-index btn btn-default ');
    if (model.pageModel.IsLastPage) {
    out.push(' disabled ');
    }
    out.push('" title="Last page" value="page" data-page="');
    out.push(model.pageModel.pagecount);
    out.push('">');
    out.push('<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>');
    out.push('</button>');
    out.push('</div>');
    }
            return out.join('');
};
gp.templates['gridponent-table-footer'] = function(model, arg) {
    var out = [];
    out.push('<table class="table" cellpadding="0" cellspacing="0">');
            out.push(gp.templates['gridponent-tfoot'](model));
        out.push('</table>');
    return out.join('');
};
gp.templates['gridponent-tfoot'] = function(model, arg) {
    var out = [];
    out.push('<tfoot>');
    out.push('<tr>');
                model.columns.forEach(function(col, index) {
        out.push('<td class="footer-cell">');
                    out.push(gp.helpers['footerCell'].call(model, col));
        out.push('</td>');
                });
        out.push('</tr>');
    out.push('</tfoot>');
    return out.join('');
};
gp.templates['gridponent'] = function(model, arg) {
    var out = [];
    out.push('<div class="gp table-container');
    out.push(gp.helpers['containerClasses'].call(model));
    out.push('" id="');
    out.push(model.ID);
    out.push('">');
            if (model.search || model.create || model.toolbartemplate) {
        out.push('<div class="table-toolbar">');
                    if (model.toolbartemplate) {
                            out.push(gp.helpers['toolbartemplate'].call(model));
                        } else {
                            if (model.search) {
        out.push('<div class="input-group gridponent-searchbox">');
    out.push('<input type="text" name="search" class="form-control" placeholder="Search...">');
    out.push('<span class="input-group-btn">');
    out.push('<button class="btn btn-default" type="button" value="search">');
    out.push('<span class="glyphicon glyphicon-search"></span>');
    out.push('</button>');
    out.push('</span>');
    out.push('</div>');
                        }
                            if (model.create) {
        out.push('<button class="btn btn-default" type="button" value="AddRow">');
    out.push('<span class="glyphicon glyphicon-plus"></span>Add');
    out.push('</button>');
                        }
                        }
        out.push('</div>');
            }
                if (model.fixedheaders) {
        out.push('<div class="table-header">');
    out.push('<table class="table" cellpadding="0" cellspacing="0">');
                        out.push(gp.helpers['thead'].call(model));
        out.push('</table>');
    out.push('</div>');
            }
        out.push('    <div class="table-body ');
    if (model.fixedheaders) {
    out.push('table-scroll');
    }
    out.push('" style="');
    out.push(model.style);
    out.push('">');
    out.push('<table class="table" cellpadding="0" cellspacing="0">');
                    if (!model.fixedheaders) {
                            out.push(gp.helpers['thead'].call(model));
                        }
        out.push('</table>');
    out.push('</div>');
            if (model.fixedfooters) {
        out.push('<div class="table-footer">');
                    out.push(gp.templates['gridponent-table-footer'](model));
        out.push('</div>');
            }
                if (model.pager) {
        out.push('<div class="table-pager"></div>');
            }
        out.push('<style type="text/css" class="column-width-style">');
                out.push(gp.helpers['columnWidthStyle'].call(model));
        out.push('</style>');
    out.push('<div class="gp-progress-overlay">');
    out.push('<div class="gp-progress gp-progress-container">');
    out.push('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>');
    out.push('</div>');
    out.push('</div>');
    out.push('</div>');
    return out.join('');
};

/***************\
   UpdateModel
\***************/
gp.UpdateModel = function ( dataItem, validationErrors ) {

    this.dataItem = dataItem;
    this.errors = validationErrors;
    this.original = gp.shallowCopy( dataItem );

};

/***************\
   utilities
\***************/
( function ( gp ) {

    var matches = null;

    var possibles = ['matches', 'matchesSelector', 'mozMatchesSelector', 'webkitMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];

    for ( var i = 0; i < possibles.length && matches == null; i++ ) {
        if ( Element.prototype[possibles[i]] ) matches = possibles[i];
    }


    gp.applyFunc = function ( callback, context, args, error ) {
        if ( typeof callback !== 'function' ) return;
        // anytime there's the possibility of executing 
        // user-supplied code, wrap it with a try-catch block
        // so it doesn't affect my component
        try {
            if ( args == undefined ) {
                return callback.call( context );
            }
            else {
                args = Array.isArray( args ) ? args : [args];
                return callback.apply( context, args );
            }
        }
        catch ( e ) {
            error = error || gp.error;
            gp.applyFunc( error, context, e );
        }
    };

    gp.camelize = function ( str ) {
        if ( gp.isNullOrEmpty( str ) ) return str;
        return str
            .replace( /[A-Z]([A-Z]+)/g, function ( _, c ) {
                return _ ? _.substr( 0, 1 ) + c.toLowerCase() : '';
            } )
            .replace( /[-_](\w)/g, function ( _, c ) {
                return c ? c.toUpperCase() : '';
            } )
            .replace( /^([A-Z])/, function ( _, c ) {
                return c ? c.toLowerCase() : '';
            } );
    };

    gp.coalesce = function ( array ) {
        if ( gp.isNullOrEmpty( array ) ) return array;

        for ( var i = 0; i < array.length; i++ ) {
            if ( gp.hasValue( array[i] ) ) {
                return array[i];
            }
        }

        return array[array.length - 1];
    };

    var FP = Function.prototype;

    var callbind = FP.bind
       ? FP.bind.bind( FP.call )
       : ( function ( call ) {
           return function ( func ) {
               return function () {
                   return call.apply( func, arguments );
               };
           };
       }( FP.call ) );

    var uids = {};
    var slice = callbind( ''.slice );
    var zero = 0;
    var numberToString = callbind( zero.toString );

    gp.createUID = function () {
        // id's can't begin with a number
        var key = 'gp' + slice( numberToString( Math.random(), 36 ), 2 );
        return key in uids ? createUID() : uids[key] = key;
    };

    gp.disable = function ( elem, seconds ) {
        $(elem).attr( 'disabled', 'disabled' ).addClass('disabled busy');
        if ( typeof seconds == 'number' && seconds > 0 ) {
            setTimeout( function () {
                gp.enable( elem );
            }, seconds * 1000 );
        }
    };

    gp.enable = function ( elem ) {
        $(elem).removeAttr( 'disabled' ).removeClass('disabled busy' );
    };

    var chars = [/&/g, /</g, />/g, /"/g, /'/g, /`/g];
    var escaped = ['&amp;', '&lt;', '&gt;', '&quot;', '&apos;', '&#96;'];

    gp.escapeHTML = function ( obj ) {
        if ( typeof obj !== 'string' ) {
            return obj;
        }
        for ( var i = 0; i < chars.length; i++ ) {
            obj = obj.replace( chars[i], escaped[i] );
        }
        return obj;
    };

    gp.formatter = new gp.Formatter();

    gp.getAttributes = function ( node ) {
        var config = {}, name, attr, attrs = node.attributes;
        for ( var i = attrs.length - 1; i >= 0; i-- ) {
            attr = attrs[i];
            name = attr.name.toLowerCase().replace('-', '');
            // convert "true", "false" and empty to boolean
            config[name] = gp.rexp.trueFalse.test( attr.value ) || attr.value === '' ?
                ( attr.value === "true" || attr.value === '' ) : attr.value;
        }
        return config;
    };

    gp.getColumnByField = function ( columns, field ) {
        var col = columns.filter( function ( c ) { return c.field === field || c.sort === field } );
        return col.length ? col[0] : null;
    };

    gp.getCommand = function ( columns, name ) {
        // find by value
        var allCmds = [];
        columns.forEach( function ( col ) {
            if ( Array.isArray(col.commands)){
                allCmds = allCmds.concat(col.commands);
            }
        } );

        var cmd = allCmds.filter(function(cmd){
            return cmd.value === name;
        });

        if (cmd.length > 0) return cmd[0];
    };

    gp.getDefaultValue = function ( type ) {
        switch ( type ) {
            case 'number':
                return 0;
            case 'boolean':
                return false;
            case 'date':
            default:
                return null;
        }
    };

    gp.getFormattedValue = function ( row, col, escapeHTML ) {
        var type = ( col.Type || '' ).toLowerCase();
        var val = row[col.field];

        if ( /^(date|datestring|timestamp)$/.test( type ) ) {
            return gp.formatter.format( val, col.format );
        }
        if ( type === 'number' && col.format ) {
            return gp.formatter.format( val, col.format );
        }
        if ( type === '' && col.format && /^(?:\d*\.)?\d+$/.test( val ) ) {
            return gp.formatter.format( parseFloat( val ), col.format );
        }
        if ( type === 'string' && escapeHTML ) {
            return gp.escapeHTML( val );
        }
        return val;
    };

    gp.getObjectAtPath = function ( path, root ) {
        if ( !path ) return path;

        path = Array.isArray( path ) ? path : path.match( gp.rexp.splitPath );

        if ( path[0] === 'window' ) path = path.splice( 1 );

        // o is our placeholder
        var o = root || window,
            segment;

        for ( var i = 0; i < path.length; i++ ) {
            // is this segment an array index?
            segment = path[i];
            if ( gp.rexp.indexer.test( segment ) ) {
                // convert to int
                segment = parseInt( /\d+/.exec( segment ) );
            }
            else if ( gp.rexp.quoted.test( segment ) ) {
                segment = segment.slice( 1, -1 );
            }

            o = o[segment];

            if ( o === undefined ) return;
        }

        return o;
    };

    gp.getTableRow = function ( map, dataItem, node ) {
        var uid = map.getUid( dataItem );
        if ( uid == -1 ) return;
        return $(node).find( 'tr[data-uid="' + uid + '"]' );
    };

    gp.getType = function ( a ) {
        if ( a === null || a === undefined ) {
            return a;
        }
        if ( a instanceof Date ) {
            return 'date';
        }
        if ( typeof ( a ) === 'string' ) {
            if ( gp.rexp.iso8601.test( a ) ) {
                return 'datestring';
            }
            if ( gp.rexp.timestamp.test( a ) ) {
                return 'timestamp';
            }
        }
        if ( Array.isArray( a ) ) {
            return 'array';
        }
        // number string boolean function object
        return typeof ( a );
    };

    gp.hasPositiveWidth = function ( nodes ) {
        if ( gp.isNullOrEmpty( nodes ) ) return false;
        for ( var i = 0; i < nodes.length; i++ ) {
            if ( nodes[i].offsetWidth > 0 ) return true;
        }
        return false;
    };

    gp.hasValue = function ( val ) {
        return val !== undefined && val !== null;
    };

    gp.isNullOrEmpty = function ( val ) {
        // if a string or array is passed, it'll be tested for both null and zero length
        // if any other data type is passed (no length property), it'll only be tested for null
        return gp.hasValue( val ) === false || ( val.length != undefined && val.length === 0 );
    };

    gp.resolveTypes = function ( config ) {
        var field,
            hasData = config && config.pageModel && config.pageModel.data && config.pageModel.data.length;

        config.columns.forEach( function ( col ) {
            if ( gp.hasValue( col.Type ) ) return;
            field = gp.hasValue( col.field ) ? col.field : col.sort;
            if ( gp.isNullOrEmpty( field ) ) return;
            if ( config.model ) {
                // look for a type by field first, then by sort
                if ( gp.hasValue( config.model[field] ) ) {
                    col.Type = gp.getType( config.model[field] );
                }
            }
            if ( !gp.hasValue( col.Type ) && hasData ) {
                // if we haven't found a value after 25 iterations, give up
                for ( var i = 0; i < config.pageModel.data.length && i < 25 ; i++ ) {
                    if ( config.pageModel.data[i][field] !== null ) {
                        col.Type = gp.getType( config.pageModel.data[i][field] );
                        break;
                    }
                }
            }
        } );
    };


    gp.rexp = {
        splitPath: /[^\[\]\.\s]+|\[\d+\]/g,
        indexer: /\[\d+\]/,
        iso8601: /^[012][0-9]{3}-[01][0-9]-[0123][0-9]/,
        timestamp: /\/Date\((\d+)\)\//,
        quoted: /^['"].+['"]$/,
        trueFalse: /true|false/i,
        json: /^\{.*\}$|^\[.*\]$/
    };

    gp.shallowCopy = function ( from, to, camelize ) {
        to = to || {};
        var p, props = Object.getOwnPropertyNames( from );
        props.forEach( function ( prop ) {
            p = camelize ? gp.camelize( prop ) : prop;
            to[p] = from[prop];
        } );
        return to;
    };

    gp.supplant = function ( str, o, args ) {
        var self = this, types = /^(string|number|boolean)$/, r;
        // raw
        str = str.replace( /{{{([^{}]*)}}}/g,
            function ( a, b ) {
                r = o[b];
                if ( types.test( typeof r ) ) return r;
                // models can contain functions
                if ( typeof r === 'function' ) return gp.applyFunc( r, self, args );
                // it's not in o, so check for a function
                r = gp.getObjectAtPath( b );
                return typeof r === 'function' ? gp.applyFunc( r, self, args ) : '';
            }
        )
        // escape HTML
        return str.replace( /{{([^{}]*)}}/g,
            function ( a, b ) {
                r = o[b];
                if ( types.test( typeof r ) ) return gp.escapeHTML( r );
                // models can contain functions
                if ( typeof r === 'function' ) return gp.escapeHTML( gp.applyFunc( r, self, args ) );
                // it's not in o, so check for a function
                r = gp.getObjectAtPath( b );
                return typeof r === 'function' ? gp.escapeHTML( gp.applyFunc( r, self, args ) ) : '';
            }
        );
    };

    gp.syncChange = function (target, model, columns) {
        // get name and value of target
        var name = target.name,
            val = target.value,
            type,
            col;

        // attempt to resolve a type by examining the configuration first
        if ( this.config ) {
            col = gp.getColumnByField( columns, name );
            if ( col ) type = col.Type;
        }

        if ( !name in model ) model[name] = null;

        try {
            // if there's no type in the columns, get one from the model
            type = type || gp.getType( model[name] );
            switch ( type ) {
                case 'number':
                    model[name] = parseFloat( val );
                    break;
                case 'boolean':
                    if ( target.type == 'checkbox' ) {
                        if ( val.toLowerCase() == 'true' ) val = target.checked;
                        else if ( val.toLowerCase() == 'false' ) val = !target.checked;
                        else val = target.checked ? val : null;
                        model[name] = val;
                    }
                    else {
                        model[name] = ( val.toLowerCase() == 'true' );
                    }
                    break;
                default:
                    model[name] = val;
            }
        }
        catch ( e ) {
            gp.error( e );
        }
    };

    gp.syncModel = function ( parent, model, columns ) {
        try {
            var inputs = parent.querySelectorAll( '[name]' );
            for ( var i = 0; i < inputs.length; i++ ) {
                gp.syncChange( inputs[i], model, columns );
            }
        }
        catch ( e ) {
            gp.error( e );
        }
    };

    // logging
    gp.log = ( window.console ? window.console.log.bind( window.console ) : function () { } );
    gp.error = function ( e ) {
        if ( console && console.error ) {
            console.error( e );
        }
    };

} )( gridponent );


/****************\
webomponent.jquery
\****************/

// check for web component support
if (document.registerElement) {

    gp.Gridponent = Object.create(HTMLElement.prototype);

    gp.Gridponent.createdCallback = function () {
        var init = new gp.Initializer( this );
        gp.ready( init.initialize.bind( init ) );
    };

    gp.Gridponent.detachedCallback = function () {
        var tbl = this.querySelector('.table-container');
        if (tbl && tbl.api) tbl.api.dispose();
    };

    document.registerElement('grid-ponent', {
        prototype: gp.Gridponent
    });
}
else {
    // no web component support
    // provide a static function to initialize grid-ponent elements manually
    gp.initialize = function (root) {
        root = root || document;
        var node, nodes = root.querySelectorAll( 'grid-ponent' );
        for ( var i = 0; i < nodes.length; i++ ) {
            new gp.Initializer( nodes[i] ).initialize();
        }
    };

    $( gp.initialize );
}

})(gridponent);
