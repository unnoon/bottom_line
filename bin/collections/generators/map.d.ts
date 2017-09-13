/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../../types';
/**
 * @generator
 * Runs each value through iteratee. The iteratee is invoked with three arguments: (value, key, collection).
 * Optionally a from & to key can be provided for partial mapping.
 *
 * @param collection - Collection to enumerate.
 * @param iteratee   - Function that maps each value.
 * @param from       - Key to start mapping.
 * @param to         - Key (exclusive) to stop mapping.
 *
 * @yields {any} - Mapped value.
 */
export default function map<T>(collection: Collection<T>, iteratee: (value, key, collection: Collection<T>) => any, from?: any, to?: any): IterableIterator<any>;
