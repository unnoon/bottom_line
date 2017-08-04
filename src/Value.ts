/**
 * Created by Rogier on 13/04/2017.
 */

/**
 * @class Value
 * @desc
 *        Wraps/tags function as a value. Helpful to distinguish between a callback and a function value.
 */
export default class Value
{
    /**
     * @method Value.of
     * @desc   Static 'constructor' sidestepping ugly 'new' keywords.
     *
     * @param {function} x - The function to be wrapped as value.
     *
     * @returns {Value}
     */
    public static of(x)
    {
        return new Value(x);
    }

    public __value: any;

    /**
     * @constructor Value
     *
     * @param {function} x - The function to be wrapped as value.
     *
     * @returns {Value}
     */
    public constructor(x)
    {
        this.__value = x;
    }

    /**
     * @method Value#valueOf
     * @desc
     *         Returns the container value.
     *
     * @returns {any}
     */
    public valueOf()
    {
        return this.__value;
    }
}
