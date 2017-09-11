/**
 * Created by Rogier on 13/04/2017.
 */
import * as is from '../lang/is';
import enumerate from './generators/enumerate';
import keyedIterator from './keyedIterator';
/**
 * Reduce a collection by running each value through iteratee.
 * The iteratee is invoked with three arguments: (accumulator, value, key, collection).
 * Optionally a from & to key can be provided for partial reduction.
 *
 * @param collection  - Collection to enumerate.
 * @param iteratee    - Iteratee invoked on each item..
 * @param accumulator - Optional initial accumulator. If omitted the first value will be taken as the accumulator.
 * @param from        - Key to start reducing.
 * @param to          - Key (exclusive) to stop reducing.
 *
 * @returns The reduced value.
 */
export default function reduce(collection, iteratee, accumulator, from, to) {
    const it = keyedIterator(collection);
    accumulator = is.undefined(accumulator) && is.not.empty(collection) ? it.next().value[1] : accumulator;
    for (const [key, value] of enumerate(it, from, to)) {
        accumulator = iteratee(accumulator, value, key, collection);
    }
    return accumulator;
}
