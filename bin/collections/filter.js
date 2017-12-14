import filterG from './generators/filter';
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
export default function filter(collection, iteratee, from, to) {
    return Array.from(filterG(collection, iteratee, from, to));
}
//# sourceMappingURL=filter.js.map