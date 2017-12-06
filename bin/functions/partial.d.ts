/**
 * Return a function with partial default arguments.
 *
 * @param fn       - Function to partialize.
 * @param partials - Array containing default argument values. Use 'undefined' for blanks.
 *
 * @returns The partial function.
 */
export default function partial(fn: Function, partials: any[]): Function;
