import { Collection } from '../types';
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
export default function reduce<T>(collection: Collection<T>, iteratee: (accumulator, value, key, collection: Collection<T>) => any, accumulator?: any, from?: any, to?: any): any;
