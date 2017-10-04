import leftOf from './leftOf';
import rightOf from './rightOf';
/**
 * Returns the string between a prefix && post substring
 * @public
 * @method str#between
 * @param   {Sequence} seq  - substring to identify the return string
 * @param   {string} prefix  - substring to identify the return string
 * @param   {string} postfix - substring to identify the return string
 *
 * @returns {string}             - new string containing the string before the given substring
 */
// TODO handle non existence of pre or post substr
export default function between(seq, prefix, postfix) {
    return leftOf(rightOf(seq, prefix), postfix);
}
//# sourceMappingURL=between.js.map