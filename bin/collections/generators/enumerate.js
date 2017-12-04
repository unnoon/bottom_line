/**
 * Created by Rogier on 13/04/2017.
 */
import KeyedIterator from '../../classes/KeyedIterator';
import is from '../../lang/is';
/**
 * Enumerates any collection using a generic keyedIterator that returns a (artificial) key value pair.
 * Optionally a from & to key can be provided for partial enumeration.
 *
 * @generator
 *
 * @param collection - Collection to enumerate.
 * @param from       - From key to start enumeration.
 * @param to         - To key (exclusive) to stop enumeration.
 *
 * @yields Array containing key & value [any, any].
 */
export default function* enumerate(collection, from, to) {
    const it = KeyedIterator.create(collection);
    let yields = it.next();
    let kvp = yields.value; // key-value-pair
    from = (is.undefined(from) && kvp) ? kvp[0] : from;
    /* tslint:disable-next-line:no-empty */
    for (; !yields.done && kvp[0] !== from; yields = it.next(), kvp = yields.value) { } // fast forward to from
    for (; !yields.done && kvp[0] !== to; yields = it.next(), kvp = yields.value) {
        yield kvp;
    }
}
//# sourceMappingURL=enumerate.js.map