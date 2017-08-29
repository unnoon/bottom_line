/**
 * Created by Rogier on 13/04/2017.
 */
import reduce from './reduce';
/**
 * Counts the occurrences matched by the match function. (value, key, collection) => boolean
 * Optionally a from & to key can be provided for partial counts.
 *
 * @param collection - The collection to count elements from.
 * @param match      - Match function.
 * @param from       - Key to start counting.
 * @param to         - Key (exclusive) to stop counting.
 *
 * @returns The total number of occurrences as matched by the match function.
 */
export default function count(collection, match, from, to) {
    return reduce(collection, (accumulator, value, key, coll) => accumulator + (match(value, key, coll) ? 1 : 0), 0, from, to);
}
