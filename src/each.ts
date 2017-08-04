/**
 * Created by Rogier on 13/04/2017.
 */
import iterator from './iterator';
import { Collection } from './types';

export default function each<T>(collection: Collection<T>, iteratee: (value, key, collection) => any|boolean, from: any|number = 0, to?: any|number): Collection<T>
{
    const iter = iterator(collection);
    let i      = 0;
    let yields = iter.next();
    let kvp    = yields.value; // key-value-pair

    /* tslint:disable-next-line:no-empty */
    for(;!(yields.done || i === from || kvp[0] === from); i++, yields = iter.next(), kvp = yields.value) {} // fast forward to from

    for(;!(yields.done || i === to   || kvp[0] === to);   i++, yields = iter.next(), kvp = yields.value)
    {
        if(iteratee(kvp[1], kvp[0], collection) === false) { break; } // break loop if 'false' is returned by iteratee
    }

    return collection;
}
