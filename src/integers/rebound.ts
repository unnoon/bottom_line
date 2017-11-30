/* tslint:disable:whitespace */
/**
 * Rebounds an integer between 2 values (min: inclusive, max: exclusive). Like the bounds of a continuous array.
 *
 * @param index - (Overflowing) index value.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (exclusive).
 *
 * @returns Range function which in turn returns the rebounded index.
 */
export default function rebound(index: number, min: number, max: number): number
{
    index = index|0; min = min|0; max = (max - 1)|0;

    const range = max - min + 1;

    return (index > max
        ? min + (index - min) % range
        : max + (index - max) % range)|0
}
