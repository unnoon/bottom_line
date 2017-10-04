/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../types';
/**
 * Counts the occurrences matched by the match function. (value, key, collection) => boolean
 * Optionally a from & to key can be provided for partial finds.
 *
 * @param collection - The collection to find elements from.
 * @param match      - Match function.
 * @param from       - Key to start finding.
 * @param to         - Key (exclusive) to stop finding.
 *
 * @returns The total number of occurrences as matched by the match function.
 */
export default function find<T>(collection: Collection<T>, match: (value: T, key, collection: Collection<T>) => boolean, from?: any, to?: any): any;
