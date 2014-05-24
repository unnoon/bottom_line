/*!
 * _____________Bottom_Line._.⌡S___
 * Bottom_line JavaScript Library
 *
 * Copyright 2013, Rogier Geertzema
 * Released under the MIT license
 * ________________________________
 */
'use strict';
!function(root, bottom_line) {
    var requirejs = typeof(define) === 'function' && define.amd;
    var nodejs    = typeof(module) === 'object' && typeof(exports) === 'object' && module.exports === exports;
    var other     = !requirejs && !nodejs;

	if(requirejs)   define(bottom_line);
	if(nodejs)      module.exports = bottom_line();
    if(other)       root._ = bottom_line();
}(this, function() {
	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 * Also all static properties (including native ones) will be available on this object
	 *
	 * @module _
	 */
	var _ = {};

    // some short cuts
    // TODO performance test once I have ported most of the library
    var __obj  = Object;
    var __arr  = Array;
    var __num  = Number;
    var __str  = String;
    var __fnc  = Function;
    var __math = Math;

    // wrap functions for chaining
    function constructWrapper(nativeObj, shorthand, module)
    {
        var wrapper = _[shorthand] = module.init || function(value) {
            this.value = value;
        };

        // stores non-chainable use methods
        wrapper.__instance__ = (shorthand === 'obj')? {} : Object.create(_.obj.__instance__); // inherit from object
        Object.defineProperties(wrapper.__instance__, {
            chain:  {get: function() {return wrapper.__chain__},            enumerable: false, configurable: false},
            $chain: {get: function() {return new wrapper(wrapper.value)},   enumerable: false, configurable: false}
        });
        // stores non-chainable use methods
        wrapper.__chain__ = (shorthand === 'obj')? {} : Object.create(_.obj.__chain__); // inherit from object
        Object.defineProperties(wrapper.__chain__, {
            value:  {get: function() {return wrapper.value},                enumerable: false, configurable: false}
        });

        if(nativeObj && nativeObj.prototype)
        {
            // extend native object with special 'bl' (bottom_line) access property
            Object.defineProperties(nativeObj.prototype, {
                // return object containing single use methods
                bl: {get: function() {
                    wrapper.value = this;
                    return wrapper.__instance__
                }, enumerable: false, configurable: false}
            });
        }

        // copy statics to wrapper & _
        var statics = module.static || {};
        __obj.getOwnPropertyNames(statics).forEach(function(name) {
            var descriptor = __obj.getOwnPropertyDescriptor(statics, name);
            descriptor.enumerable = false;

            if(wrapper.hasOwnProperty(name)) console.debug('overwriting existing property: '+name+' on _.'+shorthand+' while copying statics');
            // copy static methods to wrapper
            __obj.defineProperty(wrapper, name, descriptor);

            // copy static properties to the bottom line _ object
            if(shorthand !== 'int') // except for the int class
            {
                if(_.hasOwnProperty(name)) console.debug('overwriting existing property: '+name+' on _ while copying statics');
                __obj.defineProperty(_, name, descriptor);
            }
        });

        // prototype
        var prototype = module.prototype || {};

        __obj.getOwnPropertyNames(prototype).forEach(function(name) {
            var descriptor   = __obj.getOwnPropertyDescriptor(prototype, name);
            var descriptor_instance  = clone(descriptor); // normal descriptor
            var descriptor_chain     = clone(descriptor); // chaining descriptor
            var descriptor_$chain    = clone(descriptor); // safe chaining descriptor

            // make properties non enumerable
            descriptor_instance.enumerable = false;
            descriptor_chain.enumerable    = false;
            descriptor_$chain.enumerable   = false;

            // wrap function & getters & setters
            if(typeof(descriptor.value) === 'function') wrap('value');
            if(descriptor.get) 							wrap('get');
            if(descriptor.set) 							wrap('set');

            function wrap(type) {
                var fn = descriptor[type];

                // singular
                descriptor_instance[type] = function () {
                    return fn.apply(wrapper.value, arguments);
                };
                // chaining
                descriptor_chain[type] = function () {
                    return fn.apply(wrapper.value, arguments).bl.chain;
                };
                // safe chaining
                descriptor_$chain[type] = function () {
                    this.value = fn.apply(this.value, arguments);
                    return this;
                };
            }

            __obj.defineProperty(wrapper.__instance__,  name, descriptor_instance);
            __obj.defineProperty(wrapper.__chain__,     name, descriptor_chain);
            __obj.defineProperty(wrapper.prototype,     name, descriptor_$chain);
        })
    }

    // simple cloning function
    function clone(obj) {
        var clone = __obj.create(__obj.getPrototypeOf(obj));

        __obj.getOwnPropertyNames(obj).forEach(function(name) {
            __obj.defineProperty(clone, name, __obj.getOwnPropertyDescriptor(obj, name));
        });

        return clone;
    }

    // FIXME small fix
    _.isArray = Array.isArray;

    /*
     *  'Global' methods
     */
    _.assert = function(condition, message)
    {
        if (!condition) throw message || "Assertion failed";
    };

    /* @include coll.js */
    /* @include obj.js */
    /* @include arr.js */
    /* @include str.js */
    /* @include num.js */
    /* @include fnc.js */

	return _
});