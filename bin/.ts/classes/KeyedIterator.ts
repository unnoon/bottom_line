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
     * @param substitute - Value to be substituted for the last yield.
     *
     * @returns The next value object.
     */
    public next(substitute?: T): {value: [any, T], done: boolean}
    {
        return this.it.next(substitute);
    }

    /**
     * Finishes the iterator and returns the value
     *
     * @param value - The value to return.
     *
     * @returns The value supplied.
     */
    public return(value?: T): { value: [any, T], done: true }
    {
        return this.it.return(value);
    }

    public throw<E extends Error>(exception: E): { value: [any, T], done: boolean }
    {
        return this.it.throw(exception);
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
