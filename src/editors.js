﻿/***************\
     Editor
\***************/

gp.Editor = function ( config, dal, injector ) {

    this.config = config;
    this.dal = dal;
    this.uid = null;
    this.dataItem = null;
    this.originalDataItem = null;
    this.mode = null;
    this.beforeEdit = null;
    this.afterEdit = null;
    this.editReady = null;
    this.button = null;
    this.$n = $( config.node );
    this.injector = injector;

};

gp.Editor.prototype = {

    add: function ( dataItem ) {
        this.dataItem = dataItem || this.createDataItem();
        this.injector
            .setResource( '$dataItem', this.dataItem )
            .setResource( '$mode', 'create' );
        this.mode = 'create';

        // add the data item to the internal data array
        this.config.pageModel.data.push( this.dataItem );

        // map it
        this.uid = this.config.map.assign( this.dataItem );

        return {
            dataItem: this.dataItem,
            uid: this.uid
        };
    },

    edit: function ( dataItem ) {
        this.dataItem = dataItem;
        this.injector.setResource( '$dataItem', dataItem )
            .setResource( '$mode', 'update' );
        this.originalDataItem = gp.shallowCopy( dataItem );
        this.mode = 'update';
        return {
            dataItem: dataItem,
        };
    },

    cancel: function () {
        if ( this.mode === 'create' ) {
            // unmap the dataItem
            this.config.map.remove( this.uid );
            // remove the dataItem from the internal array
            var index = this.config.pageModel.data.indexOf( this.dataItem );
            if ( index !== -1 ) {
                this.config.pageModel.data.slice( index, 1 );
            }
        }
        else if ( this.mode == 'update' && this.originalDataItem ) {
            //restore the dataItem to its original state
            gp.shallowCopy( this.originalDataItem, this.dataItem );
        }

        this.removeCommandHandler();
    },

    httpErrorHandler: function ( e ) {
        alert( 'An error occurred while carrying out your request.' );
        gp.error( e );
    },

    save: function ( done, fail ) {
        // create or update
        var self = this,
            returnedDataItem,
            serialized,
            uid,
            fail = fail || gp.error;

        this.addBusy();

        // it's possible for the API to invoke this save method
        // there won't be a form element in that case
        if ( this.elem ) {
            // serialize the form
            serialized = gp.ModelSync.serialize( this.elem );

            // currently the only supported post format is application/x-www-form-urlencoded
            // so normally there'd be no point in converting the serialized form values to their former types
            // but we can't rely on the server to return an updated model (it may simply return a success/fail message)
            // so we'll convert them anyway
            gp.ModelSync.castValues( serialized, this.config.columns );

            // copy the values back to the original dataItem
            gp.shallowCopy( serialized, this.dataItem );
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
                        //self.config.pageModel.data.push( returnedDataItem );

                        // copy to local dataItem so updateUI will bind to current data
                        gp.shallowCopy( returnedDataItem, self.dataItem );

                        // It's important to map the dataItem after it's saved because user could cancel.
                        // Also the returned dataItem will likely have additional information added by the server.
                        //uid = self.config.map.assign( returnedDataItem, self.elem );

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
            function ( e ) {
                self.removeBusy();
                gp.applyFunc( fail, self, e );
            } );

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
            function ( e ) {
                self.removeBusy();
                gp.applyFunc( fail, self, e );
            } );

        }
    },

    addBusy: function () {
        this.$n.addClass( 'busy' );
    },

    removeBusy: function () {
        this.$n.removeClass( 'busy' );
    },

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

gp.TableRowEditor = function ( config, dal, injector ) {

    var self = this;

    gp.Editor.call( this, config, dal, injector );

    this.elem = null;
    this.commandHandler = function ( evt ) {
        // handle save or cancel
        var command = $( this ).val();

        if ( /^(create|update|save)$/i.test( command ) ) {
            self.button = evt.target;
            // prevent double clicking
            gp.disable( self.button, 5 );
            self.save(null, self.httpErrorHandler);
        }
        else if ( /^cancel$/i.test( command ) ) self.cancel();
    };

};

