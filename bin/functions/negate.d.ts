/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * Return a function with negated output of the original function.
 *
 * @param fn - Function to negate.
 *
 * @returns The negated function.
 */
export default function negate(fn: Function): (...args: any[]) => boolean;
