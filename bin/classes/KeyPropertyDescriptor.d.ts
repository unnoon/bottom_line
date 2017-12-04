import { Class, Prototype } from '../types';
/**
 * Property descriptor with handy extra utilities.
 */
export default class KeyPropertyDescriptor<T> {
    enumerable: boolean;
    configurable: boolean;
    writable?: boolean;
    value?: T;
    get?: () => T;
    set?: (v: T) => T;
    needsAccessorTarget: boolean;
    private _key?;
    /**
     * Accessor for retrieving or setting a property key.
     *
     * @param key - Key to set.
     *
     * @returns {string | symbol}
     */
    key(): string | symbol;
    key(key: string | symbol): KeyPropertyDescriptor<T>;
    /**
     * Returns a groomed clone or assigns an existing descriptor.
     *
     * @param descriptor - An existing descriptor that is assigned to the KeyPropertyDescriptor.
     *
     * @returns Groomed KeyPropertyDescriptor clone.
     */
    descriptor(): KeyPropertyDescriptor<T>;
    descriptor(dsc: TypedPropertyDescriptor<T>): KeyPropertyDescriptor<T>;
    /**
     * Grooms the current descriptor into a valid descriptor.
     *
     * @returns This for chaining.
     */
    groom(): KeyPropertyDescriptor<T>;
    /**
     * Easy onaccess wrapper. Value is piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed last.
     *
     * @param fn - Function that is executed on access.
     *
     * @returns This for chaining.
     */
    onaccess(fn: (v: T) => T): KeyPropertyDescriptor<T>;
    /**
     * Easy onupdate wrapper. Value is piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed first.
     *
     * @param fn - Function that is executed on update.
     *
     * @returns This for chaining.
     */
    onupdate(fn: (v: T) => T): KeyPropertyDescriptor<T>;
    /**
     * Easy onexecute wrapper. Args are piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed last.
     *
     * @param fn - Function that is executed on execution.
     *
     * @returns This for chaining.
     */
    onexecute(fn: T): KeyPropertyDescriptor<T>;
    /**
     * Defines a instance or static property (so no methods).
     *
     * @param target - Target for the property. a Class in case of static properties or Prototype in case of instance properties.
     */
    defineProperty(target: Class<any> | Prototype<any>): void;
    private identityGetter();
    private identitySetter();
}
