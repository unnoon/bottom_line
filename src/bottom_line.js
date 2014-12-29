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
    default        : Object.defineProperty(root, '_', {value: bottom_line(), enumerable: true}) } // TODO check for conflicts
}(this, function() {
	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 * Also all static properties (including native ones) will be available on this object
	 *
	 * @module _
	 */
	var _ = {
        // TODO investigate if this can give errors other per type values are possible. But this is a good way to check if this will give any problems (asynxhronous stuff...)
        value: null, // wrapped value
        not: {} // object to hold negative functions
    };

    // wrap functions for chaining
    function constructWrapper(obj, key, module)
    {
        var wrapper = module.init || function() {};

        _[key] = wrapper;
        // create instance and chain object including not wrapper
        wrapper.__instance__ = (key === 'obj') ? {not:{}} : Object.create(_.obj.__instance__, {not:{value:Object.create(_.obj.__instance__.not)}}); // inherit from object. // stores non-chainable use methods
        wrapper.__chain__    = (key === 'obj') ? {not:{}} : Object.create(_.obj.__chain__,    {not:{value:Object.create(_.obj.__chain__.not)}});    // inherit from object.  // stores chainable use methods
        wrapper.not          = {};

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
    function wrapStatics(wrapper, key, module)
    {
        if(!module.static) return;

        extend(wrapper,     {enumerable: false}, module.static);
        extend(wrapper.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module.static);
        if(key === 'int') return; // except for the int class
        extend(_,     {enumerable: false}, module.static);
        extend(_.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module.static);

    }

    function wrapPrototype(wrapper, key, module)
    {
        if(!module.prototype) return;

        extend(wrapper.__instance__,     {enumerable: false, modifier: function(fn) { return function () {return  fn.apply(_.value, arguments)}}}, module.prototype);
        extend(wrapper.__instance__.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(_.value, arguments)}}}, module.prototype);
        extend(wrapper.__chain__,        {enumerable: false, modifier: function(fn) { return function () {return  fn.apply(_.value, arguments)._.chain}}}, module.prototype);
        extend(wrapper.__chain__.not,    {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(_.value, arguments)._.chain}}}, module.prototype);
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
     * @method module:_.obj.extend
     * @param   {Object}  obj          - object to be extended
     * @param   {Object=} settings_    - optional settings/default descriptor
     *      {boolean} [enumerable=true]   - boolean indicating if all properties should be enumerable. can be overwritten on a config level
     *      {boolean} [configurable=true] - boolean indicating if all properties should be configurable. can be overwritten on a config level
     *      {boolean} [writable=true]     - boolean indicating if all properties should be writable. can be overwritten on a config level
     *      {boolean} [override=true]     - boolean indicating if all properties should be overridden by default. can be overwritten on a config level
     *      {boolean} [overwrite=true]    - boolean indicating if all properties should be overwritten by default. can be overwritten on a config level
     *      {string}  [loglevel='log']    - console log level. Use 'none' to disable all logging
     *      {function}[modifier]          - modifier function to apply on all functions.
     * @param   {Object}  module       - object containing functions/properties to extend the object with
     * @return  {Object}  obj          - the extended object
     */
    function extend(obj, settings_, module) {
        var settings = module && settings_ || {};
        var module   = module || settings_;
        var descriptor;
        var config;

        var enumerable   = settings.enumerable      !== false;
        var configurable = settings.configurable    !== false;
        var writable     = settings.writable        !== false;
        var overwrite    = settings.overwrite       !== false; // default is true
        var override     = settings.override        !== false; // default is true

        var loglevel     = settings.loglevel || 'log';

        for(var prop in module)
        {   if(module.hasOwnProperty(prop))
            {
                descriptor = Object.getOwnPropertyDescriptor(module, prop);

                var overrideProperty    = override;
                var overwriteProperty   = overwrite;
                var aliases             = false;
                var encapsulator        = !!(descriptor.get || descriptor.set);

                // global property overrides
                if(enumerable   !== undefined)                                           descriptor.enumerable   = enumerable;
                if(configurable !== undefined)                                           descriptor.configurable = configurable;
                if(writable     !== undefined && descriptor.hasOwnProperty('writable'))  descriptor.writable     = writable;

                // special property specific config
                if(!encapsulator && module[prop].hasOwnProperty('value'))
                {
                    config = module[prop];
                    descriptor.value = config.value;

                    if(config.clone)                            descriptor.value = _.clone(config.value); // clone deep maybe?
                    if(config.exec)                             descriptor.value = config.value();
                    if(config.hasOwnProperty('enumerable'))     descriptor.enumerable   = config.enumerable;
                    if(config.hasOwnProperty('configurable'))   descriptor.configurable = config.configurable;
                    if(config.hasOwnProperty('writable'))       descriptor.writable     = config.writable;
                    if(config.hasOwnProperty('override'))       overrideProperty  = config.override;
                    if(config.hasOwnProperty('overwrite'))      overwriteProperty = config.overwrite;
                    if(config.hasOwnProperty('shim'))           overwriteProperty = config.shim;
                    if(config.aliases)                          aliases = true;
                }
                // FIXME cleanup
                if(settings.modifier && typeof(descriptor.value) === 'function') {
                    descriptor.value = settings.modifier(descriptor.value);
                }

                if(obj.hasOwnProperty(prop))
                {
                    if(!overwriteProperty) continue; // continue;
                    if(loglevel !== 'none')console[loglevel]('overwriting existing property: '+prop);
                }
                else if(prop in obj)
                {
                    if(!overrideProperty) continue; // continue;
                    if(loglevel !== 'none')console[loglevel]('overriding existing property: '+prop);
                }

                Object.defineProperty(obj, prop, descriptor);
                if(aliases) config.aliases.forEach(function(alias) {Object.defineProperty(obj, alias, descriptor)})
            }
        }

        return obj;
    }

    // is object
    // is should be static so we can also apply it to null & undefined
    _.is = {
        array: Array.isArray
    };
    // convertor functions
    _.to = {

    };
    /**
     *  'Global' methods
     */


    /* @include shims.js */
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