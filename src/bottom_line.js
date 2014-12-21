/*!
 * _____________bottom_line.js_____
 * Bottom_line JavaScript Library
 *
 * Copyright 2013, Rogier Geertzema
 * Released under the MIT license
 * ________________________________
 */
'use strict';
!function(root, bottom_line) {
    var environments = true;
    var requirejs = typeof(define) === 'function'  && !!define.amd;
    var nodejs    = typeof(module) !== 'undefined' && typeof(exports) !== 'undefined' && module.exports === exports;

    switch(environments) {
    case requirejs : define(bottom_line);            break;
    case nodejs    : module.exports = bottom_line(); break;
    default        : Object.defineProperty(root, '_', {value: bottom_line()}) } // TODO check for conflicts
}(this, function() {
	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 * Also all static properties (including native ones) will be available on this object
	 *
	 * @module _
	 */
	var _ = {
        // TODO investigate if this can give errors other per type values are possible. But this is a good way to check if this will give any problems (asynxhronous stuff...)
        value: null // wrapped value
    };

    // wrap functions for chaining
    function constructWrapper(obj, key, module)
    {
        var wrapper = module.init || function() {};

        _[key] = wrapper;

        wrapper.__instance__ = (key === 'obj') ? {} : Object.create(_.obj.__instance__); // inherit from object. // stores non-chainable use methods
        wrapper.__chain__    = (key === 'obj') ? {} : Object.create(_.obj.__chain__);    // inherit from object.  // stores chainable use methods

        Object.defineProperty(wrapper.__instance__, 'chain', {get: function() {return wrapper.__chain__},   enumerable: false, configurable: false});
        Object.defineProperty(wrapper.__chain__,    'value', {get: function() {return _.value},             enumerable: false, configurable: false});

        if(obj && obj.prototype)
        {
            // extend native object with special _ 'bottom_line' access property
            // TODO check for conflicts
            Object.defineProperty(obj.prototype, '_', {get: function() {_.value = this; return wrapper.__instance__}, enumerable: false, configurable: false});
        }

        wrapStatics(wrapper, key, module);
        wrapPrototype(wrapper, key, module);
    }

    // wrap functions for chaining
    function wrapStatics(wrapper, key, module) {
        // copy statics to _[shorthand] & _
        var statics = module.static || {};
        Object.getOwnPropertyNames(statics).forEach(function(name) {
            var descriptor = Object.getOwnPropertyDescriptor(statics, name);
            descriptor.enumerable = false;

            if(wrapper.hasOwnProperty(name)) console.debug('overwriting existing property: '+name+' on _.'+key+' while copying statics');
            // copy static methods to _[shorthand]
            Object.defineProperty(wrapper, name, descriptor);

            // copy static properties to the bottom line _ object
            if(key !== 'int') // except for the int class
            {
                if(_.hasOwnProperty(name)) console.debug('overwriting existing property: '+name+' on _ while copying statics');
                Object.defineProperty(_, name, descriptor);
            }
        });
    }

    function wrapPrototype(wrapper, key, module)
    {
        // prototype
        var prototype = module.prototype || {};

        Object.getOwnPropertyNames(prototype).forEach(function(name) {
            var descriptor   = Object.getOwnPropertyDescriptor(prototype, name);
            var descriptor_instance  = clone(descriptor); // normal descriptor
            var descriptor_chain     = clone(descriptor); // chaining descriptor

            // make properties non enumerable
            descriptor_instance.enumerable = false;
            descriptor_chain.enumerable    = false;

            // wrap function & getters & setters
            if(typeof(descriptor.value) === 'function') wrap('value');
            if(descriptor.get) 							wrap('get');
            if(descriptor.set) 							wrap('set');

            function wrap(type) {
                var fn = descriptor[type];

                // singular
                descriptor_instance[type] = function () {
                    return fn.apply(_.value, arguments);
                };
                // chaining
                descriptor_chain[type] = function () {
                    return fn.apply(_.value, arguments)._.chain; // bl makes sure the value is set back tot the _[shorthand]
                };
            }

            Object.defineProperty(wrapper.__instance__,  name, descriptor_instance);
            Object.defineProperty(wrapper.__chain__,     name, descriptor_chain);
        })
    }

    // simple cloning function
    function clone(obj) {
        var clone = Object.create(Object.getPrototypeOf(obj));

        Object.getOwnPropertyNames(obj).forEach(function(name) {
            Object.defineProperty(clone, name, Object.getOwnPropertyDescriptor(obj, name));
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
    /* @include obj.js  */
    /* @include arr.js  */
    /* @include str.js  */
    /* @include num.js  */
    /* @include fnc.js  */
    /* @include math.js */
    /* @include int.js  */

	return _
});