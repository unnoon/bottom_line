import enumerate from './enumerate';
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
 * @yields Filtered value.
 */
export default function* filter(collection, iteratee, from, to) {
    for (const [key, value] of enumerate(collection, from, to)) {
        if (iteratee(value, key, collection)) {
            yield value;
        }
    }
}
//# sourceMappingURL=filter.js.map