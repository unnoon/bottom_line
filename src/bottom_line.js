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
    default        : Object.defineProperty(root, '_', {value: bottom_line(), enumerable: true}) } // TODO check for conflicts
}(this, function() {
    var stack = []; // stack holding all wrapped objects accessed from ._
    var index = 0;  // current index in the stack

	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 *
	 * @namespace _
	 */
	var _ = {
        not: {} // object to hold negative functions
    };

    // wrap functions for chaining
    function construct(key, settings_, module)
    {
        var settings = module && settings_ || {};
        var module   = module || settings_;
        var obj      = settings.native;

        var wrapper = settings.base? clone(settings.native) : {};

        wrapper.not     = {};
        wrapper.methods = {}; // add methods unwrapped so we can use them with apply

        // create instance and chain object including not wrapper
        var _methods = wrapper._methods = (key === 'obj') ? {not:{}} : Object.create(_.obj._methods, {not:{value:Object.create(_.obj._methods.not)}}); // inherit from object. // stores non-chainable use _methods
        var _chains  = wrapper._chains  = (key === 'obj') ? {not:{}} : Object.create(_.obj._chains,  {not:{value:Object.create(_.obj._chains.not)}});  // inherit from object.  // stores chainable use _methods

        Object.defineProperty(wrapper._methods, 'chain', {get: function() {return        _chains}, enumerable: false, configurable: false});
        Object.defineProperty(wrapper._chains,  'value', {get: function() {return stack[--index]}, enumerable: false, configurable: false});

        if(obj && obj.prototype)
        {
            // extend native object with special _ 'bottom_line' access property
            // TODO check for conflicts
            Object.defineProperty(obj.prototype, '_', {get: function() {stack[index++] = this; return _methods}, enumerable: false, configurable: false});
        }

        wrapStatics(wrapper, key, module);
        wrapPrototype(wrapper, key, module);

        if(settings.global !== false)
            _[key] = wrapper; // add wrapper to the bottom_line object

        return wrapper;
    }

    function wrapStatics(wrapper, key, module)
    {
        if(!module.static) return;

        extend(wrapper,     {enumerable: false}, module.static);
        extend(wrapper.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module.static);

        if(key !== 'obj' && key !== 'fnc') return;
        // add static obj & fnc functions to the global _ object
        extend(_,     {enumerable: false, overwrite: false}, module.static);
        extend(_.not, {enumerable: false, overwrite: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module.static);
    }

    function wrapPrototype(wrapper, key, module)
    {
        if(!module.prototype) return;

        extend(wrapper._methods,     {enumerable: false, modifier: function(fn) { return function () {return   fn.apply(stack[--index], arguments)}}},          module.prototype);
        extend(wrapper._methods.not, {enumerable: false, modifier: function(fn) { return function () {return  !fn.apply(stack[--index], arguments)}}},          module.prototype);
        extend(wrapper._chains,      {enumerable: false, modifier: function(fn) { return function () {return   fn.apply(stack[--index], arguments)._.chain}}},  module.prototype);
        extend(wrapper._chains.not,  {enumerable: false, modifier: function(fn) { return function () {return (!fn.apply(stack[--index], arguments))._.chain}}}, module.prototype);

        extend(wrapper.methods, {enumerable: false}, module.prototype);
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
     * @param   {Object=} _settings_    - optional settings/default descriptor
     *      {boolean=} enumerable      - boolean indicating if all properties should be enumerable. can be overwritten on a config level
     *      {boolean=} configurable    - boolean indicating if all properties should be configurable. can be overwritten on a config level
     *      {boolean=} writable        - boolean indicating if all properties should be writable. can be overwritten on a config level
     *
     *      {boolean=} override=true   - boolean indicating if properties should be overridden
     *      {boolean=} overwrite=true  - boolean indicating if properties should be overwritten
     *
     *      {string=} onoverwrite=warn - loglevel in case global overwrites are set to false but overwrite. ignore|log|info|warn|error|throw
     *      {string=} onoverride=warn  - loglevel for validation of super usage in function overrides.      ignore|log|info|warn|error|throw
     *
     *      {function=}modifier        - modifier function to apply on all functions.
     * @param   {Object}  module       - object containing functions/properties to extend the object with
     * @return  {Object}  obj          - the extended object
     */
    function extend(obj, _settings_, module) {
        var settings = module && _settings_ || {};
        var module   = module || _settings_;

        settings.override    = settings.override  !== false; // default is true
        settings.overwrite   = settings.overwrite !== false; // default is true
        settings.onoverwrite = settings.onoverwrite || 'warn';
        settings.onoverride  = settings.onoverride  || 'warn';

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
                    var fnw = obj[prop];
                    if(typeof(fnw) === 'function')
                    {
                        descriptor.value = (function(fnw, fnc) {
                            return function() {fnw.apply(this, arguments); return fnc.apply(this, arguments)}
                        })(fnw, descriptor.value)
                    }
                }
            }
            // create the final settings object
            var finalSettings = clone(settings);
            for(var conf in config)
            {   if (!config.hasOwnProperty(conf)) continue;

                finalSettings[conf] = config;
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
                if(obj.hasOwnProperty(prop)) // overwrite
                {
                    if(finalSettings.onoverwrite && finalSettings.onoverwrite !== 'ignore')
                    {
                        if(finalSettings.onoverwrite === 'throw') {throw "unvalidated overwrite of property: "+prop+". Please add overwrite=true to the config object if you want to overwrite it";}
                        else                                      {console[finalSettings.onoverwrite]('overwriting existing property: '+prop)}
                    }
                    if(!finalSettings.overwrite) return;
                }
                else if(prop in obj) // override
                {   // TODO check super
                    if(finalSettings.onoverride && finalSettings.onoverride !== 'ignore')
                    {
                        if(finalSettings.onoverride === 'throw') {throw "unvalidated override of property: "+prop+". Please add override=true to the config object if you want to override it"}
                        else                                     {console[finalSettings.onoverride]('overriding existing property: '+prop)}
                    }
                    if(!finalSettings.override) return;
                }

                Object.defineProperty(obj, prop, descriptor)
            });
        }

        return obj;
    }

    // is should be static so we can also apply it to null & undefined
    _.is = {
        arguments:  function(obj) {return _.typeOf(obj) === 'arguments'},
        array:      Array.isArray,
        function:   function(obj) {return typeof(obj) === 'function'},
        null:       function(obj) {return obj === null},
        number:     function(obj) {return _.typeOf(obj) === 'number'},
        object:     function(obj) {return _.typeOf(obj) === 'object'},
        string:     function(obj) {return _.typeOf(obj) === 'string'},
        undefined:  function(obj) {return obj === undefined}
    };
    // convertor functions
    _.to = {
        array: function(obj) {
            var type = _.typeOf(obj);

            switch (type)
            {
                case 'arguments' : return Array.prototype.slice.call(obj, 0);
                case 'object'    :
                case 'function'  : return Object.getOwnPropertyNames(obj).map(function(key) { return {prop:key, value:obj[key]}});
                case 'array'     : return obj;
                case 'undefined' :
                case 'null'      : return [];
                default          : return [obj];
            }
        },
        int: function(num) {return num|0}
    };
    /**
     *  'Global' _methods
     */

    extend(_, {

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