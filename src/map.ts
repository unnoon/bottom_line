/**
 * Created by Rogier on 13/04/2017.
 */
import mapG from './generators/map';
import { Collection } from './types';

/**
 * @function map
 * @desc
 *       Runs each value through iteratee. The iteratee is invoked with three arguments: (value, key, collection).
 *       Optionally a from & to key can be provided for partial mapping.
 *       All values are mapped into an array.
 *
 * @param {Collection}                      collection - Collection to enumerate.
 * @param {(value, key, collection) => any} iteratee   - Function that maps each value.
 * @param {any=}                            from       - Optional from key.
 * @param {any=}                            to         - Optional to key.
 *
 * @returns {any[]} - Array with mapped values.
 */
export default function map<T>(collection: Collection<T>, iteratee: (value, key, collection) => any, from?: any, to?: any): any
{
    return Array.from(mapG(collection, iteratee, from, to));
}
