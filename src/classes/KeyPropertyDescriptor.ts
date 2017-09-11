/**
 * Created by Rogier on 05/05/2017.
 */
import { clone, flow } from 'lodash';

/**
 *
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

    public key():                    string|symbol;
    public key(key:  string|symbol): KeyPropertyDescriptor<T>;
    public key(key?: string|symbol): string|symbol|KeyPropertyDescriptor<T>
    {
        if(key === undefined) {return this._key;}
        else                  {return this._key = key, this;}
    }
    
    public descriptor():                                 KeyPropertyDescriptor<T>;
    public descriptor(dsc: TypedPropertyDescriptor<T>):  KeyPropertyDescriptor<T>;
    public descriptor(dsc?: TypedPropertyDescriptor<T>): KeyPropertyDescriptor<T>
    {
        if(dsc === undefined) {return clone(this).groom();}
        else                  {return Object.assign(this, dsc);}
    }

    public groom(): KeyPropertyDescriptor<T>
    {
        if(!!this.get || !!this.set) // accessor
        {
            delete this.writable;
            delete this.value;
        }

        return this;
    }

    /**
     * Easy onaccess wrapper. Value is piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed last.
     *
     * @param fn
     */
    // tslint:disable-next-line:ban-types
    public onaccess(fn: Function) // value is piped thru using flow
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
     * @param fn
     */
    public onupdate(fn: (v: T) => T)
    {
        this.get = this.get || this.identityGetter();
        this.set = flow(fn, this.set || this.identitySetter());

        return this;
    }
    /**
     * Easy onexecute wrapper. Args are piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed last.
     *
     * @param fn
     */
    // tslint:disable-next-line:ban-types
    public onexecute(fn: Function)
    {
        // FIXME this is super ugly
        // tslint:disable-next-line:ban-types
        this.value = flow(this.value as any as Function, fn) as any as T; // wrap functions

        return this;
    }

    public defineProperty(target)
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
        if(!this._key) {throw new Error('Property key is not defined.');}

        this.needsAccessorTarget = true;

        const _key = `_${this._key}`;

        return function(): T
        {
            return this[_key];
        };
    }

    private identitySetter(): (v: T) => T
    {
        if(!this._key) {throw new Error('Property key is not defined.');}

        this.needsAccessorTarget = true;

        const _key = `_${this._key}`;

        return function(v: T): T
        {
            return this[_key] = v;
        };
    }
}

export default KeyPropertyDescriptor;
