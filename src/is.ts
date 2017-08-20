/**
 * Created by Rogier on 13/04/2017.
 */
import keyedIterator from './keyedIterator';
import negate from './negate';
import { Collection } from './types';

/**
 * @function is.empty
 * @desc
 *       Returns a boolean indicating if a collection is empty.
 *
 * @param {Collection} collection - Collection to check.
 *
 * @returns {boolean} - Boolean indicating if the collection is empty.
 */
function empty<T>(collection: Collection<T>): boolean
{
    return keyedIterator(collection).next().done;
}

/**
 * @function is.array
 * @desc
 *       Returns a boolean indicating if a value is an array.
 *
 * @param {any} value - Value to identify as an array.
 *
 * @returns {boolean} - Boolean indicating if the value is an array.
 */
function array(value: any): boolean
{
    return Array.isArray(value);
}

/**
 * @function is.uncloneable
 * @desc
 *       returns true if a value is uncloneable according to the structured clone algorithm.
 *
 * @param value - Value to check for uncloneability.
 *
 * @returns {boolean} - Boolean indicating if the value is uncloneable.
 */
function uncloneable(value)
{
    return value instanceof Function
    ||     value instanceof Error
    ||     value instanceof WeakMap
    ||     value instanceof HTMLElement
    ||     typeof(value) === 'symbol';
}

/**
 * @function is.undefined
 * @desc
 *       Returns a boolean indicating if a value is undefined.
 *
 * @param {any} value - Value test if undefined.
 *
 * @returns {boolean} - Boolean indicating if the value is undefined.
 */
function undefined(value: any): boolean
{
    return typeof(value) === 'undefined';
}

// TODO type needs improvement
const not: {[key: string]: any} = {};

const is =
{
    array,
    empty,
    uncloneable,
    undefined,
    not,
};

// dynamically add the negated functions
for(const key in is)
{
    /* istanbul ignore if */
    if(!is.hasOwnProperty(key)) {continue;}

    const fn = is[key];

    if(fn instanceof Function)
    {
        is.not[key] = negate(fn);
    }
}

export default is;