gp.TableRowEditor.prototype = {

    save: gp.Editor.prototype.save,

    addBusy: gp.Editor.prototype.addBusy,

    removeBusy: gp.Editor.prototype.removeBusy,

    httpErrorHandler: gp.Editor.prototype.httpErrorHandler,

    createDataItem: gp.Editor.prototype.createDataItem,

    addCommandHandler: function () {
        $( this.elem ).on( 'click', 'button[value]', this.commandHandler );
    },

    removeCommandHandler: function () {
        $( this.elem ).off( 'click', this.commandHandler );
    },

    add: function (dataItem) {
        var self = this,
            tbody = this.$n.find( 'div.table-body > table > tbody' ),
            builder = new gp.NodeBuilder(),
            cellContent;

        var obj = gp.Editor.prototype.add.call( this, dataItem );

        builder.create( 'tr' ).addClass( 'create-mode' ).attr( 'data-uid', obj.uid );

        // add td.body-cell elements to the tr
        this.config.columns.forEach( function ( col ) {
            self.injector
                .setResource( '$column', col )
                .setResource( '$mode', 'create' );
            cellContent = col.readonly ?
                self.injector.exec( 'bodyCellContent' ) :
                self.injector.exec( 'editCellContent' );
            builder.create( 'td' ).addClass( 'body-cell' ).addClass( col.bodyclass ).html( cellContent );
            if ( col.commands ) {
                builder.addClass( 'commands' );
            }
            if ( col.editclass ) {
                builder.addClass( col.editclass );
            }
            builder.endElem();
        } );

        this.elem = builder.close();

        gp.ModelSync.bindElements( this.dataItem, this.elem );

        this.addCommandHandler();

        if ( this.config.newrowposition === 'top' ) {
            tbody.prepend( this.elem );
        }
        else {
            tbody.append( this.elem );
        }

        this.invokeEditReady();

        return {
            dataItem: this.dataItem,
            elem: this.elem
        };
    },

    edit: function (dataItem, tr) {

        // replace the cell contents of the table row with edit controls

        var self = this,
            col,
            cells = $( tr ).find( 'td.body-cell' ),
            uid;

        gp.Editor.prototype.edit.call( this, dataItem );

        this.elem = tr;

        this.addCommandHandler();

        // IE9 can't set innerHTML of tr, so iterate through each cell and set its innerHTML
        // besides, that way we can just skip readonly cells
        cells.each( function ( i ) {
            col = self.config.columns[i];
            self.injector
                .setResource( '$column', col )
                .setResource( '$mode', 'edit' );
            if ( !col.readonly ) {
                $( this ).html( self.injector.exec(' editCellContent ') );
                if ( col.editclass ) {
                    $( this ).addClass( col.editclass );
                }
            }
        } );

        $( tr ).addClass( 'edit-mode' );

        gp.ModelSync.bindElements( dataItem, this.elem );

        this.invokeEditReady();

        return {
            dataItem: dataItem,
            elem: this.elem
        };
    },

    cancel: function () {
        
        gp.Editor.prototype.cancel.call( this );

        try {
            var tbl = $(this.elem).closest( 'table', this.$n ),
                index;

            if ( $( this.elem ).hasClass( 'create-mode' ) ) {
                // remove elem
                tbl[0].deleteRow( this.elem.rowIndex );
            }
            else {
                this.updateUI();
            }
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
                errors,
                msg;

            builder.add( 'Please correct the following errors:\r\n' );

            // remove error class from inputs
            $( self.elem ).find( '[name].error' ).removeClass( 'error' );

            Object.getOwnPropertyNames( updateModel.errors ).forEach( function ( e ) {

                $( self.elem ).find( '[name="' + e + '"]' ).addClass( 'error' );

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

    updateUI: function () {
        // take the table row out of edit mode
        var self = this,
            col,
            cells = $( this.elem ).find( 'td.body-cell' );

        cells.each( function ( i ) {
            col = self.config.columns[i];
            self.injector.setResource( '$column', col );
            $( this ).html( self.injector.exec( 'bodyCellContent' ) );
            if ( col.editclass ) {
                $( this ).removeClass( col.editclass );
            }
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

gp.ModalEditor = function ( config, dal, injector ) {

    gp.TableRowEditor.call( this, config, dal, injector );

};

gp.ModalEditor.prototype = {

    save: gp.Editor.prototype.save,

    addBusy: gp.Editor.prototype.addBusy,

    removeBusy: gp.Editor.prototype.removeBusy,

    httpErrorHandler: gp.Editor.prototype.httpErrorHandler,

    addCommandHandler: gp.TableRowEditor.prototype.addCommandHandler,

    removeCommandHandler: gp.TableRowEditor.prototype.removeCommandHandler,

    validate: gp.TableRowEditor.prototype.validate,

    createDataItem: gp.Editor.prototype.createDataItem,

    invokeEditReady: gp.TableRowEditor.prototype.invokeEditReady,

    add: function (dataItem) {
        var self = this,
            html,
            modal;

        gp.Editor.prototype.add.call( this, dataItem );

        // mode: create or update
        html = this.injector.exec( 'bootstrapModalContent' );

        // append the modal to the top node so button clicks will be picked up by commandHandlder
        modal = $( html )
            .appendTo( this.config.node )
            .one( 'shown.bs.modal', self.invokeEditReady.bind( self ) );

        this.elem = modal[0];

        modal.modal( {
            show: true,
            keyboard: true,
            backdrop: 'static'
        } );

        gp.ModelSync.bindElements( this.dataItem, this.elem );

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
        var self = this,
            html,
            modal;

        gp.Editor.prototype.edit.call( this, dataItem );

        // mode: create or update
        html = this.injector.exec( 'bootstrapModalContent' );

        // append the modal to the top node so button clicks will be picked up by commandHandlder
        modal = $( html )
            .appendTo( this.config.node )
            .one( 'shown.bs.modal', self.invokeEditReady.bind( self ) );

        this.elem = modal[0];

        modal.modal( {
            show: true,
            keyboard: true,
            backdrop: 'static'
        } );

        gp.ModelSync.bindElements( dataItem, this.elem );

        modal.one( 'hidden.bs.modal', function () {
            $( modal ).remove();
        } );

        this.addCommandHandler();

        return {
            dataItem: dataItem,
            elem: this.elem
        };

    },

    cancel: function () {

        gp.Editor.prototype.cancel.call( this );

        $( this.elem ).modal( 'hide' );
    },

    updateUI: function () {

        var self = this,
            tbody = this.$n.find( 'div.table-body > table > tbody' ),
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
                cellContent = self.injector.setResource( '$column', col ).exec( 'bodyCellContent' );
                builder.create( 'td' ).addClass( 'body-cell' ).addClass( col.bodyclass ).html( cellContent ).endElem();
            } );

            tableRow = builder.close();

            if ( this.config.newrowposition === 'top' ) {
                tbody.prepend( tableRow );
            }
            else {
                tbody.append( tableRow );
            }
        }
        else {
            tableRow = gp.getTableRow( this.config.map, this.dataItem, this.config.node );
    
            if ( tableRow ) {
                $( tableRow ).find( 'td.body-cell' ).each( function ( i ) {
                    col = self.config.columns[i];
                    self.injector.setResource( '$column', col );
                    $( this ).html( self.injector.exec( 'bodyCellContent' ) );
                } );
            }
        }

    }

};
