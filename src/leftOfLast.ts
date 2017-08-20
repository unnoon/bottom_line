/**
 * Created by Rogier on 13/04/2017.
 */

import reduce from './reduce';
import { Sequence } from './types';

/**
 * @function leftOfLast
 * @desc
 *       Returns the left of a sequence from each last sub(element/string) index.
 *       The original sequence is left unmodified.
 *       In case the sub is not found, the entire string is returned.
 *       Arrays are only checked on a sub-element basis.
 *
 * @param {string | any[]} sequence - The sequence.
 * @param {string | any}   subs     - One or multiple subs.
 *
 * @returns {string | any[]} - The sub-sequence left of each found sub(element/string) index.
 */
export default function leftOfLast(sequence: Sequence, ...subs: Array<string|any>): Sequence
{
    const output = reduce(subs, (out, sub) =>
    {
        const index: number = out.lastIndexOf(sub);
        return ~index ? out.slice(0, index) : out;
    }, sequence);

    return output === sequence ? sequence.slice() : output; // copy
}
