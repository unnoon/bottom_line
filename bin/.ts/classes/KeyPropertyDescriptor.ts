/**
 * Created by Rogier on 05/05/2017.
 */
import * as is from '../lang/is';
import { clone, flow } from 'lodash';
import { Class, Prototype } from '../types';

/**
 * Property descriptor with handy extra utilities.
 */
export class KeyPropertyDescriptor<T>
{
    public enumerable:   boolean = false;
    public configurable: boolean = false;
    public writable?:    boolean = false;
    // tslint:disable-next-line:ban-types
    public value?:       T;
    public get?:         () => T;
    public set?:         (v: T) => T;

    public needsAccessorTarget: boolean = false;
    
    private _key?:  string|symbol;

    /**
     * Accessor for retrieving or setting a property key.
     *
     * @param key - Key to set.
     *
     * @returns {string | symbol}
     */
    public key():                    string|symbol;
    public key(key:  string|symbol): KeyPropertyDescriptor<T>;
    public key(key?: string|symbol): string|symbol|KeyPropertyDescriptor<T>
    {
        if(key === undefined) {return this._key;}
        else                  {return this._key = key, this;}
    }

    /**
     * Returns a groomed clone or assigns an existing descriptor.
     *
     * @param descriptor - An existing descriptor that is assigned to the KeyPropertyDescriptor.
     *
     * @returns Groomed KeyPropertyDescriptor clone.
     */
    public descriptor():                                 KeyPropertyDescriptor<T>;
    public descriptor(dsc: TypedPropertyDescriptor<T>):  KeyPropertyDescriptor<T>;
    public descriptor(dsc?: TypedPropertyDescriptor<T>): KeyPropertyDescriptor<T>
    {
        if(dsc === undefined) {return clone(this).groom();}
        else                  {return Object.assign(this, dsc);}
    }

    /**
     * Grooms the current descriptor into a valid descriptor.
     *
     * @returns This for chaining.
     */
    public groom(): KeyPropertyDescriptor<T>
    {
        if(!!this.get || !!this.set) // accessor
        {
            delete this.writable;
            delete this.value;
        }
        else
        {
            this.value = undefined ? null : this.value;
        }

        return this;
    }

    /**
     * Easy onaccess wrapper. Value is piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed last.
     *
     * @param fn - Function that is executed on access.
     *
     * @returns This for chaining.
     */
    // tslint:disable-next-line:ban-types
    public onaccess(fn: Function): KeyPropertyDescriptor<T> // value is piped thru using flow
    {
        this.get = flow(this.get || this.identityGetter(), fn);
        this.set = this.set || this.identitySetter();

        return this;
    }

    /**
     * Easy onupdate wrapper. Value is piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed first.
     *
     * @param fn - Function that is executed on update.
     *
     * @returns This for chaining.
     */
    public onupdate(fn: (v: T) => T): KeyPropertyDescriptor<T>
    {
        this.set = flow(fn, this.set || this.identitySetter());
        this.get = this.get || this.identityGetter();

        return this;
    }
    /**
     * Easy onexecute wrapper. Args are piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed last.
     *
     * @param fn - Function that is executed on execution.
     *
     * @returns This for chaining.
     */
    // tslint:disable-next-line:ban-types
    public onexecute(fn: Function): KeyPropertyDescriptor<T>
    {
        // TODO this is super ugly
        // tslint:disable-next-line:ban-types
        this.value = flow(this.value as any as Function, fn) as any as T; // wrap functions

        return this;
    }

    /**
     * Defines a instance or static property (so no methods).
     *
     * @param target - Target for the property. a Class in case of static properties or Prototype in case of instance properties.
     */
    public defineProperty(target: Class<any>|Prototype<any>)
    {
        const descriptor        = this.descriptor();
        const accessor: boolean = !!this.get || !!this.set;
        const writable: boolean = this.writable;
        const value             = this.value;
        const key               = this.key();

        if(target instanceof Function) // static
        {
            if(descriptor.needsAccessorTarget) {Object.defineProperty(target, `_${key}`, {value, writable});}

            Object.defineProperty(target, key, descriptor);
        }
        else // instance
        {
            Reflect.defineMetadata('design:descriptor', this, target, key); // define meta descriptor since there is no other place to store it

            Object.defineProperty(target, key, {
                set(val: T)
                {
                    if(!accessor)                      {descriptor.value = val;} // add value to current descriptor
                    if(descriptor.needsAccessorTarget) {Object.defineProperty(this, `_${key}`, {value: val, writable});} // define private property to hold val

                    Object.defineProperty(this, key, descriptor);

                    return this[key];
                },
                get()
                {
                    if(descriptor.needsAccessorTarget) {Object.defineProperty(this, `_${key}`, {value, writable});} // define private property to hold value

                    Object.defineProperty(this, key, descriptor);

                    return this[key];
                },
                configurable: true,
            });
        }
    }

    // TODO check if we should create a hidden value instead of an underscore prefixed property key.
    private identityGetter(): () => T
    {
        if(!this._key)           {throw new Error(`Identity getter can't be initialized without a property key.`);}
        if(is.symbol(this._key)) {throw new Error(`Identity getter can't be initialized for symbol keys.`);}

        this.needsAccessorTarget = true;

        const _key = `_${this._key}`;

        return function(): T
        {
            return this[_key];
        };
    }

    private identitySetter(): (v: T) => T
    {
        if(!this._key)           {throw new Error(`Identity setter can't be initialized without a property key.`);}
        if(is.symbol(this._key)) {throw new Error(`Identity setter can't be initialized for symbol keys.`);}

        this.needsAccessorTarget = true;

        const _key = `_${this._key}`;

        return function(v: T): T
        {
            return this[_key] = v;
        };
    }
}

export default KeyPropertyDescriptor;
