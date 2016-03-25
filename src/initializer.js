﻿/***************\
   Initializer
\***************/
gp.Initializer = function ( node ) {
    this.node = node;
};

gp.Initializer.prototype = {

    initialize: function (callback) {
        var self = this;
        this.config = this.getConfig(this.node);
        this.node.config = this.config;
        var model = new gp.Model( this.config );
        var requestModel = new gp.PagingModel();
        var controller = new gp.Controller( self.config, model, requestModel );
        this.node.api = new gp.api( controller );
        this.renderLayout( this.config );
        this.addBusyHandlers();

        if ( typeof this.config.Ready === 'function' ) {
            controller.ready( this.config.Ready );
        }

        if ( typeof this.config.AfterEdit === 'function' ) {
            gp.on( this.config.node, gp.events.afterEdit, this.config.AfterEdit );
        }

        // events should be raised AFTER the node is added to the DOM or they won't bubble
        // this problem occurs when nodes are created and then added to the DOM programmatically 
        // that means initialize has to return before it raises any events
        setTimeout( function () {
            // provides a hook for extensions
            gp.raiseCustomEvent( self.config.node, gp.events.beforeInit, self.config );

            // we need both beforeInit and beforeRead because beforeRead is used after every read in the controller
            // and beforeInit happens just once after the node is created, but before first read
            gp.raiseCustomEvent( self.config.node, gp.events.beforeRead, self.config.pageModel );

            model.read( requestModel,
                function ( data ) {
                    try {
                        self.config.pageModel = data;
                        self.resolveTypes( self.config );
                        self.render( self.config );
                        controller.init();
                        if ( typeof callback === 'function' ) callback( self.config );
                    } catch ( e ) {
                        gp.error( e );
                    }
                    gp.raiseCustomEvent( self.config.node, gp.events.afterRead, self.config.pageModel );
                    gp.raiseCustomEvent( self.config.node, gp.events.afterInit, self.config );
                },
                function (e) {
                    gp.raiseCustomEvent( self.config.node, gp.events.httpError, e );
                    alert( 'An error occurred while carrying out your request.' );
                    gp.error( e );
                }

            );
        } );

        return this.config;
    },

    addBusyHandlers: function () {
        gp.on( this.config.node, gp.events.beforeRead, gp.addBusy );
        gp.on( this.config.node, gp.events.afterRead, gp.removeBusy );
        gp.on( this.config.node, gp.events.beforeUpdate, gp.addBusy );
        gp.on( this.config.node, gp.events.afterUpdate, gp.removeBusy );
        gp.on( this.config.node, gp.events.beforeDelete, gp.addBusy );
        gp.on( this.config.node, gp.events.afterDelete, gp.removeBusy );
        gp.on( this.config.node, gp.events.httpError, gp.removeBusy );
    },

    getConfig: function (node) {
        var self = this,
            obj,
            colNode,
            colConfig,
            templates,
            config = gp.getAttributes( node ),
            gpColumns = config.node.querySelectorAll( 'gp-column' );

        config.Columns = [];
        config.pageModel = {};
        config.ID = gp.createUID();

        // create the column configurations
        templates = 'header body edit footer'.split( ' ' );
        for ( var i = 0; i < gpColumns.length; i++ ) {
            colNode = gpColumns[i];
            colConfig = gp.getAttributes(colNode);
            config.Columns.push(colConfig);
            this.resolveCommands(colConfig);
            this.resolveTemplates( templates, colConfig, colNode );
        }

        config.Footer = this.resolveFooter( config );

        // resolve the top level configurations
        var options = 'Onrowselect SearchFunction Read Create Update Delete Validate Model Ready AfterEdit Model'.split(' ');
        options.forEach( function ( option ) {

            if ( gp.hasValue(config[option]) ) {
                // see if this config option points to an object
                // otherwise it must be a URL
                obj = gp.getObjectAtPath( config[option] );

                if ( gp.hasValue( obj ) ) config[option] = obj;
            }

        } );

        // resolve the various templates
        this.resolveTemplates( ['toolbar', 'footer'], config, config.node );

        return config;
    },

    renderLayout: function ( config ) {
        var self = this;
        try {
            config.node.innerHTML = gp.templates['gridponent']( config );
        }
        catch ( ex ) {
            gp.error( ex );
        }
    },

    render: function ( config ) {
        var self = this;
        try {
            var node = config.node;

            // inject table rows, footer, pager and header style.

            var body = node.querySelector( 'div.table-body' );
            var footer = node.querySelector( 'div.table-footer' );
            var pager = node.querySelector( 'div.table-pager' );
            var sortStyle = node.querySelector( 'style.sort-style' );

            body.innerHTML = gp.templates['gridponent-body']( config );
            if ( footer ) {
                footer.innerHTML = gp.templates['gridponent-table-footer']( config );
            }
            if ( pager ) {
                pager.innerHTML = gp.templates['gridponent-pager']( config );
            }
            sortStyle = gp.helpers.sortStyle.call( config );

            // sync column widths
            if ( config.FixedHeaders || config.FixedFooters ) {
                var nodes = node.querySelectorAll( '.table-body > table > tbody > tr:first-child > td' );

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

    syncColumnWidths: function (config) {
        var html = gp.helpers.columnWidthStyle.call( config );
        config.node.querySelector( 'style.column-width-style' ).innerHTML = html;
    },

    resolveFooter: function (config) {
        for (var i = 0; i < config.Columns.length; i++) {
            if (config.Columns[i].FooterTemplate) return true;
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
                        prop = gp.camelize( n ) + 'Template';
                        config[prop] = template.innerHTML;
                        return;
                    }
                }
            }
        } );
    },

    resolveCommands: function (col) {
        if ( typeof col.Commands == 'string' ) {
            col.Commands = col.Commands.split( ',' );
        }
    },

    resolveTypes: function ( config ) {
        if ( !config || !config.pageModel ) return;
        config.Columns.forEach( function ( col ) {
            // look for a type by Field first, then by Sort
            var field = gp.hasValue( col.Field ) ? col.Field : col.Sort;
            if ( gp.isNullOrEmpty( field ) ) return;
            if ( config.pageModel.Data.length ) {
                // if we haven't found a value after 200 iterations, give up
                for ( var i = 0; i < config.pageModel.Data.length && i < 200 ; i++ ) {
                    if ( config.pageModel.Data[i][field] !== null ) {
                        col.Type = gp.getType( config.pageModel.Data[i][field] );
                        break;
                    }
                }
            }
        } );
    }

};