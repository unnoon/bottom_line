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
/* tslint:disable-next-line:ban-types */
export default function negate(fn: Function): Function
{
    return function(...args)
    {
        return !fn.apply(this, args);
    };
}
