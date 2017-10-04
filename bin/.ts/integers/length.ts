/**
 * Returns the length of an integer
 *
 * @public
 * @method int.length
 *
 * @param {number} int - integer to measure the length
 *
 * @returns {number} - length of the integer
 */
export default function length(int)
{
    return int ? 1 + Math.log10(int) | 0 : 1;
}
