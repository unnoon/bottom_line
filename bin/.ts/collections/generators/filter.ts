/**
 * Created by Rogier on 13/04/2017.
 */
import { Collection } from '../../types';
import enumerate from './enumerate';

/**
 * Filters a collection based on a filter function.
 * Optionally a from & to key can be provided for partial filtering.
 *
 * @generator
 *
 * @param collection - Collection to filter.
 * @param iteratee   - Filter function.
 * @param from       - Key to start filtering.
 * @param to         - Key (exclusive) to stop filtering.
 *
 * @yields Filtered value.
 */
export default function* filter<T>(collection: Collection<T>, iteratee: (value, key, collection: Collection<T>) => boolean, from?, to?): IterableIterator<any>
{
    for(const [key, value] of enumerate(collection, from, to))
    {
        if(iteratee(value, key, collection)) {yield value}
    }
}
