/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import { Collection } from './types';

export default function each<T>(collection: Collection<T>, iteratee: (value, key, collection) => any|boolean, from?: any|number, to?: any|number): Collection<T>
{
    for(const [key, value] of enumerate(collection, from, to))
    {
        if(iteratee(value, key, collection) === false) { break; } // break loop if 'false' is returned by iteratee
    }

    return collection;
}
