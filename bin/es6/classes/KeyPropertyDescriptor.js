/**
 * Created by Rogier on 05/05/2017.
 */
import { clone, flow } from 'lodash';
/**
 *
 */
export class KeyPropertyDescriptor {
    constructor() {
        this.enumerable = false;
        this.configurable = false;
        this.writable = false;
        this.needsAccessorTarget = false;
    }
    key(key) {
        if (key === undefined) {
            return this._key;
        }
        else {
            return this._key = key, this;
        }
    }
    descriptor(dsc) {
        if (dsc === undefined) {
            return clone(this).groom();
        }
        else {
            return Object.assign(this, dsc);
        }
    }
    groom() {
        if (!!this.get || !!this.set) {
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
    onaccess(fn) {
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
    onupdate(fn) {
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
    onexecute(fn) {
        // FIXME this is super ugly
        // tslint:disable-next-line:ban-types
        this.value = flow(this.value, fn); // wrap functions
        return this;
    }
    defineProperty(target) {
        const descriptor = this.descriptor();
        const accessor = !!this.get || !!this.set;
        const writable = this.writable;
        const value = this.value;
        const key = this.key();
        if (target instanceof Function) {
            if (descriptor.needsAccessorTarget) {
                Object.defineProperty(target, `_${key}`, { value, writable });
            }
            Object.defineProperty(target, key, descriptor);
        }
        else {
            Reflect.defineMetadata('design:descriptor', this, target, key); // define meta descriptor since there is no other place to store it
            Object.defineProperty(target, key, {
                set(val) {
                    if (!accessor) {
                        descriptor.value = val;
                    } // add value to current descriptor
                    if (descriptor.needsAccessorTarget) {
                        Object.defineProperty(this, `_${key}`, { value: val, writable });
                    } // define private property to hold val
                    Object.defineProperty(this, key, descriptor);
                    return this[key];
                },
                get() {
                    if (descriptor.needsAccessorTarget) {
                        Object.defineProperty(this, `_${key}`, { value, writable });
                    } // define private property to hold value
                    Object.defineProperty(this, key, descriptor);
                    return this[key];
                },
                configurable: true,
            });
        }
    }
    // TODO check if we should create a hidden value instead of an underscore prefixed property key.
    identityGetter() {
        if (!this._key) {
            throw new Error('Property key is not defined.');
        }
        this.needsAccessorTarget = true;
        const _key = `_${this._key}`;
        return function () {
            return this[_key];
        };
    }
    identitySetter() {
        if (!this._key) {
            throw new Error('Property key is not defined.');
        }
        this.needsAccessorTarget = true;
        const _key = `_${this._key}`;
        return function (v) {
            return this[_key] = v;
        };
    }
}
export default KeyPropertyDescriptor;
