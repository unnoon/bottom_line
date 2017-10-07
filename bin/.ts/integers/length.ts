/* tslint:disable:whitespace */
/**
 * Returns the length of an integer (or trunc of any number).
 *
 * @param int - Integer to measure the length of.
 *
 * @returns Length of the integer.
 */
export default function length(int: number): number
{
    int = int|0;

    return (int ? 1 + Math.log10(Math.abs(int)) : 1)|0;
}
