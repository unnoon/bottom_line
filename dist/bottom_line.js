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
                        if(settings.validate && !config.overwrite) throw "unvalidated overwrite of property: "+prop+". Please add overwrite=true to the config object if you want to overwrite it" ;
                        if(settings.log)                           console[settings.log]('overwriting existing property: '+prop);
                    }
                    else if(prop in obj) // override
                    {
                        if(!override)                             return; // continue
                        if(settings.validate && !config.override) throw "unvalidated override of property: "+prop+". Please add override=true to the config object if you want to override it" ;
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
                (array = _.is.array($value))? 		function(val) {return $value._.has(val)} :
                    function(val) {return val === $value};
    
            // note the reverse check should be fixed when this is also implemented for strings
            this._['each'+((reverse && _.is.array(this))?'Right':'')](function(val, i, _this, delta) {
                match = cb.call(opt_ctx, val, i, _this, delta);
                // remove normal or inverted match
                if(match === normal || finish) onmatch.call(target, val, i, _this, delta);
                // if first and the first match is made check if we are done
                if(first && match && !finish) return finish = array? !$value._.remove(val).length : true, !(normal && finish);
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
                (array = _.is.array($index))?   function(i) {return $index._.has(i)}                 :
                    ($opt_to_ctx === undefined)?   function(i) {return i === $index}                   :
                        function(i) {return i._.between($index, $opt_to_ctx)};
    
            this._['each'+((reverse && _.is.array(this))?'Right':'')](function(val, i, _this, delta) {
                index = _.is.array(this)? (i - delta) : i; // the original index in the array
    
                match = cb.call($opt_to_ctx, index, _this);
                // remove normal or inverted match
                if(match === normal || finish) onmatch.call(target, i, _this);
                if(first && match && !finish) return finish = array? !$index._.remove(index).length : true, !(normal && finish);
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
            // FIXME WHOAAA this breaks with a nested obj._.descriptor... that's scary. Needs debugging
            clone: function clone(obj) {
                var clone = _.create(obj._.proto());
                var names = obj._.names();
    
                names._.each(function(name) {
                    var pd = obj._.descriptor(name);
                    clone._.define(name, pd);
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
    
                var clone = _.create(obj._.proto());
                names._.each(function (name) {
                    var pd = obj._.descriptor(name);
                    if (pd.value) pd.value = _.cloneDeep(pd.value); // does this clone getters/setters ?
                    clone._.define(name, pd);
                });
                return clone;
            },
            /**""
             * Empties an object remove destroying the object itself
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
            extend: extend,
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
             * Remove elements based on index
             * @public
             * @method Object:_.arr.del
             * @this       {Object}
             * @param  {...number} __keys - indices SORTED
             * @return     {Array}   this - mutated array for chaining
             */
            del: function(__keys)
            {
                arguments._.eachRight(function(key) {
                    delete this[key];
                }, this);
    
                return this;
            },
            /**
             * Removes 1st values from an array
             * @public
             * @method Array:_.arr.remove
             * @this       {Array}
             * @param     {...any} ___values - values to remove
             * @return     {Array}      this - mutated array for chaining
             */
            remove: function(___values) {
                var args = arguments;
                var index;
    
                this._.each(function(val, i) {
                    index = args._.indexOf(val);
                    if(~index) {this._.del(i); return !!args._.del(index).length}
                }, this);
    
                return this;
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
             * @returns {Object}                      - The array remove the element
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
             * @param {Function} cb   - callback function to be called for each element
             * @param {Object=}  ctx_ - optional context
             */
            each: function(cb, ctx_) {
                // FIXME this[key] will execute getter properties...!!!
                // TODO maybe a faster version using keys. I now prefer using for in  because it will not create a new array object with the keys
                for(var key in this)
                {
                    if(!this.hasOwnProperty(key)) continue;
                    if(cb.call(ctx_, this[key], key, this) === false) break;
                }
            },
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @private
             * @method Arguments#_eachRight
             * @this  {Array}
             * @param {number=}  step     - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param {function} cb       - callback function to be called for each element
             * @param {Object=}  ctx_  - optional context for the callback function
             * @return {Array}            - this array for chaining
             */
            eachRight: function(cb, ctx_) {
                var step = 1;
                var from = this.length-1, to = -1;
    
                for(var i = from; i > to; i -= step)
                {
                    if(this[i] === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if(cb.call(ctx_, this[i], i, this) === false) break;
                }
    
                return this;
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
            has: {aliases: ['contains'], value: function(value) {
                var has = false;
    
                this._.each(function(val) {
                    if(value === val) return !(has = true);
                });
    
                return has;
            }},
            keyOf: {aliases: ['indexOf'], value: function(value) {
                var key = -1;
    
                this._.each(function(val, k) {
                    if(value === val) return key = k, false;
                });
    
                return key;
            }},
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
             * @returns {Array}                      - The array remove the element
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
            ///**
            // * Removes the first occurrence in an object
            // * @public
            // * @method Object#_without
            // * @this    {Object}
            // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
            // * @param   {Object}             opt_ctx - optional context or the function
            // * @returns {Array }                     - The array remove the element
            // */
            //remove: function($value, opt_ctx) {
            //    return this._._rm(false, false, $value, opt_ctx);
            //},
            /**
             * Removes the first occurrence in an array
             * @public
             * @method Array#_$remove
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Object }                    - NEW object remove the element
             */
            $remove: function($value, opt_ctx) {
                return this._._cp(false, true, {}, $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @method Array#_withoutAll
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Object}                      - The array remove the element
             */
            removeAll: function($value, opt_ctx) {
                return this._._rm(true, false, $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @method Array#_$withoutAll
             * @this    {Object}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Object}                      - NEW array remove the element
             */
            $removeAll: function($value, opt_ctx) {
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
        static: {
            _utils: {
                remove: function(i) {}
            },
            /**
             * Concats arrays into a new array
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
             * Append an array to the current array. Takes inot account broken arrays
             * @public
             * @method module:_.arr.append
             * @this       {Array}
             * @param   {...Array} __arrays - arrays to be appended
             * @returns    {Array}     this - this appended with the arrays
             */
            append: function(__arrays) {
                var start;
    
                arguments._.each(function(arr) {
                    if(!arr) return; // continue
    
                    start        = this.length; // start position to start appending
                    this.length += arr.length;  // set the length to the length after appending
                    // copy the properties in case defined
    
                    arr._.each(function(val, i, arr) {
                        if(val === undefined && arr._.not.owns(i)) return; // continue. take into account broken arrays
                        this[start+i] = val;
                    }, this);
    
                }, this);
    
                return this;
            },
            /**
             * Append an array to the current array. The result is a new array
             * @public
             * @method module:_.arr.$append
             * @this       {Array}
             * @param   {...Array} __arrays - arrays to be appended
             * @returns    {Array}          - The new array that is the result of appending
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
             * @return {Array} this - mutated array for chaining
             */
            compact: function()
            {
                return this._.removeAll$(function(val) {return !val});
            },
            /**
             * Removes all falsey values from an array into a new array
             * @public
             * @method module:_.arr.$compact
             * @this   {Array}
             * @return {Array} this - new array instance without falsey values
             */
            $compact: function()
            {
                return this._.$removeAll$(function(val) {return !val});
            },
            /**
             * Remove elements based on index
             * @public
             * @method Array:_.arr.del
             * @this       {Array}
             * @param  {...number} __keys - indices SORTED
             * @return     {Array}   this - mutated array for chaining
             */
            del: function(__keys)
            {
                arguments._.eachRight(function(key) {
                    this.splice(key, 1);
                }, this);
    
                return this;
            },
            /**
             * Remove elements based on index
             * @public
             * @method Array:_.arr.del$
             * @this   {Array}
             * @param  {function(index, arr, delta)} match$ - function specifying the indices to delete
             * @param  {Object=}                     ctx_   - optional context for the match$ function
             * @return {Array}                       this   - mutated array for chaining
             */
            del$: function(match$, ctx_)
            {
                this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                    if(match$.call(ctx_, i, arr, delta)) {this.splice(i, 1)}
                }, this);
    
                return this;
            },
            /**
             * Creates a new array without the specified indices
             * @public
             * @method Array:_.arr.$del
             * @this       {Array}
             * @param  {...number} __keys - indices SORTED
             * @return     {Array}   this - new array without the specified indices
             */
            $del: function(__keys)
            {
                var args   = arguments;
                var output = _.create(Object.getPrototypeOf(this));
    
                this._.each(function(val, i) { // eachRight is a little bit faster
                    if(args._.not.has(i)) {output.push(val)}
                }, this);
    
                return output;
            },
            /**
             * Creates a new array without the specified indices
             * @public
             * @method Array:_.arr.$del$
             * @this   {Array}
             * @param  {function(index, arr, delta)} match$ - function specifying the indices to delete
             * @param  {Object=}                     ctx_   - optional context for the match$ function
             * @return {Array}                       this   - new array without the specified indices
             */
            $del$: function(match$, ctx_)
            {
                var output = _.create(Object.getPrototypeOf(this));
    
                this._.each(function(val, i, arr, delta) { // eachRight is a little bit faster
                    if(!match$.call(ctx_, i, arr, delta)) {output.push(val)}
                }, this);
    
                return output;
            },
            /**
             * Removes 1st value from an array based on a match function
             * @public
             * @method Array:_.arr.remove$
             * @this   {Array}
             * @param  {function(val, index, arr, delta)} match$ - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match$ function
             * @return {Array}                             this  - mutated array for chaining
             */
            remove$: function(match$, ctx_) {
                this._.each(function(val, i, arr, delta) {
                    if(match$.call(ctx_, val, i, arr, delta)) {this.splice(i, 1); return false}
                }, this);
    
                return this;
            },
            /**
             * Creates new array without the specified 1st values
             * @public
             * @method Array:_.arr.$remove
             * @this       {Array}
             * @param     {...any} __values - values to remove
             * @return     {Array}   output - new array without the values
             */
            $remove: function(__values) {
                var output = _.create(Object.getPrototypeOf(this));
                var args   = arguments;
                var index;
    
                this._.each(function(val) {
                    index = args._.indexOf(val);
                    if(~index) {Array.prototype.splice.call(args, index, 1)}
                    else       {output.push(val)}
                }, this);
    
                return output;
            },
            /**
             * Creates a new array without 1st value based on a match function
             * @public
             * @method Array:_.arr.$remove$
             * @this   {Array}
             * @param  {function(val, index, arr, delta)} match$ - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match$ function
             * @return {Array}                           output  - new array without the value specified
             */
            $remove$: function(match$, ctx_) {
                var output  =  _.create(Object.getPrototypeOf(this));
                var matched = false;
    
                this._.each(function(val, i, arr, delta) {
                    if(!matched && match$.call(ctx_, val, i, arr, delta)) {matched = true}
                    else {output.push(val)}
                }, this);
    
                return output;
            },
            /**
             * Removes all specified values from an array
             * @public
             * @method Array:_.arr.removeAll
             * @this       {Array}
             * @param     {...any} __values - values to remove
             * @return     {Array}     this - mutated array for chaining
             */
            removeAll: function(__values) {
                var args = arguments;
    
                this._.eachRight(function(val, i) { // eachRight is a little bit faster
                    if(~args._.indexOf(val)) {this.splice(i, 1)}
                }, this);
    
                return this;
            },
            /**
             * Removes all values from an array based on a match function
             * @public
             * @method Array:_.arr.removeAll$
             * @this   {Array}
             * @param  {function(val, index, arr, delta)} match$ - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match$ function
             * @return {Array}                             this  - mutated array for chaining
             */
            removeAll$: function(match$, ctx_) {
                this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                    if(match$.call(ctx_, val, i, arr, delta)) {this.splice(i, 1)}
                }, this);
    
                return this;
            },
            /**
             * Creates new array without all specified values
             * @public
             * @method Array:_.arr.$removeAll
             * @this       {Array}
             * @param     {...any} __values - values to remove
             * @return     {Array}   output - new array without the values
             */
            $removeAll: function(__values) {
                var output = _.create(Object.getPrototypeOf(this));
                var args   = arguments;
    
                this._.each(function(val) {
                    if(!~args._.indexOf(val)) {output.push(val)}
                }, this);
    
                return output;
            },
            /**
             * Creates a new array without all value specified by the match function
             * @public
             * @method Array:_.arr.$removeAll$
             * @this   {Array}
             * @param  {function(val, index, arr, delta)} match$ - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match$ function
             * @return {Array}                           output  - new array without the value specified
             */
            $removeAll$: function(match$, ctx_) {
                var output = _.create(Object.getPrototypeOf(this));
    
                this._.each(function(val, i, arr, delta) {
                    if(!match$.call(ctx_, val, i, arr, delta)) {output.push(val)}
                }, this);
    
                return output;
            },
    
            select: function(__values) {
                var args = arguments;
                return this._.removeAll$(function(val) {var index = args._.indexOf(val); if(~index) Array.prototype.splice.call(args, index, 1); return !~index});
            },
    
            select$: function(match$, ctx_) {
                var matched = false;
                return this._.removeAll$(function() {return (match$.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
            },
    
            $select: function(__values) {
                var args = arguments;
                return this._.$removeAll$(function(val) {var index = args._.indexOf(val); if(~index) Array.prototype.splice.call(args, index, 1); return !~index});
            },
    
            $select$: function(match$, ctx_) {
                var matched = false;
                return this._.$removeAll$(function() {return (match$.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
            },
    
            selectAll: function(__values) {
                var args = arguments;
                return this._.removeAll$(function(val) {return !~args._.indexOf(val)});
            },
            selectAll$: function(match$, ctx_) {
                return this._.removeAll$(_.fnc.not(match$), ctx_);
            },
            $selectAll: function(__values) {
                var args = arguments;
                return this._.$removeAll$(function(val) {return !~args._.indexOf(val)});
            },
            $selectAll$: {aliases: ['findAll'], value: function(match$, ctx_) {
                return this._.$removeAll$(_.fnc.not(match$), ctx_);
            }},
            /**
             * Difference between 2 arrays
             * @public
             * @method Array:_.arr.diff
             * @this     {Array}
             * @param    {Array}  arr - array to subtract from this
             * @returns  {Array} this - array mutated by difference
             */
             // TODO difference between multiple arrays
            diff: function(arr)
            {
                return this._.remove.apply(this, arr);
            },
            /**
             * Returns the difference between 2 arrays in a new array
             * @public
             * @method Array:_.arr.$diff
             * @this     {Array}
             * @param    {Array} arr - array to subtract from this
             * @returns  {Array}     - new array containing the difference
             */
            $diff: function(arr)
            {
                return this._.$remove.apply(this, arr);
            },
            /**
             * Creates a multidimensional array. The dimensions come from the array itself
             * i.e. [3, 6].$.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
             * @public
             * @method Array:_.arr.dimit
             * @this   {Array}
             * @param  {any|function=} init_ - initial value for the array. Can be either a value or a function specifying the value
             * @param  {Object}        ctx_  - optional context for the init function
             * @return {Array}               - dimensionalized array
             */
            dimit: function(init_, ctx_)
            {
                var dimensions = _.clone(this);
                this.length    = dimensions[0];
                var init       = (typeof(init_) === 'function')? init_ : function() {return init_};
    
                // add other dimensions
                addDim(this, 0, dimensions);
    
                return this;
    
                function addDim(arr, dim, dimensions)
                {
                    for(var i = 0, max = dimensions[dim]; i < max; i++)
                    {
                        arr[i] = (dim === dimensions.length-1)? init.call(ctx_) : new Array(dimensions[dim+1]); // if last dimension set initial value else create a new array
                        if(dim === dimensions.length-2 && _.isUndefined(init_)) continue; // continue if we are adding the 2nd last dimension and opt_init is undefined
                        addDim(arr[i], dim+1, dimensions); // add another dimension
                    }
                }
            },
            /**
             * Creates a multidimensional array. The dimensions come from the array itself
             * i.e. [3, 6]._.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
             * @public
             * @method Array:_.arr.$dimit
             * @this   {Array}
             * @param  {any|Function=} init_ - initial value for the array. Can be either a value or a function specifying the value
             * @param  {Object}        ctx_  - optional context for the init function
             * @return {Array}               - this initialized multi-dimensional array
             */
            $dimit: function(init_, ctx_)
            {
                var dimensions = this;
                var arr        = new Array(dimensions[0]);
                var init       = (typeof(init_) === 'function')? init_ : function() {return init_};
    
                // add other dimensions
                addDim(arr, 0, dimensions);
    
                return arr;
    
                function addDim(arr, dim, dimensions)
                {
                    for(var i = 0, max = dimensions[dim]; i < max; i++)
                    {
                        arr[i] = (dim === dimensions.length-1)? init.call(ctx_) : new Array(dimensions[dim+1]); // if last dimension set initial value else create a new array
                        if(dim === dimensions.length-2 && _.isUndefined(init_)) continue; // continue if we are adding the 2nd last dimension and opt_init is undefined don't initialize the array
                        addDim(arr[i], dim+1, dimensions); // add another dimension
                    }
                }
            },
            /**
             * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @private
             * @method Array:_.arr.each
             * @this   {Array}
             * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb    - callback function to be called for each element
             * @param  {Object=}  ctx_  - optional context for the callback function
             * @return {boolean}        - the result for the halting condition of the callback function.
             * 							  false means iteration was broken prematurely.
             * 							  This information can passed on in nested loops for multi-dimensional arrays
             */
            // TODO think of what each should return object itself or boolean indicating if the loop was broken
            each: function(step_, cb, ctx_) {
                if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}
    
                var from = 0, to = this.length;
                var val, diff, size = to, delta = 0;
    
                for(var i = from; i < to; i += step_)
                {
                    if((val = this[i]) === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if(cb.call(ctx_, this[i], i, this, delta) === false) return false; // return result of the callback function
                    if(diff = this.length - size) i += diff, to += diff, size += diff, delta += diff; // correct index after insertion or deletion
                }
    
                return true;
            },
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @private
             * @method Array:_.arr._eachRight
             * @this   {Array}
             * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb    - callback function to be called for each element
             * @param  {Object=}  ctx_  - optional context for the callback function
             * @return {Array}          - this array for chaining
             */
            eachRight: function(step_, cb, ctx_) {
                if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}
    
                var from = this.length-1, to = -1;
    
                for(var i = from; i > to; i -= step_)
                {
                    if(this[i] === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if(cb.call(ctx_, this[i], i, this) === false) break;
                }
    
                return this;
            },
            /**
             * Finds first element that is picked by the callback function
             * @public
             * @method Array:_.arr.find
             * @this   {Array}
             * @param  {Function} cb   - callback function to be called for each element
             * @param  {Object=}  ctx_ - optional context
             * @return {any}           - first value that is found
             */
            find: __coll.find,
            /**
             * Get/sets: the first element of an array
             * @public
             * @method Array:_.arr.first
             * @this   {Array}
             * @param  {any=}      val_ - value to set on the first element. if no value is given the first element is returned
             * @return {any|Array}      - first element of the array or the array itself
             */
            first: function(val_) {
                if(val_ === undefined) return this[0];
    
                this[0] = val_;
    
                return this;
            },
            /**
             * Flattens a 2 dimensional array
             * @public
             * @method Array:_.arr.flatten
             * @this    {Array}
             * @returns {Array} - this for chaining
             */
            // TODO multi dimensional flattening
            flatten: function() {
                return this._.each(function(val, i) {
                    if(_.is.array(val)) this.splice.apply(this, val._.insert(1)._.insert(i));
                }, this)
            },
            /**
             * Flattens a 2 dimensional array
             * @public
             * @method Array:_.arr.$flatten
             * @this    {Array}
             * @returns {Array} - new flattened version of the array
             */
            $flatten: function() {
                return this.concat.apply([], this);
            },
            /**
             * Check is an array contains a certain value
             * @public
             * @method Array:_.arr.has
             * @this    {Array}
             * @param   {Object}  elm - element to check membership of
             * @returns {boolean}     - boolean indicating if the array contains the element
             */
            has: {aliases: ['contains'], value: function(elm) {
                return this.indexOf(elm) > -1;
            }},
            /**
             * Inserts an element in a specific location in an array
             * @public
             * @method Array:_.arr.insert
             * @this    {Array}
             * @param   {Object}  elm - element to check membership of
             * @param   {number}    i - position to insert the element
             * @return  {Array}       - this for chaining
             */
            insert: function(elm, i) {
                return this.splice(i, 0, elm), this;
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * NOTE assumes the arrays do not contain duplicate values
             * @public
             * @method Array:_.arr.intersect
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            intersect: function(arr) {
                return this._.select.apply(this, arr);
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * @public
             * @method Array:_.arr.$intersect
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            $intersect: function(arr) {
                return this._.$select.apply(this, arr);
            },
            /**
             * Checks if an array intersects an other
             * @public
             * @method Array:_.arr.intersects
             * @this    {Array}
             * @param   {Array}  arr - array to check intersection with
             * @returns {boolean}    - boolean indicating if the 2 arrays intersect
             */
            intersects: function(arr) {
                var intersects = false;
    
                this._.each(function(val) {
                    if(arr._.has(val)) {return intersects = true, false}
                });
    
                return intersects;
            },
            /**
             * gets/sets the last element of an array
             * @public
             * @method Array:_.arr.last
             * @this    {Array}
             * @param   {any}      val_ - Value to be set as the last element. If no value is given the last value is returned
             * @returns {any|Array}     - last element of the array or this for chaiing
             */
            last: function(val_) {
                if(val_ === undefined) return this[this.length-1];
    
                this[this.length-1] = val_;
    
                return this;
            },
            /**
             * Returns the maximum value of an array with numbers
             * @public
             * @method Array:_.arr.max
             * @this    {Array<number>|Array<any>}
             * @param   {function}   compare$_ - optional function to determine the the max in case of non-numeric array
             * @returns {number|any}           - maximum number or element in the array
             */
            max: function(compare$_) {
                if(compare$_ === undefined) {return Math.max.apply(null, this)}
                else
                {
                    var max = this[0];
    
                    this._.each(function(elm) {
                        if(compare$_(elm, max) > 0) max = elm;
                    });
    
                    return max;
                }
            },
            /**
             * Returns the minimum value of an array with numbers
             * @public
             * @method Array:_.arr.min
             * @this    {Array<number>|Array<any>}
             * @param   {Function=} compare$_ - optional compare function
             * @returns {number|any} - minimum element in the array
             */
            min: function(compare$_) {
                if(compare$_ === undefined) {return Math.min.apply(null, this)}
                else
                {
                    var min = this[0];
    
                    this._.each(function(elm) {
                        if(compare$_(elm, min) < 0) max = elm;
                    });
    
                    return min;
                }
            },
            /**
             * Modifies the members of an array according to a certain function
             * @public
             * @method Array:_.arr.modify
             * @this    {Array}
             * @param   {Function} modifier$  - function that modifies the array members
             * @param   {Object=}       ctx_  - optional context for the modifier function
             * @returns {Array}               - the modified array
             */
            modify: function(modifier$, ctx_) {
                this._.each(function(val, i) {
                    this[i] = modifier$.call(ctx_, val, i, this);
                }, this);
    
                return this;
            },
            /**
             * Copies and modifies the members of an array according to a certain function
             * @public
             * @method Array:_.arr.$modify
             * @this    {Array}
             * @param   {Function} modifier$ - function that modifies the array members
             * @param   {Object=}       ctx_ - optional context for the modifier function
             * @returns {Array}              - the modified array
             */
            $modify: function(modifier$, ctx_)
            {
                return _.clone(this)._.modify(modifier$, ctx_);
            },
            /**
             * Chainable version of push
             * @public
             * @method Array:_.arr.push
             * @this    {Array}
             * @param  {...any} ___args - one or more elements to add to an array
             * @return  {Array}    this - this for chaining
             */
            push: function(___args) {
                this.push.apply(this, arguments);
    
                return this;
            },
            /**
             * Returns a random element from the array
             * @public
             * @method Array:_.arr.random
             * @this   {Array}
             * @return {any} - random element from the array
             */
            random: function() {
                return this[_.int.random(0, this.length - 1)];
            },
            /**
             * Retrieves and sets the size of an array
             * @public
             * @method Array:_.arr.size
             * @this    {Array}
             * @param   {number} size_ - the new size of the array. In case no size is given the size is returned
             * @returns {number|Array} - the length of the array or the array itself
             */
            size: function(size_) {
                if(size_ === undefined) return this.length;
    
                this.length = size_;
    
                return this;
            },
            /**
             * Returns the sum of all numbers in a number array
             * @public
             * @method Array:_.arr.sum
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
             * @method Array:_.arr.toString
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
             * @method Array:_.arr.unify
             * @this   {Array}
             * @param  {Array} arr  - array to unify
             * @return {Array} this - unified with the other
             */
            unify: function(arr) {
                return this._.append(arr)._.unique();
            },
            /**
             * Calculates the union for 2 arrays into an new array
             * @public
             * @method Array:_.arr.$unify
             * @this   {Array}
             * @param  {Array} arr - array to unify
             * @return {Array}     - new array containing the unification
             */
            $unify: function(arr) {
                var app = this._.$append(arr);
    
                return app._.unique();
            },
            /**
             * Removes duplicate values in an array
             * @public
             * @method Array:_.arr.unique
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
             * @method Array:_.arr.$unique
             * @this    {Array}
             * @returns {Array} - new array remove duplicates
             */
            $unique: function() {
                var unique = [];
    
                this._.each(function(val) {
                    if(unique._.not.has(val)) unique.push(val);
                }, this);
    
                return unique;
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
                var args = _.to.array(arguments); // convert to array
    
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
            },
            /**
             * returns a negated form of a function
             * @public
             * @method module:_.fnc.not
             * @param  {function} fnc - an array of functions or a single function in case of supplying
             * @return {function} negated form of the function
             */
            not: function(fnc) {
                return function() { return !fnc.apply(this, arguments)}
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