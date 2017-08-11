/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import is from './is';
import iterator from './iterator';
import { Collection } from './types';

export default function reduce<T>(collection: Collection<T>, iteratee: (accumulator, value, key, collection) => any, accumulator?: any, from?: any|number, to?: any|number): any
{
    const it = iterator(collection);

    accumulator = is.undefined(accumulator) && is.not.empty(collection) ? it.next().value[1] : accumulator;

    for(const [key, value] of enumerate(it, from, to))
    {
        accumulator = iteratee(accumulator, value, key, collection);
    }

    return accumulator;
}

// export default function* reduce<T>(collection: Collection<T>, iteratee: (accumulator, value, key, collection) => any, accumulator?: any, from?: any|number, to?: any|number): any
// {
//     const iter  = iterator(collection);
//
//     accumulator = is.undefined(accumulator) ? iter.next().value[1] : accumulator;
//
//     each(iter, (value, key, coll) => accumulator = iteratee(accumulator, value, key, coll), from, to);
//
//     yield accumulator;
// }

