"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Rogier on 05/05/2017.
 */
var is_1 = require("../lang/is");
var lodash_1 = require("lodash");
/**
 * Property descriptor with handy extra utilities.
 */
var KeyPropertyDescriptor = /** @class */ (function () {
    function KeyPropertyDescriptor() {
        this.enumerable = false;
        this.configurable = false;
        this.writable = false;
        this.needsAccessorTarget = false;
    }
    KeyPropertyDescriptor.prototype.key = function (key) {
        if (key === undefined) {
            return this._key;
        }
        else {
            return this._key = key, this;
        }
    };
    KeyPropertyDescriptor.prototype.descriptor = function (dsc) {
        if (dsc === undefined) {
            return lodash_1.clone(this).groom();
        }
        else {
            return Object.assign(this, dsc);
        }
    };
    /**
     * Grooms the current descriptor into a valid descriptor.
     *
     * @returns This for chaining.
     */
    KeyPropertyDescriptor.prototype.groom = function () {
        if (!!this.get || !!this.set) {
            delete this.writable;
            delete this.value;
        }
        else {
            this.value = undefined ? null : this.value;
        }
        return this;
    };
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
    KeyPropertyDescriptor.prototype.onaccess = function (fn) {
        this.get = lodash_1.flow(this.get || this.identityGetter(), fn);
        this.set = this.set || this.identitySetter();
        return this;
    };
    /**
     * Easy onupdate wrapper. Value is piped thru using flow.
     * In case you'll want to use 'this' make sure you don't use a shorthand function.
     * The supplied function is executed first.
     *
     * @param fn - Function that is executed on update.
     *
     * @returns This for chaining.
     */
    KeyPropertyDescriptor.prototype.onupdate = function (fn) {
        this.set = lodash_1.flow(fn, this.set || this.identitySetter());
        this.get = this.get || this.identityGetter();
        return this;
    };
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
    KeyPropertyDescriptor.prototype.onexecute = function (fn) {
        // TODO this is super ugly
        // tslint:disable-next-line:ban-types
        this.value = lodash_1.flow(this.value, fn); // wrap functions
        return this;
    };
    /**
     * Defines a instance or static property (so no methods).
     *
     * @param target - Target for the property. a Class in case of static properties or Prototype in case of instance properties.
     */
    KeyPropertyDescriptor.prototype.defineProperty = function (target) {
        var descriptor = this.descriptor();
        var accessor = !!this.get || !!this.set;
        var writable = this.writable;
        var value = this.value;
        var key = this.key();
        if (target instanceof Function) {
            if (descriptor.needsAccessorTarget) {
                Object.defineProperty(target, "_" + key, { value: value, writable: writable });
            }
            Object.defineProperty(target, key, descriptor);
        }
        else {
            Reflect.defineMetadata('design:descriptor', this, target, key); // define meta descriptor since there is no other place to store it
            Object.defineProperty(target, key, {
                set: function (val) {
                    if (!accessor) {
                        descriptor.value = val;
                    } // add value to current descriptor
                    if (descriptor.needsAccessorTarget) {
                        Object.defineProperty(this, "_" + key, { value: val, writable: writable });
                    } // define private property to hold val
                    Object.defineProperty(this, key, descriptor);
                    return this[key];
                },
                get: function () {
                    if (descriptor.needsAccessorTarget) {
                        Object.defineProperty(this, "_" + key, { value: value, writable: writable });
                    } // define private property to hold value
                    Object.defineProperty(this, key, descriptor);
                    return this[key];
                },
                configurable: true,
            });
        }
    };
    // TODO check if we should create a hidden value instead of an underscore prefixed property key.
    KeyPropertyDescriptor.prototype.identityGetter = function () {
        if (!this._key) {
            throw new Error("Identity getter can't be initialized without a property key.");
        }
        if (is_1.default.symbol(this._key)) {
            throw new Error("Identity getter can't be initialized for symbol keys.");
        }
        this.needsAccessorTarget = true;
        var _key = "_" + this._key;
        return function () {
            return this[_key];
        };
    };
    KeyPropertyDescriptor.prototype.identitySetter = function () {
        if (!this._key) {
            throw new Error("Identity setter can't be initialized without a property key.");
        }
        if (is_1.default.symbol(this._key)) {
            throw new Error("Identity setter can't be initialized for symbol keys.");
        }
        this.needsAccessorTarget = true;
        var _key = "_" + this._key;
        return function (v) {
            return this[_key] = v;
        };
    };
    return KeyPropertyDescriptor;
}());
exports.default = KeyPropertyDescriptor;
