/**
 * Created by Rogier on 05/05/2017.
 */
import * as identity from '../lang/identity';
/**
 * Property descriptor with handy extra utilities.
 */
export default class KeyedIterator {
    static create(collection) {
        return new KeyedIterator(collection);
    }
    constructor(collection) {
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
    next() {
        return this.it.next();
    }
    return() {
        return this.it.return();
    }
    throw() {
        return this.it.throw();
    }
    [Symbol.iterator]() {
        return this;
    }
}
//# sourceMappingURL=KeyedIterator.js.map