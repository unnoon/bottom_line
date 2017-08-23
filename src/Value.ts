/**
 * Created by Rogier on 13/04/2017.
 */

/**
 * Value container that marks special objects such as uncloneables as pass through values.
 */
export default class Value
{
    /**
     * Static 'constructor' sidestepping ugly 'new' keywords.
     *
     * @param x - The value to be wrapped in Value.
     *
     * @returns A new Value Container containing x.
     */
    public static of(x): Value
    {
        return new Value(x);
    }

    /**
     * Stores the Value container value.
     */
    private __value;

    /**
     * @param x - The value to be wrapped in Value.
     */
    public constructor(x)
    {
        this.__value = x;
    }

    /**
     * Returns the container value.
     */
    public valueOf(): any
    {
        return this.__value;
    }
}
