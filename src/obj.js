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
            var clone = _.create(obj._.proto());
            var names = obj._.names();

            names._.each(function(name) {
                clone._.define(name, obj._.descriptor(name));
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
         * Singular push function to solve problems with differences between objects & arrays
         * @public
         * @method Array:_.arr._push
         * @this    {Array}
         * @param  {...any}  val - value to push
         * @return  {Array} this - this for chaining
         */
        _add: function(val, key) {
            this[key] = val;

            return this;
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
            this._.each(function(val, key, obj) {
                if(match$.call(ctx_, key, obj)) {delete this[key]}
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
            var output = _.create(this._.proto());

            this._.each(function(val, key) { // eachRight is a little bit faster
                if(args._.not.has(key)) {output._._add(val, key)}
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
            var output = _.create(this._.proto());

            this._.each(function(val, key, obj, delta) { // eachRight is a little bit faster
                if(!match$.call(ctx_, key, obj, delta)) {output._._add(val, key)}
            }, this);

            return output;
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
         * Object iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         * @public
         * @method Object#_each
         * @this  {Object}
         * @param {Function} cb   - callback function to be called for each element
         * @param {Object=}  ctx_ - optional context
         */
        each: function(cb, ctx_) {
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
         * Removes 1st values from an object|array
         * @public
         * @method Object:_.obj.remove
         * @this   {Object|Array}
         * @param  {...any}       ___values - values to remove
         * @return {Object|Array} this      - mutated array for chaining
         */
        remove: function(___values) {
            var args = arguments;
            var len  = arguments.length;
            var index;

            this._.each(function(val, i) {
                index = args._.indexOf(val);
                if(~index) {this._.del(i); delete args[index]; return --len > 0}
            }, this);

            return this;
        },
        /**
         * Removes 1st value from an object|array based on a match function
         * @public
         * @method Array:_.obj.remove$
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match$ - function specifying the value to delete
         * @param  {Object=}                          ctx_   - optional context for the match$ function
         * @return {Array}                            this   - mutated array for chaining
         */
        remove$: function(match$, ctx_) {
            this._.each(function(val, i, arr, delta) {
                if(match$.call(ctx_, val, i, arr, delta)) {this._.del(i); return false}
            }, this);

            return this;
        },
        /**
         * Creates new array without the specified 1st values
         * @public
         * @method Object:_.obj.$remove
         * @this   {Object|Array}
         * @param  {...any} __values - values to remove
         * @return {Array}  output   - new array without the values
         */
        $remove: function(__values) {
            var output = _.create(this._.proto());
            var args   = arguments;
            var index;

            this._.each(function(val, key) {
                index = args._.indexOf(val);
                if(~index) {delete args[index]}
                else       {output._._add(val, key)}
            }, this);

            return output;
        },
        /**
         * Creates a new object|array without 1st value based on a match function
         * @public
         * @method Object:_.obj.$remove$
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match$ - function specifying the value to delete
         * @param  {Object=}                          ctx_   - optional context for the match$ function
         * @return {Array}                            output - new array without the value specified
         */
        $remove$: function(match$, ctx_) {
            var output  =  _.create(this._.proto());
            var matched = false;

            this._.each(function(val, key, obj, delta) {
                if(!matched && match$.call(ctx_, val, key, obj, delta)) {matched = true}
                else                                                    {output._._add(val, key)}
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

            this._.each(function(val, key) {
                if(args._.has(val)) {delete this[key]}
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
            this._.each(function(val, key, obj) { // eachRight is a little bit faster
                if(match$.call(ctx_, val, key, obj)) {delete this[key]}
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
            var output = _.create(this._.proto());
            var args   = arguments;

            this._.each(function(val, key) {
                if(args._.not.has(val)) {output._._add(val, key)}
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
            var output = _.create(this._.proto());

            this._.each(function(val, key, obj, delta) {
                if(!match$.call(ctx_, val, key, obj, delta)) {output._._add(val, key)} // key is ignored in case of array
            }, this);

            return output;
        },

        select: function(__values) {
            var args = arguments;
            return this._.removeAll$(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
        },

        select$: function(match$, ctx_) {
            var matched = false;
            return this._.removeAll$(function() {return (match$.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
        },

        $select: function(__values) {
            var args = arguments;
            return this._.$removeAll$(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
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
        }
    }
});