/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../types';
/**
 * Returns the (artificial) index of a given value. Optionally a from & to key can be provided.
 *
 * @param collection - Collection to search the value.
 * @param value      - Value to find the key for.
 * @param from       - Key to start search.
 * @param to         - Key (exclusive) to stop search.
 *
 * @returns The index of the found value or -1 otherwise.
 */
export default function indexOf<T>(collection: Collection<T>, value: any, from?: any, to?: any): number;
