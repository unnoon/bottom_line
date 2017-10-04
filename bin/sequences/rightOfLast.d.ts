import { Sequence } from '../types';
/**
 * Returns the right of a sequence from each last sub(element/string) index.
 * The original sequence is left unmodified.
 * In case the sub is not found, the entire sequence is returned.
 * Arrays are only checked on a sub-element basis (using lastIndexOf).
 *
 * @param sequence - The sequence.
 * @param subs     - One or multiple subs.
 *
 * @returns The sub-sequence right of each last found sub(element/string) index.
 */
export default function rightOfLast<T>(sequence: Sequence<T>, ...subs: T[]): Sequence<T>;
