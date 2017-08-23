/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import { Collection } from './types';

/**
 * Returns the key of a given value. Optionally a from & to key can be provided.
 *
 * @param collection - Collection to search the value.
 * @param value      - Value to find the key for.
 * @param from       - Key to start search.
 * @param to         - Key (exclusive) to stop search.
 *
 * @returns {any} The key of he found value or undefined otherwise.
 */
export default function keyOf<T>(collection: Collection<T>, value, from?, to?): any
{
    for(const [key, val] of enumerate(collection, from, to))
    {
        if(val === value) {return key;}
    }
}
