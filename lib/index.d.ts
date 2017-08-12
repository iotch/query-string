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
    static decode(query: string, options?: DecodeOptions): any;
    /**
     * Encodes the object into the query string
     *
     * @param {SourceObjType}  source
     * @param {string}         sep
     * @param {string}         eq
     * @param {EncodeOptions}  options
     */
    static encode(source: SourceObjType, options?: EncodeOptions): string;
}
export declare type ValueType = string | number | boolean;
export declare type SourceObjType = {
    [key: string]: ValueType | ValueType[] | null | undefined;
};
export declare type ArrayModeType = 'brackets';
export declare type SpacesModeType = 'plus';
export interface DecodeOptions {
    sep?: string;
    eq?: string;
    arrayMode?: ArrayModeType;
    spacesMode?: SpacesModeType;
    keepEmpty?: boolean;
}
export interface EncodeOptions {
    sep?: string;
    eq?: string;
    arrayMode?: ArrayModeType;
    spacesMode?: SpacesModeType;
    keepEmpty?: boolean;
}
