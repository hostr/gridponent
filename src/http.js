﻿/***************\
     http        
\***************/
gp.Http = function () { };

gp.Http.prototype = {
    serialize: function ( obj ) {
        // creates a query string from a simple object
        var props = Object.getOwnPropertyNames( obj );
        var out = [];
        props.forEach( function ( prop ) {
            out.push( encodeURIComponent( prop ) + '=' + encodeURIComponent( obj[prop] ) );
        } );
        return out.join( '&' );
    },
    createXhr: function ( type, url, callback, error ) {
        var xhr = new XMLHttpRequest();
        xhr.open(type.toUpperCase(), url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = function () {
            if ( xhr.status == 200 ) {
                callback( JSON.parse( xhr.responseText ), xhr );
            }
            else {
                gp.tryCallback( error, xhr, xhr.responseText );
            }
        }
        xhr.onerror = error;
        return xhr;
    },
    get: function (url, callback, error) {
        var xhr = this.createXhr('GET', url, callback, error);
        xhr.send();
    },
    post: function ( url, data, callback, error ) {
        var s = this.serialize( data );
        var xhr = this.createXhr( 'POST', url, callback, error );
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
        xhr.send( s );
    },
    'delete': function ( url, data, callback, error ) {
        var s = this.serialize( data );
        var xhr = this.createXhr( 'DELETE', url, callback, error );
        xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
        xhr.send( s );
    }

};
