/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../types';
import mapG from './generators/map';

/**
 * Runs each value through iteratee. The iteratee is invoked with three arguments: (value, key, collection).
 * Optionally a from & to key can be provided for partial mapping.
 * All values are mapped into an array.
 *
 * @param collection - Collection to enumerate.
 * @param iteratee   - Function that maps each value.
 * @param from       - Key to start mapping.
 * @param to         - Key (exclusive) to stop mapping.
 *
 * @returns Array with mapped values.
 */
export default function map<T>(collection: Collection<T>, iteratee: (value, key, collection: Collection<T>) => any, from?, to?): any[]
{
    return Array.from(mapG(collection, iteratee, from, to));
}
