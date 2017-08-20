/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../types';
import enumerate from './enumerate';

/**
 * @generator
 * @function map
 * @desc
 *       Runs each value through iteratee. The iteratee is invoked with three arguments: (value, key, collection).
 *       Optionally a from & to key can be provided for partial mapping.
 *
 * @param {Collection}                      collection - Collection to enumerate.
 * @param {(value, key, collection) => any} iteratee   - Function that maps each value.
 * @param {any=}                            from       - Optional from key.
 * @param {any=}                            to         - Optional to key.
 *
 * @yields {any} - Mapped value.
 */
export default function* map<T>(collection: Collection<T>, iteratee: (value, key, collection) => any, from?: any, to?: any): any
{
    for(const [key, value] of enumerate(collection, from, to))
    {
        yield iteratee(value, key, collection);
    }
}
