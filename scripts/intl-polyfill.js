﻿/* For detailed credits and licence information see http://github.com/financial-times/polyfill-service.
 * 
 * UA detected: ie/9.0.0
 * Features requested: Intl.~locale.en
 * Library version: latest
 * 
 * - Intl, License: MIT  (required by "Intl.~locale.en")
 * - Intl.~locale.en, License: MIT  */

(function (undefined) {

    // Intl
    (function () { "use strict"; function a(a) { for (var b = 0; b < ma.length; b += 1) if (a.hasOwnProperty(ma[b])) return !1; return !0 } 
        function b(a) { for (var b = 0; b < la.length; b += 1) if (a.hasOwnProperty(la[b])) return !1; return !0 } 
        function c(a) { if (ja.test(a)) return void 0; var b = {};
            return b.pattern = a.replace(ia, function (a) { switch (a.charAt(0)) { case "E": case "e": case "c": return b.weekday = ka.weekday[a.length - 1], "{weekday}"; case "G": return b.era = ka.era[a.length - 1], "{era}"; case "y": case "Y": case "u": case "U": return b.year = 2 === a.length ? "2-digit" : "numeric", "{year}"; case "M": case "L": return b.month = ka.month[a.length - 1], "{month}"; case "d": return b.day = 2 === a.length ? "2-digit" : "numeric", "{day}"; case "a": return "{ampm}"; case "h": case "H": case "k": case "K": return b.hour = 2 === a.length ? "2-digit" : "numeric", "{hour}"; case "m": return b.minute = 2 === a.length ? "2-digit" : "numeric", "{minute}"; case "s": return b.second = 2 === a.length ? "2-digit" : "numeric", "{second}"; case "z": return b.timeZoneName = a.length < 4 ? "short" : "long", "{timeZoneName}" } 
            }),
            b.pattern = b.pattern.replace(/'([^']*)'/g, function (a, b) { return b ? b : "'" }),
            b.pattern.indexOf("{ampm}") > -1 && (b.hour12 = !0, b.pattern12 = b.pattern, b.pattern = b.pattern.replace("{ampm}", "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")),
            b } 
        function d(d) { function e(a, b) { var c = new Array((a.match(/M/g) || []).length + 1),
         d = new Array((a.match(/E/g) || []).length + 1);
            return c.length > 2 && (b = b.replace(/(M|L)+/, c.join("$1"))),
            d.length > 2 && (b = b.replace(/([Eec])+/, d.join("$1"))),
            b } 
            var f, g, h, i, j, k = d.availableFormats, l = d.timeFormats, m = d.dateFormats, n = d.medium, o = [], p = [], q = []; for (f in k) k.hasOwnProperty(f) && (g = e(f, k[f]),
             h = c(g),
             h && (o.push(h),
             a(h) ? q.push(g) : b(h) && p.push(g)));
            for (i = 0; i < p.length; i += 1) for (j = 0; j < q.length; j += 1) g = n.replace("{0}", p[i]).replace("{1}", q[j]).replace(/^[,\s]+|[,\s]+$/gi, ""),
            h = c(g),
            h && o.push(h);
            for (f in l) l.hasOwnProperty(f) && (g = e(f, l[f]),
            h = c(g),
            h && o.push(h));
            for (f in m) m.hasOwnProperty(f) && (g = e(f, m[f]),
            h = c(g),
            h && o.push(h));
            return o } 
        function e(a) { return ea.test(a) ? fa.test(a) ? !1 : ga.test(a) ? !1 : !0 : !1 } 
        function f(a) { var b, c; a = a.toLowerCase(),
         c = a.split("-");
            for (var d = 1, e = c.length; e > d; d++) if (2 === c[d].length) c[d] = c[d].toUpperCase();
            else if (4 === c[d].length) c[d] = c[d].charAt(0).toUpperCase() + c[d].slice(1);
            else if (1 === c[d].length && "x" !== c[d]) break; a = xa.call(c, "-"),
            (b = a.match(ha)) && b.length > 1 && (b.sort(),
            a = a.replace(RegExp("(?:" + ha.source + ")+", "i"),
            xa.call(b, ""))),
            qa.call(Ha.tags, a) && (a = Ha.tags[a]),
            c = a.split("-");
            for (var d = 1, e = c.length; e > d; d++) qa.call(Ha.subtags, c[d]) ? c[d] = Ha.subtags[c[d]] : qa.call(Ha.extLang, c[d]) && (c[d] = Ha.extLang[c[d]][0], 1 === d && Ha.extLang[c[1]][1] === c[0] && (c = ua.call(c, d++),
            e -= 1));
            return xa.call(c, "-") } 
        function g() { return T } 
        function h(a) { var b = String(a),
         c = Q(b);
            return Fa.test(c) === !1 ? !1 : !0 } 
        function i(a) { if (void 0 === a) return new O; for (var b = new O, a = "string" == typeof a ? [a] : a, c = R(a),
         d = c.length, g = 0; d > g;) { var h = String(g),
         i = h in c; if (i) { var j = c[h]; if (null == j || "string" != typeof j && "object" != typeof j) throw new TypeError("String or Object type expected");
             var k = String(j);
             if (!e(k)) throw new RangeError("'" + k + "' is not a structurally valid language tag");
             k = f(k),
             -1 === sa.call(b, k) && wa.call(b, k) } 
            g++ } 
            return b } 
        function j(a, b) { for (var c = b; ;) { if (sa.call(a, c) > -1) return c; var d = c.lastIndexOf("-");
            if (0 > d) return; d >= 2 && "-" === c.charAt(d - 2) && (d -= 2),
            c = c.substring(0, d) } 
        } 
        function k(a, b) { for (var c, d = 0, e = b.length; e > d && !c;) { var f = b[d], h = String(f).replace(Ga, ""),
         c = j(a, h);
            d++ } 
            var i = new N; if (void 0 !== c) { if (i["[[locale]]"] = c, String(f) !== String(h)) { var k = f.match(Ga)[0], l = f.indexOf("-u-");
                i["[[extension]]"] = k, i["[[extensionIndex]]"] = l } 
            } 
            else i["[[locale]]"] = g();
            return i } 
        function l(a, b) { return k(a, b) } 
        function m(a, b, c, d, e) { if (0 === a.length) throw new ReferenceError("No locale data has been provided for this object yet.");
            var f = c["[[localeMatcher]]"]; if ("lookup" === f) var g = k(a, b);
            else var g = l(a, b);
            var h = g["[[locale]]"]; if (qa.call(g, "[[extension]]")) var i = g["[[extension]]"], j = g["[[extensionIndex]]"], m = String.prototype.split, n = m.call(i, "-"),
            o = n.length; var p = new N; p["[[dataLocale]]"] = h; for (var q = "-u", r = 0, s = d.length; s > r;) { var t = d[r], u = e[h], v = u[t], w = v[0], x = "", y = sa; if (void 0 !== n) { var z = y.call(n, t);
                if (-1 !== z) if (o > z + 1 && n[z + 1].length > 2) { var A = n[z + 1], B = y.call(v, A);
                    if (-1 !== B) var w = A, x = "-" + t + "-" + w } 
                else { var B = y(v, "true");
                    if (-1 !== B) var w = "true" } 
            } 
                if (qa.call(c, "[[" + t + "]]")) { var C = c["[[" + t + "]]"]; -1 !== y.call(v, C) && C !== w && (w = C, x = "") } 
                p["[[" + t + "]]"] = w, q += x, r++ } 
            if (q.length > 2) var D = h.substring(0, j),
             E = h.substring(j),
             h = D + q + E; return p["[[locale]]"] = h, p } 
        function n(a, b) { for (var c = b.length, d = new O, e = 0; c > e;) { var f = b[e], g = String(f).replace(Ga, ""),
         h = j(a, g);
            void 0 !== h && wa.call(d, f),
            e++ } 
            var i = ua.call(d);
            return i } 
        function o(a, b) { return n(a, b) } 
        function p(a, b, c) { if (void 0 !== c) { var c = new N(R(c)),
         d = c.localeMatcher; if (void 0 !== d && (d = String(d),
         "lookup" !== d && "best fit" !== d)) throw new RangeError('matcher should be "lookup" or "best fit"') } 
            if (void 0 === d || "best fit" === d) var e = o(a, b);
            else var e = n(a, b);
            for (var f in e) qa.call(e, f) && ra(e, f, { writable: !1, configurable: !1, value: e[f] });
            return ra(e, "length", { writable: !1 }),
            e } 
        function q(a, b, c, d, e) { var f = a[b]; if (void 0 !== f) { if (f = "boolean" === c ? Boolean(f) : "string" === c ? String(f) : f, void 0 !== d && -1 === sa.call(d, f)) throw new RangeError("'" + f + "' is not an allowed value for `" + b + "`");
            return f } 
            return e } 
        function r(a, b, c, d, e) { var f = a[b]; if (void 0 !== f) { if (f = Number(f),
         isNaN(f) || c > f || f > d) throw new RangeError("Value is not a number or outside accepted range");
            return Math.floor(f) } 
            return e } 
        function s() { var a = arguments[0], b = arguments[1]; return this && this !== na ? t(R(this),
         a, b) : new na.NumberFormat(a, b) } 
        function t(a, b, c) { var d = S(a),
         e = P();
            if (d["[[initializedIntlObject]]"] === !0) throw new TypeError("`this` object has already been initialized as an Intl object");
            ra(a, "__getInternalProperties", { value: function () { return arguments[0] === Ba ? d : void 0 } 
            }),
            d["[[initializedIntlObject]]"] = !0; var f = i(b);
            c = void 0 === c ? {} 
           : R(c);
            var g = new N, j = q(c, "localeMatcher", "string", new O("lookup", "best fit"),
            "best fit");
            g["[[localeMatcher]]"] = j; var k = Aa.NumberFormat["[[localeData]]"], l = m(Aa.NumberFormat["[[availableLocales]]"], f, g, Aa.NumberFormat["[[relevantExtensionKeys]]"], k);
            d["[[locale]]"] = l["[[locale]]"], d["[[numberingSystem]]"] = l["[[nu]]"], d["[[dataLocale]]"] = l["[[dataLocale]]"]; var n = l["[[dataLocale]]"], o = q(c, "style", "string", new O("decimal", "percent", "currency"),
            "decimal");
            d["[[style]]"] = o; var p = q(c, "currency", "string");
            if (void 0 !== p && !h(p)) throw new RangeError("'" + p + "' is not a valid currency code");
            if ("currency" === o && void 0 === p) throw new TypeError("Currency code is required when style is currency");
            if ("currency" === o) { p = p.toUpperCase(),
            d["[[currency]]"] = p; var s = u(p) } 
            var t = q(c, "currencyDisplay", "string", new O("code", "symbol", "name"),
             "symbol");
            "currency" === o && (d["[[currencyDisplay]]"] = t);
            var w = r(c, "minimumIntegerDigits", 1, 21, 1);
            d["[[minimumIntegerDigits]]"] = w; var x = "currency" === o ? s : 0, y = r(c, "minimumFractionDigits", 0, 20, x);
            d["[[minimumFractionDigits]]"] = y; var z = "currency" === o ? Math.max(y, s) : "percent" === o ? Math.max(y, 0) : Math.max(y, 3),
            A = r(c, "maximumFractionDigits", y, 20, z);
            d["[[maximumFractionDigits]]"] = A; var B = c.minimumSignificantDigits, C = c.maximumSignificantDigits; (void 0 !== B || void 0 !== C) && (B = r(c, "minimumSignificantDigits", 1, 21, 1),
            C = r(c, "maximumSignificantDigits", B, 21, 21),
            d["[[minimumSignificantDigits]]"] = B, d["[[maximumSignificantDigits]]"] = C);
            var D = q(c, "useGrouping", "boolean", void 0, !0);
            d["[[useGrouping]]"] = D; var E = k[n], F = E.patterns, G = F[o]; return d["[[positivePattern]]"] = G.positivePattern, d["[[negativePattern]]"] = G.negativePattern, d["[[boundFormat]]"] = void 0, d["[[initializedNumberFormat]]"] = !0, pa && (a.format = v.call(a)),
            e.exp.test(e.input),
            a } 
        function u(a) { return void 0 !== Ia[a] ? Ia[a] : 2 } 
        function v() { var a = null != this && "object" == typeof this && S(this);
            if (!a || !a["[[initializedNumberFormat]]"]) throw new TypeError("`this` value for format() is not an initialized Intl.NumberFormat object.");
            if (void 0 === a["[[boundFormat]]"]) { var b = function (a) { return w(this, Number(a)) },
            c = za.call(b, this);
                a["[[boundFormat]]"] = c } 
            return a["[[boundFormat]]"] } 
        function w(a, b) { var c, d = P(),
         e = S(a),
         f = e["[[dataLocale]]"], g = e["[[numberingSystem]]"], h = Aa.NumberFormat["[[localeData]]"][f], i = h.symbols[g] || h.symbols.latn, j = !1; if (isFinite(b) === !1) isNaN(b) ? c = i.nan : (c = i.infinity, 0 > b && (j = !0));
         else { if (0 > b && (j = !0, b = -b),
         "percent" === e["[[style]]"] && (b *= 100),
         c = qa.call(e, "[[minimumSignificantDigits]]") && qa.call(e, "[[maximumSignificantDigits]]") ? x(b, e["[[minimumSignificantDigits]]"], e["[[maximumSignificantDigits]]"]) : y(b, e["[[minimumIntegerDigits]]"], e["[[minimumFractionDigits]]"], e["[[maximumFractionDigits]]"]),
         Ja[g]) { var k = Ja[e["[[numberingSystem]]"]]; c = String(c).replace(/\d/g, function (a) { return k[a] }) } 
         else c = String(c);
             if (c = c.replace(/\./g, i.decimal),
             e["[[useGrouping]]"] === !0) { var l = c.split(i.decimal),
             m = l[0], n = h.patterns.primaryGroupSize || 3, o = h.patterns.secondaryGroupSize || n; if (m.length > n) { var p = new O, q = m.length - n, r = q % o, s = m.slice(0, r);
                 for (s.length && wa.call(p, s) ; q > r;) wa.call(p, m.slice(r, r + o)),
                 r += o; wa.call(p, m.slice(q)),
                 l[0] = xa.call(p, i.group) } 
                 c = xa.call(l, i.decimal) } 
         } 
            var t = e[j === !0 ? "[[negativePattern]]" : "[[positivePattern]]"]; if (t = t.replace("{number}", c),
             "currency" === e["[[style]]"]) { var u, v = e["[[currency]]"], w = h.currencies[v]; switch (e["[[currencyDisplay]]"]) { case "symbol": u = w || v; break; default: case "code": case "name": u = v } 
                t = t.replace("{currency}", u) } 
            return d.exp.test(d.input),
             t } 
        function x(a, b, c) { var d = c; if (0 === a) var e = xa.call(Array(d + 1),
         "0"),
         f = 0; else var f = K(Math.abs(a)),
         g = Math.round(Math.exp(Math.abs(f - d + 1) * Math.LN10)),
         e = String(Math.round(0 > f - d + 1 ? a * g : a / g));
            if (f >= d) return e + xa.call(Array(f - d + 1 + 1),
            "0");
            if (f === d - 1) return e; if (f >= 0 ? e = e.slice(0, f + 1) + "." + e.slice(f + 1) : 0 > f && (e = "0." + xa.call(Array(-(f + 1) + 1),
            "0") + e),
            e.indexOf(".") >= 0 && c > b) { for (var h = c - b; h > 0 && "0" === e.charAt(e.length - 1) ;) e = e.slice(0, -1),
            h--; "." === e.charAt(e.length - 1) && (e = e.slice(0, -1)) } 
            return e } 
        function y(a, b, c, d) { var e, f = Number.prototype.toFixed.call(a, d),
         g = f.split(".")[0].length, h = d - c, i = (e = f.indexOf("e")) > -1 ? f.slice(e + 1) : 0; for (i && (f = f.slice(0, e).replace(".", ""),
         f += xa.call(Array(i - (f.length - 1) + 1),
         "0") + "." + xa.call(Array(d + 1),
         "0"),
         g = f.length) ; h > 0 && "0" === f.slice(-1) ;) f = f.slice(0, -1),
         h--; if ("." === f.slice(-1) && (f = f.slice(0, -1)),
         b > g) var j = xa.call(Array(b - g + 1),
         "0");
            return (j ? j : "") + f } 
        function z() { var a = arguments[0], b = arguments[1]; return this && this !== na ? A(R(this),
         a, b) : new na.DateTimeFormat(a, b) } 
        function A(a, b, c) { var d = S(a),
         e = P();
            if (d["[[initializedIntlObject]]"] === !0) throw new TypeError("`this` object has already been initialized as an Intl object");
            ra(a, "__getInternalProperties", { value: function () { return arguments[0] === Ba ? d : void 0 } 
            }),
            d["[[initializedIntlObject]]"] = !0; var f = i(b),
            c = C(c, "any", "date"),
            g = new N; u = q(c, "localeMatcher", "string", new O("lookup", "best fit"),
            "best fit"),
            g["[[localeMatcher]]"] = u; var h = Aa.DateTimeFormat, j = h["[[localeData]]"], k = m(h["[[availableLocales]]"], f, g, h["[[relevantExtensionKeys]]"], j);
            d["[[locale]]"] = k["[[locale]]"], d["[[calendar]]"] = k["[[ca]]"], d["[[numberingSystem]]"] = k["[[nu]]"], d["[[dataLocale]]"] = k["[[dataLocale]]"]; var l = k["[[dataLocale]]"], n = c.timeZone; if (void 0 !== n && (n = Q(n),
            "UTC" !== n)) throw new RangeError("timeZone is not supported.");
            d["[[timeZone]]"] = n, g = new N; for (var o in Ka) if (qa.call(Ka, o)) { var p = q(c, o, "string", Ka[o]);
                g["[[" + o + "]]"] = p } 
            var r, s = j[l], t = B(s.formats),
             u = q(c, "formatMatcher", "string", new O("basic", "best fit"),
             "best fit");
            s.formats = t, r = "basic" === u ? D(g, t) : F(g, t);
            for (var o in Ka) if (qa.call(Ka, o) && qa.call(r, o)) { var v = r[o]; d["[[" + o + "]]"] = v } 
            var w, x = q(c, "hour12", "boolean");
            if (d["[[hour]]"]) if (x = void 0 === x ? s.hour12 : x, d["[[hour12]]"] = x, x === !0) { var y = s.hourNo0; d["[[hourNo0]]"] = y, w = r.pattern12 } 
            else w = r.pattern; else w = r.pattern; return d["[[pattern]]"] = w, d["[[boundFormat]]"] = void 0, d["[[initializedDateTimeFormat]]"] = !0, pa && (a.format = G.call(a)),
             e.exp.test(e.input),
             a } 
        function B(a) { return "[object Array]" === Object.prototype.toString.call(a) ? a : d(a) } 
        function C(a, b, c) { if (void 0 === a) a = null; else { var d = R(a);
            a = new N; for (var e in d) a[e] = d[e] } 
            var f = ta, a = f(a),
             g = !0; return ("date" === b || "any" === b) && (void 0 !== a.weekday || void 0 !== a.year || void 0 !== a.month || void 0 !== a.day) && (g = !1),
             ("time" === b || "any" === b) && (void 0 !== a.hour || void 0 !== a.minute || void 0 !== a.second) && (g = !1),
             !g || "date" !== c && "all" !== c || (a.year = a.month = a.day = "numeric"),
             !g || "time" !== c && "all" !== c || (a.hour = a.minute = a.second = "numeric"),
             a } 
        function D(a, b) { return E(a, b) } 
        function E(a, b, c) { for (var d, e = 8, f = 120, g = 20, h = 8, i = 6, j = 6, k = 3, l = -(1 / 0),
         m = 0, n = b.length; n > m;) { var o = b[m], p = 0; for (var q in Ka) if (qa.call(Ka, q)) { var r = a["[[" + q + "]]"], s = qa.call(o, q) ? o[q] : void 0; if (void 0 === r && void 0 !== s) p -= g; else if (void 0 !== r && void 0 === s) p -= f; else { var t = ["2-digit", "numeric", "narrow", "short", "long"], u = sa.call(t, r),
         v = sa.call(t, s),
         w = Math.max(Math.min(v - u, 2),
         -2);
             !c || ("numeric" !== r && "2-digit" !== r || "numeric" === s || "2-digit" === s) && ("numeric" === r || "2-digit" === r || "2-digit" !== s && "numeric" !== s) || (p -= e),
             2 === w ? p -= i : 1 === w ? p -= k : -1 === w ? p -= j : -2 === w && (p -= h) } 
         } 
            p > l && (l = p, d = o),
             m++ } 
            return d } 
        function F(a, b) { return E(a, b, !0) } 
        function G() { var a = null != this && "object" == typeof this && S(this);
            if (!a || !a["[[initializedDateTimeFormat]]"]) throw new TypeError("`this` value for format() is not an initialized Intl.DateTimeFormat object.");
            if (void 0 === a["[[boundFormat]]"]) { var b = function () { var a = Number(0 === arguments.length ? Date.now() : arguments[0]);
                return H(this, a) },
            c = za.call(b, this);
                a["[[boundFormat]]"] = c } 
            return a["[[boundFormat]]"] } 
        function H(a, b) { if (!isFinite(b)) throw new RangeError("Invalid valid date passed to format");
            var c = a.__getInternalProperties(Ba),
            d = P(),
            e = c["[[locale]]"], f = new na.NumberFormat([e], { useGrouping: !1 }),
            g = new na.NumberFormat([e], { minimumIntegerDigits: 2, useGrouping: !1 }),
            h = I(b, c["[[calendar]]"], c["[[timeZone]]"]),
            i = c["[[pattern]]"], j = c["[[dataLocale]]"], k = Aa.DateTimeFormat["[[localeData]]"][j].calendars, l = c["[[calendar]]"]; for (var m in Ka) if (qa.call(c, "[[" + m + "]]")) { var n, o, p = c["[[" + m + "]]"], q = h["[[" + m + "]]"]; if ("year" === m && 0 >= q ? q = 1 - q : "month" === m ? q++ : "hour" === m && c["[[hour12]]"] === !0 && (q %= 12, n = q !== h["[[" + m + "]]"], 0 === q && c["[[hourNo0]]"] === !0 && (q = 12)),
            "numeric" === p) o = w(f, q);
            else if ("2-digit" === p) o = w(g, q),
            o.length > 2 && (o = o.slice(-2));
            else if (p in Ca) switch (m) { case "month": o = M(k, l, "months", p, h["[[" + m + "]]"]);
                break; case "weekday": try { o = M(k, l, "days", p, h["[[" + m + "]]"]) } 
                    catch (r) { throw new Error("Could not find weekday data for locale " + e) } 
                    break; case "timeZoneName": o = ""; break; default: o = h["[[" + m + "]]"] } 
                i = i.replace("{" + m + "}", o) } 
            return c["[[hour12]]"] === !0 && (o = M(k, l, "dayPeriods", n ? "pm" : "am"),
             i = i.replace("{ampm}", o)),
             d.exp.test(d.input),
             i } 
        function I(a, b, c) { var d = new Date(a),
         e = "get" + (c || "");
            return new N({ "[[weekday]]": d[e + "Day"](),
                "[[era]]": +(d[e + "FullYear"]() >= 0),
                "[[year]]": d[e + "FullYear"](),
                "[[month]]": d[e + "Month"](),
                "[[day]]": d[e + "Date"](),
                "[[hour]]": d[e + "Hours"](),
                "[[minute]]": d[e + "Minutes"](),
                "[[second]]": d[e + "Seconds"](),
                "[[inDST]]": !1 }) } 
        function J(a, b) { if (!a.number) throw new Error("Object passed doesn't contain locale data for Intl.NumberFormat");
            var c, d = [b], e = b.split("-");
            for (e.length > 2 && 4 === e[1].length && wa.call(d, e[0] + "-" + e[2]) ; c = ya.call(d) ;) wa.call(Aa.NumberFormat["[[availableLocales]]"], c),
            Aa.NumberFormat["[[localeData]]"][c] = a.number, a.date && (a.date.nu = a.number.nu, wa.call(Aa.DateTimeFormat["[[availableLocales]]"], c),
            Aa.DateTimeFormat["[[localeData]]"][c] = a.date);
            void 0 === T && (T = b),
            Da || (t(na.NumberFormat.prototype),
            Da = !0),
            a.date && !Ea && (A(na.DateTimeFormat.prototype),
            Ea = !0) } 
        function K(a) { if ("function" == typeof Math.log10) return Math.floor(Math.log10(a));
            var b = Math.round(Math.log(a) * Math.LOG10E);
            return b - (Number("1e" + b) > a) } 
        function L(a) { if (!qa.call(this, "[[availableLocales]]")) throw new TypeError("supportedLocalesOf() is not a constructor");
            var b = P(),
            c = arguments[1], d = this["[[availableLocales]]"], e = i(a);
            return b.exp.test(b.input),
            p(d, e, c) } 
        function M(a, b, c, d, e) { var f = a[b] && a[b][c] ? a[b][c] : a.gregory[c], g = { narrow: ["short", "long"], "short": ["long", "narrow"], "long": ["short", "narrow"] },
         h = qa.call(f, d) ? f[d] : qa.call(f, g[d][0]) ? f[g[d][0]] : f[g[d][1]]; return null != e ? h[e] : h } 
        function N(a) { for (var b in a) (a instanceof N || qa.call(a, b)) && ra(this, b, { value: a[b], enumerable: !0, writable: !0, configurable: !0 }) } 
        function O() { ra(this, "length", { writable: !0, value: 0 }),
         arguments.length && wa.apply(this, ua.call(arguments)) } 
        function P() { for (var a = /[.?*+^$[\]\\(){}|-]/g, b = RegExp.lastMatch || "", c = RegExp.multiline ? "m" : "", d = { input: RegExp.input },
         e = new O, f = !1, g = {},
         h = 1; 9 >= h; h++) f = (g["$" + h] = RegExp["$" + h]) || f; if (b = b.replace(a, "\\$&"),
         f) for (var h = 1; 9 >= h; h++) { var i = g["$" + h]; i ? (i = i.replace(a, "\\$&"),
         b = b.replace(i, "(" + i + ")")) : b = "()" + b, wa.call(e, b.slice(0, b.indexOf("(") + 1)),
         b = b.slice(b.indexOf("(") + 1) } 
            return d.exp = new RegExp(xa.call(e, "") + b, c),
             d } 
        function Q(a) { for (var b = a.length; b--;) { var c = a.charAt(b);
            c >= "a" && "z" >= c && (a = a.slice(0, b) + c.toUpperCase() + a.slice(b + 1)) } 
            return a } 
        function R(a) { if (null == a) throw new TypeError("Cannot convert null or undefined to object");
            return Object(a) } 
        function S(a) { return qa.call(a, "__getInternalProperties") ? a.__getInternalProperties(Ba) : ta(null) } 
        var T, U = "[a-z]{3}(?:-[a-z]{3}){0,2}", V = "(?:[a-z]{2,3}(?:-" + U + ")?|[a-z]{4}|[a-z]{5,8})", W = "[a-z]{4}", X = "(?:[a-z]{2}|\\d{3})", Y = "(?:[a-z0-9]{5,8}|\\d[a-z0-9]{3})", Z = "[0-9a-wy-z]", $ = Z + "(?:-[a-z0-9]{2,8})+", _ = "x(?:-[a-z0-9]{1,8})+", aa = "(?:en-GB-oed|i-(?:ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu)|sgn-(?:BE-FR|BE-NL|CH-DE))", ba = "(?:art-lojban|cel-gaulish|no-bok|no-nyn|zh-(?:guoyu|hakka|min|min-nan|xiang))", ca = "(?:" + aa + "|" + ba + ")", da = V + "(?:-" + W + ")?(?:-" + X + ")?(?:-" + Y + ")*(?:-" + $ + ")*(?:-" + _ + ")?", ea = RegExp("^(?:" + da + "|" + _ + "|" + ca + ")$", "i"),
         fa = RegExp("^(?!x).*?-(" + Y + ")-(?:\\w{4,8}-(?!x-))*\\1\\b", "i"),
         ga = RegExp("^(?!x).*?-(" + Z + ")-(?:\\w+-(?!x-))*\\1\\b", "i"),
         ha = RegExp("-" + $, "ig"),
         ia = /(?:[Eec]{1,6}|G{1,5}|(?:[yYu]+|U{1,5})|[ML]{1,5}|d{1,2}|a|[hkHK]{1,2}|m{1,2}|s{1,2}|z{1,4})(?=([^']*'[^']*')*[^']*$)/g, ja = /[QxXVOvZASjgFDwWIQqH]/, ka = { month: ["numeric", "2-digit", "short", "long", "narrow"], weekday: ["short", "short", "short", "long", "narrow"], era: ["short", "short", "short", "long", "narrow"] },
         la = ["weekday", "era", "year", "month", "day"], ma = ["hour", "minute", "second", "timeZoneName"], na = {},
         oa = function () { var a = {};
             try { return Object.defineProperty(a, "a", {}),
             "a" in a } 
             catch (b) { return !1 } 
         }(),
         pa = !oa && !Object.prototype.__defineGetter__, qa = Object.prototype.hasOwnProperty, ra = oa ? Object.defineProperty : function (a, b, c) { "get" in c && a.__defineGetter__ ? a.__defineGetter__(b, c.get) : (!qa.call(a, b) || "value" in c) && (a[b] = c.value) },
         sa = Array.prototype.indexOf || function (a) { var b = this; if (!b.length) return -1; for (var c = arguments[1] || 0, d = b.length; d > c; c++) if (b[c] === a) return c; return -1 },
         ta = Object.create || function (a, b) { function c() { } 
             var d; c.prototype = a, d = new c; for (var e in b) qa.call(b, e) && ra(d, e, b[e]);
             return d },
         ua = Array.prototype.slice, va = Array.prototype.concat, wa = Array.prototype.push, xa = Array.prototype.join, ya = Array.prototype.shift, za = (Array.prototype.unshift, Function.prototype.bind || function (a) { var b = this, c = ua.call(arguments, 1);
             return 1 === b.length ? function (d) { return b.apply(a, va.call(c, ua.call(arguments))) } 
            : function () { return b.apply(a, va.call(c, ua.call(arguments))) } 
         }),
         Aa = ta(null),
         Ba = Math.random(),
         Ca = ta(null, { narrow: {},
             "short": {},
             "long": {} 
         }),
         Da = !1, Ea = !1, Fa = /^[A-Z]{3}$/, Ga = /-u(?:-[0-9a-z]{2,8})+/gi, Ha = { tags: { "art-lojban": "jbo", "i-ami": "ami", "i-bnn": "bnn", "i-hak": "hak", "i-klingon": "tlh", "i-lux": "lb", "i-navajo": "nv", "i-pwn": "pwn", "i-tao": "tao", "i-tay": "tay", "i-tsu": "tsu", "no-bok": "nb", "no-nyn": "nn", "sgn-BE-FR": "sfb", "sgn-BE-NL": "vgt", "sgn-CH-DE": "sgg", "zh-guoyu": "cmn", "zh-hakka": "hak", "zh-min-nan": "nan", "zh-xiang": "hsn", "sgn-BR": "bzs", "sgn-CO": "csn", "sgn-DE": "gsg", "sgn-DK": "dsl", "sgn-ES": "ssp", "sgn-FR": "fsl", "sgn-GB": "bfi", "sgn-GR": "gss", "sgn-IE": "isg", "sgn-IT": "ise", "sgn-JP": "jsl", "sgn-MX": "mfs", "sgn-NI": "ncs", "sgn-NL": "dse", "sgn-NO": "nsl", "sgn-PT": "psr", "sgn-SE": "swl", "sgn-US": "ase", "sgn-ZA": "sfs", "zh-cmn": "cmn", "zh-cmn-Hans": "cmn-Hans", "zh-cmn-Hant": "cmn-Hant", "zh-gan": "gan", "zh-wuu": "wuu", "zh-yue": "yue" },
             subtags: { BU: "MM", DD: "DE", FX: "FR", TP: "TL", YD: "YE", ZR: "CD", heploc: "alalc97", "in": "id", iw: "he", ji: "yi", jw: "jv", mo: "ro", ayx: "nun", bjd: "drl", ccq: "rki", cjr: "mom", cka: "cmr", cmk: "xch", drh: "khk", drw: "prs", gav: "dev", hrr: "jal", ibi: "opa", kgh: "kml", lcq: "ppr", mst: "mry", myt: "mry", sca: "hle", tie: "ras", tkk: "twm", tlw: "weo", tnf: "prs", ybd: "rki", yma: "lrr" },
             extLang: { aao: ["aao", "ar"], abh: ["abh", "ar"], abv: ["abv", "ar"], acm: ["acm", "ar"], acq: ["acq", "ar"], acw: ["acw", "ar"], acx: ["acx", "ar"], acy: ["acy", "ar"], adf: ["adf", "ar"], ads: ["ads", "sgn"], aeb: ["aeb", "ar"], aec: ["aec", "ar"], aed: ["aed", "sgn"], aen: ["aen", "sgn"], afb: ["afb", "ar"], afg: ["afg", "sgn"], ajp: ["ajp", "ar"], apc: ["apc", "ar"], apd: ["apd", "ar"], arb: ["arb", "ar"], arq: ["arq", "ar"], ars: ["ars", "ar"], ary: ["ary", "ar"], arz: ["arz", "ar"], ase: ["ase", "sgn"], asf: ["asf", "sgn"], asp: ["asp", "sgn"], asq: ["asq", "sgn"], asw: ["asw", "sgn"], auz: ["auz", "ar"], avl: ["avl", "ar"], ayh: ["ayh", "ar"], ayl: ["ayl", "ar"], ayn: ["ayn", "ar"], ayp: ["ayp", "ar"], bbz: ["bbz", "ar"], bfi: ["bfi", "sgn"], bfk: ["bfk", "sgn"], bjn: ["bjn", "ms"], bog: ["bog", "sgn"], bqn: ["bqn", "sgn"], bqy: ["bqy", "sgn"], btj: ["btj", "ms"], bve: ["bve", "ms"], bvl: ["bvl", "sgn"], bvu: ["bvu", "ms"], bzs: ["bzs", "sgn"], cdo: ["cdo", "zh"], cds: ["cds", "sgn"], cjy: ["cjy", "zh"], cmn: ["cmn", "zh"], coa: ["coa", "ms"], cpx: ["cpx", "zh"], csc: ["csc", "sgn"], csd: ["csd", "sgn"], cse: ["cse", "sgn"], csf: ["csf", "sgn"], csg: ["csg", "sgn"], csl: ["csl", "sgn"], csn: ["csn", "sgn"], csq: ["csq", "sgn"], csr: ["csr", "sgn"], czh: ["czh", "zh"], czo: ["czo", "zh"], doq: ["doq", "sgn"], dse: ["dse", "sgn"], dsl: ["dsl", "sgn"], dup: ["dup", "ms"], ecs: ["ecs", "sgn"], esl: ["esl", "sgn"], esn: ["esn", "sgn"], eso: ["eso", "sgn"], eth: ["eth", "sgn"], fcs: ["fcs", "sgn"], fse: ["fse", "sgn"], fsl: ["fsl", "sgn"], fss: ["fss", "sgn"], gan: ["gan", "zh"], gds: ["gds", "sgn"], gom: ["gom", "kok"], gse: ["gse", "sgn"], gsg: ["gsg", "sgn"], gsm: ["gsm", "sgn"], gss: ["gss", "sgn"], gus: ["gus", "sgn"], hab: ["hab", "sgn"], haf: ["haf", "sgn"], hak: ["hak", "zh"], hds: ["hds", "sgn"], hji: ["hji", "ms"], hks: ["hks", "sgn"], hos: ["hos", "sgn"], hps: ["hps", "sgn"], hsh: ["hsh", "sgn"], hsl: ["hsl", "sgn"], hsn: ["hsn", "zh"], icl: ["icl", "sgn"], ils: ["ils", "sgn"], inl: ["inl", "sgn"], ins: ["ins", "sgn"], ise: ["ise", "sgn"], isg: ["isg", "sgn"], isr: ["isr", "sgn"], jak: ["jak", "ms"], jax: ["jax", "ms"], jcs: ["jcs", "sgn"], jhs: ["jhs", "sgn"], jls: ["jls", "sgn"], jos: ["jos", "sgn"], jsl: ["jsl", "sgn"], jus: ["jus", "sgn"], kgi: ["kgi", "sgn"], knn: ["knn", "kok"], kvb: ["kvb", "ms"], kvk: ["kvk", "sgn"], kvr: ["kvr", "ms"], kxd: ["kxd", "ms"], lbs: ["lbs", "sgn"], lce: ["lce", "ms"], lcf: ["lcf", "ms"], liw: ["liw", "ms"], lls: ["lls", "sgn"], lsg: ["lsg", "sgn"], lsl: ["lsl", "sgn"], lso: ["lso", "sgn"], lsp: ["lsp", "sgn"], lst: ["lst", "sgn"], lsy: ["lsy", "sgn"], ltg: ["ltg", "lv"], lvs: ["lvs", "lv"], lzh: ["lzh", "zh"], max: ["max", "ms"], mdl: ["mdl", "sgn"], meo: ["meo", "ms"], mfa: ["mfa", "ms"], mfb: ["mfb", "ms"], mfs: ["mfs", "sgn"], min: ["min", "ms"], mnp: ["mnp", "zh"], mqg: ["mqg", "ms"], mre: ["mre", "sgn"], msd: ["msd", "sgn"], msi: ["msi", "ms"], msr: ["msr", "sgn"], mui: ["mui", "ms"], mzc: ["mzc", "sgn"], mzg: ["mzg", "sgn"], mzy: ["mzy", "sgn"], nan: ["nan", "zh"], nbs: ["nbs", "sgn"], ncs: ["ncs", "sgn"], nsi: ["nsi", "sgn"], nsl: ["nsl", "sgn"], nsp: ["nsp", "sgn"], nsr: ["nsr", "sgn"], nzs: ["nzs", "sgn"], okl: ["okl", "sgn"], orn: ["orn", "ms"], ors: ["ors", "ms"], pel: ["pel", "ms"], pga: ["pga", "ar"], pks: ["pks", "sgn"], prl: ["prl", "sgn"], prz: ["prz", "sgn"], psc: ["psc", "sgn"], psd: ["psd", "sgn"], pse: ["pse", "ms"], psg: ["psg", "sgn"], psl: ["psl", "sgn"], pso: ["pso", "sgn"], psp: ["psp", "sgn"], psr: ["psr", "sgn"], pys: ["pys", "sgn"], rms: ["rms", "sgn"], rsi: ["rsi", "sgn"], rsl: ["rsl", "sgn"], sdl: ["sdl", "sgn"], sfb: ["sfb", "sgn"], sfs: ["sfs", "sgn"], sgg: ["sgg", "sgn"], sgx: ["sgx", "sgn"], shu: ["shu", "ar"], slf: ["slf", "sgn"], sls: ["sls", "sgn"], sqk: ["sqk", "sgn"], sqs: ["sqs", "sgn"], ssh: ["ssh", "ar"], ssp: ["ssp", "sgn"], ssr: ["ssr", "sgn"], svk: ["svk", "sgn"], swc: ["swc", "sw"], swh: ["swh", "sw"], swl: ["swl", "sgn"], syy: ["syy", "sgn"], tmw: ["tmw", "ms"], tse: ["tse", "sgn"], tsm: ["tsm", "sgn"], tsq: ["tsq", "sgn"], tss: ["tss", "sgn"], tsy: ["tsy", "sgn"], tza: ["tza", "sgn"], ugn: ["ugn", "sgn"], ugy: ["ugy", "sgn"], ukl: ["ukl", "sgn"], uks: ["uks", "sgn"], urk: ["urk", "ms"], uzn: ["uzn", "uz"], uzs: ["uzs", "uz"], vgt: ["vgt", "sgn"], vkk: ["vkk", "ms"], vkt: ["vkt", "ms"], vsi: ["vsi", "sgn"], vsl: ["vsl", "sgn"], vsv: ["vsv", "sgn"], wuu: ["wuu", "zh"], xki: ["xki", "sgn"], xml: ["xml", "sgn"], xmm: ["xmm", "ms"], xms: ["xms", "sgn"], yds: ["yds", "sgn"], ysl: ["ysl", "sgn"], yue: ["yue", "zh"], zib: ["zib", "sgn"], zlm: ["zlm", "ms"], zmi: ["zmi", "ms"], zsl: ["zsl", "sgn"], zsm: ["zsm", "ms"] } 
         },
         Ia = { BHD: 3, BYR: 0, XOF: 0, BIF: 0, XAF: 0, CLF: 4, CLP: 0, KMF: 0, DJF: 0, XPF: 0, GNF: 0, ISK: 0, IQD: 3, JPY: 0, JOD: 3, KRW: 0, KWD: 3, LYD: 3, OMR: 3, PYG: 0, RWF: 0, TND: 3, UGX: 0, UYI: 0, VUV: 0, VND: 0 };
        ra(na, "NumberFormat", { configurable: !0, writable: !0, value: s }),
        ra(na.NumberFormat, "prototype", { writable: !1 }),
        Aa.NumberFormat = { "[[availableLocales]]": [], "[[relevantExtensionKeys]]": ["nu"], "[[localeData]]": {} 
        },
        ra(na.NumberFormat, "supportedLocalesOf", { configurable: !0, writable: !0, value: za.call(L, Aa.NumberFormat) }),
        ra(na.NumberFormat.prototype, "format", { configurable: !0, get: v });
        var Ja = { arab: ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"], arabext: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"], bali: ["᭐", "᭑", "᭒", "᭓", "᭔", "᭕", "᭖", "᭗", "᭘", "᭙"], beng: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"], deva: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"], fullwide: ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"], gujr: ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"], guru: ["੦", "੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯"], hanidec: ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"], khmr: ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"], knda: ["೦", "೧", "೨", "೩", "೪", "೫", "೬", "೭", "೮", "೯"], laoo: ["໐", "໑", "໒", "໓", "໔", "໕", "໖", "໗", "໘", "໙"], latn: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], limb: ["᥆", "᥇", "᥈", "᥉", "᥊", "᥋", "᥌", "᥍", "᥎", "᥏"], mlym: ["൦", "൧", "൨", "൩", "൪", "൫", "൬", "൭", "൮", "൯"], mong: ["᠐", "᠑", "᠒", "᠓", "᠔", "᠕", "᠖", "᠗", "᠘", "᠙"], mymr: ["၀", "၁", "၂", "၃", "၄", "၅", "၆", "၇", "၈", "၉"], orya: ["୦", "୧", "୨", "୩", "୪", "୫", "୬", "୭", "୮", "୯"], tamldec: ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"], telu: ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"], thai: ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"], tibt: ["༠", "༡", "༢", "༣", "༤", "༥", "༦", "༧", "༨", "༩"] };
        ra(na.NumberFormat.prototype, "resolvedOptions", { configurable: !0, writable: !0, value: function () { var a, b = new N, c = ["locale", "numberingSystem", "style", "currency", "currencyDisplay", "minimumIntegerDigits", "minimumFractionDigits", "maximumFractionDigits", "minimumSignificantDigits", "maximumSignificantDigits", "useGrouping"], d = null != this && "object" == typeof this && S(this);
            if (!d || !d["[[initializedNumberFormat]]"]) throw new TypeError("`this` value for resolvedOptions() is not an initialized Intl.NumberFormat object.");
            for (var e = 0, f = c.length; f > e; e++) qa.call(d, a = "[[" + c[e] + "]]") && (b[c[e]] = { value: d[a], writable: !0, configurable: !0, enumerable: !0 });
            return ta({},
            b) } 
        }),
        ra(na, "DateTimeFormat", { configurable: !0, writable: !0, value: z }),
        ra(z, "prototype", { writable: !1 });
        var Ka = { weekday: ["narrow", "short", "long"], era: ["narrow", "short", "long"], year: ["2-digit", "numeric"], month: ["2-digit", "numeric", "narrow", "short", "long"], day: ["2-digit", "numeric"], hour: ["2-digit", "numeric"], minute: ["2-digit", "numeric"], second: ["2-digit", "numeric"], timeZoneName: ["short", "long"] };
        Aa.DateTimeFormat = { "[[availableLocales]]": [], "[[relevantExtensionKeys]]": ["ca", "nu"], "[[localeData]]": {} 
        },
        ra(na.DateTimeFormat, "supportedLocalesOf", { configurable: !0, writable: !0, value: za.call(L, Aa.DateTimeFormat) }),
        ra(na.DateTimeFormat.prototype, "format", { configurable: !0, get: G }),
        ra(na.DateTimeFormat.prototype, "resolvedOptions", { writable: !0, configurable: !0, value: function () { var a, b = new N, c = ["locale", "calendar", "numberingSystem", "timeZone", "hour12", "weekday", "era", "year", "month", "day", "hour", "minute", "second", "timeZoneName"], d = null != this && "object" == typeof this && S(this);
            if (!d || !d["[[initializedDateTimeFormat]]"]) throw new TypeError("`this` value for resolvedOptions() is not an initialized Intl.DateTimeFormat object.");
            for (var e = 0, f = c.length; f > e; e++) qa.call(d, a = "[[" + c[e] + "]]") && (b[c[e]] = { value: d[a], writable: !0, configurable: !0, enumerable: !0 });
            return ta({},
            b) } 
        });
        var La = na.__localeSensitiveProtos = { Number: {},
            Date: {} 
        };
        La.Number.toLocaleString = function () { if ("[object Number]" !== Object.prototype.toString.call(this)) throw new TypeError("`this` value must be a number for Number.prototype.toLocaleString()");
            return w(new s(arguments[0], arguments[1]),
            this) },
        La.Date.toLocaleString = function () { if ("[object Date]" !== Object.prototype.toString.call(this)) throw new TypeError("`this` value must be a Date instance for Date.prototype.toLocaleString()");
            var a = +this; if (isNaN(a)) return "Invalid Date"; var b = arguments[0], c = arguments[1], c = C(c, "any", "all"),
            d = new z(b, c);
            return H(d, a) },
        La.Date.toLocaleDateString = function () { if ("[object Date]" !== Object.prototype.toString.call(this)) throw new TypeError("`this` value must be a Date instance for Date.prototype.toLocaleDateString()");
            var a = +this; if (isNaN(a)) return "Invalid Date"; var b = arguments[0], c = arguments[1], c = C(c, "date", "date"),
            d = new z(b, c);
            return H(d, a) },
        La.Date.toLocaleTimeString = function () { if ("[object Date]" !== Object.prototype.toString.call(this)) throw new TypeError("`this` value must be a Date instance for Date.prototype.toLocaleTimeString()");
            var a = +this; if (isNaN(a)) return "Invalid Date"; var b = arguments[0], c = arguments[1], c = C(c, "time", "time"),
            d = new z(b, c);
            return H(d, a) },
        ra(na, "__applyLocaleSensitivePrototypes", { writable: !0, configurable: !0, value: function () { ra(Number.prototype, "toLocaleString", { writable: !0, configurable: !0, value: La.Number.toLocaleString }),
        ra(Date.prototype, "toLocaleString", { writable: !0, configurable: !0, value: La.Date.toLocaleString });
            for (var a in La.Date) qa.call(La.Date, a) && ra(Date.prototype, a, { writable: !0, configurable: !0, value: La.Date[a] }) } 
        }),
        ra(na, "__addLocaleData", { value: function (a) { if (!e(a.locale)) throw new Error("Object passed doesn't identify itself with a valid language tag");
            J(a, a.locale) } 
        }),
        N.prototype = ta(null),
        O.prototype = ta(null);
        var Ma = na; this.Intl || (this.Intl = Ma, Ma.__applyLocaleSensitivePrototypes());
        var Na = Ma; this.IntlPolyfill = Na }).call(this);

    // Intl.~locale.en
    IntlPolyfill.__addLocaleData({ locale: "en", date: { ca: ["gregory", "buddhist", "chinese", "coptic", "dangi", "ethioaa", "ethiopic", "generic", "hebrew", "indian", "islamic", "islamicc", "japanese", "persian", "roc"], hourNo0: true, hour12: true, formats: { medium: "{1},
 {0}", availableFormats: { "E": "ccc", EHm: "E HH:mm", EHms: "E HH:mm:ss", Ed: "d E", Ehm: "E h:mm a", Ehms: "E h:mm:ss a", Gy: "y G", GyMMM: "MMM y G", GyMMMEd: "E, MMM d, y G", GyMMMd: "MMM d, y G", "H": "HH", Hm: "HH:mm", Hms: "HH:mm:ss", Hmsv: "HH:mm:ss v", Hmv: "HH:mm v", "M": "L", MEd: "E, M/d", MMM: "LLL", MMMEd: "E, MMM d", MMMd: "MMM d", Md: "M/d", "d": "d", "h": "h a", hm: "h:mm a", hms: "h:mm:ss a", hmsv: "h:mm:ss a v", hmv: "h:mm a v", ms: "mm:ss", "y": "y", yM: "M/y", yMEd: "E, M/d/y", yMMM: "MMM y", yMMMEd: "E, MMM d, y", yMMMd: "MMM d, y", yMd: "M/d/y", yQQQ: "QQQ y", yQQQQ: "QQQQ y" },
    dateFormats: { full: "EEEE, MMMM d, y", long: "MMMM d, y", medium: "MMM d, y", short: "M/d/yy" },
    timeFormats: { full: "h:mm:ss a zzzz", long: "h:mm:ss a z", medium: "h:mm:ss a", short: "h:mm a" } 
},
calendars: { buddhist: { months: { narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["BE"], short: ["BE"], long: ["BE"] },
            dayPeriods: { am: "AM", pm: "PM" } 
},
    chinese: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["Mo1", "Mo2", "Mo3", "Mo4", "Mo5", "Mo6", "Mo7", "Mo8", "Mo9", "Mo10", "Mo11", "Mo12"], long: ["Month1", "Month2", "Month3", "Month4", "Month5", "Month6", "Month7", "Month8", "Month9", "Month10", "Month11", "Month12"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    coptic: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"], short: ["Tout", "Baba", "Hator", "Kiahk", "Toba", "Amshir", "Baramhat", "Baramouda", "Bashans", "Paona", "Epep", "Mesra", "Nasie"], long: ["Tout", "Baba", "Hator", "Kiahk", "Toba", "Amshir", "Baramhat", "Baramouda", "Bashans", "Paona", "Epep", "Mesra", "Nasie"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["ERA0", "ERA1"], short: ["ERA0", "ERA1"], long: ["ERA0", "ERA1"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    dangi: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["Mo1", "Mo2", "Mo3", "Mo4", "Mo5", "Mo6", "Mo7", "Mo8", "Mo9", "Mo10", "Mo11", "Mo12"], long: ["Month1", "Month2", "Month3", "Month4", "Month5", "Month6", "Month7", "Month8", "Month9", "Month10", "Month11", "Month12"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    ethiopic: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"], short: ["Meskerem", "Tekemt", "Hedar", "Tahsas", "Ter", "Yekatit", "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehasse", "Pagumen"], long: ["Meskerem", "Tekemt", "Hedar", "Tahsas", "Ter", "Yekatit", "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehasse", "Pagumen"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["ERA0", "ERA1"], short: ["ERA0", "ERA1"], long: ["ERA0", "ERA1"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    ethioaa: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"], short: ["Meskerem", "Tekemt", "Hedar", "Tahsas", "Ter", "Yekatit", "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehasse", "Pagumen"], long: ["Meskerem", "Tekemt", "Hedar", "Tahsas", "Ter", "Yekatit", "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehasse", "Pagumen"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["ERA0"], short: ["ERA0"], long: ["ERA0"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    generic: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12"], long: ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["ERA0", "ERA1"], short: ["ERA0", "ERA1"], long: ["ERA0", "ERA1"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    gregory: { months: { narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["B", "A", "BCE", "CE"], short: ["BC", "AD", "BCE", "CE"], long: ["Before Christ", "Anno Domini", "Before Common Era", "Common Era"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    hebrew: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "7"], short: ["Tishri", "Heshvan", "Kislev", "Tevet", "Shevat", "Adar I", "Adar", "Nisan", "Iyar", "Sivan", "Tamuz", "Av", "Elul", "Adar II"], long: ["Tishri", "Heshvan", "Kislev", "Tevet", "Shevat", "Adar I", "Adar", "Nisan", "Iyar", "Sivan", "Tamuz", "Av", "Elul", "Adar II"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["AM"], short: ["AM"], long: ["AM"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    indian: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"], long: ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["Saka"], short: ["Saka"], long: ["Saka"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    islamic: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["Muh.", "Saf.", "Rab. I", "Rab. II", "Jum. I", "Jum. II", "Raj.", "Sha.", "Ram.", "Shaw.", "Dhuʻl-Q.", "Dhuʻl-H."], long: ["Muharram", "Safar", "Rabiʻ I", "Rabiʻ II", "Jumada I", "Jumada II", "Rajab", "Shaʻban", "Ramadan", "Shawwal", "Dhuʻl-Qiʻdah", "Dhuʻl-Hijjah"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["AH"], short: ["AH"], long: ["AH"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    islamicc: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["Muh.", "Saf.", "Rab. I", "Rab. II", "Jum. I", "Jum. II", "Raj.", "Sha.", "Ram.", "Shaw.", "Dhuʻl-Q.", "Dhuʻl-H."], long: ["Muharram", "Safar", "Rabiʻ I", "Rabiʻ II", "Jumada I", "Jumada II", "Rajab", "Shaʻban", "Ramadan", "Shawwal", "Dhuʻl-Qiʻdah", "Dhuʻl-Hijjah"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["AH"], short: ["AH"], long: ["AH"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    japanese: { months: { narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["Taika (645-650)", "Hakuchi (650-671)", "Hakuhō (672-686)", "Shuchō (686-701)", "Taihō (701-704)", "Keiun (704-708)", "Wadō (708-715)", "Reiki (715-717)", "Yōrō (717-724)", "Jinki (724-729)", "Tempyō (729-749)", "Tempyō-kampō (749-749)", "Tempyō-shōhō (749-757)", "Tempyō-hōji (757-765)", "Temphō-jingo (765-767)", "Jingo-keiun (767-770)", "Hōki (770-780)", "Ten-ō (781-782)", "Enryaku (782-806)", "Daidō (806-810)", "Kōnin (810-824)", "Tenchō (824-834)", "Jōwa (834-848)", "Kajō (848-851)", "Ninju (851-854)", "Saiko (854-857)", "Tennan (857-859)", "Jōgan (859-877)", "Genkei (877-885)", "Ninna (885-889)", "Kampyō (889-898)", "Shōtai (898-901)", "Engi (901-923)", "Enchō (923-931)", "Shōhei (931-938)", "Tengyō (938-947)", "Tenryaku (947-957)", "Tentoku (957-961)", "Ōwa (961-964)", "Kōhō (964-968)", "Anna (968-970)", "Tenroku (970-973)", "Ten-en (973-976)", "Jōgen (976-978)", "Tengen (978-983)", "Eikan (983-985)", "Kanna (985-987)", "Ei-en (987-989)", "Eiso (989-990)", "Shōryaku (990-995)", "Chōtoku (995-999)", "Chōhō (999-1004)", "Kankō (1004-1012)", "Chōwa (1012-1017)", "Kannin (1017-1021)", "Jian (1021-1024)", "Manju (1024-1028)", "Chōgen (1028-1037)", "Chōryaku (1037-1040)", "Chōkyū (1040-1044)", "Kantoku (1044-1046)", "Eishō (1046-1053)", "Tengi (1053-1058)", "Kōhei (1058-1065)", "Jiryaku (1065-1069)", "Enkyū (1069-1074)", "Shōho (1074-1077)", "Shōryaku (1077-1081)", "Eiho (1081-1084)", "Ōtoku (1084-1087)", "Kanji (1087-1094)", "Kaho (1094-1096)", "Eichō (1096-1097)", "Shōtoku (1097-1099)", "Kōwa (1099-1104)", "Chōji (1104-1106)", "Kashō (1106-1108)", "Tennin (1108-1110)", "Ten-ei (1110-1113)", "Eikyū (1113-1118)", "Gen-ei (1118-1120)", "Hoan (1120-1124)", "Tenji (1124-1126)", "Daiji (1126-1131)", "Tenshō (1131-1132)", "Chōshō (1132-1135)", "Hoen (1135-1141)", "Eiji (1141-1142)", "Kōji (1142-1144)", "Tenyō (1144-1145)", "Kyūan (1145-1151)", "Ninpei (1151-1154)", "Kyūju (1154-1156)", "Hogen (1156-1159)", "Heiji (1159-1160)", "Eiryaku (1160-1161)", "Ōho (1161-1163)", "Chōkan (1163-1165)", "Eiman (1165-1166)", "Nin-an (1166-1169)", "Kaō (1169-1171)", "Shōan (1171-1175)", "Angen (1175-1177)", "Jishō (1177-1181)", "Yōwa (1181-1182)", "Juei (1182-1184)", "Genryuku (1184-1185)", "Bunji (1185-1190)", "Kenkyū (1190-1199)", "Shōji (1199-1201)", "Kennin (1201-1204)", "Genkyū (1204-1206)", "Ken-ei (1206-1207)", "Shōgen (1207-1211)", "Kenryaku (1211-1213)", "Kenpō (1213-1219)", "Shōkyū (1219-1222)", "Jōō (1222-1224)", "Gennin (1224-1225)", "Karoku (1225-1227)", "Antei (1227-1229)", "Kanki (1229-1232)", "Jōei (1232-1233)", "Tempuku (1233-1234)", "Bunryaku (1234-1235)", "Katei (1235-1238)", "Ryakunin (1238-1239)", "En-ō (1239-1240)", "Ninji (1240-1243)", "Kangen (1243-1247)", "Hōji (1247-1249)", "Kenchō (1249-1256)", "Kōgen (1256-1257)", "Shōka (1257-1259)", "Shōgen (1259-1260)", "Bun-ō (1260-1261)", "Kōchō (1261-1264)", "Bun-ei (1264-1275)", "Kenji (1275-1278)", "Kōan (1278-1288)", "Shōō (1288-1293)", "Einin (1293-1299)", "Shōan (1299-1302)", "Kengen (1302-1303)", "Kagen (1303-1306)", "Tokuji (1306-1308)", "Enkei (1308-1311)", "Ōchō (1311-1312)", "Shōwa (1312-1317)", "Bunpō (1317-1319)", "Genō (1319-1321)", "Genkyō (1321-1324)", "Shōchū (1324-1326)", "Kareki (1326-1329)", "Gentoku (1329-1331)", "Genkō (1331-1334)", "Kemmu (1334-1336)", "Engen (1336-1340)", "Kōkoku (1340-1346)", "Shōhei (1346-1370)", "Kentoku (1370-1372)", "Bunchũ (1372-1375)", "Tenju (1375-1379)", "Kōryaku (1379-1381)", "Kōwa (1381-1384)", "Genchũ (1384-1392)", "Meitoku (1384-1387)", "Kakei (1387-1389)", "Kōō (1389-1390)", "Meitoku (1390-1394)", "Ōei (1394-1428)", "Shōchō (1428-1429)", "Eikyō (1429-1441)", "Kakitsu (1441-1444)", "Bun-an (1444-1449)", "Hōtoku (1449-1452)", "Kyōtoku (1452-1455)", "Kōshō (1455-1457)", "Chōroku (1457-1460)", "Kanshō (1460-1466)", "Bunshō (1466-1467)", "Ōnin (1467-1469)", "Bunmei (1469-1487)", "Chōkyō (1487-1489)", "Entoku (1489-1492)", "Meiō (1492-1501)", "Bunki (1501-1504)", "Eishō (1504-1521)", "Taiei (1521-1528)", "Kyōroku (1528-1532)", "Tenmon (1532-1555)", "Kōji (1555-1558)", "Eiroku (1558-1570)", "Genki (1570-1573)", "Tenshō (1573-1592)", "Bunroku (1592-1596)", "Keichō (1596-1615)", "Genwa (1615-1624)", "Kan-ei (1624-1644)", "Shōho (1644-1648)", "Keian (1648-1652)", "Shōō (1652-1655)", "Meiryaku (1655-1658)", "Manji (1658-1661)", "Kanbun (1661-1673)", "Enpō (1673-1681)", "Tenwa (1681-1684)", "Jōkyō (1684-1688)", "Genroku (1688-1704)", "Hōei (1704-1711)", "Shōtoku (1711-1716)", "Kyōhō (1716-1736)", "Genbun (1736-1741)", "Kanpō (1741-1744)", "Enkyō (1744-1748)", "Kan-en (1748-1751)", "Hōryaku (1751-1764)", "Meiwa (1764-1772)", "An-ei (1772-1781)", "Tenmei (1781-1789)", "Kansei (1789-1801)", "Kyōwa (1801-1804)", "Bunka (1804-1818)", "Bunsei (1818-1830)", "Tenpō (1830-1844)", "Kōka (1844-1848)", "Kaei (1848-1854)", "Ansei (1854-1860)", "Man-en (1860-1861)", "Bunkyū (1861-1864)", "Genji (1864-1865)", "Keiō (1865-1868)", "M", "T", "S", "H"], short: ["Taika (645-650)", "Hakuchi (650-671)", "Hakuhō (672-686)", "Shuchō (686-701)", "Taihō (701-704)", "Keiun (704-708)", "Wadō (708-715)", "Reiki (715-717)", "Yōrō (717-724)", "Jinki (724-729)", "Tempyō (729-749)", "Tempyō-kampō (749-749)", "Tempyō-shōhō (749-757)", "Tempyō-hōji (757-765)", "Temphō-jingo (765-767)", "Jingo-keiun (767-770)", "Hōki (770-780)", "Ten-ō (781-782)", "Enryaku (782-806)", "Daidō (806-810)", "Kōnin (810-824)", "Tenchō (824-834)", "Jōwa (834-848)", "Kajō (848-851)", "Ninju (851-854)", "Saiko (854-857)", "Tennan (857-859)", "Jōgan (859-877)", "Genkei (877-885)", "Ninna (885-889)", "Kampyō (889-898)", "Shōtai (898-901)", "Engi (901-923)", "Enchō (923-931)", "Shōhei (931-938)", "Tengyō (938-947)", "Tenryaku (947-957)", "Tentoku (957-961)", "Ōwa (961-964)", "Kōhō (964-968)", "Anna (968-970)", "Tenroku (970-973)", "Ten-en (973-976)", "Jōgen (976-978)", "Tengen (978-983)", "Eikan (983-985)", "Kanna (985-987)", "Ei-en (987-989)", "Eiso (989-990)", "Shōryaku (990-995)", "Chōtoku (995-999)", "Chōhō (999-1004)", "Kankō (1004-1012)", "Chōwa (1012-1017)", "Kannin (1017-1021)", "Jian (1021-1024)", "Manju (1024-1028)", "Chōgen (1028-1037)", "Chōryaku (1037-1040)", "Chōkyū (1040-1044)", "Kantoku (1044-1046)", "Eishō (1046-1053)", "Tengi (1053-1058)", "Kōhei (1058-1065)", "Jiryaku (1065-1069)", "Enkyū (1069-1074)", "Shōho (1074-1077)", "Shōryaku (1077-1081)", "Eiho (1081-1084)", "Ōtoku (1084-1087)", "Kanji (1087-1094)", "Kaho (1094-1096)", "Eichō (1096-1097)", "Shōtoku (1097-1099)", "Kōwa (1099-1104)", "Chōji (1104-1106)", "Kashō (1106-1108)", "Tennin (1108-1110)", "Ten-ei (1110-1113)", "Eikyū (1113-1118)", "Gen-ei (1118-1120)", "Hoan (1120-1124)", "Tenji (1124-1126)", "Daiji (1126-1131)", "Tenshō (1131-1132)", "Chōshō (1132-1135)", "Hoen (1135-1141)", "Eiji (1141-1142)", "Kōji (1142-1144)", "Tenyō (1144-1145)", "Kyūan (1145-1151)", "Ninpei (1151-1154)", "Kyūju (1154-1156)", "Hogen (1156-1159)", "Heiji (1159-1160)", "Eiryaku (1160-1161)", "Ōho (1161-1163)", "Chōkan (1163-1165)", "Eiman (1165-1166)", "Nin-an (1166-1169)", "Kaō (1169-1171)", "Shōan (1171-1175)", "Angen (1175-1177)", "Jishō (1177-1181)", "Yōwa (1181-1182)", "Juei (1182-1184)", "Genryuku (1184-1185)", "Bunji (1185-1190)", "Kenkyū (1190-1199)", "Shōji (1199-1201)", "Kennin (1201-1204)", "Genkyū (1204-1206)", "Ken-ei (1206-1207)", "Shōgen (1207-1211)", "Kenryaku (1211-1213)", "Kenpō (1213-1219)", "Shōkyū (1219-1222)", "Jōō (1222-1224)", "Gennin (1224-1225)", "Karoku (1225-1227)", "Antei (1227-1229)", "Kanki (1229-1232)", "Jōei (1232-1233)", "Tempuku (1233-1234)", "Bunryaku (1234-1235)", "Katei (1235-1238)", "Ryakunin (1238-1239)", "En-ō (1239-1240)", "Ninji (1240-1243)", "Kangen (1243-1247)", "Hōji (1247-1249)", "Kenchō (1249-1256)", "Kōgen (1256-1257)", "Shōka (1257-1259)", "Shōgen (1259-1260)", "Bun-ō (1260-1261)", "Kōchō (1261-1264)", "Bun-ei (1264-1275)", "Kenji (1275-1278)", "Kōan (1278-1288)", "Shōō (1288-1293)", "Einin (1293-1299)", "Shōan (1299-1302)", "Kengen (1302-1303)", "Kagen (1303-1306)", "Tokuji (1306-1308)", "Enkei (1308-1311)", "Ōchō (1311-1312)", "Shōwa (1312-1317)", "Bunpō (1317-1319)", "Genō (1319-1321)", "Genkyō (1321-1324)", "Shōchū (1324-1326)", "Kareki (1326-1329)", "Gentoku (1329-1331)", "Genkō (1331-1334)", "Kemmu (1334-1336)", "Engen (1336-1340)", "Kōkoku (1340-1346)", "Shōhei (1346-1370)", "Kentoku (1370-1372)", "Bunchū (1372-1375)", "Tenju (1375-1379)", "Kōryaku (1379-1381)", "Kōwa (1381-1384)", "Genchū (1384-1392)", "Meitoku (1384-1387)", "Kakei (1387-1389)", "Kōō (1389-1390)", "Meitoku (1390-1394)", "Ōei (1394-1428)", "Shōchō (1428-1429)", "Eikyō (1429-1441)", "Kakitsu (1441-1444)", "Bun-an (1444-1449)", "Hōtoku (1449-1452)", "Kyōtoku (1452-1455)", "Kōshō (1455-1457)", "Chōroku (1457-1460)", "Kanshō (1460-1466)", "Bunshō (1466-1467)", "Ōnin (1467-1469)", "Bunmei (1469-1487)", "Chōkyō (1487-1489)", "Entoku (1489-1492)", "Meiō (1492-1501)", "Bunki (1501-1504)", "Eishō (1504-1521)", "Taiei (1521-1528)", "Kyōroku (1528-1532)", "Tenmon (1532-1555)", "Kōji (1555-1558)", "Eiroku (1558-1570)", "Genki (1570-1573)", "Tenshō (1573-1592)", "Bunroku (1592-1596)", "Keichō (1596-1615)", "Genwa (1615-1624)", "Kan-ei (1624-1644)", "Shōho (1644-1648)", "Keian (1648-1652)", "Shōō (1652-1655)", "Meiryaku (1655-1658)", "Manji (1658-1661)", "Kanbun (1661-1673)", "Enpō (1673-1681)", "Tenwa (1681-1684)", "Jōkyō (1684-1688)", "Genroku (1688-1704)", "Hōei (1704-1711)", "Shōtoku (1711-1716)", "Kyōhō (1716-1736)", "Genbun (1736-1741)", "Kanpō (1741-1744)", "Enkyō (1744-1748)", "Kan-en (1748-1751)", "Hōryaku (1751-1764)", "Meiwa (1764-1772)", "An-ei (1772-1781)", "Tenmei (1781-1789)", "Kansei (1789-1801)", "Kyōwa (1801-1804)", "Bunka (1804-1818)", "Bunsei (1818-1830)", "Tenpō (1830-1844)", "Kōka (1844-1848)", "Kaei (1848-1854)", "Ansei (1854-1860)", "Man-en (1860-1861)", "Bunkyū (1861-1864)", "Genji (1864-1865)", "Keiō (1865-1868)", "Meiji", "Taishō", "Shōwa", "Heisei"], long: ["Taika (645-650)", "Hakuchi (650-671)", "Hakuhō (672-686)", "Shuchō (686-701)", "Taihō (701-704)", "Keiun (704-708)", "Wadō (708-715)", "Reiki (715-717)", "Yōrō (717-724)", "Jinki (724-729)", "Tempyō (729-749)", "Tempyō-kampō (749-749)", "Tempyō-shōhō (749-757)", "Tempyō-hōji (757-765)", "Temphō-jingo (765-767)", "Jingo-keiun (767-770)", "Hōki (770-780)", "Ten-ō (781-782)", "Enryaku (782-806)", "Daidō (806-810)", "Kōnin (810-824)", "Tenchō (824-834)", "Jōwa (834-848)", "Kajō (848-851)", "Ninju (851-854)", "Saiko (854-857)", "Tennan (857-859)", "Jōgan (859-877)", "Genkei (877-885)", "Ninna (885-889)", "Kampyō (889-898)", "Shōtai (898-901)", "Engi (901-923)", "Enchō (923-931)", "Shōhei (931-938)", "Tengyō (938-947)", "Tenryaku (947-957)", "Tentoku (957-961)", "Ōwa (961-964)", "Kōhō (964-968)", "Anna (968-970)", "Tenroku (970-973)", "Ten-en (973-976)", "Jōgen (976-978)", "Tengen (978-983)", "Eikan (983-985)", "Kanna (985-987)", "Ei-en (987-989)", "Eiso (989-990)", "Shōryaku (990-995)", "Chōtoku (995-999)", "Chōhō (999-1004)", "Kankō (1004-1012)", "Chōwa (1012-1017)", "Kannin (1017-1021)", "Jian (1021-1024)", "Manju (1024-1028)", "Chōgen (1028-1037)", "Chōryaku (1037-1040)", "Chōkyū (1040-1044)", "Kantoku (1044-1046)", "Eishō (1046-1053)", "Tengi (1053-1058)", "Kōhei (1058-1065)", "Jiryaku (1065-1069)", "Enkyū (1069-1074)", "Shōho (1074-1077)", "Shōryaku (1077-1081)", "Eiho (1081-1084)", "Ōtoku (1084-1087)", "Kanji (1087-1094)", "Kaho (1094-1096)", "Eichō (1096-1097)", "Shōtoku (1097-1099)", "Kōwa (1099-1104)", "Chōji (1104-1106)", "Kashō (1106-1108)", "Tennin (1108-1110)", "Ten-ei (1110-1113)", "Eikyū (1113-1118)", "Gen-ei (1118-1120)", "Hoan (1120-1124)", "Tenji (1124-1126)", "Daiji (1126-1131)", "Tenshō (1131-1132)", "Chōshō (1132-1135)", "Hoen (1135-1141)", "Eiji (1141-1142)", "Kōji (1142-1144)", "Tenyō (1144-1145)", "Kyūan (1145-1151)", "Ninpei (1151-1154)", "Kyūju (1154-1156)", "Hogen (1156-1159)", "Heiji (1159-1160)", "Eiryaku (1160-1161)", "Ōho (1161-1163)", "Chōkan (1163-1165)", "Eiman (1165-1166)", "Nin-an (1166-1169)", "Kaō (1169-1171)", "Shōan (1171-1175)", "Angen (1175-1177)", "Jishō (1177-1181)", "Yōwa (1181-1182)", "Juei (1182-1184)", "Genryuku (1184-1185)", "Bunji (1185-1190)", "Kenkyū (1190-1199)", "Shōji (1199-1201)", "Kennin (1201-1204)", "Genkyū (1204-1206)", "Ken-ei (1206-1207)", "Shōgen (1207-1211)", "Kenryaku (1211-1213)", "Kenpō (1213-1219)", "Shōkyū (1219-1222)", "Jōō (1222-1224)", "Gennin (1224-1225)", "Karoku (1225-1227)", "Antei (1227-1229)", "Kanki (1229-1232)", "Jōei (1232-1233)", "Tempuku (1233-1234)", "Bunryaku (1234-1235)", "Katei (1235-1238)", "Ryakunin (1238-1239)", "En-ō (1239-1240)", "Ninji (1240-1243)", "Kangen (1243-1247)", "Hōji (1247-1249)", "Kenchō (1249-1256)", "Kōgen (1256-1257)", "Shōka (1257-1259)", "Shōgen (1259-1260)", "Bun-ō (1260-1261)", "Kōchō (1261-1264)", "Bun-ei (1264-1275)", "Kenji (1275-1278)", "Kōan (1278-1288)", "Shōō (1288-1293)", "Einin (1293-1299)", "Shōan (1299-1302)", "Kengen (1302-1303)", "Kagen (1303-1306)", "Tokuji (1306-1308)", "Enkei (1308-1311)", "Ōchō (1311-1312)", "Shōwa (1312-1317)", "Bunpō (1317-1319)", "Genō (1319-1321)", "Genkyō (1321-1324)", "Shōchū (1324-1326)", "Kareki (1326-1329)", "Gentoku (1329-1331)", "Genkō (1331-1334)", "Kemmu (1334-1336)", "Engen (1336-1340)", "Kōkoku (1340-1346)", "Shōhei (1346-1370)", "Kentoku (1370-1372)", "Bunchū (1372-1375)", "Tenju (1375-1379)", "Kōryaku (1379-1381)", "Kōwa (1381-1384)", "Genchū (1384-1392)", "Meitoku (1384-1387)", "Kakei (1387-1389)", "Kōō (1389-1390)", "Meitoku (1390-1394)", "Ōei (1394-1428)", "Shōchō (1428-1429)", "Eikyō (1429-1441)", "Kakitsu (1441-1444)", "Bun-an (1444-1449)", "Hōtoku (1449-1452)", "Kyōtoku (1452-1455)", "Kōshō (1455-1457)", "Chōroku (1457-1460)", "Kanshō (1460-1466)", "Bunshō (1466-1467)", "Ōnin (1467-1469)", "Bunmei (1469-1487)", "Chōkyō (1487-1489)", "Entoku (1489-1492)", "Meiō (1492-1501)", "Bunki (1501-1504)", "Eishō (1504-1521)", "Taiei (1521-1528)", "Kyōroku (1528-1532)", "Tenmon (1532-1555)", "Kōji (1555-1558)", "Eiroku (1558-1570)", "Genki (1570-1573)", "Tenshō (1573-1592)", "Bunroku (1592-1596)", "Keichō (1596-1615)", "Genwa (1615-1624)", "Kan-ei (1624-1644)", "Shōho (1644-1648)", "Keian (1648-1652)", "Shōō (1652-1655)", "Meiryaku (1655-1658)", "Manji (1658-1661)", "Kanbun (1661-1673)", "Enpō (1673-1681)", "Tenwa (1681-1684)", "Jōkyō (1684-1688)", "Genroku (1688-1704)", "Hōei (1704-1711)", "Shōtoku (1711-1716)", "Kyōhō (1716-1736)", "Genbun (1736-1741)", "Kanpō (1741-1744)", "Enkyō (1744-1748)", "Kan-en (1748-1751)", "Hōryaku (1751-1764)", "Meiwa (1764-1772)", "An-ei (1772-1781)", "Tenmei (1781-1789)", "Kansei (1789-1801)", "Kyōwa (1801-1804)", "Bunka (1804-1818)", "Bunsei (1818-1830)", "Tenpō (1830-1844)", "Kōka (1844-1848)", "Kaei (1848-1854)", "Ansei (1854-1860)", "Man-en (1860-1861)", "Bunkyū (1861-1864)", "Genji (1864-1865)", "Keiō (1865-1868)", "Meiji", "Taishō", "Shōwa", "Heisei"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    persian: { months: { narrow: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], short: ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"], long: ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["AP"], short: ["AP"], long: ["AP"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    },
    roc: { months: { narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
            days: { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], long: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
            eras: { narrow: ["Before R.O.C.", "Minguo"], short: ["Before R.O.C.", "Minguo"], long: ["Before R.O.C.", "Minguo"] },
            dayPeriods: { am: "AM", pm: "PM" } 
    } 
} 
},
number: { nu: ["latn"], patterns: { decimal: { positivePattern: "{number}", negativePattern: "-{number}" },
        currency: { positivePattern: "{currency}{number}", negativePattern: "-{currency}{number}" },
        percent: { positivePattern: "{number}%", negativePattern: "-{number}%" } 
},
    symbols: { latn: { decimal: ".", group: ",", nan: "NaN", percent: "%", infinity: "∞" } 
    },
    currencies: { AUD: "A$", BRL: "R$", CAD: "CA$", CNY: "CN¥", EUR: "€", GBP: "£", HKD: "HK$", ILS: "₪", INR: "₹", JPY: "¥", KRW: "₩", MXN: "MX$", NZD: "NZ$", TWD: "NT$", USD: "$", VND: "₫", XAF: "FCFA", XCD: "EC$", XOF: "CFA", XPF: "CFPF" } 
} 
});

})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
