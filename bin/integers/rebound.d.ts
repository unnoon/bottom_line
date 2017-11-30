/**
 * Rebounds an integer between 2 values (min: inclusive, max: exclusive). Like the bounds of a continuous array.
 *
 * @param index - (Overflowing) index value.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (exclusive).
 *
 * @returns Range function which in turn returns the rebounded index.
 */
export default function rebound(index: number, min: number, max: number): number;
