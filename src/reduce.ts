/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import is from './is';
import keyedIterator from './keyedIterator';
import { Collection } from './types';

/**
 * @function map
 * @desc
 *       Reduce a collection by running each value through iteratee.
 *       The iteratee is invoked with three arguments: (accumulator, value, key, collection).
 *       Optionally a from & to key can be provided for partial reduction.
 *
 * @param {Collection}                                   collection  - Collection to enumerate.
 * @param {(accumulator, value, key, collection) => any} iteratee    - Iteratee invoked on each item..
 * @param {any=}                                         accumulator - Optional initial accumulator. If omitted the first value will be taken as the accumulator.
 * @param {any=}                                         from        - Optional from key.
 * @param {any=}                                         to          - Optional to key.
 *
 * @returns {any} - The reduced value.
 */
export default function reduce<T>(collection: Collection<T>, iteratee: (accumulator, value, key, collection) => any, accumulator?: any, from?: any|number, to?: any|number): any
{
    const it = keyedIterator(collection);

    accumulator = is.undefined(accumulator) && is.not.empty(collection) ? it.next().value[1] : accumulator;

    for(const [key, value] of enumerate(it, from, to))
    {
        accumulator = iteratee(accumulator, value, key, collection);
    }

    return accumulator;
}