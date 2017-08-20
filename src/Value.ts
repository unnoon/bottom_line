/**
 * Created by Rogier on 13/04/2017.
 */

/**
 * @class Value
 * @desc
 *        Value container to distinguish between special attributes such as callbacks or values.
 */
export default class Value
{
    /**
     * @method Value.of
     * @desc   Static 'constructor' sidestepping ugly 'new' keywords.
     *
     * @param {function} x - The value to be wrapped in Value.
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
     * @param {function} x - The value to be wrapped in Value.
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
