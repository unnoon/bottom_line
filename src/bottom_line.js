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
    var requirejs    = typeof(define) === 'function'  && !!define.amd;
    var nodejs       = typeof(module) !== 'undefined' && typeof(exports) !== 'undefined' && module.exports === exports;

    switch(environments) {
    case requirejs : define(bottom_line);            break;
    case nodejs    : module.exports = bottom_line(); break;
    default        : bottom_line(root)}
}(this, function(root_) {
    var stack = []; // stack holding all wrapped objects accessed from ._
    var index = 0;  // current index in the stack

	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 *
	 * @namespace _
	 */
	var _ = {
        'version': '0.0.1',
        not: {} // object to hold negative functions
    };
    // we can't set the root above since phantomJS 1.9.8 will break as it gets confused with _ defined on the object prototype
    if(root_) root_._ = _; // TODO check for conflicts

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
            // extend native object with special _ 'bottom_line' access property
            // TODO check for conflicts
            Object.defineProperty(obj.prototype, '_', {
                enumerable: false, configurable: false,
                get: function() {
                    stack[index++] = this;
                    return _methods
                },
                set: function(val) {Object.defineProperty(this, '_', {value: val, enumerable: true,  configurable: true, writable: true})}}); // we implement a set so it is still possible to use _ as an object property
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
    /**
     * Extends an object with function/properties from a module object
     * @public
     * @static
     * @method _.extend
     * @param   {Object}  obj          - object to be extended
     * @param   {Object=} _settings_   - optional settings/default descriptor
     *      {boolean=} enumerable      - boolean indicating if all properties should be enumerable. can be overwritten on a config level
     *      {boolean=} configurable    - boolean indicating if all properties should be configurable. can be overwritten on a config level
     *      {boolean=} writable        - boolean indicating if all properties should be writable. can be overwritten on a config level
     *
     *      {boolean=} override=true   - boolean indicating if properties should be overridden
     *      {boolean=} overwrite=true  - boolean indicating if properties should be overwritten
     *
     *      {string=} overwriteaction=warn - loglevel in case global overwrites are set to false but overwrite. ignore|log|info|warn|error|throw
     *      {string=} overrideaction=warn  - loglevel for validation of super usage in function overrides.      ignore|log|info|warn|error|throw
     *
     *      {function=}modifier        - modifier function to apply on all functions.
     * @param   {Object}  module       - object containing functions/properties to extend the object with
     * @return  {Object}  obj          - the extended object
     */
    function extend(obj, _settings_, module) {
        var settings = module && _settings_ || {};
        var module   = module || _settings_;

        settings.override        = settings.override  !== false; // default is true
        settings.overwrite       = settings.overwrite !== false; // default is true
        settings.overwriteaction = settings.overwriteaction || 'warn';
        settings.overrideaction  = settings.overrideaction  || 'warn';

        for(var prop in module)
        {   if(!module.hasOwnProperty(prop)) continue;

            var descriptor   = Object.getOwnPropertyDescriptor(module, prop);
            var encapsulator = !!(descriptor.get || descriptor.set);
            var config       = {};

            // special property specific config
            if(!encapsulator && module[prop].hasOwnProperty('value'))
            {
                config           = module[prop];
                descriptor.value = config.value;

                if(config.clone) descriptor.value = clone(config.value); // clone deep maybe?
                if(config.exec)  descriptor.value = config.value(obj);
                if(config.wrap)
                {
                    /**
                     * wraps 2 functions into 1. Return the result of the second function given
                     *
                     * @param {Function}   fnc1 - function to be wrapped
                     * @param {Function}   fnc2 - second function to be wrapped. The result of this function is returned as a result of the wrapping function
                     * @returns {Function}      - the wrapping function
                     */
                    var wrap = function(fnc1, fnc2) {
                        return function() {fnc1.apply(this, arguments); return fnc2.apply(this, arguments)}
                    };
                    // wrap super or override function with the module function
                    descriptor.value = wrap(obj[prop], descriptor.value)
                }
            }
            // create the final settings object
            var finalSettings = clone(settings);
            for(var conf in config)
            {   if (!config.hasOwnProperty(conf)) continue;

                finalSettings[conf] = config[conf];
            }

            descriptor.enumerable   = (finalSettings.enumerable     !== undefined)? finalSettings.enumerable    : descriptor.enumerable;
            descriptor.configurable = (finalSettings.configurable   !== undefined)? finalSettings.configurable  : descriptor.configurable;
            descriptor.writable     = (finalSettings.writable       !== undefined)? finalSettings.writable      : descriptor.writable;
            // getters & setters don't have a writable option
            if(encapsulator) delete descriptor.writable;

            if(finalSettings.modifier && typeof(descriptor.value) === 'function') {
                descriptor.value = finalSettings.modifier(descriptor.value);
            }

            var names = (config.aliases || []).concat(prop); // this is not super nice

            names.forEach(function(prop) {
                /**
                 * Performs action based on type, conf & value. The 'conf' parameter determines a override/overwrite warning or a a redundant warning on the model.
                 * In case of overrides a action is only performed if the super is not called by the override function
                 *
                 * @param {string}  type='override'|'overwrite'
                 * @param {boolean} conf  - true or false value for type (override or overwrite)
                 * @param {any}     value - value in the model
                 */
                var action = function(type, conf, value) {
                    var message;
                    var action                = finalSettings[type+'action'];
                    var skipOverrideAction    = (type === 'override') && (conf === true) && ((typeof(value) !== 'function') ||  /\b_super\b/.test(value));
                    var overrideNotUsingSuper = (type === 'override') && (conf === true) && ((typeof(value) === 'function') && !/\b_super\b/.test(value));

                    if(action === 'ignore' || skipOverrideAction || finalSettings.wrap) return; // no action required so return

                    if(conf === true)
                    {
                        message = ((type === 'override')? 'overriding' : 'overwriting') +' property: '+prop+'.';
                        if(overrideNotUsingSuper) message += ' But not calling super method.'
                    }
                    else
                    {
                        message = 'redundant '+type+' defined in module for property '+prop+'. '+type+'s are set to false in settings/config';
                    }

                    if(action === 'throw') {throw message}
                    else                   {
                        console[action](message)
                    }
                };

                if(obj.hasOwnProperty(prop)) // overwrite
                {
                    action('overwrite', finalSettings.overwrite, descriptor.value);
                    if(!finalSettings.overwrite) return; // continue
                }
                else if(prop in obj) // override
                {
                    action('override', finalSettings.override, descriptor.value);
                    if(!finalSettings.override) return; // continue
                }

                Object.defineProperty(obj, prop, descriptor)
            });
        }

        return obj;
    }

    var objToString = Object.prototype.toString;
    /**
     *  'Global' _methods
     */

    extend(_, {
        /**
         * @public
         * @static
         * @method _.inject
         *
         * @param {Object}  obj                - object to be injected i.e _.arr|_.obj|etc...
         * @param {string}  prop               - name of the property
         * @param {Object} descriptor          - descriptor/settings object on injection
         *      {boolean}  value               - value of the property
         *      {boolean=} static              - optional boolean indicating if the property is static
         *
         *      {boolean=} enumerable          - boolean indicating if all properties should be enumerable. can be overwritten on a config level
         *      {boolean=} configurable        - boolean indicating if all properties should be configurable. can be overwritten on a config level
         *      {boolean=} writable            - boolean indicating if all properties should be writable. can be overwritten on a config level
         *
         *      {boolean=} override=true       - boolean indicating if properties should be overridden
         *      {boolean=} overwrite=true      - boolean indicating if properties should be overwritten
         *
         *      {string=} overwriteaction=warn - loglevel in case global overwrites are set to false but overwrite. ignore|log|info|warn|error|throw
         *      {string=} overrideaction=warn  - loglevel for validation of super usage in function overrides.      ignore|log|info|warn|error|throw
         *
         *      {function=}modifier            - modifier function to apply on all functions.
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

            for (key in obj) {
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
                case 'arguments'                    : return Array.prototype.slice.call(obj, 0);
                case 'object'                       : return obj._.values();
                case 'array'                        : return obj;
                default                             : return [];
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
        toString: function(obj) {return obj? obj._.toString() : obj+''}
    });

    /* @include shims.js */
    /* @include obj.js  */
    /* @include arr.js  */
    /* @include str.js  */
    /* @include num.js  */
    /* @include fnc.js  */
    /* @include int.js  */
    /* @include math.js */

	return _
});