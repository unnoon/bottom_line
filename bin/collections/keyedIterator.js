/**
 * Created by Rogier on 13/04/2017.
 */
import * as identity from '../lang/identity';
import * as is from '../lang/is';
/**
 * Returns a keyed iterator given any collection. In case no key exists an artificial key is provided.
 *
 * @param collection - Collection to get a keyedIterator for.
 *
 * @returns The generic keyed iterable iterator.
 */
export default function keyedIterator(collection) {
    return (function* () {
        const iter = (collection[Symbol.iterator] || identity.iterator).call(collection);
        let i = 0;
        let yields = iter.next();
        switch (true) {
            case is.not.array(yields.value):
                for (; !yields.done; yields = iter.next(), i++) {
                    yield [i, yields.value];
                }
                break;
            default:
                for (; !yields.done; yields = iter.next()) {
                    yield yields.value;
                }
                break;
        }
    })();
}
//# sourceMappingURL=keyedIterator.js.map