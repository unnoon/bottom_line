/**
 * Created by Rogier on 13/04/2017.
 */
import reduce       from '../collections/reduce';
import is           from '../lang/is';
import { Sequence } from '../types';

/**
 * Returns the right of a sequence from each sub(element/string) index.
 * The original sequence is left unmodified.
 * In case the sub is not found, the entire sequence is returned.
 * Arrays are only checked on a sub-element basis (using indexOf).
 *
 * @param sequence - The sequence.
 * @param subs     - One or multiple subs.
 *
 * @returns The sub-sequence right of each found sub(element/string) index.
 */
export default function rightOf<T>(sequence: Sequence<T>, ...subs: T[]): Sequence<T>
{
    const output = reduce(subs, (out, sub) =>
    {
        const index = out.indexOf(sub);
        return ~index ? out.slice(index + (is.string(sub) ? sub.length : 1)) : out;
    }, sequence);

    return output === sequence ? sequence.slice() : output; // copy
}
