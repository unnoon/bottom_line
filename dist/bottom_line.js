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

    /**
     * Collections general collection object to store general collection functions
     *
     * @private
     */
    var __coll = {
        /**
         * Edits the key valuer pairs of an object
         * @private
         * @this    {Array|Object}
         * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
         * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
         * @param   {Function}           onmatch - function to be executed on a match
         * @param   {boolean}            reverse - Boolean indicating if we should use inverse iteration
         * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | function
         * @param   {Object}             opt_ctx - optional context for the function
         * @returns {Array}                      - new array with the copied elements
         */
        _edit: function(all, invert, onmatch, reverse, target, $value, opt_ctx)
        {
            var first = !all, normal = !invert;
            var array, match, finish = false;
    
            var cb = (typeof($value) === 'function')? 	$value                                  :
                (array = _.isArray($value))? 		function(val) {return $value._.has(val)} :
                    function(val) {return val === $value};
    
            // note the reverse check should be fixed when this is also implemented for strings
            this._['each'+((reverse && _.isArray(this))?'Right':'')](function(val, i, _this, delta) {
                match = cb.call(opt_ctx, val, i, _this, delta);
                // remove normal or inverted match
                if(match === normal || finish) onmatch.call(target, val, i, _this, delta);
                // if first and the first match is made check if we are done
                if(first && match && !finish) return finish = array? !$value._.without(val).length : true, !(normal && finish);
            }, this);
    
            return target;
        },
        /**
         * Edits an array based on indices
         * @private
         * @method Array#__editKeys
         * @this    {Array|Object}
         * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
         * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
         * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
         * @param   {Object}             $opt_to_ctx - optional context for the function
         * @returns {Array|Object}                      - new array with the copied elements
         */
        _editKeys: function(invert, onmatch, reverse, target, $index, $opt_to_ctx)
        {
            var type = typeof($index), index;
            var first = !(typeof($opt_to_ctx) === 'number' || type === 'function'), normal = !invert;
            var array, match, finish = false;
    
            var cb = (type === 'function')?	$index                                               		:
                (array = _.isArray($index))?   function(i) {return $index._.has(i)}                 :
                    ($opt_to_ctx === undefined)?   function(i) {return i === $index}                   :
                        function(i) {return i._.between($index, $opt_to_ctx)};
    
            this._['each'+((reverse && _.isArray(this))?'Right':'')](function(val, i, _this, delta) {
                index = _.isArray(this)? (i - delta) : i; // the original index in the array
    
                match = cb.call($opt_to_ctx, index, _this);
                // remove normal or inverted match
                if(match === normal || finish) onmatch.call(target, i, _this);
                if(first && match && !finish) return finish = array? !$index._.without(index).length : true, !(normal && finish);
            }, this);
    
            return target;
        },
        /**
         * Finds first element that is picked by the callback function
         * @private
         * @this   {Array}
         * @param  {Function} cb      - callback function to be called for each element
         * @param  {Object=}  opt_ctx - optional context
         * @return {any} first value that is found
         */
        find: function(cb, opt_ctx) {
            var found;
    
            this._.each(function(elm) {
                if(cb.call(opt_ctx, elm)) return found = elm, false; // break iteration
            });
    
            return found;
        }
    };
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
            // TODO These should be expanded with frozen, extensible states etc
            clone: function clone(obj) {
                var clone = Array.isArray(obj)? [] : Object.create(Object.getPrototypeOf(obj));
    
                Object.getOwnPropertyNames(obj)._.each(function(name) {
                    Object.defineProperty(clone, name, Object.getOwnPropertyDescriptor(obj, name));
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
    
                try       { names = obj._.names(); } // this is ugly add a is primitive & is object function
                catch (e) { return obj }
    
                var clone = Object.create(obj._.proto());
                names._.each(function (name) {
                    var pd = obj._.descriptor(name);
                    if (pd.value) pd.value = _.cloneDeep(pd.value); // does this clone getters/setters ?
                    clone._.define(name, pd);
                });
                return clone;
            },
            /**""
             * Empties an object without destroying the object itself
             * @public
             * @static
             * @method module:_.obj.empty
             * @return  {Object}  this - for chaining
             */
            empty: function() {
                this.each(function(prop) {
                    delete this[prop];
                }, this);
    
                return this
            },
            /**
             * Extends an object with function/properties from a module object
             * @public
             * @static
             * @method module:_.obj.extend
             * @param   {Object}  obj          - object to be extended
             * @param   {Object=} settings_ - optional settings/default descriptor
             * @param   {Object}  module       - object containing functions/properties to extend the object with
             * @return  {Object}  obj          - the extended object
             */
            extend: function(obj, settings_, module) {
                var settings = module && settings_;
                var module   = module || settings_;
                var descriptor;
                var config;
    
                var enumerable   =  settings && settings.enumerable;
                var configurable =  settings && settings.configurable;
                var writable     =  settings && settings.writable;
                var overwrite    = !settings || settings.overwrite !== false; // default is true
                var override     = !settings || settings.override  !== false; // default is true
    
                var loglevel     = (settings && settings.loglevel) || 'debug';
                if(loglevel === 'debug' && !console.debug) loglevel = 'log'; // shim for old browsers i.e 10... better solve it with a shim though
    
                for(var prop in module) // we can't use ._.each here otherwise we will execute the getter
                {   if(module.hasOwnProperty(prop))
                    {
                        descriptor = module._.descriptor(prop);
    
                        var overrideProperty    = override;
                        var overwriteProperty   = overwrite;
                        var aliases             = false;
                        var isGetterSetter      = !!(descriptor.get || descriptor.set);
    
                        // global property overrides
                        if(_.isDefined(enumerable))                                 descriptor.enumerable   = enumerable;
                        if(_.isDefined(configurable))                               descriptor.configurable = configurable;
                        if(_.isDefined(writable) && descriptor._.owns('writable'))  descriptor.writable     = writable;
    
                        // special property specific config
                        // FIXME this doesn't work for getters & setters
                        if(!isGetterSetter && module[prop]._.owns('value'))
                        {
                            config = module[prop];
                            descriptor.value = config.value;
    
                            if(config.clone)                    descriptor.value = _.clone(config.value); // clone deep maybe?
                            if(config.exec)                     descriptor.value = config.value();
                            if(config._.owns('enumerable'))     descriptor.enumerable   = config.enumerable;
                            if(config._.owns('configurable'))   descriptor.configurable = config.configurable;
                            if(config._.owns('writable'))       descriptor.writable     = config.writable;
                            if(config._.owns('override'))       overrideProperty  = config.override;
                            if(config._.owns('overwrite'))      overwriteProperty = config.overwrite;
                            if(config._.owns('shim'))           overwriteProperty = config.shim;
                            if(config.aliases)                  aliases = true;
                        }
    
                        if(obj._.owns(prop))
                        {
                            if(!overwriteProperty) continue; // continue;
                            console[loglevel]('overwriting existing property: '+prop+' while extending: '+_.typeOf(obj));
                        }
                        else if(prop in obj)
                        {
                            if(!overrideProperty) continue; // continue;
                            console[loglevel]('overriding existing property: '+prop+' while extending: '+_.typeOf(obj));
                        }
    
                        obj._.define(prop, descriptor);
                        if(aliases) config.aliases._.each(function(alias) {obj._.define(alias, descriptor)})
                    }
                }
    
    
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
                return Object.prototype.toString.call(obj)._.between('[object ', ']')._.decapitalize();
            }
        },
        /**
         * Extension of the native Object class prototype
         *
         * @class Object
         */
        prototype: {
            /**
             * Copies the occurrences from an array to an new object
             * @private
             * @method Object#__cp
             * @this    {Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Object}                     - new array with the copied elements
             */
            _cp: function(all, invert, target, $value, opt_ctx)
            {
                return this._._edit(all, invert, function(val, key, obj) {
                    Object.defineProperty(this, key, Object.getOwnPropertyDescriptor(obj, key)); // TODO maybe add a nice function to do stuff like this
                }, false, target, $value, opt_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @private
             * @method Object#__cpKeys
             * @this    {Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Object}                      - new array with the copied elements
             */
            _cpKeys: function(invert, target, $value, opt_to_ctx)
            {
                return this._._editKeys(invert, function(key, _this) {this[key] = _this[key];}, false, target, $value, opt_to_ctx);
            },
            /**
             * Copies a value to an array
             * @public
             * @method Object#_copy
             * @this   {Object}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}                 this       - mutated array for chaining
             */
            copy: function(to, $value, opt_ctx)
            {
                return this._._cp(false, false, to, $value, opt_ctx);
            },
            /**
             * Copies all similar values to an array
             * @public
             * @method Object#_copy$
             * @this   {Object}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}                 this       - mutated array for chaining
             */
            copyAll: function(to, $value, opt_ctx)
            {
                return this._._cp(true, false, to, $value, opt_ctx);
            },
            /**
             * Copies keys to an array
             * @public
             * @method Object#_copyKeys
             * @this   {Object}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}                 this       - mutated array for chaining
             */
            copyKeys: function(to, $index, opt_to_ctx)
            {
                return this._._cpKeys(false, to, $index, opt_to_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @private
             * @method Object#__cut
             * @this    {Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Object}                      - new array with the copied elements
             */
            _cut: function(all, invert, target, $value, opt_ctx)
            {
                return this._._edit(all, invert, function(val, key, _this) {this[key] = _this[key]; delete _this[key]}, false, target, $value, opt_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @private
             * @method Object#__cutKeys
             * @this    {Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Object}                      - new array with the copied elements
             */
            _cutKeys: function(invert, target, $value, opt_ctx)
            {
                return this._._editKeys(invert, function(key, _this) {this[key] = _this[key]; delete _this[key]}, false, target, $value, opt_ctx);
            },
            /**
             * Cut a value to an array
             * @public
             * @method Object#_cut
             * @this   {Object}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}                 this       - mutated array for chaining
             */
            cut: function(to, $value, opt_ctx)
            {
                return this._._cut(false, false, to, $value, opt_ctx);
            },
            /**
             * Cut all similar values to an array
             * @public
             * @method Object#_cutAll
             * @this   {Object}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}                 this       - mutated array for chaining
             */
            cutAll: function(to, $value, opt_ctx)
            {
                return this._._cut(true, false, to, $value, opt_ctx);
            },
            /**
             * Copies keys to an array
             * @public
             * @method Object#_cutKeys
             * @this   {Object}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}                 this       - mutated object for chaining
             */
            cutKeys: function(to, $index, opt_to_ctx)
            {
                return this._._cutKeys(false, to, $index, opt_to_ctx);
            },
            /**
             * Copies keys to an array
             * @public
             * @method Object#_define
             * @this   {Object}
             * @param  {string}       prop - the property name
             * @param  {Object} descriptor - descriptor object
             * @return {Object}       this - object for chaining
             */
            define: function(prop, descriptor)
            {
                return Object.defineProperty(this, prop, descriptor)
            },
            /**
             * Copies keys to an array
             * @public
             * @method Object#_define
             * @this   {Object}
             * @param  {string}       prop - the property name
             * @return {Object} descriptor - descriptor object
             */
            descriptor: function(prop)
            {
                return Object.getOwnPropertyDescriptor(this, prop)
            },
            /**
             * Removes the occurrences from an object
             * @private
             * @method Object#__del
             * @this    {Object}
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Object}                      - The array without the element
             */
            _del: function(invert, $index, opt_to_ctx)
            {
                return this._._editKeys(invert, function(key) {delete this[key]}, false, this, $index, opt_to_ctx);
            },
            /**
             * Object iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * @public
             * @method Object#_each
             * @this  {Object}
             * @param {Function} cb      - callback function to be called for each element
             * @param {Object=}  opt_ctx - optional context
             */
            each: function(cb, opt_ctx) {
                // FIXME this[key] will execute getter properties...!!!
                // TODO maybe a faster version using keys. I now prefer using for in  because it will not create a new array object with the keys
                for(var key in this)
                {
                    if(!this.hasOwnProperty(key)) continue;
                    if(cb.call(opt_ctx, this[key], key, this) === false) break;
                }
            },
            /**
             * Edits the key value pairs of an object
             * @private
             * @method Object#__edit
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _edit: __coll._edit,
            /**
             * Edits an object based on keys
             * @private
             * @method Array#__editKeys
             * @this    {Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Object}                      - new array with the copied elements
             */
            _editKeys: __coll._editKeys,
            /**
             * Filters
             * @public
             * @method Object#_filter
             * @this   {Object}
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             * @return {Array} array containing the filtered values
             */
            filter: function(cb, opt_ctx) {
                var filtered = [];
    
                this._.each(function(elm) {
                    if(cb.call(opt_ctx, elm)) filtered.push(elm);
                });
    
                return filtered;
            },
            /**
             * Finds first element that is picked by the callback function
             * @public
             * @method Object#_find
             * @this   {Object}
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             * @return {any} first value that is found
             */
            find: __coll.find,
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
                    if(this._.owns(key)) len++;
                }
    
                return len;
            },
            /**
             * Returns an array containing the names of an object (includes non-enumerable properties)
             * @public
             * @method Object#names
             * @return {Array} keys of the object
             */
            names: function() {
                return Object.getOwnPropertyNames(this);
            },
            /**
             * Shortcut for hasOwnProperty
             * @public
             * @method Object#owns
             * @return {boolean} boolean indicating ownership
             */
            owns: Object.prototype.hasOwnProperty,
            /**
             * Returns an array containing the keys & values of an object (enumerable properties)
             * @public
             * @method Object#_pairs
             * @this   {Object}
             * @return {Array} keys & values of the object in a singular array [key1, val1, key2, val2, ...]]
             */
            pairs: function() {
                var pairs = [];
    
                this._.each(function(val, key) {
                    pairs.push(key, val);
                });
    
                return pairs;
            },
            /**
             * Sets/gets the prototype of an object
             * NOTE setting a prototype using __proto__ is non standard use at your own risk!
             * @public
             * @method Object#_proto
             * @this   {Object}
             * @param   {Array}  proto      - the prototype to be set
             * @returns {Array|Object} this - the prototype of the object or the object itself for chaining
             */
            proto: function(proto) {
                if(proto === undefined) return Object.getPrototypeOf(this);
    
                this._._proto__ = proto;
    
                return this;
            },
            // TODO proper implementation
    //			/**
    //			 * Proxies all functions of an object (including those from the prototype in a certain context.
    //			 * @public
    //			 * @method Object#_proxy
    //			 * @param   {Object} obj - object containing the functions to be proxied
    //			 * @param   {Object} ctx - context to proxy the functions in
    //			 * @returns {Object} obj - the object containing the proxied versions of the functions
    //			 */
    //			proxy: function(obj, ctx) {
    //				for(var prop in obj)
    //				{
    //					if(typeof(obj[prop]) === 'function') obj[prop] = obj[prop].bind(ctx);
    //				}
    //
    //				return obj;
    //			},
            /**
             * Removes the occurrences from an object based on value
             * @public
             * @method Object#_rm
             * @this    {Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - The array without the element
             */
            _rm: function(all, invert, $value, opt_ctx)
            {
                return this._._edit(all, invert, function(val, key) {delete this[key]}, all, this, $value, opt_ctx);
            },
            /**
             * Better to string version
             * @public
             * @method Object#_toString
             * @this    {Object}
             * @returns {string} - string representation of the object
             */
            toString: function()
            {
                var output = '';
    
                for(var key in this)
                {
                    if(this.hasOwnProperty(key))
                    {   // TODO add punctuation mark if the key holds a string
                        // TODO add proper formatting
                        output += (output? ', ' : '{') + key + ': ' + (this[key]? this[key]._.toString() : this[key]);
                    }
                }
    
                return output + '}';
            },
            /**
             * Returns an array containing the values of an object (enumerable properties)
             * @public
             * @method Object#_values
             * @this   {Object}
             * @return {Array} values of the object
             */
            values: function() {
                var values = [];
    
                this._.each(function(elm) {
                    values.push(elm);
                });
    
                return values;
            },
            /**
             * Removes the first occurrence in an object
             * @public
             * @method Object#_without
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - The array without the element
             */
            without: function($value, opt_ctx) {
                return this._._rm(false, false, $value, opt_ctx);
            },
            /**
             * Removes the first occurrence in an array
             * @public
             * @method Array#_$without
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Object }                    - NEW object without the element
             */
            $without: function($value, opt_ctx) {
                return this._._cp(false, true, {}, $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @method Array#_withoutAll
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Object}                      - The array without the element
             */
            withoutAll: function($value, opt_ctx) {
                return this._._rm(true, false, $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @method Array#_$withoutAll
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Object}                      - NEW array without the element
             */
            $withoutAll: function($value, opt_ctx) {
                return this._._cp(true, true, [], $value, opt_ctx);
            },
            /**
             * Remove elements based on index
             * @public
             * @method Object#_withoutKeys
             * @this   {Object}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}   this   - mutated array for chaining
             */
            withoutKeys: function($index, opt_to_ctx)
            {
                return this._._del(false, $index, opt_to_ctx);
            },
            /**
             * Remove elements based on index
             * @public
             * @method Object#_$withoutKeys
             * @this   {Object}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Object}   this   - mutated array for chaining
             */
            $withoutKeys: function($index, opt_to_ctx)
            {
                return this._._cpKeys(true, [], $index, opt_to_ctx);
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
        init: function(obj) {
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
        static: {
            _utils: {
                remove: function(i) {}
            },
            /**
             * Concats array into a new array
             * @public
             * @static
             * @method module:_.arr.concat
             * @param {...Array} __arrays - arrays to concat
             * @returns  {Array}          - the concatenated array
             */
            concat: function(__arrays) {
                return Array.prototype.concat.apply([], arguments);
            }
        },
        /**
         * @class Array
         */
        prototype: {
            /**
             * Append an array to the current array
             * @public
             * @method module:_.arr.append
             * @this       {Array}
             * @param   {...Array} __arrays - arrays to be appended
             * @returns    {Array}     this - this appended with the array
             */
            // NOTE this can probably done using several copies
            append: function(__arrays) {
                var arr;
                var start;
                var i, max;
    
                for(var k = 0; k < arguments.length; k++)
                {
                    arr = arguments[k]; if(!arr) continue;
    
                    start        = this.length; // start position to start appending
                    this.length += arr.length;  // set the length to the length after appending
                    // copy the properties in case defined
                    for(i = 0, max = arr.length; i < max; i++)
                    {
                        if(arr[i] === undefined && !arr._.owns(i)) continue; // take into account broken arrays
                        this[start+i] = arr[i];
                    }
                }
    
                return this;
            },
            /**
             * Append an array to the current array. The result is a new array
             * @public
             * @method module:_.arr.$append
             * @this    {Array}
             * @param   {...Array} __arrays - arrays to be appended
             * @returns {Array}             - The new array that is the result of appending
             */
            $append: function(__arrays) {
                return _.clone(this)._.append.apply(this, arguments);
            },
            /**
             * Returns the average of a number based array
             * @public
             * @method module:_.arr.avg
             * @this    {Array<number>}
             * @returns {number} - Average of the numbers in the array
             */
            avg: function() {
                if(!this.length) return;
    
                return this._.sum()/this.length;
            },
            /**
             * Removes al falsey values from an array
             * @public
             * @method module:_.arr.compact
             * @this   {Array}
             * @return {Array}                 this       - mutated array for chaining
             */
            compact: function()
            {
                return this._.withoutAll(function(val) {return !val});
            },
            /**
             * Removes al falsey values from an array into a new array
             * @public
             * @method module:_.arr.$compact
             * @this   {Array}
             * @return {Array}                 this       - mutated array for chaining
             */
            $compact: function()
            {
                return this._.$withoutAll(function(val) {return !val});
            },
            /**
             * Copies a value to an array
             * @public
             * @method Array#copy
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            copy: function(to, $value, opt_ctx)
            {
                return this._._cp(false, false, to, $value, opt_ctx);
            },
            /**
             * Copies all similar values to an array
             * @public
             * @method Array#copyAll
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            copyAll: function(to, $value, opt_ctx)
            {
                return this._._cp(true, false, to, $value, opt_ctx);
            },
            /**
             * Copies keys to an array
             * @public
             * @method Array#copyKeys
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            copyKeys: function(to, $index, opt_to_ctx)
            {
                return this._._cpKeys(false, to, $index, opt_to_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @private
             * @method Array#_cp
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cp: function(all, invert, target, $value, opt_ctx)
            {
                return this._._edit(all, invert, function(val) {this.push(val)}, false, target, $value, opt_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @private
             * @method Array#_cut
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cut: function(all, invert, target, $value, opt_ctx)
            {
                return this._._edit(all, invert, function(val, i, _this) {this.push(val); _this.splice(i, 1)}, false, target, $value, opt_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @private
             * @method Array#_cutKeys
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cutKeys: function(invert, target, $value, opt_ctx)
            {
                return this._._editKeys(invert, function(i, _this) {this.push(_this[i]); _this.splice(i, 1)}, false, target, $value, opt_ctx);
            },
            /**
             * Cut a value to an array
             * @public
             * @method Array#cut
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            cut: function(to, $value, opt_ctx)
            {
                return this._._cut(false, false, to, $value, opt_ctx);
            },
            /**
             * Cut all similar values to an array
             * @public
             * @method Array#cutAll
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            cutAll: function(to, $value, opt_ctx)
            {
                return this._._cut(true, false, to, $value, opt_ctx);
            },
            /**
             * Copies keys to an array
             * @public
             * @method Array#cutKeys
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            cutKeys: function(to, $index, opt_to_ctx)
            {
                return this._._cutKeys(false, to, $index, opt_to_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array. Results are copied at the end of the array. // TODO copy at specific index
             * @private
             * @method Array#_cpKeys
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cpKeys: function(invert, target, $value, opt_to_ctx)
            {
                return this._._editKeys(invert, function(i, _this) {this.push(_this[i]);}, false, target, $value, opt_to_ctx);
            },
            /**
             * Edits the key valuer pairs of an object
             * @private
             * @this    {Array|Object}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {Function}           onmatch - function to be executed on a match
             * @param   {boolean}            reverse - Boolean indicating if we should use inverse iteration
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            // TODO decide we make a specialized array version of edit
            _edit: function(all, invert, onmatch, reverse, target, $value, opt_ctx)
            {
                var first = !all, normal = !invert;
                var array, match, finish = false;
    
                var cb = (typeof($value) === 'function')? 	$value                                   :
                         (array = _.isArray($value))? 		function(val) {return $value._.has(val)} : // TODO decode if we should remove the array option
                                                            function(val) {return val === $value};
    
                // note the reverse check should be fixed when this is also implemented for strings
                this._['each'+((reverse && _.isArray(this))?'Right':'')](function(val, i, _this, delta) {
                    match = cb.call(opt_ctx, val, i, _this, delta);
                    // remove normal or inverted match
                    if(match === normal || finish) onmatch.call(target, val, i, _this, delta);
                    // if first and the first match is made check if we are done
                    if(first && match && !finish) return finish = array? !$value._.without(val).length : true, !(normal && finish);
                }, this);
    
                return target;
            },
            /**
             * Edits an array based on indices
             * @private
             * @method Array#_editKeys
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _editKeys: __coll._editKeys,
            /**
             * Removes the occurrences from an array
             * @private
             * @method Array#_del
             * @this    {Array}
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Array}                      - The array without the element
             */
            _del: function(invert, $index, opt_to_ctx)
            {
                return this._._editKeys(invert, function(i) {this.splice(i, 1);}, false, this, $index, opt_to_ctx);
            },
            /**
             * Returns the difference between 2 arrays
             * @public
             * @method Array#diff
             * @this     {Array}
             * @param {...Array} var_args - 2 or more arrays to calc the difference from
             * @returns  {Array}          - this for chaining
             */
            // TODO this should be an alias
            diff: function(arr)
            {
                return this._.without(arr);
            },
            /**
             * Returns the difference between 2 arrays in a new array
             * @public
             * @method Array#$diff
             * @this     {Array}
             * @param    {Array} arr - array to subtract from this
             * @returns  {Array}     - new array containing the difference between the first array and the others
             */
            $diff: function(arr)
            {
                return this._.$selectAll(function(val) {return !arr._.has(val)});
            },
            /**
             * Mutator: Creates a multidimensional array. The dimensions come from the array itself
             * i.e. [3, 6].$.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
             * @public
             * @method Array#dimit
             * @this   {Array}
             * @param  {any|Function=} opt_init - initial value for the array. Can be either a value or a function specifying the value
             * @param  {Object}        opt_ctx  - optional context for the init function
             * @return {Array}                  - this for chaining
             */
            dimit: function(opt_init, opt_ctx)
            {
                var dimensions = _.clone(this);
                this.length    = dimensions[0];
                var init       = (typeof(opt_init) === 'function')? opt_init : function() {return opt_init};
    
                // add other dimensions
                addDim(this, 0, dimensions);
    
                return this;
    
                function addDim(arr, dim, dimensions)
                {
                    for(var i = 0, max = dimensions[dim]; i < max; i++)
                    {
                        arr[i] = (dim === dimensions.length-1)? init.call(opt_ctx) : new Array(dimensions[dim+1]); // if last dimension set initial value else create a new array
                        if(dim === dimensions.length-2 && _.isUndefined(opt_init)) continue; // continue if we are adding the 2nd last dimension and opt_init is undefined
                        addDim(arr[i], dim+1, dimensions); // add another dimension
                    }
                }
            },
            /**
             * Mutator: Creates a multidimensional array. The dimensions come from the array itself
             * i.e. [3, 6]._.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
             * @public
             * @method Array#$dimit
             * @this   {Array}
             * @param  {any|Function=} opt_init - initial value for the array. Can be either a value or a function specifying the value
             * @param  {Object}        opt_ctx  - optional context for the init function
             * @return {Array}                  - this initialized multi-dimensional array
             */
            $dimit: function(opt_init, opt_ctx)
            {
                var dimensions = this;
                var arr        = new Array(dimensions[0]);
                var init       = (typeof(opt_init) === 'function')? opt_init : function() {return opt_init};
    
                // add other dimensions
                addDim(arr, 0, dimensions);
    
                return arr;
    
                function addDim(arr, dim, dimensions)
                {
                    for(var i = 0, max = dimensions[dim]; i < max; i++)
                    {
                        arr[i] = (dim === dimensions.length-1)? init.call(opt_ctx) : new Array(dimensions[dim+1]); // if last dimension set initial value else create a new array
                        if(dim === dimensions.length-2 && _.isUndefined(opt_init)) continue; // continue if we are adding the 2nd last dimension and opt_init is undefined don't initialize the array
                        addDim(arr[i], dim+1, dimensions); // add another dimension
                    }
                }
            },
            /**
             * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @method Array#each
             * @this   {Array}
             * @param  {number=}  opt_step - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb       - callback function to be called for each element
             * @param  {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}             - this array for chaining
             */
            each: function(opt_step, cb, opt_ctx) {
                if(typeof(opt_step) === 'function')
                    return this._._each(1, opt_step, cb);
                else
                    return this._._each(opt_step, cb, opt_ctx);
            },
            /**
             * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @private
             * @method Array#_each
             * @this   {Array}
             * @param  {number=}  step     - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb       - callback function to be called for each element
             * @param  {Object=}  opt_ctx  - optional context for the callback function
             * @return {boolean}           - the result for the halting condition of the callback function.
             * 								 false means iteration was broken prematurely.
             * 								 This information can passed on in nested loops for multi-dimensional arrays
             */
            _each: function(step, cb, opt_ctx) {
                var from = 0, to = this.length;
                var val, diff, size = to, delta = 0;
    
                for(var i = from; i < to; i += step)
                {
                    if((val = this[i]) === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if(cb.call(opt_ctx, this[i], i, this, delta) === false) return false; // return result of the callback function
                    if(diff = this.length - size) i += diff, to += diff, size += diff, delta += diff; // correct index after insertion or deletion
                }
    
                return true;
            },
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @method Array#eachRight
             * @this  {Array}
             * @param {number=}  opt_step - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param {function} cb       - callback function to be called for each element
             * @param {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}            - this array for chaining
             */
            eachRight: function(opt_step, cb, opt_ctx) {
                if(typeof(opt_step) === 'function')
                    return this._._eachRight(1, opt_step, cb);
                else
                    return this._._eachRight(opt_step, cb, opt_ctx);
            },
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @private
             * @method Array#_eachRight
             * @this  {Array}
             * @param {number=}  step     - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param {function} cb       - callback function to be called for each element
             * @param {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}            - this array for chaining
             */
            _eachRight: function(step, cb, opt_ctx) {
                var from = this.length-1, to = -1;
    
                for(var i = from; i > to; i -= step)
                {
                    if(this[i] === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if(cb.call(opt_ctx, this[i], i, this) === false) break;
                }
    
                return this;
            },
            /**
             * Finds first element that is picked by the callback function
             * @public
             * @method Array#find
             * @this   {Array}
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             * @return {any} first value that is found
             */
            find: __coll.find,
            /**
             * Finds all elements according to the callback function
             * @public
             * @method Array#_findAll
             * @this   {Array}
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             * @return {Array} first value that is found
             */
            // TODO this should be an alias
            _findAll: function(cb, opt_ctx) {
                return this._.$selectAll(cb, opt_ctx);
            },
            /**
             * Get/sets: the first element of an array
             * @public
             * @method Array#first
             * @this   {Array}
             * @param  {any=}      val - value to set on the first element
             * @return {any|Array}     - first element of the array or the array itself
             */
            first: function(val) {
                if(val === undefined) return this[0];
    
                this[0] = val;
    
                return this;
            },
            /**
             * Accessor: Flattens a 2 dimensional array
             * @public
             * @method Array#flatten
             * @this    {Array}
             * @returns {Array} - this for chaining
             */
            flatten: function() {
                return this._.each(function(val, i) {
                    if(_.isArray(val)) this.splice.apply(this, val._.insert(1)._.insert(i));
                }, this)
            },
            /**
             * Accessor: Flattens a 2 dimensional array
             * @public
             * @method Array#$flatten
             * @this    {Array}
             * @returns {Array} - new flattened version of the array
             */
            $flatten: function() {
                return this.concat.apply([], this);
            },
            /**
             * Accessor: Check is an array contains a certain value
             * @public
             * @method Array#has
             * @this    {Array}
             * @param   {Object}  elm - element to check membership of
             * @returns {boolean}     - boolean indicating if the array contains the element
             */
            has: function(elm) {
                return this.indexOf(elm) > -1;
            },
            /**
             * Mutator: Inserts an element in a specific location in an array
             * @public
             * @method Array#insert
             * @this    {Array}
             * @param   {Object}  elm - element to check membership of
             * @param   {number}  i   - position to insert the element
             * @return  {Array  }     - this for chaining
             */
            insert: function(elm, i) {
                return this.splice(i, 0, elm), this;
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * NOTE assumes the arrays do not contain duplicate values
             * @public
             * @method Array#intersect
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            intersect: function(arr) {
                return this._.selectAll(function(val) {
                    return arr._.has(val);
                }, this);
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * @public
             * @method Array#$intersect
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            $intersect: function(arr) {
                return this._.$selectAll(function(val) {
                    return arr._.has(val);
                }, this);
            },
            /**
             * Checks if an array intersects an other
             * @public
             * @method Array#intersects
             * @this    {Array}
             * @param   {Array}  arr - array to check intersection with
             * @returns {boolean}     - boolean indicating if the 2 arrays intersect
             */
            intersects: function(arr) {
                var intersects = false;
    
                this._.each(function(val) {
                    if(arr._.has(val)) return !(intersects = true);
                });
    
                return intersects;
            },
            /**
             * gets/sets the last element of an array
             * @public
             * @method Array#last
             * @this    {Array}
             * @param   {any}      val - Value to be set as the last element
             * @returns {any|Array}    - last element of the array
             */
            last: function(val) {
                if(val === undefined) return this[this.length-1];
    
                this[this.length-1] = val;
    
                return this;
            },
            /**
             * Accessor: Returns the maximum value of an array with numbers
             * @public
             * @method Array#max
             * @this    {Array<number>|Array<any>}
             * @param   {Function} opt_compare - optional function to determine the the max in case of non-numeric array
             * @returns {number|any} - maximum number or element in the array
             */
            max: function(opt_compare) {
                if(opt_compare === undefined)
                {
                    return Math.max.apply(null, this);
                }
                else
                {
                    var max = this[0];
    
                    this._.each(function(elm) {
                        max = opt_compare(elm, max) > 0? elm : max;
                    });
    
                    return max;
                }
            },
            /**
             * Accessor: Returns the minimum value of an array with numbers
             * @public
             * @method Array#min
             * @this    {Array<number>|Array<any>}
             * @param   {Function=} opt_compare - optional compare function
             * @returns {number|any} - minimum element in the array
             */
            min: function(opt_compare) {
                if(opt_compare === undefined)
                {
                    return Math.min.apply(null, this);
                }
                else
                {
                    var min = this[0];
    
                    this._.each(function(elm) {
                        min = opt_compare(elm, min) < 0? elm : min;
                    });
    
                    return min;
                }
            },
            /**
             * Modifies the members of an array according to a certain function
             * @public
             * @method Array#modify
             * @this    {Array}
             * @param   {Function} modifier - function that modifies the array members
             * @param   {Object=}  opt_ctx  - optional context for the modifier function
             * @returns {Array}             - the modified array
             */
            modify: function(modifier, opt_ctx) {
                this._.each(function(val, i) {
                    this[i] = modifier.call(opt_ctx, val, i, this);
                }, this);
    
                return this;
            },
            /**
             * Copies and modifies the members of an array according to a certain function
             * @public
             * @method Array#$modify
             * @this    {Array}
             * @param   {Function} modifier - function that modifies the array members
             * @param   {Object=}  opt_ctx  - optional context for the modifier function
             * @returns {Array}             - the modified array
             */
            $modify: function(modifier, opt_ctx)
            {
                return _.clone(this)._.modify(modifier, opt_ctx);
            },
            /**
             * Chainable version of push
             * @public
             * @method Array#push
             * @this   {Array}
             * @param  {...any} var_args - one or more elements to add to an array
             * @return {Array}  this     - this for chaining
             */
            push: function(var_args) {
                this.push.apply(this, arguments);
    
                return this;
            },
            /**
             * Accessor: Returns a random element from the array
             * @public
             * @method Array#random
             * @this   {Array}
             * @return {any} - random element from the array
             */
            random: function() {
                return this[_.int.random(0, this.length - 1)];
            },
            /**
             * Removes the occurrences from an array
             * @private
             * @method Array#_rm
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - The array without the element
             */
            _rm: function(invert, $value, opt_ctx)
            {
                return this._._edit(false, invert, function(val, i) {this.splice(i, 1);}, false, this, $value, opt_ctx);
    
                //for(var i = 0; i < this.length; i++)
                //{
                //
                //}
    
            },
            /**
             * Removes all the occurrences from an array
             * @private
             * @method Array#_rm
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - The array without the element
             */
            _rmAll: function(invert, $value, opt_ctx)
            {
                return this._._edit(true, invert, function(val, i) {this.splice(i, 1);}, false, this, $value, opt_ctx);
            },
            /**
             * Select the first occurrence in an array
             * @public
             * @method Array#select
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - array with the selected element
             */
            select: function($value, opt_ctx) {
                return this._._rm(true, $value, opt_ctx);
            },
            /**
             * Accessor: Returns the first element found by the selector function
             * @public
             * @method Array#$select
             * @this    {Array}
             * @param   {Function} $value   - selector function callback to be called on each element
             * @param   {Object=}  opt_ctx  - optional context for the callback function
             * @returns {any}               - the found element or undefined otherwise
             */
            $select: function($value, opt_ctx) {
                return this._._cp(false, false, [], $value, opt_ctx);
            },
            /**
             * Select all occurrence in an array
             * @public
             * @method Array#selectAll
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - array with the selected elements
             */
            selectAll: function($value, opt_ctx) {
                return this._._rmAll(true, $value, opt_ctx);
            },
            /**
             * Select all occurrence in an array and copies them to a new array
             * @public
             * @method Array#$selectAll
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - array with the selected elements
             */
            $selectAll: function($value, opt_ctx) {
                return this._._cp(true, false, [], $value, opt_ctx);
            },
            /**
             * Selects elements based on index, removes others
             * @public
             * @method Array#selectKeys
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            selectKeys: function($index, opt_to_ctx)
            {
                return this._._del(true, $index, opt_to_ctx);
            },
            /**
             * Selects elements based on index into a new array
             * @public
             * @method Array#$selectKeys
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            $selectKeys: function($index, opt_to_ctx)
            {
                return this._._cpKeys(false, [], $index, opt_to_ctx);
            },
            /**
             * Retrieves and sets the size of an array
             * @public
             * @method Array#size
             * @this    {Array}
             * @param   {number} size  - the new size of the array
             * @returns {number|Array} - the length of the arrayu or the array itself
             */
            size: function(size) {
                if(size === undefined) return this.length;
    
                this.length = size;
    
                return this;
            },
            /**
             * Accessor: Returns the sum of all numbers in a number array
             * @public
             * @method Array#sum
             * @this    {Array<number>}
             * @returns {number} - sum of the  number array
             */
            sum: function() {
                if(!this.length) return;
    
                return this.reduce(function(a, b) { return a + b });
            },
            /**
             * Better to string version
             * @public
             * @method Array#toString
             * @this    {Array}
             * @returns {string} - string representation of the array
             */
            toString: function()
            {
                var output = '[';
    
                for(var i = 0, max = this.length; i < max; i++)
                {
                    output += (i? ', ' : '') + this[i]._.toString();
                }
    
                return output + ']';
            },
            /**
             * Calculates the union for 2 arrays
             * @public
             * @method Array#unify
             * @this   {Array}
             * @param  {Array} arr  - array to unfiy
             * @return {Array} this - unified with the other
             */
            unify: function(arr) {
                return this._.append(arr)._.unique();
            },
            /**
             * Calculates the union for 2 arrays into an new array
             * @public
             * @method Array#$unify
             * @this   {Array}
             * @param  {Array} arr  - array to unfiy
             * @return {Array}      - new array containing the unification
             */
            $unify: function(arr) {
                var app = this._.$append(arr);
                var output = app._.unique();
    
                return output;
    
    //				return this._.$append(arr)._.unique();
            },
            /**
             * Removes duplicate values in an array
             * @public
             * @method Array#unique
             * @this    {Array}
             * @returns {Array} - new array without duplicates
             */
            unique: function() {
                this._.eachRight(function(val, i) {
                    this._.each(function(duplicate, j) {
                        if(val === duplicate && j < i) return this.splice(i, 1), false;
                        return j < i;
                    }, this)
                }, this);
    
                return this;
            },
            /**
             * Accessor: Returns a new version of the array without duplicates
             * @public
             * @method Array#$unique
             * @this    {Array}
             * @returns {Array} - new array without duplicates
             */
            $unique: function() {
                var unique = [];
    
                this._.each(function(val) {
                    if(!unique._.has(val)) unique.push(val);
                }, this);
    
                return unique;
            },
            /**
             * Removes the first occurrence in an array
             * @public
             * @method Array#without
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - The array without the element
             */
            without: function($value, opt_ctx) {
                return this._._rm(false, $value, opt_ctx);
            },
            /**
             * Removes the first occurrence in an array
             * @public
             * @method Array#$without
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - NEW array without the element
             */
            $without: function($value, opt_ctx) {
                return this._._cp(false, true, [], $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @method Array#withoutAll
             * @this    {Array}
             * @param   {any|Array|Function} $value - Element to be deleted | Array of elements | or a function
             * @param   {Object=}             ctx_  - optional context or the function
             * @returns {Array}                     - The array without the element
             */
            //withoutAll: function($value, opt_ctx) {
            //    return this._._rmAll(false, $value, opt_ctx);
            //},
            withoutAll: function($value, ctx_) {
                return this._._rmAll(false, $value, ctx_);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @method Array#$withoutAll
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - NEW array without the element
             */
            $withoutAll: function($value, opt_ctx) {
                return this._._cp(true, true, [], $value, opt_ctx);
            },
            /**
             * Remove elements based on index
             * @public
             * @method Array#withoutKeys
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} to_ctx_ - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            withoutKeys: function($index, to_ctx_)
            {
                return this._._del(false, $index, to_ctx_);
            },
            /**
             * Remove elements based on index
             * @public
             * @method Array#$withoutKeys
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            $withoutKeys: function($index, opt_to_ctx)
            {
                return this._._cpKeys(true, [], $index, opt_to_ctx);
            }
        }
    });
    
    /**
     * String
     */
    constructWrapper(String, 'str', {
        /**
         * @namespace str
         * @memberOf module:_
         */
        /**
         * @class String
         */
        prototype: {
            /**
             * Returns the rest of the string after a certain substring (1st occurrence)
             * @public
             * @method String#after
             * @param   {string} substr - substring to identify the return string
             * @returns {string}        - new string containing the string after the given substring
             */
            after: function(substr) {
                var index = this.indexOf(substr);
                return (~index)? this.slice(index + substr.length) : this;
            },
            /**
             * Returns the rest of the string after a certain substring (last occurrence)
             * @public
             * @method String#afterLast
             * @param   {string} substr - substring to identify the return string
             * @returns {string}         - new string containing the string after the given substring
             */
            afterLast: function(substr) {
                var index = this.lastIndexOf(substr);
                return (~index)? this.slice(index + substr.length) : this;
            },
            /**
             * Returns the rest of the string before a certain substring (1st occurrence)
             * @public
             * @method String#before
             * @param   {string} substr - substring to identify the return string
             * @returns {string}         - new string containing the string before the given substring
             */
            before: function(substr) {
                var index = this.indexOf(substr);
                return (~index)? this.slice(0, index) : this;
            },
            /**
             * Returns the rest of the string before a certain substring (last occurrence)
             * @public
             * @method String#beforeLast
             * @param   {string} substr - substring to identify the return string
             * @returns {string}         - new string containing the string before the given substring
             */
            beforeLast: function(substr) {
                var index = this.lastIndexOf(substr);
                return (~index)? this.slice(0, index) : this;
            },
            /**
             * Returns the string between a prefix && post substring
             * @public
             * @method String#between
             * @param   {string} pre_substr  - substring to identify the return string
             * @param   {string} post_substr - substring to identify the return string
             * @returns {string}             - new string containing the string before the given substring
             */
            between: function(pre_substr, post_substr) {
                return this._.after(pre_substr)._.before(post_substr);
            },
            /**
             * Capitalize the first character of a string
             * @public
             * @method String#capitalize
             * @returns {string} - the capitalized string
             */
            capitalize: function() {
                return this[0]? this[0].toUpperCase() + this.slice(1): this;
            },
            /**
             * Decapitalize the first character of a string
             * @public
             * @method String#decapitalize
             * @returns {string} - the decapitalized string
             */
            decapitalize: function() {
                return this[0]? this[0].toLowerCase() + this.slice(1): this;
            },
            /**
             * Checks if the string ends with a certain substr
             * @public
             * @method String#endsWith
             * @param   {string}  substr - substring to check for
             * @returns {boolean}        - boolean indicating if the string ends with the given substring
             */
            endsWith: function(substr) {
                return this.slice(-substr.length) === substr;
            },
            /**
             * Checks if the string contains a certain substring
             * @public
             * @method String#has
             * @param   {string}  substr - substring to check for
             * @returns {boolean}        - boolean indicating if the string contains the substring
             */
            has: function(substr) {
                return !!~this.indexOf(substr);
            },
            /**
             * Inserts a substring in a string
             * @public
             * @method String#insert
             * @param   {string}  substr - substring to insert
             * @param   {number}  i      - index to insert the substring (can be a negative value as well)
             * @returns {string}         - new string with the substring inserted
             */
            insert: function(substr, i) {
                return this._.splice(i, 0, substr);
            },
            /**
             * Checks if a string is all lowercase
             * @public
             * @method String#isLowerCase
             * @returns {boolean} - Boolean indicating if the string is lowercase
             */
            isLowerCase: function() {
                return this == this.toLowerCase();
            },
            /**
             * Checks if a string is all uppercase
             * @public
             * @method String#isUpperCase
             * @returns {boolean} - Boolean indicating if the string is uppercase
             */
            isUpperCase: function() {
                return this == this.toUpperCase();
            },
            /**
             * getter: the last character of a string
             * @public
             * @method String#last
             * @returns {string} - the last character of the string
             */
            get last() {
                return this[this.length-1];
            },
            /**
             * Splice for string. NOTE string are immutable so this function will return a NEW string
             * @public
             * @method String#splice
             * @param   {number}  i       - index to start (can be a negative value as well)
             * @param   {string}  howMany - number of characters to apply
             * @param   {string}  substr  - substring to insert
             * @returns {string}          - NEW string with deleted or inserted characters
             */
            splice: function(i, howMany, substr) {
                return this.slice(0,i) + substr + this.slice(i + __math.abs(howMany));
            },
            /**
             * Checks if the string starts with a certain substr
             * @public
             * @method String#startsWith
             * @param   {string}  substr - substring to check for
             * @returns {boolean}        - boolean indicating if the string starts with the given substring
             */
            startsWith: function(substr) {
                return !this.indexOf(substr);
            },
            /**
             * Better to string version
             * @public
             * @method String#toString
             * @this    {string}
             * @returns {string} - string representation of the object
             */
            toString: function()
            {
                return this;
            }
        }
    });
    
    /**
     * Number
     */
    constructWrapper(Number, 'num', {
        /**
         * @namespace num
         * @memberOf module:_
         */
        static: {
            /**
             * Checks if an object is a number
             * @public
             * @method module:_.num.isNumber
             * @param   {any} num - object to check the number for
             * @returns {boolean} - indicating if it is a number
             */
            isNumber: function(num) {
                return typeof(num) === 'number' && !isNaN(num); // use the broken isNaN here because iOS doesn't support Number.isNaN
            },
            /**
             * Returns a random numer between the min and max value, or between 0 & 1) if no arguments are given.
             * In case a singular argument is given iy will return the bound between 0 and this value
             * @public
             * @method module:_.num.random
             * @param   {number=} min_max_ - optional lower or upper bound
             * @param   {number=} max_min_ - optional lower or upper bound
             * @returns {number} - random number in between
             */
            random: function(min_max_, max_min_) {
                if(min_max_ === undefined) return Math.random(); // normal random functionality (no arguments)
    
                var diff   = (max_min_ || 0) - min_max_;
                var offset = diff? min_max_: 0; // cover the case in which both arguments have the same value
    
                return Math.random()*diff + offset;
            },
            // TODO left inclusive right inclusive or both
            /**
             * Rebounds a number between 2 values. Handy for number ranges that are continuous
             * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
             * @public
             * @method module:_.num.rebound
             * @param   {number}   num - number value
             * @returns {function}     - function to add the range
             */
            rebound: function(num) { // TODO (negative) testcases
                /**
                 * Rebounds a number between 2 values. For continuous number ranges
                 * @public
                 * @param   {number}  min - minimum value
                 * @param   {number}  max - maximum value
                 * @returns {boolean} - rebounded version of the number that falls between the 2 values
                 */
                return function range(min, max)
                {
                    return min + num % (max - min);
                }
            }
        },
        /**
         * @class Number
         */
        prototype: {
            /**
             * Getter: returns the sign of a number
             * @public
             * @method Number#sign
             * @returns {number} - sign of the number: -1, 0, 1
             */
            get sign() { // TODO this should be a normal function so we can also set the sign (this can be annoying otherwise)
                return this > 0?  1 :
                       this < 0? -1 :
                                  0 ;
            },
            /**
             * Getter: indicator if the the number is even
             * @public
             * @method Number#even
             * @returns {boolean} - indicating if the number is even
             */
            get even() {
                return !(this & 1);
            },
            /**
             * Getter: indicator if the the number is odd
             * @public
             * @method Number#odd
             * @returns {boolean} - indicating if the number is odd
             */
            get odd() {
                return !!(this & 1);
            },
            /**
             * Getter: parity for a number 0: even and 1: for odd
             * @public
             * @method Number#parity
             * @returns {number} - parity of the number
             */
            get parity() {
                return this & 1;
            },
            /**
             * Power of a number
             * @public
             * @method Number#pow
             * @param   {number}  exponent - the exponent
             * @returns {number}           - the powered number
             */
            pow: function(exponent) {
                return Math.pow(this, exponent)
            },
            /**
             * Checks if a number is between to values
             * @public
             * @method Number#between
             * @param   {number}  min - minimum value
             * @param   {number}  max - maximum value
             * @returns {boolean}     - boolean indicating if the value lies between the two values
             */
            between: function(min, max) {
                return min <= this && this <= max; // this is correct when saying between the endpoints should be included when saying from to the end point "to" is excluded well for mathematicians that is
            },
            /**
             * Bounds a number between 2 values
             * @public
             * @method Number#bound
             * @param   {number}  min - minimum value
             * @param   {number}  max - maximum value
             * @returns {boolean}     - bounded version of the number that falls between the 2 values
             */
            bound: function(min, max) {
                return Math.min(Math.max(this, min), max);
            },
            /**
             * Rebounds a number between 2 values. Handy for number ranges that are continuous
             * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
             * @public
             * @method Number#rebound
             * @param   {number}   num - number value
             * @returns {function}     - function to add the range
             */
            rebound: function(min, max)
            {
                return min + this % (max - min);
            },
            /**
             * Better to string version
             * @public
             * @method Number#toString
             * @this    {Number}
             * @returns {string} - string representation of the number
             */
            toString: function()
            {
                return this+'';
            }
        }
    });
    
    // FIXME textcases and complete adaptation to static methods
    constructWrapper(Function, 'fnc', {
        /**
         * @namespace fnc
         * @memberOf module:_
         */
        static: {
            /**
             * Delays a function by a given number of milliseconds
             * Use bind to prefill args and set context: fnc.bind(this, 'arg1', 'arg2').callAfter(10);
             * @public
             * @method module:_.fnc.callAfter
             * @param {number} delay   - optional arguments
             * @param {number} cb      - callback function to call after the delay
             * @param {number} opt_ctx - optional arguments
             */
            callAfter: function (delay, cb, opt_ctx) {
                setTimeout(function() {
                    cb.call(opt_ctx)
                }, delay);
            },
            /**
             * Defers some methods so they'll get set to the end of the stack
             * @public
             * @method module:_.fnc.defer
             * @param {number} cb      - callback function to call after the delay
             * @param {number} opt_ctx - optional context
             */
            defer: function (cb, opt_ctx) {
                setTimeout(function() {
                    cb.call(opt_ctx)
                }, 0);
            },
            /**
             * Memoization function
             * @public
             * @method module:_.fnc.memoize
             * @param {number}   delay   - optional arguments
             */
            memoize: function(ctx)
            {
                // TODO
            },
            /**
             * Creates a partial version of the function that can be partially prefilled/bootstrapped with arguments use undefined to leave blank
             * @public
             * @method module:_.fnc.partial
             * @param   {...any}   var_args - arguments to prefill/bootstrap. Use undefined to identify custom input
             * @returns {function}          - partial version of the function
             */
            partial: function (var_args, fnc) {
                var args = arguments;
    
                return function() {
                    for(var i = 0, arg = 0; i < args.length && arg < arguments.length; i++)
                    {
                        if(args[i] === undefined)
                        {
                            args[i] = arguments[arg++];
                        }
                    }
                    return fnc.apply(this, args);
                }
            },
            /**
             * Similar to bind but only prefills the arguments not the context
             * @public
             * @method module:_.fnc.strap
             * @param   {...any}   var_args - arguments to prefill
             * @param   {Function} fnc      - function to strap
             * @returns {Function}          - bootstrapped version of the function
             */
            // TODO add partial support
            strap: function(var_args, fnc) {
                var args = _.arr(arguments); // convert to array
    
                fnc = args.pop();
    
                return fnc.bind.apply(fnc, [null]._.append(args));
            },
            /**
             * Similar to bind but only prefills the arguments not the context
             * @public
             * @method module:_.fnc.bind
             * @param   {...any}   var_args - arguments to prefill
             * @param   {Function} fnc      - function to strap
             * @returns {Function}          - bootstrapped version of the function
             */
            // TODO add partial support
            bind: function(ctx, var_args, fnc) {
                var args = _.arr(arguments); // convert to array
    
                fnc = args.pop();
    
                return fnc.bind.apply(fnc, args)
            },
            /**
             * Super simple inheritance function
             * @public
             * @method module:_.fnc.inherit
             * @param   {Function} child  - child
             * @param   {Function} parent - parent to inherit from
             */
            inherit: function(child, parent) {
                child.prototype = Object.create(parent.prototype);
                child.prototype.constructor = child;
                child._super = parent.prototype;
            },
            /**
             * Mixin properties on a class. It is assumed this function is called inside the constructor
             * @public
             * @method module:_.fnc.mixin
             * @param {Function}        child - child
             * @param {Function|Array} mixins - array or sinlge mixin classes
             */
            mixin: function(child, mixins) {
    
                child._mixin = function(mixin) {
                    return mixin.prototype;
                };
    
                mixins._.each(function(mixin) {
                    // copy static fucntions
                    _.extend(child, mixin);
                    // copy prototype functions
                    _.extend(child.prototype, mixin.prototype);
                });
            },
            /**
             * Nests functions together.
             * @public
             * @method module:_.fnc.nest
             * @param {Array|Function} $arr_fnc - an array of functions or a single function in case of supplying
             * @param {...Function}    var_args - one or multiple functions
             */
            nest: function($arr_fnc, var_args) {
                var fns = (var_args === undefined)? $arr_fnc : arguments;
    
                return function() {
                    for(var i = 0, max = fns.length; i < max; i++)
                    {
                        fns[i].apply(this, arguments);
                    }
                }
            }
        },
        prototype:
        {
            /**
             * Better to string version
             * @public
             * @method Function#toString
             * @this    {Function}
             * @returns {string} - string representation of the object
             */
            toString: function()
            {
                return this.toString();
            },
            /**
             * Returns the name of a function if it is an unnamed function it returns an empty string ''
             * NOTE avoid using this function as on older browsers name property is not defined and is shimmed
             * @public
             * @method Function#name
             * @this    {Function}
             * @returns {string} - the name of the function
             */
            // FIXME a better solution is to shim the name property in case it is not defined. In that case we we can use a simpler function
            get name()
            {
                if(_.isDefined(Function.prototype.name)) return this.name;
                else return this.toString().match(/^function\s?([^\s(]*)/)[1];
            }
        }
    });
    /**
     * Math
     */
    constructWrapper(Math, 'math', {
        /**
         * @namespace math
         * @memberOf module:_
         */
        static: {
            /**
             * Return true based on a certain probability based on a number between 0 & 1;
             * @public
             * @method module:_.byProb
             * @param   {number}  p - probability to return true
             * @returns {boolean}   - true or false based on the probability
             */
            byProb: function(p) {
                return Math.random() < p;
            },
            /**
             * Return the distance between 2 points in Euclidean space
             * @public
             * @method module:_.distance
             * @param   {number}  x1 - x position for point1
             * @param   {number}  y1 - y position for point1
             * @param   {number}  x2 - x position for point2
             * @param   {number}  y2 - y position for point2
             * @returns {number} - distance between the 2 points
             */
            distance: function(x1, y1, x2, y2) {
                return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            },
            /**
             * Return the squared distance between 2 points in Euclidean space
             * @public
             * @method module:_.distanceSquared
             * @param   {number}  x1 - x position for point1
             * @param   {number}  y1 - y position for point1
             * @param   {number}  x2 - x position for point2
             * @param   {number}  y2 - y position for point2
             * @returns {number} - squared distance between the 2 points
             */
            distanceSquared: function(x1, y1, x2, y2) {
                return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            },
            /**
             * Calculates the angle between a the y-axis and a line through a point x, y calculated clockwise (slope)
             * @public
             * @method module:_.angle
             * @param   {number}  x -
             * @param   {number}  y -
             * @returns {number} - angle in degrees
             */
            angle: function(x, y) {
                return (_.rad2Deg(Math.atan2(x, -y))+360)%360;
            },
            /**
             * Calculates the angle between a the x-axis and a line through a point x, y calculated counter-clockwise (slope)
             * @public
             * @method module:_.angle
             * @param   {number}  x -
             * @param   {number}  y -
             * @returns {number} - angle in degrees
             */
            angleSloped: function(x, y) {
                return (90-_.rad2Deg(Math.atan2(x, -y))+360)%360;
            },
            /**
             * Calculates the angle between a the x-axis and a line through a point x, y calculated counter-clockwise (slope)
             * @public
             * @method module:_.angle
             * @param   {number}  angle - angle in degrees
             * @returns {number} - angle in degrees
             */
            angleInvert: function(angle) {
                return (angle+540)%360;
            },
            /**
             * Convert degrees to radians.
             *
             * @method module:_.deg2Rad
             * @param {number} degrees
             * @returns {number} radians
             */
            deg2Rad: function() {
                var degreeToRadiansFactor = Math.PI/180;
    
                return function (degrees) {
                    return degrees*degreeToRadiansFactor;
                };
            }(),
            /**
             * Decimal log function
             * @public
             * @method module:_.log10
             * @param   {number} val - value to get the log10 from
             * @returns {number}     - angle in degrees
             */
            log10: function(val) {
                return Math.log(val)/Math.LN10;
            },
            /**
             * Convert radians to degrees
             *
             * @method module:_.rad2Deg
             * @param {number} radians
             * @returns {number} degrees
             */
            rad2Deg: function() {
                var radianToDegreesFactor = 180/Math.PI;
    
                return function (radians) {
                    return radians*radianToDegreesFactor;
                };
            }(),
            /**
             * Significantly faster version of Math.max if there are more then 2+x elements
             * See http://jsperf.com/math-s-min-max-vs-homemade/5
             * Borrowed from phaser
             *
             * @method module:_.maxmore
             * @return {number} The highest value from those given.
             */
            maxmore: function ()
            {
                for (var i = 1, max = 0, len = arguments.length; i < len; i++)
                {
                    if (arguments[max] < arguments[i])
                    {
                        max = i;
                    }
                }
    
                return arguments[max];
            },
    
            /**
             * Significantly faster version of Math.min if there are more then 2+x elements
             * See http://jsperf.com/math-s-min-max-vs-homemade/5
             * Borrowed from phaser
             *
             * @method module:_.minmore
             * @return {number} The lowest value from those given.
             */
            minmore: function () {
    
                for (var i = 1 , min = 0, len = arguments.length; i < len; i++)
                {
                    if (arguments[i] < arguments[min])
                    {
                        min = i;
                    }
                }
    
                return arguments[min];
            }
        }
    });
    /**
     * Integer
     * // TODO check if we can do something with signed arrays
     */
    constructWrapper(null, 'int', {
        /*
         * Converter function
         */
        init: function(num) {
            return num|0;
        },
        /**
         * @namespace int
         * @memberOf module:_
         */
        static: {
            /**
             * Returns the length of an integer
             * @public
             * @method module:_.int.length
             * @param   {number} int - integer to measure the length
             * @returns {number} - length of the integer
             */
            len: function(int) {
                return int? 1+ _.log10(int)|0 : 1;
    //				return (int+'').length;
            },
            /**
             * Returns the length of an integer
             * @public
             * @method module:_.int.length
             * @param   {number} int    - integer to measure the length
             * @param   {number} length - total length of the string including leading zero's
             * @returns {string} - string with leading zero's
             */
            leadZeros: function(int, length) {
                return (int/Math.pow(10, length)).toFixed(length).substr(2);
            },
            /**
             * Returns a random integer between the min and max value
             * @public
             * @method module:_.int.random
             * @param   {number} min - integer lower bound
             * @param   {number} max - integer upper bound
             * @returns {number} - random integer in between
             */
            // TODO do all random options as for _.num.random see below
            random: function(min, max) {
                return min + (Math.random() * (max + 1 - min))|0;
            },
            //random: function(min_max_, max_min_) {
            //    if(min_max_ === undefined) return Math.random(); // normal random functionality
            //
            //    var diff   = (max_min_ || 0) - min_max_;
            //    var offset = diff? min_max_: 0;
            //
            //    return min + (Math.random() * (max + 1 - min))|0;
            //},
            /**
             * Rebounds a number between 2 values. Handy for arrays that are continuous
             * Curried version: for example - __int.rebound(4)(-5, 7)
             * @public
             * @method module:_.int.rebound
             * @param   {number}  int - integer value
             * @returns {function} - function to add the range
             */
            rebound: function(int) {
                /**
                 * Rebounds a number between 2 values. Handy for arrays that are continuous
                 * @private
                 * @param   {number}  min - minimum value
                 * @param   {number}  max - maximum value
                 * @returns {boolean} - rebounded version of the number that falls between the 2 values
                 */
                return function range(min, max) {
                    var overflow = int % (Math.abs(max - min) + 1);
    
                    return ((overflow < 0)? max+1 : min) + overflow;
                }
            }
        }
    });

	return _
});