/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../types';
/**
 * Filters a collection based on a filter function.
 * Optionally a from & to key can be provided for partial filtering.
 *
 * @generator
 *
 * @param collection - Collection to filter.
 * @param iteratee   - Filter function.
 * @param from       - Key to start filtering.
 * @param to         - Key (exclusive) to stop filtering.
 *
 * @returns Array containing filtered values.
 */
export default function filter<T>(collection: Collection<T>, iteratee: (value, key, collection: Collection<T>) => boolean, from?: any, to?: any): any[];
