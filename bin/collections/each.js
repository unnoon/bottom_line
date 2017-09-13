import enumerate from './generators/enumerate';
/**
 * Invokes iteratee for every item in a collection.
 * Iteration can be broken by letting the iteratee return false.
 * Optionally a from & to key can be provided for partial iteration.
 *
 * @param collection - The collection to iterate over.
 * @param iteratee   - The iteratee that is invoked on every item. Returning false will break iteration.
 * @param from       - Key to start iteration.
 * @param to         - Key (exclusive) to stop iteration.
 *
 * @returns The iterated collection.
 */
export default function each(collection, iteratee, from, to) {
    for (const [key, value] of enumerate(collection, from, to)) {
        if (iteratee(value, key, collection) === false) {
            break;
        } // break loop if 'false' is returned by iteratee
    }
    return collection;
}
//# sourceMappingURL=each.js.map