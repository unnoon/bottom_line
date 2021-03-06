/**
 * Created by Rogier on 13/04/2017.
 */
import KeyedIterator from '../classes/KeyedIterator';
import negate from '../functions/negate';
import { Collection } from '../types';

const not: {[key: string]: (...args : any[]) => boolean} = {};

const is =
{
    /**
     * Returns a boolean indicating if a value is an array.
     *
     * @param value - Value to identify as an array.
     *
     * @returns Boolean indicating if the value is an array.
     */
    array: Array.isArray,

    /**
     * returns true if a value is cloneable according to the structured clone algorithm.
     *
     * @param value - Value to check for cloneability.
     *
     * @returns Boolean indicating if the value is cloneable.
     */
    cloneable: (value): boolean =>
    {
        return !(value instanceof Function
            ||   value instanceof Error
            ||   value instanceof WeakMap
            ||   value instanceof HTMLElement
            ||   typeof(value) === 'symbol');
    },

    /**
     * Returns a boolean indicating if a collection is empty.
     *
     * @param collection - Collection to check.
     *
     * @returns Boolean indicating if the collection is empty.
     */
    empty: (collection: Collection<any>): boolean =>
    {
        return KeyedIterator.create(collection).next().done;
    },

    /**
     * Returns a boolean indicating if an object is iterable.
     *
     * @param obj - Object to check iterability for.
     *
     * @returns Boolean indicating if the obj is iterable.
     */
    iterable: (obj): obj is Iterable<any>|IterableIterator<any> =>
    {
        return obj !== null && obj !== undefined && typeof(obj[Symbol.iterator]) === 'function';
    },

    /**
     * Returns a boolean indicating if a value is NaN.
     *
     * @param value - Value to be identified as NaN.
     *
     * @returns Boolean indicating if the value is NaN.
     */
    nan: (value): boolean =>
    {
        return Object.is(value, NaN)
    },
    /**
     * Contains negated versions of functions.
     */
    not,
    /**
     * Returns a boolean indicating if a value is null.
     *
     * @param value - Value to be identified as null.
     *
     * @returns Boolean indicating if the value is null.
     */
    null: (value): boolean =>
    {
        return value === null
    },

    /**
     * Returns a boolean indicating if a value is number.
     *
     * @param value - Value to be identified as a number.
     *
     * @returns Boolean indicating if the value is number.
     */
    number: (value): value is number =>
    {
        return typeof(value) === 'number'
    },

    /**
     * Returns a boolean indicating if a value is string.
     *
     * @param value - Value to be identified as a string.
     *
     * @returns Boolean indicating if the value is string.
     */
    string: (value): value is string =>
    {
        return typeof(value) === 'string';
    },

    /**
     * Returns a boolean indicating if a the value is a symbol.
     *
     * @param value - Value to identify as symbol.
     *
     * @returns Boolean indicating if value is a symbol.
     */
    symbol: (value): boolean =>
    {
        return typeof(value) === 'symbol';
    },

    /**
     * Returns a boolean indicating if a value is undefined.
     *
     * @param {any} value - Value test if undefined.
     *
     * @returns Boolean indicating if the value is undefined.
     */
    undefined: (value): boolean =>
    {
        return value === undefined
    },
};

is.not = {
    array:     negate(is.array),
    cloneable: negate(is.cloneable),
    empty:     negate(is.empty),
    iterable:  negate(is.iterable),
    nan:       negate(is.nan),
    null:      negate(is.null),
    number:    negate(is.number),
    string:    negate(is.string),
    symbol:    negate(is.symbol),
    undefined: negate(is.undefined),
};

export default is
