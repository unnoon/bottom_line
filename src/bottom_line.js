/*!
 * _____________Bottom_Line._.⌡S___
 * BottomLine JavaScript Library
 *
 * Copyright 2013, Rogier Geertzema
 * Released under the MIT license
 * ________________________________
 */
'use strict';

(function() {
	var __root = this;
	var _      = function() {};

	// set browser and nodejs globals
	if(typeof(module) !== 'undefined' && module.exports)
	{
		module.exports = _;
	}
	else
	{
		__root._ = _;
	}

	// some short cuts
	var __obj  = Object;
	var __arr  = Array;
	var __num  = Number;
	var __str  = String;
	var __fnc  = Function;
	var __math = Math;

	// wrap functions for chaining
	function constructWrapper(nativeObj, shorthand, module)
	{
		var wrapperObj = _[shorthand] = module.init || function(value) {
			// convertor & constructor function
			this.value = value;
		};

		// extend it with an extra property to support chaining of multiple types
		__obj.defineProperties(wrapperObj.prototype, {
			$$: {
				get: function() {
					return this.value.$$;
				},
				enumerable: false
			}
		});

		// stores non-chainable use methods
		wrapperObj.__instance__ = {};

		if(nativeObj && nativeObj.prototype)
		{
			// extend native object with the 2 special properties
			__obj.defineProperties(nativeObj.prototype, {
				$: {
					get: function() {
						wrapperObj.value = this;

						return wrapperObj.__instance__; // return object containing single use methods
					},
					enumerable: false
				},
				$$: {
					get: function() {
						return new wrapperObj(this); // return new wrapper object for chaining
					},
					enumerable: false
				}
			});
		}

		// statics
		var statics = module.static || {};
		__obj.getOwnPropertyNames(statics).forEach(function(name) {
			var descriptor = __obj.getOwnPropertyDescriptor(statics, name);

			descriptor.enumarable = false;

			__obj.defineProperty(wrapperObj, name, descriptor);

			// copy static properties to the bottom line _ object
			if(shorthand !== 'int') // except for the int class
			{
				if(_[name]) console.log('overwriting property: '+name); // TODO properly wrap identical function names based on type

				__obj.defineProperty(_, name, descriptor);
			}
		});

		// prototype
		var prototype = module.prototype || {};

		__obj.getOwnPropertyNames(prototype).forEach(function(name) {
			var descriptor   = __obj.getOwnPropertyDescriptor(prototype, name);
			var descriptor$  = clone(descriptor);
			var descriptor$$ = clone(descriptor);

			// make properties non enumerable
			descriptor$.enumerable  = false;
			descriptor$$.enumerable = false;

			// wrap function & getters & setters
			if(typeof(descriptor.value) === 'function') wrap('value');
			if(descriptor.get) 							wrap('get');
			if(descriptor.set) 							wrap('set');

			function wrap(type) {
				var fn = descriptor[type];

				// singular
				descriptor$[type] = function () {
					return fn.apply(wrapperObj.value, arguments);
				};
				// chaining
				descriptor$$[type] = function () {
					this.value = fn.apply(this.value, arguments);

					return this;
				};
			}

			__obj.defineProperty(wrapperObj.__instance__, name, descriptor$);
			__obj.defineProperty(wrapperObj.prototype,    name, descriptor$$);

			// simple cloning function
			function clone(obj) {
				var clone = __obj.create(__obj.getPrototypeOf(obj));

				__obj.getOwnPropertyNames(obj).forEach(function(name) {
					__obj.defineProperty(clone, name, __obj.getOwnPropertyDescriptor(obj, name));
				});

				return clone;
			}
		})
	}

	/**
	 * Object
	 */
	constructWrapper(Object, 'obj', {
		static: {
			// TODO: deep clone
			/**
			 * Clones an object
			 * @public
			 * @static
			 * @param   {Object}  obj   - object to be cloned
			 * @returns {Object}  clone - the cloned object
			 */
			clone: function (obj) {
				var clone = __obj.create(__obj.getPrototypeOf(obj));

				__obj.getOwnPropertyNames(obj).forEach(function(name) {
					__obj.defineProperty(clone, name, __obj.getOwnPropertyDescriptor(obj, name));
				});

				return clone;
			},
			/**
			 * Extends an object with function/properties from a module object
			 * @public
			 * @param   {Object}  obj          - object to be extended
			 * @param   {Object=} opt_settings - optional settings/default descriptor
			 * @param   {Object}  module       - object containing functions/properties to extend the object with
			 * @return  {Object}  obj          - the extended object
			 */
			extend: function(obj, opt_settings, module) {
				var settings;
				var descriptor;

				module   = module? module       : opt_settings;
				settings = module? opt_settings : {};

				settings.enumerable   = settings.enumerable   !== false;
				settings.configurable = settings.configurable !== false;
				settings.writable     = settings.writable     !== false;

				for (var prop in module)
				{
					if(obj.hasOwnProperty(prop))
					{
						console.warn('overwriting existing property: '+prop);
					}
					else if(prop in obj)
					{
						console.warn('overriding existing property: '+prop);
					}

					descriptor = __obj.getOwnPropertyDescriptor(module, prop);

					descriptor.enumerable   = settings.enumerable;
					descriptor.configurable = settings.configurable;
					if(descriptor.hasOwnProperty('writable')) descriptor.writable = settings.writable; // getters/setters don't have a writable property in their descriptor

					__obj.defineProperty(obj, prop, descriptor);
				}

				return obj;
			},
			/**
			 * Returns the type of an object. Better suited then the one from js itself
			 * @public
			 * @param   {Object} obj - object tot check the type from
			 * @returns {string} - type of the object
			 */
			typeof: function(obj) {
				return __obj.prototype.toString.call(obj).$$.between('[object ', ']').decapitalize().value;
			}
		},
		prototype: {
			/**
			 * Filters
			 * @public
			 * @param  {Function} cb      - callback function to be called for each element
			 * @param  {Object=}  opt_ctx - optional context
			 * @return {Array} array containing the filtered values
			 */
			filter: function(cb, opt_ctx) {
				var filtered = [];

				this.$.each(function(elm) {
					if(cb.call(opt_ctx, elm)) filtered.push(elm);
				});

				return filtered;
			},
			/**
			 * Finds first element that is picked by the callback function
			 * @public
			 * @param  {Function} cb      - callback function to be called for each element
			 * @param  {Object=}  opt_ctx - optional context
			 * @return {any} first value that is found
			 */
			find: function(cb, opt_ctx) {
				var found;

				this.$.each(function(elm) {
					if(cb.call(opt_ctx, elm)) return found = elm, false; // break iteration
				});

				return found;
			},
			/**
			 * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
			 * @public
			 * @param {Function} cb      - callback function to be called for each element
			 * @param {Object=}  opt_ctx - optional context
			 */
			each: function(cb, opt_ctx) {
				var keys = __obj.keys(this);
				var key;

				for(var i = 0, max = keys.length; i < max; i++)
				{
					key = keys[i];

					if(cb.call(opt_ctx, this[key], key, this) === false) break;
				}
			},
			/**
			 * Returns an array containing the keys of an object (enumerable properties))
			 * @public
			 * @return {Array} keys of the object
			 */
			keys: function() {
				return __obj.keys(this);
			},
			/**
			 * Returns an array containing the names of an object (includes non-enumerable properties)
			 * @public
			 * @return {Array} keys of the object
			 */
			names: function() {
				return __obj.getOwnPropertyNames(this);
			},
			/**
			 * Sets/gets the prototype of an object
			 * NOTE setting a prototype using __proto__ is non standard use at your own risk!
			 * @public
			 * @param   {Array}  proto      - the prototype to be set
			 * @returns {Array|Object} this - the prototype of the object or the object itself for chaining
			 */
			proto: function(proto) {
				if(proto === undefined) return __obj.getPrototypeOf(this);

				this.__proto__ = proto;

				return this;
			},
			// TODO proper implementation
//			/**
//			 * Proxies all functions of an object (including those from the prototype in a certain context.
//			 * @public
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
			 * Remove elements based on index
			 * @public
			 * @param  {number|Array|Function} $key - singular key, an array of keys or a function specifying specific keys
			 * @return {Array}   this   - mutated array for chaining
			 */
			withoutKeys: function($key)
			{
				var type = typeof($key);

				if(type === 'string')
				{
					delete this[$key];
				}
				else // function or array
				{
					var cb = (type === 'function')? $key : function(key) {return $key.$.has(key)}; // assumes function otherwise array

					this.$.each(function(val, key) {
						if(cb(key)) delete this[key];
					}, this);
				}

				return this;
			},
			/**
			 * Removes the first occurrence in an object
			 * @public
			 * @this    {Object}
			 * @param   {any|Array|Function} $value - Element to be deleted | Array of element | or a function
			 * @returns {Object}     - The array without the element
			 */
			remove: function($value) {
				this.$._remove(true, $value);
			},
			/**
			 * Removes the all occurrence in an object
			 * @public
			 * @this    {Object}
			 * @param   {any|Array|Function} $value - Element to be deleted | Array of element | or a function
			 * @returns {Object}     - The array without the element
			 */
			removeAll: function($value) {
				this.$._remove(false, $value);
			},
			/**
			 * Removes the first occurrence in an object
			 * @public
			 * @this    {Object}
			 * @param   {boolean} first - Boolean indicating if we should remove the first occurrence only
			 * @param   {any|Array|Function} $value - Element to be deleted | Array of element | or a function
			 * @returns {Object}     - The array without the element
			 */
			_remove: function(first, $value) {
				var type = _.typeof($value);

				if(type === 'array')
				{
					var values = $value;

					this.$.each(function(val, key) {
						if(values.$.has(val))
						{
							delete this[key];

							if(first) return values.$.remove(val), !!values.length;
						}
					}, this);
				}
				else // function or a singular value given
				{
					var cb = (type === 'function')? $value : function(val) {return val === $value};

					this.$.each(function(val, key) {
						if(cb(val, key, this)) return delete this[key], first;
					}, this);
				}

				return this;
			},
			/**
			 * Returns an array containing the values of an object (enumerable properties)
			 * @public
			 * @return {Array} values of the object
			 */
			values: function() {
				var values = [];

				this.$.each(function(elm) {
					values.push(elm);
				});

				return values;
			},
			/**
			 * Returns an array containing the keys & values of an object (enumerable properties)
			 * @public
			 * @return {Array} keys & values of the object
			 */
			pairs: function() {
				var pairs = [];

				this.$.each(function(val, key) {
					pairs.push(key, val);
				});

				return pairs;
			}
		}
	});

	/**
	* Array prototype
	* Friendly note to self: Use array specific methods as little as possible so we can still apply these to array-like objects
	*/
	constructWrapper(Array, 'arr', {
		init: function(obj) {

			if (this.constructor === _.arr) // called with new
			{
				this.value = obj;
			}
			else // called as converter function
			{
				 var type = _.typeof(obj);

				 switch (type)
				 {
					 case 'arguments' : return __arr.prototype.slice.call(obj, 0);
					 case 'object'    :
					 case 'function'  : return __obj.getOwnPropertyNames(obj).map(function(key) { return {prop:key, value:obj[key]}});
					 case 'array'     : return obj;
					 case 'undefined' :
					 case 'null'      : return [];
					 default          : return [obj];
				 }
			}
		},
		static: {
			/**
			 * Concats 2 or more array. Result is an new array
			 * @public
			 * @static
			 * @param {...Array} var_args     - 2 or more arrays
			 * @returns  {Array} intersection - array containing the contatenated array
			 */
			concat: function(var_args) {
				return __arr.prototype.concat.apply(null, arguments);
			}
		},
		prototype: {
			/**
			 * Mutator: Append 1 or more arrays to the current array
			 * @public
             * @this       {Array}
			 * @param      {Array} arr  - array to be appended
			 * @returns    {Array} this - Array appended with arr
			 */
			 append: function(arr) {
				this.push.apply(this, arr);

				return this;
			 },
            /**
             * appends 1 or more arrays toa new array
             * @public
             * @this       {Array}
             * @param   {...Array} var_args - 1 or more arrays to be appended
             * @returns    {Array}  this     - Array appended with arr
             */
            $append: function(var_args) {
                return _.clone(this).$.append(var_args);
            },
			/**
			 * Accessor: Returns the average of an array with numbers
			 * @public
			 * @this    {Array<number>}
			 * @returns {Number} - Average of the numbers in the array
			 */
			avg: function() {
				return this.sum()/this.length;
			},
            /**
             * Copies a value to an array
             * @public
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            copy: function(to, $value, opt_ctx)
            {
                return this.$._cp(false, false, to, $value, opt_ctx);
            },
            /**
             * Copies all similar values to an array
             * @public
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            copyAll: function(to, $value, opt_ctx)
            {
                return this.$._cp(true, false, to, $value, opt_ctx);
            },
            /**
             * Copies keys to an array
             * @public
             * @this   {Array}
             * @param  {Array}                 to         - array to copy to
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            copyKeys: function(to, $index, opt_to_ctx)
            {
                return this.$._cpKeys(false, to, $index, opt_to_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @public
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cp: function(all, invert, target, $value, opt_ctx)
            {
                var onmatch = function(val) {this.push(val);};
                var ondone  = function(val, i, _this) {_this.$.copyKeys(this, function(index) {return index > i});};

                return this.$._edit(all, invert, onmatch, ondone, target, $value, opt_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @public
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cut: function(all, invert, target, $value, opt_ctx)
            {
                var onmatch = function(val, i, _this) {this.push(val); _this.splice(i, 1)};
                var ondone  = function(val, i, _this) {_this.$.cutKeys(this, function(index) {return index > i});};

                return this.$._edit(all, invert, onmatch, ondone, target, $value, opt_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @public
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _cpKeys: function(invert, target, $value, opt_to_ctx)
            {
                var onmatch = function(i, _this) {this.push(_this[i]);};
                var ondone  = function(i, _this) {_this.$.copyKeys(this, function(index) {return index > i});};

                return this.$._editKeys(invert, onmatch, ondone, target, $value, opt_to_ctx);
            },
            /**
             * Copies the occurrences from an array to an new array
             * @public
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _edit: function(all, invert, onmatch, ondone, target, $value, opt_ctx)
            {
                var first  = !all;
                var normal = !invert;
                var match;
                var done;
                var array  = false;

                var cb = (typeof($value) === 'function')? $value                                   :
                         (array = __arr.isArray($value))? function(val) {return $value.$.has(val)} :
                                                          function(val) {return val === $value};

                this.$.each(function(val, i, _this, delta) {
                    match = cb.call(opt_ctx, val, i, _this, delta);
                    // remove normal or inverted match
                    if(match === normal) onmatch.call(target, val, i, _this, delta);

                    // if first and the first  match is made check if we are done
                    if(first && match)
                    {
                        done = array? !$value.$.without(val).length : true;

                        // remove remainder if done & invert mode
                        if(done && invert) ondone.call(target, val, i, _this, delta);

                        return !done;
                    }
                }, this);

                return target;
            },
            /**
             * Edits an array based on indices
             * @public
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Array}                      - new array with the copied elements
             */
            _editKeys: function(invert, onmatch, ondone, target, $index, opt_to_ctx)
            {
                var type   = typeof($index);
                var all    = typeof(opt_to_ctx) === 'number' || type === 'function';
                var first  = !all;
                var normal = !invert;
                var match;
                var done;
                var array  = false;
                var index;

                var cb = (type === 'function')?           $index                                               :
                         (array = __arr.isArray($index))? function(i) {return $index.$.has(i)}                 :
                         (opt_to_ctx === undefined)?      function(i) {return i === $index}                    :
                                                          function(i) {return i.$.between($index, opt_to_ctx)};

                this.$.each(function(val, i, _this, delta) {
                    index = i - delta; // the original index in the array

                    match = cb.call(opt_to_ctx, index, _this);
                    // remove normal or inverted match
                    if(match === normal) onmatch.call(target, i, _this);

                    // if match is made check if we are done
                    if(first && match)
                    {
                        done = array? !$index.$.without(index).length : true;

                        // remove remainder if done & invert mode
                        if(done && invert) ondone.call(target, i, _this);

                        return !done;
                    }
                }, this);

                return target;
            },
            /**
             * Removes the occurrences from an array
             * @public
             * @this    {Array}
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_to_ctx - optional context for the function
             * @returns {Array}                      - The array without the element
             */
            _del: function(invert, $index, opt_to_ctx)
            {
                var onmatch = function(i) {this.splice(i, 1);};
                var ondone  = function(i) {this.$.withoutKeys(i+1, this.length);};

                return this.$._editKeys(invert, onmatch, ondone, this, $index, opt_to_ctx);
            },
            /**
             * Remove elements based on index
             * @public
             * @this   {Array}
             * @param  {boolean}               invert     - boolean indicating if the deletion should be inverted
             * @param  {number|Array|Function} $index     - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=}               opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}                 this       - mutated array for chaining
             */
            _del2: function(invert, $index, opt_to_ctx)
            {
                var normal = !invert;

                switch(_.typeof($index))
                {
                    case 'number' :
                    {
                        var from = $index;
                        var to   = opt_to_ctx || from;

                        if(normal)
                        {
                            this.splice(from, to-from+1);
                        }
                        else
                        {
                            this.splice(to+1, this.length-to);
                            this.splice(0,    from);
                        }

                        break;
                    }
                    case 'function' :
                    {
                        var cb = $index;

                        this.$.each(function(val, i, _this, delta) {
                            if(cb.call(opt_to_ctx, i-delta, this) === normal) this.splice(i, 1);
                        }, this);

                        break;
                    }
                    case 'array' :
                    {
                        this.$.each(function(val, i, _this, delta) {
                            if($index.$.has(i-delta) === normal) return $index.$.without(i-delta), this.splice(i, 1), !!$index.length;
                        }, this);

                        break;
                    }
                }

                return this;
            },
            /**
             * Returns the difference between 2 arrays
             * @this     {Array}
             * @param {...Array} var_args - 2 or more arrays to calc the difference from
             * @returns  {Array}          - this for chaining             */
            // TODO this should be an alias
            diff: function(arr) {
                return this.$.without(arr);
            },
            /**
             * Returns the difference between 2 arrays in a new arrar
             * @this     {Array}
             * @param    {Array} arr - array to subtract from this
             * @returns  {Array}     - new array containing the difference between the first array and the others
             */
            $diff: function(arr) {
                return this.$.$selectAll(function(val) {return !arr.$.has(val)});
            },
			/**
			 * Mutator: Creates a multidimensional array
			 * @public
             * @this   {Array}
			 * @param  {Array<number>} dimensions - array specifying the dimensions. A multidimensional array specification can be used for clarity
			 * @param  {any|Function}  init       - initial value for the array. Can be either a value or a function specifying the value
			 * @return {Array}                    - this initialized multi-dimensional array
			 */
			dim: function(dimensions, init) {
				dimensions = dimensions.flatten();

				addDim(this, 0);

				function addDim(arr, dim)
				{
					for(var i = 0, max = dimensions[dim]; i < max; i++)
					{   // if last dimension set initial value
						if(dim === dimensions.length-1)
						{
							arr[i] = (typeof(init) === 'function')? init() : init;
						}
						else
						{
							arr[i] = [];
							addDim(arr[i], dim+1);
						}
					}
				}

				return this;
			},
            /**
             * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @this   {Array}
             * @param  {number=}  opt_step - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb       - callback function to be called for each element
             * @param  {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}             - this array for chaining
             */
            each: function(opt_step, cb, opt_ctx) {
                if(typeof(opt_step) === 'function')
                    return this.$._each(1, opt_step, cb);
                else
                    return this.$._each(opt_step, cb, opt_ctx);
            },
            /**
             * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @this   {Array}
             * @param  {number=}  step     - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb       - callback function to be called for each element
             * @param  {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}             - this array for chaining
             */
            _each: function(step, cb, opt_ctx) {
                var from = 0, to = this.length;
                var diff, size = to, delta = 0;

                cb = opt_ctx? cb.bind(opt_ctx) : cb;

                for(var i = from; i < to; i += step)
                {
                    if(cb(this[i], i, this, delta) === false) break;
                    if(diff = this.length - size) i += diff, to += diff, size += diff, delta += diff;
                }

                return this;
            },
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @this  {Array}
             * @param {number=}  opt_step - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param {function} cb       - callback function to be called for each element
             * @param {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}            - this array for chaining
             */
            eachRight: function(opt_step, cb, opt_ctx) {
                if(typeof(opt_step) === 'function')
                    return this.$._eachRight(1, opt_step, cb);
                else
                    return this.$._eachRight(opt_step, cb, opt_ctx);
            },
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @this  {Array}
             * @param {number=}  step     - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param {function} cb       - callback function to be called for each element
             * @param {Object=}  opt_ctx  - optional context for the callback function
             * @return {Array}            - this array for chaining
             */
            _eachRight: function(step, cb, opt_ctx) {
                var from = this.length-1, to = -1;

                cb = opt_ctx? cb.bind(opt_ctx) : cb;

                for(var i = from; i > to; i -= step)
                {
                    if(cb(this[i], i, this) === false) break;
                }

                return this;
            },
            /**
             * Finds first element that is picked by the callback function
             * @public
             * @this   {Array}
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             * @return {any} first value that is found
             */
            find: function(cb, opt_ctx) {
                var found;

                this.$.each(function(elm) {
                    if(cb.call(opt_ctx, elm)) return found = elm, false; // break iteration
                });

                return found;
            },
            /**
             * Finds all elements according to ther callback fucntion
             * @public
             * @this   {Array}
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             * @return {Array} first value that is found
             */
            // TODO this should be an alias
            findAll: function(cb, opt_ctx) {
                return this.$.$selectAll(cb, opt_ctx);
            },
            /**
             * Get/sets: the first element of an array
             * @public
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
             * @this    {Array}
             * @returns {Array} - this for chaining
             */
            flatten: function() {
                return this.$.each(function(val, i) {
                    if(__arr.isArray(val)) this.splice.apply(this, val.$.insert(1).$.insert(i));
                }, this)
            },
			/**
			 * Accessor: Flattens a 2 dimensional array
			 * @public
             * @this    {Array}
			 * @returns {Array} - new flattened version of the array
			 */
			$flatten: function() {
				return this.concat.apply([], this);
			},
			/**
			 * Accessor: Check is an array contains a certain value
			 * @public
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
             * @static
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            intersect: function(arr) {
                return this.$.selectAll(function(val) {
                    return arr.$.has(val);
                }, this);
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * @public
             * @static
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            $intersect: function(arr) {
                return this.$.$selectAll(function(val) {
                    return arr.$.has(val);
                }, this);
            },
            /**
             * Checks if an array intersects an other
             * @public
             * @this    {Array}
             * @param   {Array}  arr - array to check intersection with
             * @returns {boolean}     - boolean indicating if the 2 arrays intersect
             */
            intersects: function(arr) {
                var intersects = false;

                this.$.each(function(val) {
                    if(arr.$.has(val)) return !(intersects = true);
                });

                return intersects;
            },
            /**
             * gets/sets the last element of an array
             * @public
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
			 * @this    {Array<number>|Array<any>}
			 * @param   {Function} opt_compare - optional function to determine the the max in case of non-numeric array
			 * @returns {number|any} - maximum number or element in the array
			 */
			max: function(opt_compare) {
				if(opt_compare === undefined)
				{
					return __math.max.apply(null, this);
				}
				else
				{
					var max = this[0];

					this.$.each(function(elm) {
						max = opt_compare(elm, max) > 0? elm : max;
					});

					return max;
				}
			},
			/**
			 * Accessor: Returns the minimum value of an array with numbers
			 * @public
			 * @this    {Array<number>|Array<any>}
             * @param   {Function=} opt_compare - optional compare function
			 * @returns {number|any} - minimum element in the array
			 */
			min: function(opt_compare) {
                if(opt_compare === undefined)
                {
                    return __math.min.apply(null, this);
                }
                else
                {
                    var min = this[0];

                    this.$.each(function(elm) {
                        min = opt_compare(elm, min) < 0? elm : min;
                    });

                    return min;
                }
			},
            /**
             * Modifies the members of an array according to a certain function
             * @public
             * @this    {Array}
             * @param   {Function} modifier - function that modifies the array members
             * @param   {Object=}  opt_ctx  - optional context for the modifier function
             * @returns {Array}             - the modified array
             */
            modify: function(modifier, opt_ctx) {
                this.$.each(function(val, i) {
                    this[i] = modifier.call(opt_ctx, val, i, this);
                }, this);

                return this;
            },
            /**
             * Copies and modifies the members of an array according to a certain function
             * @public
             * @this    {Array}
             * @param   {Function} modifier - function that modifies the array members
             * @param   {Object=}  opt_ctx  - optional context for the modifier function
             * @returns {Array}             - the modified array
             */
            $modify: function(modifier, opt_ctx)
            {
                return _.clone(this).$.modify(modifier, opt_ctx);
            },
			/**
			 * Accessor: Returns a random element from the array
			 * @public
             * @this   {Array}
			 * @return {any} - random element from the array
			 */
			 random: function() {
				 return this[_.int.random(0, this.length - 1)];
			 },
            /**
             * Removes the occurrences from an array
             * @public
             * @this    {Array}
             * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
             * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context for the function
             * @returns {Array}                      - The array without the element
             */
            _rm: function(all, invert, $value, opt_ctx)
            {
                var onmatch = function(val, i) {this.splice(i, 1);};
                var ondone  = function(val, i) {this.$.withoutKeys(i+1, this.length);};

                return this.$._edit(all, invert, onmatch, ondone, this, $value, opt_ctx);
            },
            /**
             * Select the first occurrence in an array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - array with the selected element
             */
            select: function($value, opt_ctx) {
                return this.$._rm(false, true, $value, opt_ctx);
            },
            /**
             * Accessor: Returns the first element found by the selector function
             * @public
             * @this    {Array}
             * @param   {Function} $value   - selector function callback to be called on each element
             * @param   {Object=}  opt_ctx  - optional context for the callback function
             * @returns {any}               - the found element or undefined otherwise
             */
            $select: function($value, opt_ctx) {
                return this.$._cp(false, false, [], $value, opt_ctx);
            },
            /**
             * Select all occurrence in an array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - array with the selected elements
             */
            selectAll: function($value, opt_ctx) {
                return this.$._rm(true, true, $value, opt_ctx);
            },
            /**
             * Select all occurrence in an array and copies them to a new array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - array with the selected elements
             */
            $selectAll: function($value, opt_ctx) {
                return this.$._cp(true, false, [], $value, opt_ctx);
            },
            /**
             * Retrieves and sets the size of an array
             * @public
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
			 * @this    {Array<number>}
			 * @returns {number} - sum of the  number array
			 */
			 sum: function() {
				 return this.reduce(function(a, b) { return a + b; });
			 },
            /**
             * Calculates the union for 2 arrays
             * @public
             * @this   {Array}
             * @param  {Array} arr  - array to unfiy
             * @return {Array} this - unified with the other
             */
            unify: function(arr) {
                return this.$$.append(arr).unique().value;
            },
            /**
             * Calculates the union for 2 arrays into an new array
             * @public
             * @this   {Array}
             * @param  {Array} arr  - array to unfiy
             * @return {Array}      - new array containing the unification
             */
            $unify: function(arr) {
                return this.$$.$append(arr).unique().value;
            },
			/**
			 * Removes duplicate values in an array
			 * @public
             * @this    {Array}
			 * @returns {Array} - new array without duplicates
			 */
			unique: function() {
                this.$.eachRight(function(val, i) {
                    this.$.each(function(duplicate, j) {
                        if(val === duplicate && j < i) return this.splice(i, 1), false;
                        return j < i;
                    }, this)
                }, this);

                return this;
			},
            /**
             * Accessor: Returns a new version of the array without duplicates
             * @public
             * @this    {Array}
             * @returns {Array} - new array without duplicates
             */
            $unique: function() {
                var unique = [];

                this.$.each(function(val) {
                    if(!unique.$.has(val)) unique.push(val);
                }, this);

                return unique;
            },
            /**
             * Removes the first occurrence in an array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - The array without the element
             */
            without: function($value, opt_ctx) {
                return this.$._rm(false, false, $value, opt_ctx);
            },
            /**
             * Removes the first occurrence in an array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array }                     - NEW array without the element
             */
            $without: function($value, opt_ctx) {
                return this.$._cp(false, true, [], $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - The array without the element
             */
            withoutAll: function($value, opt_ctx) {
                return this.$._rm(true, false, $value, opt_ctx);
            },
            /**
             * Removes the all occurrence in an array
             * @public
             * @this    {Array}
             * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
             * @param   {Object}             opt_ctx - optional context or the function
             * @returns {Array}                      - NEW array without the element
             */
            $withoutAll: function($value, opt_ctx) {
                return this.$._cp(true, true, [], $value, opt_ctx);
            },
            /**
             * Remove elements based on index
             * @public
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            withoutKeys: function($index, opt_to_ctx)
            {
                return this.$._del(false, $index, opt_to_ctx);
            },
            /**
             * Remove elements based on index
             * @public
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            $withoutKeys: function($index, opt_to_ctx)
            {
                return this.$._cpKeys(true, [], $index, opt_to_ctx);
            },
            /**
             * Selects elements based on index, removes others
             * @public
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            selectKeys: function($index, opt_to_ctx)
            {
                return this.$._del(true, $index, opt_to_ctx);
            },
            /**
             * Selects elements based on index into a new array
             * @public
             * @this   {Array}
             * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
             * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
             * @return {Array}   this   - mutated array for chaining
             */
            $selectKeys: function($index, opt_to_ctx)
            {
                return this.$._cpKeys(false, [], $index, opt_to_ctx);
            }
		}
	});

	/**
	* String
	*/
	constructWrapper(String, 'str', {
		prototype: {
			/**
			 * Returns the rest of the string after a certain substring (1st occurrence)
			 * @public
			 * @param   {string} substr - substring to identify the return string
			 * @returns {string}        - new string containing the string after the given substring
			 */
			after: function(substr) {
				var index = this.indexOf(substr);
				return (index > -1)? this.slice(index + substr.length) : '';
			},
			/**
			 * Returns the rest of the string after a certain substring (last occurrence)
			 * @public
			 * @param   {string} substr - substring to identify the return string
			 * @returns {string}         - new string containing the string after the given substring
			 */
			afterLast: function(substr) {
				var index = this.indexOf(substr);
				return (index > -1)? this.slice(index + substr.length) : '';
			},
			/**
			 * Returns the rest of the string before a certain substring (1st occurrence)
			 * @public
			 * @param   {string} substr - substring to identify the return string
			 * @returns {string}         - new string containing the string before the given substring
			 */
			before: function(substr) {
				var index = this.indexOf(substr);
				return (index > -1)? this.slice(0, index) : '';
			},
			/**
			 * Returns the rest of the string before a certain substring (last occurrence)
			 * @public
			 * @param   {string} substr - substring to identify the return string
			 * @returns {string}         - new string containing the string before the given substring
			 */
			beforeLast: function(substr) {
				var index = this.indexOf(substr);
				return (index > -1)? this.slice(0, index) : '';
			},
			/**
			 * Returns the string between a prefix && post substring
			 * @public
			 * @param   {string} pre_substr  - substring to identify the return string
			 * @param   {string} post_substr - substring to identify the return string
			 * @returns {string}             - new string containing the string before the given substring
			 */
			between: function(pre_substr, post_substr) {
				return this.$$.after(pre_substr).before(post_substr).value;
			},
			/**
			 * Capitalize the first character of a string
			 * @public
			 * @returns {string} - the capitalized string
			 */
			capitalize: function() {
				return this[0]? this[0].toUpperCase() + this.slice(1): this;
			},
			/**
			 * Decapitalize the first character of a string
			 * @public
			 * @returns {string} - the decapitalized string
			 */
			decapitalize: function() {
				return this[0]? this[0].toLowerCase() + this.slice(1): this;
			},
			/**
			 * Checks if the string ends with a certain substr
			 * @public
			 * @param   {string}  substr - substring to check for
			 * @returns {boolean}        - boolean indicating if the string ends with the given substring
			 */
			endsWith: function(substr) {
				return this.slice(-substr.length) === substr;
			},
			/**
			 * Checks if the string contains a certain substring
			 * @public
			 * @param   {string}  substr - substring to check for
			 * @returns {boolean}        - boolean indicating if the string contains the substring
			 */
			 has: function(substr) {
				 return this.indexOf(substr) > -1;
			 },
			/**
			 * Inserts a substring in a string
			 * @public
			 * @param   {string}  substr - substring to insert
			 * @param   {number}  i      - index to insert the substring (can be a negative value as well)
			 * @returns {string}         - new string with the substring inserted
			 */
			insert: function(substr, i) {
				return this.$.splice(i, 0, substr);
			},
			/**
			 * Checks if a string is all lowercase
			 * @public
			 * @returns {boolean} - Boolean indicating if the string is lowercase
			 */
			isLowerCase: function() {
				return this == this.toLowerCase();
			},
			/**
			 * Checks if a string is all uppercase
			 * @public
			 * @returns {boolean} - Boolean indicating if the string is uppercase
			 */
			isUpperCase: function() {
				return this == this.toUpperCase();
			},
			/**
			 * Splice for string. NOTE string are immutable so this function will return a NEW string
			 * @public
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
			 * @param   {string}  substr - substring to check for
			 * @returns {boolean}        - boolean indicating if the string starts with the given substring
			 */
			startsWith: function(substr) {
				return this.indexOf(substr) === 0;
			}
		}
	});

	/**
	  * Number
	  */
	constructWrapper(Number, 'num', {
		static: {
			/**
			 * Returns a random integer between the min and max value, or between 0 & 1) if no arguments are given
			 * @public
			 * @param   {number=} opt_min - integer lower bound
			 * @param   {number=} opt_max - integer upper bound
			 * @returns {number} - random number in between
			 */
			random: function(opt_min, opt_max) {
				var min = opt_min || 0;
				var max = opt_max || 1;

				return arguments.length? __math.random() * (max - min) + min : __math.random();
			},
			// TODO left inclusive right inclusive or both
			/**
			 * Rebounds a number between 2 values. Handy for number ranges that are continuous
			 * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
			 * @public
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
		prototype: {
			/**
			 * Getter: returns the sign of a number
			 * @public
			 * @returns {number} - sign of the number: -1, 0, 1
			 */
			get sign() {
				return this > 0?  1 :
					   this < 0? -1 :
								  0 ;
			},
			/**
			 * Getter: indicator if the the number is even
			 * @public
			 * @returns {boolean} - indicating if the number is even
			 */
			get even() {
				return !this.odd;
			},
			/**
			 * Getter: indicator if the the number is odd
			 * @public
			 * @returns {boolean} - indicating if the number is odd
			 */
			get odd() {
				return this % 2;
			},
			/**
			 * Checks if a number is between to values
			 * @public
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
			 * @param   {number}   num - number value
			 * @returns {function}     - function to add the range
			 */
			rebound: function(min, max)
			{
				return min + this % (max - min);
			}
		}
	});

	// FIXME textcases and complete adaptation to static methods
	constructWrapper(Function, 'fnc', {
		static: {
			/**
			 * Delays a function by a given number of milliseconds
			 * Use bind to prefill args and set context: fnc.bind(this, 'arg1', 'arg2').callAfter(10);
			 * @public
			 * @param {number}   delay   - optional arguments
			 */
			callAfter: function (delay, fnc) {
				setTimeout(fnc, delay);
			},
			memoize: function(ctx)
			{
				// TODO
			},
			/**
			 * Creates a partial version of the function that can be partially prefilled/bootstrapped with arguments use undefined to leave blank
			 * @public
			 * @param   {...any}   var_args - arguments to prefill/bootstrap. Use undefined to identify custom input
			 * @returns {function}          - partial version of the function
			 */
			 partial: function (var_args, fnc) {
				var args = arguments; // is to array needed??

				return function() {
					for(var i = 0, arg = 0; i < args.length && arg < arguments.length; i++)
					{
						if(args[i] === undefined)
						{
							args[i] = arguments[arg++];
						}
					}
					return fnc.apply(this. args);
				}
			 },
			/**
			 * Similar to bind but only prefills the arguments not the context
			 * @public
			 * @param   {...any}   var_args - arguments to prefill
			 * @param   {Function} fnc      - function to strap
			 * @returns {Function}          - bootstrapped version of the function
			 */
			// TODO add partial support
			strap: function(var_args, fnc) {
				var args = _.arr(arguments); // convert to array

				fnc = args.pop();

				return fnc.bind.apply(fnc, [null].$.append(args));
			},
			/**
			 * Similar to bind but only prefills the arguments not the context
			 * @public
			 * @param   {...any}   var_args - arguments to prefill
			 * @param   {Function} fnc      - function to strap
			 * @returns {Function}          - bootstrapped version of the function
			 */
			// TODO add partial support
			bind: function(ctx, var_args, fnc) {
				var args = _.arr(arguments); // convert to array

				fnc = args.pop();

				return fnc.bind.apply(fnc, args);
			}
		}
	});

	/**
	  * Math
	  */
	constructWrapper(Math, 'math', {
		static: {
			/**
			 * Return true based on a certain probability based on a number between 0 & 1;
			 * @public
			 * @param   {number}  p - probability to return true
			 * @returns {boolean}   - true or false based on the probability
			 */
			byProb: function(p) {
				return Math.random() < p;
			},
			/**
			 * Return the distance between 2 points in Euclidean space
			 * @public
			 * @param   {number}  x1 - x position for point1
			 * @param   {number}  y1 - y position for point1
			 * @param   {number}  x2 - x position for point2
			 * @param   {number}  y2 - y position for point2
			 * @returns {number} - distance between the 2 points
			 */
			distance: function(x1, y1, x2, y2) {
				return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
			}
		}
	});

	/**
	  * Integer
	  * // TODO check if we can do something with signed arrays
	  */
	constructWrapper(null, 'int', {
		init: function(num) {
			if (this.constructor === _.int) // called with new
			{
				this.value = num;
			}
			else // called as converter function
			{
				if(typeof(num) === 'number')
				{
					return Math[num < 0? 'ceil' : 'floor'](num);
				}
			}
		},
		static: {
			/**
			 * Returns a random integer between the min and max value
			 * @public
			 * @param   {number} min - integer lower bound
			 * @param   {number} max - integer upper bound
			 * @returns {number} - random integer in between
			 */
			random: function(min, max) {
				return Math.floor(Math.random() * (max + 1 - min)) + min;
			},
			/**
			 * Rebounds a number between 2 values. Handy for arrays that are continuous
			 * Curried version: for example - __int.rebound(4)(-5, 7)
			 * @public
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
					var overflow = int % (__math.abs(max - min) + 1);

					return ((overflow < 0)? max+1 : min) + overflow;
				}
			}
		}
	});
}).call(this); // need to call it specifically in this context, otherwise 'this' is undefined