/**
 * Created by Rogier on 13/04/2017.
 */
import reduce from '../collections/reduce';
/**
 * Returns the left of a sequence from each sub(element/string) index.
 * The original sequence is left unmodified.
 * In case the sub is not found, the entire sequence is returned.
 * Arrays are only checked on a sub-element basis.
 *
 * @param sequence - The sequence.
 * @param subs     - One or multiple subs.
 *
 * @returns The sub-sequence left of each found sub(element/string) index.
 */
export default function leftOf(sequence, ...subs) {
    const indexOf = sequence['indexOf'] || Array.prototype.indexOf;
    const slice = sequence['slice'] || Array.prototype.slice;
    const output = reduce(subs, (out, sub) => {
        const index = indexOf.call(out, sub);
        return ~index ? slice.call(out, 0, index) : out;
    }, sequence);
    return output === sequence ? slice.call(sequence) : output; // copy in case no sub is found
}
//# sourceMappingURL=leftOf.js.map