/**
 * Created by Rogier on 13/04/2017.
 */
import * as is from 'is_js';
import each from './each';
import iterator from './iterator';
import { Collection } from './types';

export default function reduce<T>(collection: Collection<T>, iteratee: (accumulator, value, key, collection) => any, accumulator?: any, from: any|number = 0, to?: any|number): any
{
    if(is.undefined(accumulator))
    {
        accumulator = iterator(collection).next().value[1];
        from        = 1;
    }

    each(collection, (value, key, coll) => accumulator = iteratee(accumulator, value, key, coll), from, to);

    return accumulator;
}
