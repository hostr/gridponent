﻿/***************\
   ObjectProxy
\***************/
gp.ObjectProxy = function (obj, onPropertyChanged ) {
    var self = this;
    var dict = {};

    // create mirror properties
    var props = Object.getOwnPropertyNames( obj );

    props.forEach(function (prop) {
        Object.defineProperty(self, prop, {
            get: function () {
                return dict[prop];
            },
            set: function (value) {
                if (dict[prop] != value) {
                    var oldValue = dict[prop];
                    dict[prop] = value;
                    if ( typeof onPropertyChanged === 'function' ) {
                        gp.applyFunc( onPropertyChanged, self, [self, prop, oldValue, value] );
                    }
                }
            }
        });
        dict[prop] = obj[prop];
    });
};