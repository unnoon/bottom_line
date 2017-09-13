/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * Value container that marks special objects such as uncloneables as pass through values.
 */
export default class Value {
    /**
     * Static 'constructor' sidestepping ugly 'new' keywords.
     *
     * @param x - The value to be wrapped in Value.
     *
     * @returns A new Value container containing x.
     */
    static of(x: any): Value;
    /**
     * Stores the Value container value.
     */
    private __value;
    /**
     * @param x - The value to be wrapped in Value.
     */
    constructor(x: any);
    /**
     * Returns The container value.
     */
    valueOf(): any;
}
