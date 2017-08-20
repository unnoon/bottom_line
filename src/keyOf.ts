/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import { Collection } from './types';

/**
 * @function keyOf
 * @desc
 *       Returns the key of a given value. Optionally a from & to key can be provided.
 *
 * @param {Collection} collection - Collection to search the value.
 * @param {any}        value      - Value to find the key for.
 * @param {any=}       from       - Optional from key.
 * @param {any=}       to         - Optional to key.
 *
 * @returns {any} - The key of he found value or undefined otherwise.
 */
export default function keyOf<T>(collection: Collection<T>, value: any, from?: any, to?: any): any
{
    for(const [key, val] of enumerate(collection, from, to))
    {
        if(val === value) {return key;}
    }
}
