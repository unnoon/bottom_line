construct('obj', {native:Object}, {
    /**
     * @namespace obj
     */
    static: {
        /**
         * Clones an object
         * @public
         * @static
         * @method obj.clone
         * @param   {Object}  obj   - object to be cloned
         * @return  {Object}  clone - the cloned object
         */
        // TODO These should be expanded with frozen, extensible states etc
        clone: function clone(obj) {
            if(_.obj.isPrimitive(obj)) return obj;
            if(_.is.array(obj))        return obj.slice();

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
         * @method obj.cloneDeep
         * @param   {Object}  obj   - object to be cloned
         * @return  {Object}  clone - the cloned object
         */
        // TODO adaptation for arrays in phantomJS
        cloneDeep: function cloneDeep(obj) {
            if(_.obj.isPrimitive(obj)) return obj;

            var clone = _.create(obj._.proto());
            obj._.names()._.each(function (name) {
                var pd = obj._.descriptor(name);
                if (pd.value) pd.value = _.cloneDeep(pd.value); // does this clone getters/setters ?
                clone._.define(name, pd);
            });
            return clone;
        },
        /**
         * creates an object based on a prototype
         * @static
         * @public
         * @method _.create
         * @param  {Object} proto - prototype to base the object on
         * @return {Object}       - new object based on prototype
         */
        create: function(proto) {
            return (proto === Array.prototype) ? [] : Object.create(proto);
        },
        /**
         * Extends an object with function/properties from a module object
         * @public
         * @static
         * @method obj.extend
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
         * @method obj.isDefined
         * @param   {Object} prop - property to check
         * @returns {boolean}     - indication of the property definition
         */
        isDefined: function(prop) {
            return prop !== undefined;
        },
        /**
         * Checks if an object is empty
         * @public
         * @static
         * @method obj.isEmpty
         * @param   {Object}  obj - object to check the void
         * @returns {boolean}     - boolean indicating if the object is empty
         */
        isEmpty: function (obj)
        {
            var key;

            for (key in obj) {
                return false;
            }
            return true;
        },
        /**
         * Checks if an object is an primitive
         * @public
         * @static
         * @method obj.isPrimitive
         * @param   {Object} obj - object to classify
         * @returns {boolean}    - boolean indicating if the object is a primitive
         */
        isPrimitive: function(obj) {
            var type = typeof(obj);

            switch(type)
            {
                case 'object'   :
                case 'function' :
                    return obj === null;
                default :
                    return true
            }
        },
        /**
         * Checks is a property is undefined
         * @public
         * @static
         * @method obj.isUndefined
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
         * @method obj.typeof
         * @param   {Object} obj - object tot check the type from
         * @returns {string} - type of the object
         */
        typeOf: function(obj) {

            switch(obj)
            {
                case null      : return 'null'; // null & undefined should be separate cases since for phantomJS they'll return 'domWindow'
                case undefined : return 'undefined';
                default        : return  Object.prototype.toString.call(obj)._.between('[object ', ']')._.decapitalize();
            }
        },
        /**
         * Static version of _.names returns an empty array in case of null or undefined
         * @public
         * @static
         * @method obj.names
         * @param   {Object} obj - object tot check the type from
         * @returns {string}     - type of the object
         */
        names: function(obj) {
            return (obj === null || obj === undefined) ? [] : Object.getOwnPropertyNames(obj);
        }
    },
    prototype: {
        /**
         * Singular push function to solve problems with differences between objects & arrays
         * @private
         * @method obj#_add
         * @this    {Object}
         * @param  {...any}  val - value to push
         * @return  {Array} this - this for chaining
         */
        _add: function(val, key) {
            this[key] = val;

            return this;
        },
        /**
         * Counts the number of occurrences of an element
         * @public
         * @method obj#count
         * @param   {any}   elm  - value to push
         * @return  {number} occurrences - occurrences of the elm int he object
         */
        count: function(elm) {
            var occurrences = 0;

            this._.each(function(e) {
                occurrences += e === elm; // js magic true = 1 false = 0
            });

            return occurrences;
        },
        /**
         * Copies keys to an array
         * @public
         * @method obj#define
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
         * @method obj#del
         * @this       {Object}
         * @param  {...number} ___keys - indices SORTED
         * @return     {Array}   this - mutated array for chaining
         */
        del: function(___keys)
        {
            arguments._.eachRight(function(key) {
                delete this[key];
            }, this);

            return this;
        },
        /**
         * Remove elements based on index
         * @public
         * @method obj#delFn
         * @this   {Array}
         * @param  {function(index, arr, delta)} match - function specifying the indices to delete
         * @param  {Object=}                     ctx_   - optional context for the match function
         * @return {Array}                       this   - mutated array for chaining
         */
        delFn: function(match, ctx_)
        {
            this._.each(function(val, key, obj) {
                if(match.call(ctx_, key, obj)) {delete this[key]}
            }, this);

            return this;
        },
        /**
         * Creates a new array without the specified indices
         * @public
         * @method obj#Del
         * @this       {Array}
         * @param  {...number} ___keys - keys
         * @return     {Array}    this - new array without the specified indices
         */
        Del: function(___keys)
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
         * @method obj#DelFn
         * @this   {Array}
         * @param  {function(index, arr, delta)} match - function specifying the indices to delete
         * @param  {Object=}                     ctx_   - optional context for the match function
         * @return {Array}                       this   - new array without the specified indices
         */
        DelFn: function(match, ctx_)
        {
            var output = _.create(this._.proto());

            this._.each(function(val, key, obj, delta) { // eachRight is a little bit faster
                if(!match.call(ctx_, key, obj, delta)) {output._._add(val, key)}
            }, this);

            return output;
        },
        /**
         * Copies keys to an array
         * @public
         * @method obj#define
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
         * @method obj#each
         * @this  {Object}
         * @param {Function} cb   - callback function to be called for each element
         * @param {Object=}  ctx_ - optional context
         */
        // TODO proper implementation for arguments. It will break on phantomJS otherwise
        each: function(cb, ctx_) {
            if(this.hasOwnProperty('length')) // we need to distinguish here because for example phantomJS will not let us use for in on arguments
            {
                for(var key = 0; key < this.length; key++) {
                    if (!this.hasOwnProperty(key)) continue;
                    if (cb.call(ctx_, this[key], key, this) === false) break;
                }
            }
            else {
                for (var key in this) {
                    if (!this.hasOwnProperty(key)) continue;
                    if (cb.call(ctx_, this[key], key, this) === false) break;
                }
            }
        },
        /**
         * Inverse iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         * @public
         * @method obj#eachRight
         * @this  {Object}
         * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
         * @param {function} cb    - callback function to be called for each element
         * @param {Object=}  ctx_  - optional context for the callback function
         * @return {Array}         - this array for chaining
         */
        eachRight: function(step_, cb, ctx_) {
            if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}
            if(this.length) return _.arr.methods.eachRight.apply(this, arguments); // handle arguments.

            this._.keys()._.eachRight(function(key) {
                return cb.call(ctx_, this[key], key, this); // loop is broken upon returning false
            }, this);

            return this;
        },
        /**
         * Filters
         * @public
         * @method obj#filter
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
         * @private
         * @param  {Function} cb   - callback function to be called for each element
         * @param  {Object=}  ctx_ - optional context
         * @return {any} first value that is found
         */
        find: function(cb, ctx_) {
            var found;

            this._.each(function(elm) {
                if(cb.call(ctx_, elm)) return found = elm, false; // break iteration
            });

            return found;
        },
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
         * @method obj#keys
         * @this   {Object}
         * @return {Array} keys of the object
         */
        keys: function() {
            return Object.keys(this);
        },
        /**
         * Removes 1st values from an object|array
         * @public
         * @method obj#remove
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
         * @method obj#removeFn
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                          ctx_   - optional context for the match function
         * @return {Array}                            this   - mutated array for chaining
         */
        removeFn: function(match, ctx_) {
            this._.each(function(val, i, arr, delta) {
                if(match.call(ctx_, val, i, arr, delta)) {this._.del(i); return false}
            }, this);

            return this;
        },
        /**
         * Creates new array without the specified 1st values
         * @public
         * @method obj#Remove
         * @this   {Object|Array}
         * @param  {...any} ___values - values to remove
         * @return {Array}  output    - new array without the values
         */
        Remove: function(___values) {
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
         * @method obj#RemoveFn
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                          ctx_   - optional context for the match function
         * @return {Array}                            output - new array without the value specified
         */
        RemoveFn: function(match, ctx_) {
            var output  =  _.create(this._.proto());
            var matched = false;

            this._.each(function(val, key, obj, delta) {
                if(!matched && match.call(ctx_, val, key, obj, delta)) {matched = true}
                else                                                    {output._._add(val, key)}
            }, this);

            return output;
        },
        /**
         * Removes all specified values from an array
         * @public
         * @method obj#remove$
         * @this       {Array}
         * @param     {...any} ___values - values to remove
         * @return     {Array}     this - mutated array for chaining
         */
        remove$: function(___values) {
            var args = arguments;

            this._.each(function(val, key) {
                if(args._.has(val)) {delete this[key]}
            }, this);

            return this;
        },
        /**
         * Removes all values from an array based on a match function
         * @public
         * @method obj#remove$Fn
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                            ctx_ - optional context for the match function
         * @return {Array}                             this  - mutated array for chaining
         */
        remove$Fn: function(match, ctx_) {
            this._.each(function(val, key, obj) { // eachRight is a little bit faster
                if(match.call(ctx_, val, key, obj)) {delete this[key]}
            }, this);

            return this;
        },

        /**
         * Creates new array without all specified values
         * @public
         * @method obj#Remove$
         * @this       {Array}
         * @param     {...any} ___values - values to remove
         * @return     {Array}    output - new array without the values
         */
        Remove$: function(___values) {
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
         * @method obj#Remove$Fn
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                            ctx_ - optional context for the match function
         * @return {Array}                           output  - new array without the value specified
         */
        Remove$Fn: function(match, ctx_) {
            var output = _.create(this._.proto());

            this._.each(function(val, key, obj, delta) {
                if(!match.call(ctx_, val, key, obj, delta)) {output._._add(val, key)} // key is ignored in case of array
            }, this);

            return output;
        },

        select: function(___values) {
            var args = arguments;
            return this._.remove$Fn(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
        },

        selectFn: function(match, ctx_) {
            var matched = false;
            return this._.remove$Fn(function() {return (match.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
        },

        Select: function(___values) {
            var args = arguments;
            return this._.Remove$Fn(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
        },

        SelectFn: function(match, ctx_) {
            var matched = false;
            return this._.Remove$Fn(function() {return (match.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
        },

        select$: function(___values) {
            var args = arguments;
            return this._.remove$Fn(function(val) {return !~args._.indexOf(val)});
        },
        select$Fn: function(match, ctx_) {
            return this._.remove$Fn(_.fnc.negate(match), ctx_);
        },
        Select$: function(___values) {
            var args = arguments;
            return this._.Remove$Fn(function(val) {return !~args._.indexOf(val)});
        },
        Select$Fn: {aliases: ['find$'], value: function(match, ctx_) {
            return this._.Remove$Fn(_.fnc.negate(match), ctx_);
        }},
        /**
         * Returns the number of own properties on an object
         * @public
         * @method obj#size
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
         * @method obj#names
         * @return {Array} keys of the object
         */
        names: {aliases: ['keys$'], value:function() {
            return Object.getOwnPropertyNames(this);
        }},
        /**
         * Shortcut for hasOwnProperty
         * @public
         * @method obj#owns
         * @return {boolean} boolean indicating ownership
         */
        owns: Object.prototype.hasOwnProperty,
        /**
         * Returns an array containing the keys & values of an object (enumerable properties)
         * @public
         * @method obj#pairs
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
         *
         * @public
         * @method obj#proto
         *
         * @param   {Array}        proto - the prototype to be set
         * @returns {Array|Object} this  - the prototype of the object or the object itself for chaining
         */
        proto: function(proto) {
            if(proto === undefined) return Object.getPrototypeOf(this);

            this.__proto__ = proto;

            return this;
        },
        /**
         * Better to string version
         * @public
         * @method obj#toString
         * @this    {Object}
         * @returns {string} - string representation of the object
         */
        toString: {overrideaction: 'ignore', value: function(visited_)
        {
            var output = '';
            var val;
            var obj;

            for(var key in this)
            {   if(!this.hasOwnProperty(key)) continue;

                obj = this[key];

                if(_.isPrimitive(obj))      {val = obj}
                else
                {
                    if(!visited_)           {visited_ = [this]}

                    if(visited_._.has(obj)) {val = '[[circular ref]]'}
                    else                    {visited_.push(obj); val = obj._.toString(visited_)}
                }

                // TODO punctuation for strings & proper formatting
                output += (output? ', ' : '{') + key + ': ' + val
            }

            return output + '}';
        }},
        /**
         * Returns an array containing the values of an object (enumerable properties)
         * @public
         * @method obj#values
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