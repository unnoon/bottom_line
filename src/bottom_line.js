/*!
 * _____________bottom_line.js_____
 * Bottom_line JavaScript Library
 *
 * Copyright 2015, Rogier Geertzema
 * Released under the MIT license
 * ________________________________
 */
!function(bottom_line) {
    var environments = true;
    var requirejs    = typeof(define) === 'function'  && !!define.amd;
    var nodejs       = typeof(module) !== 'undefined' && this === module.exports;

    switch(environments) {
    case requirejs : define(bottom_line);            break;
    case nodejs    : module.exports = bottom_line(); break;
    default        : bottom_line(this)}
}.call(this, function(root_) {
    'use strict';

    var stack = []; // stack holding all wrapped objects accessed from ._
    var index = 0;  // current index in the stack

	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 *
	 * @namespace _
	 */
	var _ = {
        'version': '0.0.5',
        not: {} // object to hold negative functions
    };
    // we can't set the root above since phantomJS 1.9.8 will break as it gets confused with _ defined on the object prototype
    if(root_)
    {
        if(root_.hasOwnProperty('_'))
        {
            console.error('_ is already defined on root object'); return;
        }
        else
        {
            root_._ = _;
        }
    }

    // TODO something to run methods in a different context. Apply will not work since the context will get lost when using other bottom_line functions internally
    // wrap functions for chaining
    function construct(key, _settings_, module)
    {
        var settings = module && _settings_ || {};
        var module   = module || _settings_;
        var obj      = settings.native;

        var wrapper = settings.base? clone(settings.native) : {};

        wrapper.not     = {};
        wrapper.methods = {}; // add methods unwrapped so we can use them with apply

        // create instance and chain object including not wrapper
        var _methods = wrapper._methods = (key === 'obj') ? {not:{}} : Object.create(_.obj._methods, {not:{value:Object.create(_.obj._methods.not)}}); // inherit from object. // stores non-chainable use _methods
        var _chains  = wrapper._chains  = (key === 'obj') ? {not:{}} : Object.create(_.obj._chains,  {not:{value:Object.create(_.obj._chains.not)}});  // inherit from object.  // stores chainable use _methods

        Object.defineProperty(wrapper._methods, 'chain', {get: function() {return        _chains}, enumerable: false, configurable: false});
        Object.defineProperty(wrapper._chains,  'value', {get: function() {
            var elm = stack[--index];
            return elm.valueOf? elm.valueOf() : elm;
        }, enumerable: false, configurable: false});

        if(obj && obj.prototype)
        {
            if(obj.prototype.hasOwnProperty('_'))
            {
                // TODO add a silent log here
            }
            else
            {
                // extend native object with special _ 'bottom_line' access property
                Object.defineProperty(obj.prototype, '_', {
                    enumerable: false, configurable: false,
                    get: function() {
                        stack[index++] = this;
                        return _methods
                    },
                    // we implement a set so it is still possible to use _ as an object property
                    set: function(val) {Object.defineProperty(this, '_', {value: val, enumerable: true,  configurable: true, writable: true})}}
                );
            }
        }

        if(settings.global !== false)
            _[key] = wrapper; // add wrapper to the bottom_line object

        wrapStatics(wrapper,   module.static);
        wrapPrototype(wrapper, module.prototype);

        return wrapper;
    }

    function wrapStatics(wrapper, module)
    {
        if(!module) return;

        extend(wrapper,     {enumerable: false}, module);
        extend(wrapper.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module);

        if(wrapper !== _.obj && wrapper !== _.fnc) return;
        // add static obj & fnc functions to the global _ object
        extend(_,     {enumerable: false, overwrite: false}, module);
        extend(_.not, {enumerable: false, overwrite: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module);
    }

    function wrapPrototype(wrapper, module)
    {
        if(!module) return;

        extend(wrapper._methods,     {enumerable: false, modifier: function(fn) { return function () {return   fn.apply(stack[--index], arguments)}}},          module);
        extend(wrapper._methods.not, {enumerable: false, modifier: function(fn) { return function () {return  !fn.apply(stack[--index], arguments)}}},          module);
        extend(wrapper._chains,      {enumerable: false, modifier: function(fn) { return function () {return   fn.apply(stack[--index], arguments)._.chain}}},  module);
        extend(wrapper._chains.not,  {enumerable: false, modifier: function(fn) { return function () {return (!fn.apply(stack[--index], arguments))._.chain}}}, module);

        extend(wrapper.methods, {enumerable: false}, module);
    }

    // simple cloning function
    function clone(obj) {
        var clone = Object.create(Object.getPrototypeOf(obj));

        Object.getOwnPropertyNames(obj).forEach(function(name) {
            Object.defineProperty(clone, name, Object.getOwnPropertyDescriptor(obj, name));
        });

        return clone;
    }

    /* @include extend.js */

    var objToString = Object.prototype.toString;
    /*
     *  'Global' _methods
     */

    extend(_, {
        /**
         * @public
         * @static
         * @method _.inject
         *
         * @param {Object}  obj                - object to be injected on i.e _.arr|_.obj|etc...
         * @param {string}  prop               - name of the property
         * @param {Object} descriptor          - descriptor/settings object on injection. See extend documentation for more options
         *     @param {boolean}  descriptor.value                - value of the property
         *     @param {boolean=} descriptor.static               - optional boolean indicating if the property is static
         */
        inject: function(obj, prop, descriptor) {
            var module = {};

            module[prop] = descriptor;

            if(descriptor.static) {wrapStatics(obj, module)}
            else                  {wrapPrototype(obj, module)}
        },
        isArguments:  function(obj) {return objToString.call(obj) === '[object Arguments]'},
        isArray:      Array.isArray,
        /**
         * Checks if an object is empty
         * @public
         * @static
         * @method _.isEmpty
         * @param   {Object}  obj - object to check the void
         * @returns {boolean}     - boolean indicating if the object is empty
         */
        isEmpty: function (obj)
        {
            var key;

            for(key in obj) {
                return false;
            }
            return true;
        },
        isFunction:   function(obj) {return typeof(obj) === 'function'},
        isInteger:    function(obj) {return _.typeOf(obj) === 'number' && obj === (obj|0)},
        isNull:       function(obj) {return obj === null},
        isNumber:     function(obj) {return _.typeOf(obj) === 'number'},
        isObject:     function(obj) {return _.typeOf(obj) === 'object'},
        /**
         * Checks if an object is an primitive
         * @public
         * @static
         * @method _.isPrimitive
         * @param   {Object} obj - object to classify
         * @returns {boolean}    - boolean indicating if the object is a primitive
         */
        isPrimitive: function(obj) {
            // maybe just check for valueOF??
            var type = typeof(obj);

            switch(type)
            {
                case 'object'   :
                case 'function' :
                    return obj === null;
                default :
                    return true
            }
        },
        isString:     function(obj) {return _.typeOf(obj) === 'string'},
        /**
         * Checks is a property is undefined
         * @public
         * @static
         * @method _.isUndefined
         * @param   {Object} prop - property to check
         * @returns {boolean}     - indication of the property definition
         */
        isUndefined: function(prop) {
            return prop === undefined;
        },
        /**
         * Checks is a property is defined
         * @public
         * @static
         * @method _.isDefined
         * @param   {Object} prop - property to check
         * @returns {boolean}     - indication of the property definition
         */
        isDefined: function(prop) {
            return prop !== undefined;
        },
        toArray: function(obj) {
            var type = _.typeOf(obj);

            switch (type)
            {
                case 'arguments' : // make a copy instead of slice to not leak arguments
                    var max  = arguments.length;
                    var args = new Array(max);
                    for(var i = 0; i < max; i++) {
                        args[i] = arguments[i];
                    }
                    return args;
                case 'object'    : return obj._.values();
                case 'array'     : return obj;
                default          : return [];
            }
        },
        toInteger: function(obj) {
            switch(_.typeOf(obj))
            {
                case 'number' : return obj|0;
                case 'string' : return parseInt(obj);
                default       : return NaN
            }
        },
        toNumber: function(obj) {
            switch(_.typeOf(obj))
            {
                case 'number' : return obj;
                case 'string' : return parseFloat(obj);
                default       : return NaN
            }
        },
        toString: {overrideaction: null, value: function(obj) {return obj? obj._.toString() : obj+''}}
    });

    /* @include shims.js */
    /* @include Batcher.js */
    /* @include obj.js  */
    /* @include arr.js  */
    /* @include str.js  */
    /* @include num.js  */
    /* @include fnc.js  */
    /* @include int.js  */
    /* @include math.js */

	return _
});
