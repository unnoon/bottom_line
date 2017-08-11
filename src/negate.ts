/**
 * Created by Rogier on 13/04/2017.
 */

/* tslint:disable-next-line:ban-types */
export default function negate(fn: Function): Function
{
    return function(...args)
    {
        return !fn.apply(this, args);
    };
}
