/**
 * Created by Rogier on 13/04/2017.
 */
import reduce from '../collections/reduce';
import { Sequence } from '../types';

/**
 * Returns the left of a sequence from each last sub(element/string) index.
 * The original sequence is left unmodified.
 * In case the sub is not found, the entire sequence is returned.
 * Arrays are only checked on a sub-element basis (using lastIndexOf).
 *
 * @param sequence - The sequence.
 * @param subs     - One or multiple subs.
 *
 * @returns The sub-sequence left of each last found sub(element/string) index.
 */
export default function leftOfLast<T>(sequence: Sequence<T>, ...subs: T[]): Sequence<T>
{
    const lastIndexOf = sequence['lastIndexOf'] || Array.prototype.lastIndexOf;
    const slice       = sequence['slice']       || Array.prototype.slice;

    const output = reduce(subs, (out, sub) =>
    {
        const index: number = lastIndexOf.call(out, sub);

        return ~index ? slice.call(out, 0, index) : out;
    }, sequence);

    return output === sequence ? slice.call(sequence) : output // copy in case nothing changed.
}
