import enumerate from './generators/enumerate';
/**
 * Returns the key of a given value. Optionally a from & to key can be provided.
 *
 * @param collection - Collection to search the value.
 * @param value      - Value to find the key for.
 * @param from       - Key to start search.
 * @param to         - Key (exclusive) to stop search.
 *
 * @returns The key of the found value or undefined otherwise.
 */
export default function keyOf(collection, value, from, to) {
    for (const [key, val] of enumerate(collection, from, to)) {
        if (val === value) {
            return key;
        }
    }
}
//# sourceMappingURL=keyOf.js.map