/**
 * Created by Rogier on 13/04/2017.
 */
import reduce from '../collections/reduce';
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
export default function rightOfLast(sequence, ...subs) {
    const output = reduce(subs, (out, sub) => {
        const index = out.lastIndexOf(sub);
        return ~index ? out.slice(index + (typeof (sub) === 'string' ? sub.length : 1)) : out;
    }, sequence);
    return output === sequence ? sequence.slice() : output; // copy in case nothing changed.
}
//# sourceMappingURL=rightOfLast.js.map