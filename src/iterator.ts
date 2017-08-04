/**
 * Created by Rogier on 13/04/2017.
 */
import * as is from 'is_js';
import identity from './identity';
import { Collection } from './types';

export default function iterator<T>(collection: Collection<T>)
{
    return (function*()
    {
        const iter = (collection[Symbol.iterator] || identity.iterator).call(collection);
        let i      = 0;
        let yields = iter.next();
        let kvp    = yields.value;

        for(;!yields.done; i++, yields = iter.next(), kvp = yields.value)
        {
            switch(true)
            {
                case    is.not.array(kvp) : yield [i, yields.value]; break;
                default                   : yield kvp;               break;
            }
        }
    })();
}
