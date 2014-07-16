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
            var clone = Object.create(Object.getPrototypeOf(obj));

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

            try       { names = obj._.names(); }
            catch (e) { return obj }

            var clone = Object.create(obj._.proto());
            names._.each(function (name) {
                var pd = obj._.descriptor(name);
                if (pd.value) pd.value = _.cloneDeep(pd.value); // does this clone getters/setters ?
                clone._.define(name, pd);
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

            var loglevel     = (settings && settings.loglevel) || (console.debug? 'debug' : 'log');

            module._.each(function(value, prop) {  // fix for non-enumerable properties maybe???
                var overrideProperty  = override;
                var overwriteProperty = overwrite;
                var aliases           = false;

                descriptor = module._.descriptor(prop);
                // global property overrides
                if(_.isDefined(enumerable))                                 descriptor.enumerable   = enumerable;
                if(_.isDefined(configurable))                               descriptor.configurable = configurable;
                if(_.isDefined(writable) && descriptor._.owns('writable'))  descriptor.writable     = writable;

                // special property specific config
                if((config = value) && config._.owns('value'))
                {
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
                    if(!overwriteProperty) return; // continue;
                    console[loglevel]('overwriting existing property: '+prop+' while extending: '+_.typeOf(obj));
                }
                else if(prop in obj)
                {
                    if(!overrideProperty) return; // continue;
                    console[loglevel]('overriding existing property: '+prop+' while extending: '+_.typeOf(obj));
                }

                obj._.define(prop, descriptor);
                if(aliases) config.aliases._.each(function(alias) {obj._.define(alias, descriptor)})
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
            return Object.prototype.toString.call(obj)._.between('[object ', ']')._.decapitalize();
        }
    },
    /**
     * Extension of the native Object class prototype
     *
     * @class Object
     */
    prototype: {
        faux: function() {return this},
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
         * @method Object#_copyAll
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
                {
                    output += (output? ', ' : '{') + key + ': ' + this[key]._.toString();
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