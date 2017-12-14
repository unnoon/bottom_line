/**
 * Created by Rogier on 13/04/2017.
 */
import reduce from '../collections/reduce';
import is           from '../lang/is';
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
export default function rightOfLast<T>(sequence: Sequence<T>, ...subs: T[]): Sequence<T>
{
    const lastIndexOf = sequence['lastIndexOf'] || Array.prototype.indexOf;
    const slice       = sequence['slice']       || Array.prototype.slice;

    const output = reduce(subs, (out, sub) =>
    {
        const index = lastIndexOf.call(out, sub);

        return ~index ? slice.call(out, index + (is.string(sub) ? sub.length : 1)) : out;
    }, sequence);

    return output === sequence ? slice.call(sequence) : output // copy in case nothing changed.
}
