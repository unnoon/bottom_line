/**
 * Property descriptor with handy extra utilities.
 */
export default class KeyedIterator {
    static create(collection: any): KeyedIterator;
    it: any;
    constructor(collection: any);
    next(): any;
    return(): any;
    throw(): any;
    [Symbol.iterator](): this;
}
