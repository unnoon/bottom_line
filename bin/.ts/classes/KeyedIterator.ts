/**
 * Created by Rogier on 05/05/2017.
 */
import * as identity  from '../lang/identity';
import { Collection } from '../types';

/**
 * Keyed iterator. Utilizes the entries method if available, otherwise uses Symbol.iterator or the identity iterator.
 */
export default class KeyedIterator<T>
{
    /**
     * Creates a new KeyedIterator avoiding ugly new key words.
     *
     * @param collection - The collection to create a KeyedIterator for.
     *
     * @returns new KeyedIterator.
     */
    public static create<T>(collection: Collection<T>)
    {
        return new KeyedIterator(collection);
    }

    public it;

    public [Symbol.toStringTag] = 'Keyed Iterator';

    /**
     * Creates a new KeyedIterator.
     *
     * @param collection - The collection to create a KeyedIterator for.
     *
     * @returns new KeyedIterator.
     */
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

    /**
     * Returns the next item in the iterator
     *
     * @returns The next value object.
     */
    public next(): {value: [any, T], done: boolean}
    {
        return this.it.next();
    }

    /**
     * Makes sure the iterator is iterable.
     *
     * @returns The KeyedIterator
     */
    public [Symbol.iterator](): KeyedIterator<T>
    {
        return this
    }
}
