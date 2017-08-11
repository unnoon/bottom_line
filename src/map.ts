/**
 * Created by Rogier on 13/04/2017.
 */
import mapG from './generators/map';
import { Collection } from './types';

export default function map<T>(collection: Collection<T>, iteratee: (value, key, collection) => any, from?: any|number, to?: any|number): any
{
    return Array.from(mapG(collection, iteratee, from, to));
}
