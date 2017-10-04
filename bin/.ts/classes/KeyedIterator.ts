/**
 * Created by Rogier on 05/05/2017.
 */
import * as identity from '../lang/identity';

/**
 * Property descriptor with handy extra utilities.
 */
export default class KeyedIterator
{
    public static create(collection)
    {
        return new KeyedIterator(collection);
    }

    public it;

    constructor(collection)
    {
        if(collection instanceof KeyedIterator) {return collection}

        if(collection[Symbol.iterator] && collection.entries)
        {
            this.it = collection.entries();
        }
        else
        {
            this.it = (function*()
            {
                const it = (collection[Symbol.iterator] || identity.iterator).call(collection);

                let i      = 0;
                let yields = it.next();

                switch(true)
                {
                    case !!collection[Symbol.iterator] : for(;!yields.done; yields = it.next(), i++) {yield [i, yields.value] as [number, any]} break;
                    default                            : for(;!yields.done; yields = it.next())      {yield yields.value      as [any, any]}    break;
                }
            })();
        }
    }

    public next()
    {
        return this.it.next();
    }

    public return()
    {
        return this.it.return();
    }

    public throw()
    {
        return this.it.throw();
    }

    [Symbol.iterator]()
    {
        return this
    }
}
