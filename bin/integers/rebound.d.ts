/**
 * Rebounds an integer between 2 values (min: inclusive, max: exclusive). Like the bounds of a continuous array.
 * Note this function uses currying: rebound(4)(-5, 7)
 *
 * @param index - (Overflowing) index value.
 *
 * @returns Range function which in turn returns the rebounded index.
 */
export default function rebound(index: number): (min: number, max: number) => number;
