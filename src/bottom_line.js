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
	 * Also all static properties will be available on this object
	 *
	 * @module _
	 */
    // TODO this should be a function where we can wrap for example arguments and apply an array function to it
	var _ = {
        // TODO investigate if this can give errors other per type values are possible. But this is a good way to check if this will give any problems (asynxhronous stuff...)
        value: null, // wrapped value
        not: {} // object to hold negative functions
    };

    // wrap functions for chaining
    function constructWrapper(obj, key, module)
    {
        var wrapper = {not:{}};

        // create instance and chain object including not wrapper
        var methods = wrapper.methods = (key === 'obj') ? {not:{}} : Object.create(_.obj.methods, {not:{value:Object.create(_.obj.methods.not)}}); // inherit from object. // stores non-chainable use methods
        var chains  = wrapper.chains  = (key === 'obj') ? {not:{}} : Object.create(_.obj.chains,  {not:{value:Object.create(_.obj.chains.not)}});  // inherit from object.  // stores chainable use methods

        Object.defineProperty(wrapper.methods, 'chain', {get: function() {return chains},  enumerable: false, configurable: false});
        Object.defineProperty(wrapper.chains,  'value', {get: function() {return _.value}, enumerable: false, configurable: false});

        if(obj && obj.prototype)
        {
            // extend native object with special _ 'bottom_line' access property
            // TODO check for conflicts
            Object.defineProperty(obj.prototype, '_', {get: function() {return _.value = this, methods}, enumerable: false, configurable: false});
        }

        wrapStatics(wrapper, key, module);
        wrapPrototype(wrapper, key, module);

        _[key] = wrapper; // add wrapper to the bottom_line object
    }

    // wrap functions for chaining
    function wrapStatics(wrapper, key, module)
    {
        if(!module.static) return;

        extend(wrapper,     {enumerable: false}, module.static);
        extend(wrapper.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module.static);

        extend(_,     {enumerable: false, overwrite: false}, module.static);
        extend(_.not, {enumerable: false, overwrite: false, modifier: function(fn) { return function () {return !fn.apply(wrapper, arguments)}}}, module.static);
    }

    function wrapPrototype(wrapper, key, module)
    {
        if(!module.prototype) return;

        extend(wrapper.methods,     {enumerable: false, modifier: function(fn) { return function () {return  fn.apply(_.value, arguments)}}}, module.prototype);
        extend(wrapper.methods.not, {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(_.value, arguments)}}}, module.prototype);
        extend(wrapper.chains,      {enumerable: false, modifier: function(fn) { return function () {return  fn.apply(_.value, arguments)._.chain}}}, module.prototype);
        extend(wrapper.chains.not,  {enumerable: false, modifier: function(fn) { return function () {return !fn.apply(_.value, arguments)._.chain}}}, module.prototype);
    }

    /**
     * Extends an object with function/properties from a module object
     * @public
     * @static
     * @method module:_.obj.extend
     * @param   {Object}  obj          - object to be extended
     * @param   {Object=} settings_    - optional settings/default descriptor
     *      {boolean} [enumerable]     - boolean indicating if all properties should be enumerable. can be overwritten on a config level
     *      {boolean} [configurable]   - boolean indicating if all properties should be configurable. can be overwritten on a config level
     *      {boolean} [writable]       - boolean indicating if all properties should be writable. can be overwritten on a config level
     *
     *      {boolean} [override=true]  - boolean indicating if all properties should be overridden by default. can be overwritten on a config level
     *      {boolean} [overwrite=true] - boolean indicating if all properties should be overwritten by default. can be overwritten on a config level
     *
     *      {string}  [log]            - console log level for overwrites&overrides
     *      {boolean} [validate=false] - validate overwrites & overrides should be set to true in the config

     *      {function}[modifier]       - modifier function to apply on all functions.
     * @param   {Object}  module       - object containing functions/properties to extend the object with
     * @return  {Object}  obj          - the extended object
     */
    function extend(obj, settings_, module) {
        var settings = module && settings_ || {};
        var module   = module || settings_;

        settings.override  = settings.override  !== false; // default = true
        settings.overwrite = settings.overwrite !== false; // default = true

        for(var prop in module)
        {   if(module.hasOwnProperty(prop))
            {
                var descriptor   = Object.getOwnPropertyDescriptor(module, prop);
                var encapsulator = !!(descriptor.get || descriptor.set);
                var config       = {};

                // special property specific config
                if(!encapsulator && module[prop].hasOwnProperty('value'))
                {
                    config           = module[prop];
                    descriptor.value = config.value;

                    if(config.clone) descriptor.value = _.clone(config.value); // clone deep maybe?
                    if(config.exec)  descriptor.value = config.value(obj);
                }

                descriptor.enumerable   = (config.enumerable   !== undefined) ? config.enumerable   : (settings.enumerable   !== undefined) ? settings.enumerable   : descriptor.enumerable;
                descriptor.configurable = (config.configurable !== undefined) ? config.configurable : (settings.configurable !== undefined) ? settings.configurable : descriptor.configurable;
                descriptor.writable     = (config.writable     !== undefined) ? config.writable     : (settings.writable     !== undefined) ? settings.writable     : descriptor.writable;
                // getters & setters don't have a writable option
                if(encapsulator) delete descriptor.writable;

                if(settings.modifier && typeof(descriptor.value) === 'function') {
                    descriptor.value = settings.modifier(descriptor.value);
                }

                var override  = (config.override  !== undefined) ? config.override  : settings.override;
                var overwrite = (config.overwrite !== undefined) ? config.overwrite : settings.overwrite;

                var names = (config.aliases || []).concat(prop); // this is not super nice

                names.forEach(function(prop) {
                    if(obj.hasOwnProperty(prop)) // overwrite
                    {
                        if(!overwrite)                             return; // continue
                        if(settings.validate && !config.overwrite) throw "unvalidated overwrite of property: "+prop+". Please add overwrite=true to the config object" ;
                        if(settings.log)                           console[settings.log]('overwriting existing property: '+prop);
                    }
                    else if(prop in obj) // override
                    {
                        if(!override)                             return; // continue
                        if(settings.validate && !config.override) throw "unvalidated override of property: "+prop+". Please add override=true to the config object" ;
                        if(settings.log)                          console[settings.log]('overriding existing property: '+prop);
                    }

                    Object.defineProperty(obj, prop, descriptor)
                });
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
     *  'Global' methods
     */

    extend(_, {
        create: function(proto) {
            return (proto === Array.prototype) ? [] : Object.create(proto);
        }
    });

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