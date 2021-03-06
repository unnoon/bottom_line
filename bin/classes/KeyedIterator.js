/**
 * Created by Rogier on 05/05/2017.
 */
import * as identity from '../lang/identity';
/**
 * Keyed iterator. Utilizes the entries method if available, otherwise uses Symbol.iterator or the identity iterator.
 */
export default class KeyedIterator {
    /**
     * Creates a new KeyedIterator.
     *
     * @param collection - The collection to create a KeyedIterator for.
     *
     * @returns new KeyedIterator.
     */
    constructor(collection) {
        this[Symbol.toStringTag] = 'Keyed Iterator';
        if (collection instanceof KeyedIterator) {
            return collection;
        }
        if (collection[Symbol.iterator] && collection.entries) {
            this.it = collection.entries();
        }
        else {
            this.it = (function* () {
                const it = (collection[Symbol.iterator] || identity.iterator).call(collection);
                let i = 0;
                let yields = it.next();
                switch (true) {
                    case !!collection[Symbol.iterator]:
                        for (; !yields.done; yields = it.next(), i++) {
                            yield [i, yields.value];
                        }
                        break;
                    default:
                        for (; !yields.done; yields = it.next()) {
                            yield yields.value;
                        }
                        break;
                }
            })();
        }
    }
    /**
     * Creates a new KeyedIterator avoiding ugly new key words.
     *
     * @param collection - The collection to create a KeyedIterator for.
     *
     * @returns new KeyedIterator.
     */
    static create(collection) {
        return new KeyedIterator(collection);
    }
    /**
     * Returns the next item in the iterator
     *
     * @returns The next value object.
     */
    next() {
        return this.it.next();
    }
    /**
     * Makes sure the iterator is iterable.
     *
     * @returns The KeyedIterator
     */
    [Symbol.iterator]() {
        return this;
    }
}
//# sourceMappingURL=KeyedIterator.js.map