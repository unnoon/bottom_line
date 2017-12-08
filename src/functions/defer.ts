/**
 * Created by Rogier on 13/04/2017.
 */

/**
 * Defers a function call to the end of the stack.
 *
 * @param fn - Function to defer.
 *
 * @returns Identifier to be used by cancelDelay.
 */
/* tslint:disable-next-line:ban-types */
export default function defer(fn: Function): number
{
    return setTimeout(fn, 0)
}
