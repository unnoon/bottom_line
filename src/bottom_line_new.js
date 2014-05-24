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
        Object.defineProperties(wrapper.__instance__ = {}, {
            chain:  {get: function() {return wrapper.__chain__},            enumerable: false, configurable: false},
            $chain: {get: function() {return new wrapper(wrapper.value)},   enumerable: false, configurable: false}
        });
        // stores non-chainable use methods
        Object.defineProperties(wrapper.__chain__ = {}, {
            value:  {get: function() {return wrapper.value},                enumerable: false, configurable: false}
        });

        if(nativeObj && nativeObj.prototype)
        {
            // extend native object with special 'bl' (bottom_line) access property
            Object.defineProperties(nativeObj.prototype, {
                // return object containing single use methods
                bl: {get: function() {wrapper.value = this; return wrapper.__instance__}, enumerable: false, configurable: false}
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

	/**
	 * Object
	 */
	constructWrapper(Object, 'obj', {
		/**
		 * @namespace obj
		 * @memberOf module:_
		 */
		static: {
            // TODO object reduce function
			/**
			 * Clones an object
			 * @public
			 * @static
			 * @method module:_.obj.clone
			 * @param   {Object}  obj   - object to be cloned
			 * @return  {Object}  clone - the cloned object
			 */
            // TODO These should be expanded with frozen, extrnsible states etc
			clone: function clone(obj) {
				var clone = __obj.create(__obj.getPrototypeOf(obj));

				__obj.getOwnPropertyNames(obj)._each(function(name) {
					__obj.defineProperty(clone, name, __obj.getOwnPropertyDescriptor(obj, name));
				});

				return clone;
			},
            /**
             * Clones an object
             * @public
             * @static
             * @method module:_.obj.cloneDeep
             * @param   {Object}  obj   - object to be cloned
             * @return  {Object}  clone - the cloned object
             */
            cloneDeep: function cloneDeep(obj) {
                var names;

                try       { names = obj._names(); }
                catch (e) { return obj }

                var clone = _.create(obj._proto());
                names._each(function (name) {
                    var pd = obj._descriptor(name);
                    if (pd.value) pd.value = _.cloneDeep(pd.value); // does this clone getters/setters ?
                    clone._define(name, pd);
                });
                return clone;
            },
			/**
			 * Extends an object with function/properties from a module object
			 * @public
			 * @static
			 * @method module:_.obj.extend
			 * @param   {Object}  obj          - object to be extended
			 * @param   {Object=} opt_settings - optional settings/default descriptor
			 * @param   {Object}  module       - object containing functions/properties to extend the object with
			 * @return  {Object}  obj          - the extended object
			 */
			extend: function(obj, opt_settings, module) {
                var settings = module && opt_settings;
                var module   = module || opt_settings;
                var descriptor;
                var config;

                var enumerable   =  settings && settings.enumerable;
                var configurable =  settings && settings.configurable;
                var writable     =  settings && settings.writable;
                var overwrite    = !settings || settings.overwrite !== false; // default is true
                var override     = !settings || settings.override  !== false; // default is true

                var loglevel     = (settings && settings.loglevel) || 'debug';

				module._each(function(value, prop) {
                    var overrideProperty  = override;
                    var overwriteProperty = overwrite;
                    var aliases           = false;

        			descriptor = module._descriptor(prop);
                    // global property overrides
                    if(_.isDefined(enumerable))                                 descriptor.enumerable   = enumerable;
                    if(_.isDefined(configurable))                               descriptor.configurable = configurable;
                    if(_.isDefined(writable) && descriptor._owns('writable'))   descriptor.writable     = writable;

                    // special property specific config
                    if((config = value) && config._owns('value'))
                    {
                        if(config.clone)                   descriptor.value = _.clone(config.value); // clone deep maybe?
                        if(config.exec)                    descriptor.value = config.value();
                        if(config._owns('enumerable'))     descriptor.enumerable   = config.enumerable;
                        if(config._owns('configurable'))   descriptor.configurable = config.configurable;
                        if(config._owns('writable'))       descriptor.writable     = config.writable;
                        if(config._owns('override'))       overrideProperty  = config.override;
                        if(config._owns('overwrite'))      overwriteProperty = config.overwrite;
                        if(config._owns('shim'))           overwriteProperty = config.shim;
                        if(config.aliases)                 aliases = true;
                    }

                    if(obj._owns(prop))
                    {
                        if(!overwriteProperty) return; // continue;
                        console[loglevel]('overwriting existing property: '+prop+' while extending: '+_.typeOf(obj));
                    }
                    else if(prop in obj)
                    {
                        if(!overrideProperty) return; // continue;
                        console[loglevel]('overriding existing property: '+prop+' while extending: '+_.typeOf(obj));
                    }

					obj.bl.define(prop, descriptor);
                    if(aliases) config.aliases._each(function(alias) {obj._define(alias, descriptor)})
				});

				return obj;
			},
			/**
			 * Checks is a property is defined
			 * @public
			 * @static
			 * @method module:_.obj.isDefined
			 * @param   {Object} prop - property to check
			 * @returns {boolean}     - indication of the property definition
			 */
			isDefined: function(prop) {
				return prop !== undefined;
			},
			/**
			 * Checks is a property is undefined
			 * @public
			 * @static
			 * @method module:_.obj.isUndefined
			 * @param   {Object} prop - property to check
			 * @returns {boolean}     - indication of the property definition
			 */
			isUndefined: function(prop) {
				return prop === undefined;
			},
			/**
			 * Returns the type of an object. Better suited then the one from js itself
			 * @public
			 * @static
			 * @method module:_.obj.typeof
			 * @param   {Object} obj - object tot check the type from
			 * @returns {string} - type of the object
			 */
			typeOf: function(obj) {
				return __obj.prototype.toString.call(obj)._between('[object ', ']')._decapitalize();
			}
		},
		/**
		 * Extension of the native Object class prototype
		 *
		 * @class Object
		 */
		prototype: {
            /**
             * Returns an array containing the keys of an object (enumerable properties))
             * @public
             * @method Object#_keys
             * @this   {Object}
             * @return {Array} keys of the object
             */
            keys: function() {
                return Object.keys(this);
            },
            /**
             * Returns the number of own properties on an object
             * @public
             * @method Object#_size
             * @this   {Object}
             * @return {number} the 'length' of the object
             */
            size: function() {
                var len = 0;

                for(var key in this)
                {
                    if(this.bl.owns(key)) len++;
                }

                return len;
            },
            /**
             * Returns an array containing the names of an object (includes non-enumerable properties)
             * @public
             * @method Object#_names
             * @return {Array} keys of the object
             */
            names: function() {
                return Object.getOwnPropertyNames(this);
            },
            /**
             * Shortcut for hasOwnProperty
             * @public
             * @method Object#_owns
             * @return {boolean} boolean indicating ownership
             */
            owns: Object.prototype.hasOwnProperty,
            /**
             * Shortcut for hasOwnProperty
             * @public
             * @method Object#_owns
             * @return {boolean} boolean indicating ownership
             */
            faux: function() {
                return this
            }
        }
	});

    /**
     * Array
     */
    constructWrapper(Array, 'arr', {
        /**
         *
         * @namespace arr
         * @memberOf module:_
         */
//		TODO add proper documentation
// 		/**
//		 * Converter function: converts an object to an array
//		 *
//		 * @param  {Object} obj - object to convert
//		 * @return {Array} the converted object
//		 */
        init: function (obj) {
            var type = _.typeOf(obj);

            switch (type) {
                case 'arguments' :
                    return __arr.prototype.slice.call(obj, 0);
                case 'object'    :
                case 'function'  :
                    return __obj.getOwnPropertyNames(obj).map(function (key) {
                        return {prop: key, value: obj[key]}
                    });
                case 'array'     :
                    return obj;
                case 'undefined' :
                case 'null'      :
                    return [];
                default          :
                    return [obj];
            }
        },
        /**
         * @class Array
         */
        prototype: {
            /**
             * Get/sets: the first element of an array
             * @public
             * @method Array#_first
             * @this   {Array}
             * @param  {any=}      val - value to set on the first element
             * @return {any|Array}     - first element of the array or the array itself
             */
            first: function(val) {
                if(val === undefined) return this[0];

                this[0] = val;

                return this;
            }
        }
    });

    /**
     * Extends an object with function/properties from a module object
     * @public
     * @static
     * @method module:_.obj.extend
     * @param   {Object}  obj          - object to be extended
     * @param   {Object=} opt_settings - optional settings/default descriptor
     * @param   {Object}  module       - object containing functions/properties to extend the object with
     * @return  {Object}  obj          - the extended object
     */
    function extend(obj, opt_settings, module) {
        var settings = module && opt_settings;
        var module   = module || opt_settings;
        var descriptor;
        var config;

        var enumerable   =  settings && settings.enumerable;
        var configurable =  settings && settings.configurable;
        var writable     =  settings && settings.writable;
        var overwrite    = !settings || settings.overwrite !== false; // default is true
        var override     = !settings || settings.override  !== false; // default is true

        var loglevel     = (settings && settings.loglevel) || 'debug';

        module._each(function(value, prop) {
            var overrideProperty  = override;
            var overwriteProperty = overwrite;
            var aliases           = false;

            descriptor = module._descriptor(prop);
            // global property overrides
            if(_.isDefined(enumerable))                                 descriptor.enumerable   = enumerable;
            if(_.isDefined(configurable))                               descriptor.configurable = configurable;
            if(_.isDefined(writable) && descriptor._owns('writable'))   descriptor.writable     = writable;

            // special property specific config
            if((config = value) && config._owns('value'))
            {
                if(config.clone)                   descriptor.value = _.clone(config.value); // clone deep maybe?
                if(config.exec)                    descriptor.value = config.value();
                if(config._owns('enumerable'))     descriptor.enumerable   = config.enumerable;
                if(config._owns('configurable'))   descriptor.configurable = config.configurable;
                if(config._owns('writable'))       descriptor.writable     = config.writable;
                if(config._owns('override'))       overrideProperty  = config.override;
                if(config._owns('overwrite'))      overwriteProperty = config.overwrite;
                if(config._owns('shim'))           overwriteProperty = config.shim;
                if(config.aliases)                 aliases = true;
            }

            if(obj._owns(prop))
            {
                if(!overwriteProperty) return; // continue;
                console[loglevel]('overwriting existing property: '+prop+' while extending: '+_.typeOf(obj));
            }
            else if(prop in obj)
            {
                if(!overrideProperty) return; // continue;
                console[loglevel]('overriding existing property: '+prop+' while extending: '+_.typeOf(obj));
            }

            obj._define(prop, descriptor);
            if(aliases) config.aliases._each(function(alias) {obj._define(alias, descriptor)})
        });

        return obj;
    }

	return _
});