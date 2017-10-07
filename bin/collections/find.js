import enumerate from './generators/enumerate';
/**
 * Returns the first value in a collection matched by the match function.
 *
 * @param collection - The collection to search through.
 * @param match      - The match function.
 * @param from       - Key to start searching.
 * @param to         - Key (exclusive) to stop searching.
 *
 * @returns The found value or undefined otherwise.
 */
export default function find(collection, match, from, to) {
    for (const [key, value] of enumerate(collection, from, to)) {
        if (match(value, key, collection)) {
            return value;
        }
    }
}
//# sourceMappingURL=find.js.map