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
    static of(x) {
        return new Value(x);
    }
    /**
     * @param x - The value to be wrapped in Value.
     */
    constructor(x) {
        this.__value = x;
    }
    /**
     * Returns The container value.
     */
    valueOf() {
        return this.__value;
    }
}
//# sourceMappingURL=Value.js.map