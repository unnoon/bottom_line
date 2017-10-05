import { Collection } from '../types';
/**
 * Keyed iterator. Utilizes the entries method if available, otherwise uses Symbol.iterator or the identity iterator.
 */
export default class KeyedIterator<T> {
    /**
     * Creates a new KeyedIterator avoiding ugly new key words.
     *
     * @param collection - The collection to create a KeyedIterator for.
     *
     * @returns new KeyedIterator.
     */
    static create<T>(collection: Collection<T>): KeyedIterator<{}>;
    it: any;
    /**
     * Creates a new KeyedIterator.
     *
     * @param collection - The collection to create a KeyedIterator for.
     *
     * @returns new KeyedIterator.
     */
    constructor(collection: any);
    /**
     * Returns the next item in the iterator
     *
     * @param substitute - Value to be substituted for the last yield.
     *
     * @returns The next value object.
     */
    next(substitute?: T): {
        value: [any, T];
        done: boolean;
    };
    /**
     * Finishes the iterator and returns the value
     *
     * @param value - The value to return.
     *
     * @returns The value supplied.
     */
    return(value?: T): {
        value: [any, T];
        done: true;
    };
    throw<E extends Error>(exception: E): {
        value: [any, T];
        done: boolean;
    };
    /**
     * Makes sure the iterator is iterable.
     *
     * @returns The KeyedIterator
     */
    [Symbol.iterator](): KeyedIterator<T>;
}
