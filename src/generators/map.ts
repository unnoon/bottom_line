/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../types';
import enumerate from './enumerate';

export default function* map<T>(collection: Collection<T>, iteratee: (value, key, collection) => any, from?: any|number, to?: any|number): any
{
    for(const [key, value] of enumerate(collection, from, to))
    {
        yield iteratee(value, key, collection);
    }
}
