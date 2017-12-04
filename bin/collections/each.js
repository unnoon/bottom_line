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
 * @returns Boolean indicating if iteration was UN-broken. Handy for breaking nested each loops.
 */
export default function each(collection, iteratee, from, to) {
    for (const [key, value] of enumerate(collection, from, to)) {
        if (iteratee(value, key, collection) === false) {
            return false;
        } // break loop if 'false' is returned by iteratee
    }
    return true;
}
//# sourceMappingURL=each.js.map