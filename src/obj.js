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
                clone._.define(name, obj._.descriptor(name._.decapitalize()));
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