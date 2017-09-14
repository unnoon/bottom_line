import { Collection } from '../types';
/**
 * Returns a boolean indicating if a value is an array.
 *
 * @param value - Value to identify as an array.
 *
 * @returns Boolean indicating if the value is an array.
 */
export declare const array: (obj) => obj is any[];
/**
 * returns true if a value is cloneable according to the structured clone algorithm.
 *
 * @param value - Value to check for cloneability.
 *
 * @returns Boolean indicating if the value is cloneable.
 */
export declare function cloneable(value: any): boolean;
/**
 * Returns a boolean indicating if a collection is empty.
 *
 * @param collection - Collection to check.
 *
 * @returns Boolean indicating if the collection is empty.
 */
export declare function empty(collection: Collection<any>): boolean;
/**
 * Returns a boolean indicating if an object is iterable.
 *
 * @param obj - Object to check iterability for.
 *
 * @returns Boolean indicating if the obj is iterable.
 */
export declare function iterable(obj: any): obj is Iterable<any> | IterableIterator<any>;
/**
 * Returns a boolean indicating if a value is number.
 *
 * @param value - Value to be identified as a number.
 *
 * @returns Boolean indicating if the value is number.
 */
export declare function number(value: any): value is number;
/**
 * Returns a boolean indicating if a value is string.
 *
 * @param value - Value to be identified as a string.
 *
 * @returns Boolean indicating if the value is string.
 */
export declare function string(value: any): value is string;
/**
 * Returns a boolean indicating if a the value is a symbol.
 *
 * @param value - Value to identify as symbol.
 *
 * @returns Boolean indicating if value is a symbol.
 */
export declare function symbol(value: any): boolean;
/**
 * Returns a boolean indicating if a value is undefined.
 *
 * @param {any} value - Value test if undefined.
 *
 * @returns Boolean indicating if the value is undefined.
 */
export declare function undefined(value: any): boolean;
/**
 * Contains negated versions of functions.
 */
export declare const not: {
    array: Function;
    cloneable: Function;
    empty: Function;
    iterable: Function;
    number: Function;
    string: Function;
    symbol: Function;
    undefined: Function;
};
