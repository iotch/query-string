"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Query string encoder/decoder
 * inspired by Gozala/querystring
 *
 * {@see} https://github.com/Gozala/querystring
 */
var QueryString = (function () {
    function QueryString() {
    }
    /**
     * Decodes the query string
     *
     * @param {string}        query
     * @param {DecodeOptions} options
     */
    QueryString.decode = function (query, options) {
        if (options === void 0) { options = {}; }
        var sep = options.sep || '&';
        var eq = options.eq || '=';
        var result = Object.create(null);
        if (query.length === 0) {
            return result;
        }
        var segments = query.replace(/^[#\\?]/, '').trim().split(sep);
        for (var i = 0; i < segments.length; ++i) {
            var x = segments[i];
            if (options.spacesMode === 'plus') {
                x = x.replace(/\+/g, ' ');
            }
            var idx = x.indexOf(eq);
            var kstr = x;
            var vstr = '';
            if (idx >= 0) {
                kstr = x.substr(0, idx);
                vstr = x.substr(idx + eq.length);
            }
            if (kstr === '' || !options.keepEmpty && vstr === '') {
                continue;
            }
            var k = decodeURIComponent(kstr);
            var v = decodeURIComponent(vstr);
            if (options.arrayMode === 'brackets') {
                k = k.replace(/\[\]$/, '');
            }
            if (!has(result, k)) {
                result[k] = v;
            }
            else if (Array.isArray(result[k])) {
                result[k].push(v);
            }
            else {
                result[k] = [result[k], v];
            }
        }
        return result;
    };
    /**
     * Encodes the object into the query string
     *
     * @param {SourceObjType}  source
     * @param {string}         sep
     * @param {string}         eq
     * @param {EncodeOptions}  options
     */
    QueryString.encode = function (source, options) {
        if (options === void 0) { options = {}; }
        var sep = options.sep || '&';
        var eq = options.eq || '=';
        var encode = encodeURIComponent;
        var keys = Object.keys(source);
        var result = keys.map(function (key) {
            var val = source[key];
            if (!options.keepEmpty && (val == null || val === '')) {
                return null;
            }
            var encodedKey = encode(stringify(key));
            var queryString = encodedKey + eq;
            if (Array.isArray(val)) {
                if (options.arrayMode === 'brackets') {
                    queryString = encodedKey + '[]' + eq;
                }
                return val.map(function (v) { return queryString + encode(stringify(v)); }).join(sep);
            }
            else {
                return queryString + encode(stringify(val));
            }
        }).filter(Boolean).join(sep);
        if (options.spacesMode === 'plus') {
            result = result.replace(/%20/g, '+');
        }
        return result;
    };
    return QueryString;
}());
exports.default = QueryString;
/**
 * Checks if object has own property
 *
 * @param {any}    obj
 * @param {string} prop
 */
function has(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
/**
 * Converts primitive to string
 *
 * @param {any} value
 */
function stringify(value) {
    switch (typeof value) {
        case 'string':
            return value;
        case 'boolean':
            return value ? '1' : '0';
        case 'number':
            return isFinite(value) ? value : '';
        default:
            return '';
    }
}
