/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import { Collection } from './types';

/**
 * @function each
 * @desc
 *       Invokes iteratee for every item in a collection.
 *       Iteration can be broken by letting the iteratee return false.
 *       Optionally a from & to key can be provided for partial iteration.
 *
 * @param {Collection}                                  collection - The collection to iterate over.
 * @param {(value, key, collection) => (any | boolean)} iteratee   - The iteratee that is invoked on every item. Returning false will break iteration.
 * @param {any=}                                        from       - Optional from key.
 * @param {any=}                                        to         - Optional to key.
 *
 * @returns {Collection} - The iterated collection.
 */
export default function each<T>(collection: Collection<T>, iteratee: (value, key, collection) => any|boolean, from?: any, to?: any): Collection<T>
{
    for(const [key, value] of enumerate(collection, from, to))
    {
        if(iteratee(value, key, collection) === false) { break; } // break loop if 'false' is returned by iteratee
    }

    return collection;
}
