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
    [Symbol.toStringTag]: string;
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
     * @returns The next value object.
     */
    next(): {
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
