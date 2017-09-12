/**
 * Created by Rogier on 13/04/2017.
 */
import keyedIterator from '../collections/keyedIterator';
import negate from '../functions/negate';
/**
 * Returns a boolean indicating if a value is an array.
 *
 * @param value - Value to identify as an array.
 *
 * @returns Boolean indicating if the value is an array.
 */
export const array = Array.isArray;
/**
 * returns true if a value is cloneable according to the structured clone algorithm.
 *
 * @param value - Value to check for cloneability.
 *
 * @returns Boolean indicating if the value is cloneable.
 */
export function cloneable(value) {
    return !(value instanceof Function
        || value instanceof Error
        || value instanceof WeakMap
        || value instanceof HTMLElement
        || typeof (value) === 'symbol');
}
/**
 * Returns a boolean indicating if a collection is empty.
 *
 * @param collection - Collection to check
 *
 * @returns Boolean indicating if the collection is empty.
 */
export function empty(collection) {
    return keyedIterator(collection).next().done;
}
/**
 * Returns a boolean indicating if an object is iterable
 *
 * @param obj
 * @returns {boolean}
 */
export function iterable(obj) {
    return (obj !== null && !undefined(obj)) && typeof (obj[Symbol.iterator]) === 'function';
}
/**
 * Returns a boolean indicating if a the value is a symbol.
 *
 * @param value - Value to identify as symbol.
 *
 * @returns Boolean indicating if value is a symbol.
 */
export function symbol(value) {
    return typeof (value) === 'symbol';
}
/**
 * Returns a boolean indicating if a value is undefined.
 *
 * @param {any} value - Value test if undefined.
 *
 * @returns Boolean indicating if the value is undefined.
 */
export function undefined(value) {
    return typeof (value) === 'undefined';
}
/**
 * Contains negated versions of functions.
 */
export const not = {
    array: negate(array),
    cloneable: negate(cloneable),
    empty: negate(empty),
    iterable: negate(iterable),
    undefined: negate(undefined),
};
