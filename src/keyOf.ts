/**
 * Created by Rogier on 13/04/2017.
 */
import enumerate from './generators/enumerate';
import { Collection } from './types';

export default function keyOf<T>(collection: Collection<T>, value: any, from?: any|number, to?: any|number): any
{
    for(const [key, val] of enumerate(collection, from, to))
    {
        if(val === value) {return key;}
    }
}
