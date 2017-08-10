import  'mocha';
import { expect } from 'chai';
import QueryString from '../src';

describe('QueryString', () => {

    // decode
    describe('decode()', () => {

        it('should decode', () => {
            expect(QueryString.decode('a=b')).to.deep.equal({a : 'b'});
            expect(QueryString.decode('a=b&c=d')).to.deep.equal({a : 'b', c: 'd'});
        });

        it('should handle empty values', () => {
            expect(QueryString.decode('1=&2=10&3=0&4=false&5=null&6=undefined', {keepEmpty: true}))
                .to.deep.equal({
                    1: '',
                    2: '10',
                    3: '0',
                    4: 'false',
                    5: 'null',
                    6: 'undefined',
                });
        });

        it('should handle invalid string and return empty object', () => {
            expect(QueryString.decode('')).to.deep.equal({});
            expect(QueryString.decode(' ')).to.deep.equal({});
            expect(QueryString.decode('_')).to.deep.equal({});
            expect(QueryString.decode('#')).to.deep.equal({});
            expect(QueryString.decode('?')).to.deep.equal({});
            expect(QueryString.decode('&')).to.deep.equal({});
            expect(QueryString.decode('=')).to.deep.equal({});
        });

        it('should preserve array order', () => {
            expect(QueryString.decode('a=1&a=2&a=3&b=x&a=4')).to.deep.equal({
                a: ['1', '2', '3', '4'],
                b: 'x'
            });
        });

        it('should handle object properties', () => {
            expect(QueryString.decode('hasOwnProperty=a&toString=b&valueOf=c&__defineGetter__=d'))
                .to.deep.equal({
                    hasOwnProperty: 'a',
                    toString: 'b',
                    valueOf: 'c',
                    __defineGetter__: 'd',
                });
        });

        it('should accept custom separators', () => {
            expect(QueryString.decode('a->b|c->d', {
                sep:'|',
                eq: '->',
            })).to.deep.equal({a:'b', c:'d'});
        });

        it('should handle same key names', () => {
            expect(QueryString.decode('a=1&a=2&a=3&c=d')).to.deep.equal({a: ['1', '2', '3'], c: 'd'});
        });

        it('should allow array brackets', () => {
            expect(QueryString.decode('a[]=1&a[]=2&a[]=3&c=d', {
                arrayMode: 'brackets',
            })).to.deep.equal({a: ['1', '2', '3'], c: 'd'});
        });

        it('should handle spaces', () => {
            expect(QueryString.decode('a=some%20string+x&c=d')).to.deep.equal({a: 'some string+x', c: 'd'});
        });

        it('should handle plus sign', () => {
            expect(QueryString.decode('a=some+string+x&c=d', {
                spacesMode: 'plus',
            })).to.deep.equal({a: 'some string x', c: 'd'});
        });
    });

    // encode
    describe('encode()', () => {

        it('should encode', () => {
            expect(QueryString.encode({a : 'b'})).to.equal('a=b');
            expect(QueryString.encode({a : 'b', c: 'd'})).to.equal('a=b&c=d');
        });

        it('should handle empty values', () => {
            expect(QueryString.encode({
                1: '',
                2: 10,
                3: false,
                4: undefined,
                5: null
            })).to.equal('2=10&3=0');

            expect(QueryString.encode({
                1: '',
                2: 10,
                3: false,
                4: undefined,
                5: null
            }, {keepEmpty: true})).to.equal('1=&2=10&3=0&4=&5=');
        });

        it('should preserve array order', () => {
            expect(QueryString.encode({
                a: ['4', '3', '2', '1'],
                b: 'x'
            })).to.equal('a=4&a=3&a=2&a=1&b=x');
        });

        it('should handle special chars', () => {
            expect(QueryString.encode({a:'b"', c:'d/'})).to.equal('a=b%22&c=d%2F');
        });

        it('should accept custom separators', () => {
            expect(QueryString.encode({a:'b', c:'d'}, {
                sep: '|',
                eq: '->',
            })).to.equal('a->b|c->d');
        });

        it('should handle same key names', () => {
            expect(QueryString.encode({a: ['1', '2', '3'], c: 'd'})).to.equal('a=1&a=2&a=3&c=d');
        });

        it('should allow array brackets', () => {
            expect(QueryString.encode({a: ['1', '2', '3'], c: 'd'}, {
                arrayMode: 'brackets',
            })).to.equal('a[]=1&a[]=2&a[]=3&c=d');
        });

        it('should handle spaces', () => {
            expect(QueryString.encode({a: 'some string x', c: 'd'})).to.equal('a=some%20string%20x&c=d');
        });

        it('should handle plus sign', () => {
            expect(QueryString.encode({a: 'some string+x', c: 'd'}, {
                spacesMode: 'plus',
            })).to.equal('a=some+string%2Bx&c=d');
        });
    });

});