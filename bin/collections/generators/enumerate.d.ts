import { Collection } from '../../types';
/**
 * @generator
 * Enumerates any collection using a generic keyedIterator that returns a (artificial) key value pair.
 * Optionally a from & to key can be provided for partial enumeration.
 *
 * @param collection - Collection to enumerate.
 * @param from       - From key to start enumeration.
 * @param to         - To key (exclusive) to stop enumeration.
 *
 * @yields {[any, any]} - Array containing key & value.
 */
export default function enumerate<T>(collection: Collection<T>, from?: any, to?: any): IterableIterator<[any, any]>;
