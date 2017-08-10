/**
 * Query string encoder/decoder
 * inspired by Gozala/querystring
 *
 * {@see} https://github.com/Gozala/querystring
 */
export default class QueryString {

    /**
     * Decodes the query string
     *
     * @param {string}        query
     * @param {DecodeOptions} options
     */
    public static decode(query: string, options: DecodeOptions = {}) {
        const sep = options.sep || '&';
        const eq = options.eq || '=';
        const result = Object.create(null);

        if (query.length === 0) {
            return result;
        }

        const segments = query.replace(/^[#\\?]/, '').trim().split(sep);
        for (let i = 0; i < segments.length; ++i) {
            let x = segments[i];

            if(options.spacesMode === 'plus') {
                x = x.replace(/\+/g, ' ');
            }

            const idx = x.indexOf(eq);
            let kstr = x;
            let vstr = '';

            if (idx >= 0) {
                kstr = x.substr(0, idx);
                vstr = x.substr(idx + eq.length);
            }

            if(kstr === '' || !options.keepEmpty && vstr === '') {
                continue;
            }

            let k = decodeURIComponent(kstr);
            let v = decodeURIComponent(vstr);

            if(options.arrayMode === 'brackets') {
                k = k.replace(/\[\]$/, '');
            }

            if (!has(result, k)) {
                result[k] = v;
            } else if (Array.isArray(result[k])) {
                result[k].push(v);
            } else {
                result[k] = [result[k], v];
            }
        }

        return result;
    }

    /**
     * Encodes the object into the query string
     *
     * @param {SourceObjType}  source
     * @param {string}         sep
     * @param {string}         eq
     * @param {EncodeOptions}  options
     */
    public static encode(
        source: SourceObjType,
        options: EncodeOptions = {}
    ) {
        const sep = options.sep || '&';
        const eq = options.eq || '=';
        const encode = encodeURIComponent;
        const keys = Object.keys(source);

        let result = keys.map((key) => {
            const val = source[key];

            if(!options.keepEmpty && (val == null || val === '')) {
                return null;
            }

            const encodedKey = encode(stringify(key));
            let queryString = encodedKey + eq;

            if (Array.isArray(val)) {
                if(options.arrayMode === 'brackets') {
                    queryString = encodedKey + '[]' + eq;
                }
                return val.map((v) => queryString + encode(stringify(v))).join(sep);

            } else {
                return queryString + encode(stringify(val));
            }
        }).filter(Boolean).join(sep);

        if(options.spacesMode === 'plus') {
            result = result.replace(/%20/g, '+');
        }

        return result;
    }
}

/**
 * Checks if object has own property
 *
 * @param {any}    obj
 * @param {string} prop
 */
function has(obj: any, prop: string) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Converts primitive to string
 *
 * @param {any} value
 */
function stringify(value: any) {
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

export type ValueType = string | number | boolean;

export type SourceObjType = {
    [key: string]: ValueType | ValueType[] | null | undefined,
}

export type ArrayModeType = 'brackets';
export type SpacesModeType = 'plus';

export interface DecodeOptions {
    sep?: string,
    eq?: string,
    arrayMode?: ArrayModeType,
    spacesMode?: SpacesModeType,
    keepEmpty?: boolean,
}

export interface EncodeOptions {
    sep?: string,
    eq?: string,
    arrayMode?: ArrayModeType,
    spacesMode?: SpacesModeType,
    keepEmpty?: boolean,
}