/**
 * Created by Rogier on 13/04/2017.
 */
import * as is from '../is';
import keyedIterator from '../keyedIterator';
import { Collection } from '../types';

/**
 * @generator
 * Enumerates any collection using a generic keyedIterator that returns a (artificial) key value pair.
 * Optionally a from & to key can be provided for partial enumeration.
 *
 * @param collection - Collection to enumerate.
 * @param from       - From key to start enumeration.
 * @param to         - To key (exclusive) to stop enumeration.
 *
 * @yields {[any, any]} - Array containing key & value.
 */
export default function* enumerate<T>(collection: Collection<T>, from?, to?): Iterable<[any, any]>
{
    const it = keyedIterator(collection);

    let yields = it.next();
    let kvp: [any, any] = yields.value; // key-value-pair

    from = is.undefined(from) && kvp ? kvp[0] : from;

    /* tslint:disable-next-line:no-empty */
    for(;!yields.done && kvp[0] !== from; yields = it.next(), kvp = yields.value) {} // fast forward to from

    for(;!yields.done && kvp[0] !== to;   yields = it.next(), kvp = yields.value)
    {
        yield kvp;
    }
}