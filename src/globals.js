﻿/***************\
     globals
\***************/
(function (gp) {

    gp.getSearch = function () {
        var split, nameValue,
            obj = {},
            search = window.location.search;
        if (search && search.length) {
            split = search.substring(1).split('&');
            split.forEach(function (s) {
                nameValue = s.split('=');
                if (nameValue.length == 1) obj[nameValue[0]] = null;
                else obj[nameValue[0]] = nameValue[1];
            });
        }
        return obj;
    };

    // logging
    var search = gp.getSearch();

    gp.error = console.log.bind(console);
    gp.log = gp.verbose = gp.info = gp.warn = function () { };

    if ('log' in search) {
        gp.log = console.log.bind(console);
        if (search.log === 'verbose') {
            gp.verbose = gp.info = gp.warn = gp.log;
        }
        else if (search.log === 'info') {
            gp.info = gp.warn = gp.log;
        }
        else if (search.log === 'warn') {
            gp.warn = gp.log;
        }
    }

    gp.getConfig = function (node) {
        gp.verbose('getConfig: node:');
        gp.verbose(node);
        var config = {}, name, attr, attrs = node.attributes;
        config.node = node;
        for (var i = attrs.length - 1; i >= 0; i--) {
            attr = attrs[i];
            name = gp.camelize(attr.name);
            // convert "true", "false" and empty to boolean
            config[name] = attr.value === "true" || attr.value === "false" || attr.value === '' ? (attr.value === "true" || attr.value === '') : attr.value;
        }
        gp.verbose('getConfig: config:');
        gp.verbose(config);
        return config;
    };

    gp.padLeft = function (str, length, char) {
        var s = str.toString();
        char = char || ' ';
        while (s.length < length)
            s = char + s;
        return s;
    };

    var iso8601 = /^[012][0-9]{3}-[01][0-9]-[0123][0-9]/;

    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // I hate dates. Why do they have to be so painful?
    // http://stackoverflow.com/questions/5802461/javascript-which-browsers-support-parsing-of-iso-8601-date-string-with-date-par
    function dateFromISO8601(isoDateString) {
        var parts = isoDateString.match(/\d+/g);
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    }

    gp.formatDate = function (date, format) {
        var dt = date;

        if (typeof dt === 'string') {
            // check for iso 8601
            if (iso8601.test(dt)) {
                dt = dateFromISO8601(dt);
            }
            else {
                // check for MS Date(1234567890-12345)
                var msDate = (/-?\d+/).exec(dt);
                if (msDate != null) {
                    var d1 = new Date(parseInt(msDate[0])).toUTCString().replace("UTC", "");
                    dt = new Date(d1);
                }
            }
        }

        switch (format) {
            case 'd':
                format = 'M/d/yyyy';
                break;
            case 'D':
                format = 'dddd, MMMM d, yyyy';
                break;
            case 't':
                format = 'h:mm tt';
                break;
            case 'T':
                format = 'h:mm:ss tt';
                break;
        }

        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var h = dt.getHours();
        var n = dt.getMinutes();
        var s = dt.getSeconds();
        var f = dt.getMilliseconds();
        var w = dt.getDay();

        format = format
            .replace('yyyy', y)
            .replace('yy', y.toString().slice(-2))
            .replace('ss', gp.padLeft(s, 2, '0'))
            .replace('s', s)
            .replace('f', f)
            .replace('mm', gp.padLeft(n, 2, '0'))
            .replace('m', n)
            .replace('HH', gp.padLeft(h, 2, '0'))
            .replace('H', h)
            .replace('hh', gp.padLeft((h > 12 ? h - 12 : h), 2, '0'))
            .replace('h', (h > 12 ? h - 12 : h))
            //replace conflicting tokens with alternate tokens
            .replace('tt', (h > 11 ? '>>' : '<<'))
            .replace('t', (h > 11 ? '##' : '$$'))
            .replace('MMMM', '!!')
            .replace('MMM', '@@')
            .replace('MM', gp.padLeft(m, 2, '0'))
            .replace('M', m)
            .replace('dddd', '^^')
            .replace('ddd', '&&')
            .replace('dd', gp.padLeft(d, 2, '0'))
            .replace('d', d)
            //replace alternate tokens
            .replace('>>', 'PM')
            .replace('<<', 'AM')
            .replace('##', 'P')
            .replace('$$', 'A')
            .replace('!!', monthNames[m - 1])
            .replace('@@', monthNames[m - 1].substring(0, 3))
            .replace('^^', dayNames[w])
            .replace('&&', dayNames[w].substring(0, 3));

        return format;
    };

    var chars = [/&/g, /</g, />/g, /"/g, /'/g, /`/g];

    var escaped = ['&amp;', '&lt;', '&gt;', '&quot;', '&apos;', '&#96;'];

    gp.escapeHTML = function (obj) {
        if (typeof obj !== 'string') {
            return obj;
        }
        for (var i = 0; i < chars.length; i++) {
            obj = obj.replace(chars[i], escaped[i]);
        }
        return obj;
    };

    gp.camelize = function (str) {
        return str.replace(/(?:^|[-_])(\w)/g, function (_, c) {
            return c ? c.toUpperCase() : '';
        });
    };

    gp.getType = function (a) {
        if (a === null || a === undefined) {
            return a;
        }
        if (a instanceof Date || (typeof (a) === 'string' && iso8601.test(a))) {
            return 'date';
        }
        if (Array.isArray(a)) {
            return 'array';
        }
        // 'number','string','boolean','function','object'
        return typeof (a);
    };

    gp.on = function (elem, event, targetSelector, listener) {
        // if elem is a selector, convert it to an element
        if (typeof (elem) === 'string') {
            elem = document.querySelector(elem);
        }

        if (!gp.hasValue(elem)) {
            return;
        }

        // this allows us to attach an event handler to the document
        // and handle events that match a selector
        var privateListener = function (evt) {

            var e = evt.target;

            // get all the elements that match targetSelector
            var potentials = elem.querySelectorAll(targetSelector);

            // find the first element that matches targetSelector
            // usually this will be the first one
            while (e) {
                for (var j = 0; j < potentials.length; j++) {
                    if (e == potentials[j]) {
                        // set 'this' to the matching element
                        listener.call(e, evt);
                        return;
                    }
                }
                e = e.parentElement;
            }
        };

        // handle event
        elem.addEventListener(event, privateListener, false);

        // use an array to store listener and privateListener 
        // so we can remove the handler with gp.off
        var propName = 'gp-listeners-' + event;
        var listeners = elem[propName] || (elem[propName] = []);
        listeners.push({
            pub: listener,
            priv: privateListener
        });
    };

    gp.off = function (elem, event, listener) {
        // check for a matching listener store on the element
        var listeners = elem['gp-listeners-' + event];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].pub === listener) {

                    // remove the event handler
                    elem.removeEventListener(event, listeners[i].priv);

                    // remove it from the listener store
                    listeners.splice(i, 1);
                    return;
                }
            }
        }
    };

    gp.closest = function (elem, selector) {
        // if elem is a selector, convert it to an element
        if (typeof (elem) === 'string') {
            elem = document.querySelector(elem);
        }
        gp.info('closest: elem:');
        gp.info(elem);

        if (elem) {
            // start with elem's immediate parent
            var e = elem.parentElement;

            var potentials = document.querySelectorAll(selector);

            while (e) {
                for (var j = 0; j < potentials.length; j++) {
                    if (e == potentials[j]) {
                        return e;
                    }
                }
                e = e.parentElement;
            }
        }
    };

    gp.hasValue = function (val) {
        return val !== undefined && val !== null;
    };

    gp.isNullOrEmpty = function (val) {
        return gp.hasValue(val) === false || val.length === undefined || val.length === 0;
    };

    gp.coalesce = function (array) {
        if (gp.isNullOrEmpty(array)) return array;

        for (var i = 0; i < array.length; i++) {
            if (gp.hasValue(array[i])) {
                return array[i];
            }
        }

        return array[array.length - 1];
    };

    var quoted = /^['"].+['"]$/;

    gp.resolveObjectPath = function (path, root) {
        // split by dots, then square brackets
        try {
            if (typeof path !== 'string') return null;
            gp.verbose('resolveObjectPath:');
            var currentObj = root || window;
            var paths = path.split('.');

            for (var i = 0; i < paths.length && gp.hasValue(currentObj); i++) {
                var name = paths[i];
                gp.verbose(name)
                var split = name.split('[');
                var objName = split[0];
                gp.verbose('objName: ' + objName);
                if (objName !== 'window' || i !== 0) {
                    currentObj = currentObj[objName];
                }
                gp.verbose('currentObj: ' + currentObj);
                if (gp.hasValue(currentObj) && split.length > 1) {

                    for (var j = 1; j < split.length; j++) {
                        var indexer = split[j].slice(0, -1);
                        // check to see if indexer is a number
                        if (isNaN(parseInt(indexer))) {
                            if (quoted.test(indexer)) {
                                indexer = indexer.slice(1, -1);
                            }
                            else {
                                indexer = gp.resolveObjectPath(indexer);
                            }
                            gp.verbose('indexer: ' + indexer);
                            currentObj = currentObj[indexer];
                        }
                        else {
                            gp.verbose('indexer: ' + indexer);
                            currentObj = currentObj[parseInt(indexer)];
                        }
                        gp.verbose('currentObj: ' + currentObj);
                    }

                }
            }

            gp.verbose(currentObj);

            return currentObj;
        }
        catch (err) {
            console.log('Could not resolve object path: ' + path);
            console.log(err);
        }
    };

    gp.resolveObject = function (obj, name) {
        if (gp.hasValue(obj[name])) {
            obj[name] = gp.resolveObjectPath(obj[name]);
            return gp.hasValue(obj[name]);
        }
        return false;
    };

    var FP = Function.prototype;

    var callbind = FP.bind
       ? FP.bind.bind(FP.call)
       : (function (call) {
           return function (func) {
               return function () {
                   return call.apply(func, arguments);
               };
           };
       }(FP.call));

    var uids = {};
    var slice = callbind(''.slice);
    var zero = 0;
    var numberToString = callbind(zero.toString);

    gp.createUID = function () {
        // id's can't begin with a number
        var key = 'gp' + slice(numberToString(Math.random(), 36), 2);
        return key in uids ? createUID() : uids[key] = key;
    };

    gp.hasPositiveWidth = function(nodes) {
        if (gp.isNullOrEmpty(nodes)) return false;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].offsetWidth > 0) return true;
        }
        return false;
    };

    var token = /{{.+?}}/g;

    gp.resolveTemplate = function (template) {
        // it's either a selector or a function
        var t = gp.resolveObjectPath(template);
        if (typeof (t) === 'function') {
            return t;
        }
        else {
            t = document.querySelector(template);
            if (t) {
                return t.innerHTML;
            }
        }
        return null;
    };

    gp.processRowTemplate = function (template, row, col) {
        gp.info('gp.processTemplate: template: ');
        gp.info(template);
        var fn, match, tokens = template.match(/{{.+?}}/g);
        if (tokens) {
            for (var i = 0; i < tokens.length; i++) {
                match = tokens[i].slice(2, -2);
                if (match in row) {
                    template = template.replace(tokens[i], row[match]);
                }
                else {
                    fn = gp.resolveObjectPath(match);
                    if (typeof fn === 'function') {
                        template = template.replace(tokens[i], fn.call(this, row, col));
                    }
                }
            }
        }
        gp.info('gp.processTemplate: template:');
        gp.info(template);
        return template;
    }

    gp.processColumnTemplate = function (template, col) {
        var fn, match, tokens = template.match(/{{.+?}}/g);
        if (tokens) {
            for (var i = 0; i < tokens.length; i++) {
                match = tokens[i].slice(2, -2);
                fn = gp.resolveObjectPath(match);
                if (typeof fn === 'function') {
                    template = template.replace(tokens[i], fn.call(this, col));
                }
            }
        }
        gp.info('gp.processTemplate: template:');
        gp.info(template);
        return template;
    }

})(gridponent);