/**
 * Created by Rogier on 13/04/2017.
 */

import reduce from './reduce';
import { Collection } from './types';

/**
 * @function count
 * @desc
 *       Counts the occurrences as defined by a match function.
 *       Optionally a from & to key can be provided for partial counts.
 *
 * @param {Collection}         collection - The collection to count elements from.
 * @param {(value) => boolean} match      - Match function.
 * @param {any=}               from       - Optional from key.
 * @param {any=}               to         - Optional to key.
 *
 * @returns {number} - The total number of occurrences.
 */
export default function count<T>(collection: Collection<T>, match: (value: T) => boolean, from?: any, to?: any): number
{
    return reduce(collection, (accumulator, value) => accumulator + (match(value) ? 1 : 0), 0, from, to);
}
