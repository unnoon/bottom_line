import enumerate from './generators/enumerate';
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
export default function indexOf(collection, value, from, to) {
    let index = from || 0;
    for (const [key, val] of enumerate(collection, from, to)) {
        if (val === value) {
            return index;
        }
        index++;
    }
    return -1;
}
//# sourceMappingURL=indexOf.js.map