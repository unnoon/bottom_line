import { Collection } from '../types';
/**
 * Returns a keyed iterator given any collection. In case no key exists an artificial key is provided.
 *
 * @param collection - Collection to get a keyedIterator for.
 *
 * @returns The generic keyed iterable iterator.
 */
export default function keyedIterator<T>(collection: Collection<T>): IterableIterator<[any, any]>;
