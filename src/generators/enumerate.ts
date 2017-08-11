/**
 * Created by Rogier on 13/04/2017.
 */
import is from '../is';
import iterator from '../iterator';
import { Collection } from '../types';

export default function* enumerate<T>(collection: Collection<T>, from?: any|number, to?: any|number): any
{
    const iter = iterator(collection);
    let yields = iter.next();
    let kvp = yields.value; // key-value-pair

    from = is.undefined(from) && kvp ? kvp[0] : from;

    /* tslint:disable-next-line:no-empty */
    for(;!yields.done && kvp[0] !== from; yields = iter.next(), kvp = yields.value) {} // fast forward to from

    for(;!yields.done && kvp[0] !== to;   yields = iter.next(), kvp = yields.value)
    {
        yield kvp;
    }
}
