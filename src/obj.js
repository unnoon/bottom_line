construct('obj', {native:Object}, {
    /**
     * @namespace obj
     */
    static: {
        /**
         * Clones an object
         *
         * @public
         * @static
         * @method obj.clone
         *
         * @param {Object} obj - object to be cloned
         *
         * @return {Object} clone - the cloned object
         */
        clone: clone,
        /**
         * creates an object based on a prototype
         *
         * @public
         * @static
         * @method _.create
         *
         * @param {Object} proto - prototype to base the object on
         *
         * @return {Object} - new object based on prototype
         */
        create: function(proto) {
            return (proto === Array.prototype) ? [] : Object.create(proto);
        },
        /**
         * See bottom_line.js for documentation details
         */
        extend: extend,
        /**
         * Returns the type of an object. Better suited then the one from js itself
         *
         * @public
         * @static
         * @method obj.typeof
         *
         * @param {Object} obj - object tot check the type from
         *
         * @return {string} - type of the object
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
         *
         * @public
         * @static
         * @method obj.names
         *
         * @param  {Object} obj - object tot check the type from
         *
         * @return {Array} - Array containing the names of the object
         */
        names: function(obj) {
            return (obj === null || obj === undefined) ? [] : Object.getOwnPropertyNames(obj);
        },
        /**
         * Returns the correct owner/prototype of a property in a prototype chain
         *
         * @public
         * @static
         * @method obj.owner
         *
         * @param {string} prop - property name
         * @param {Object} obj  - start prototype
         *
         * @return {Object|undefined} - the owning prototype
         */
        owner: function(prop, obj)
        {
            var proto = obj;

            do
            {
                if(proto.hasOwnProperty(prop)) {return proto}
            } while(proto = proto._.proto())
        }
    },
    prototype: {
        /**
         * Singular push function to solve problems with differences between objects & arrays
         *
         * @private
         * @method obj#_add
         *
         * @this    {Object}
         *
         * @param  {any}    val - value to add
         * @param  {string} key - string key to add to the object
         *
         * @return  {Array} this - this for chaining
         */
        _add: function(val, key) {
            this[key] = val;

            return this;
        },
        /**
         * local assign method including deep option
         *
         * @public
         * @method obj#assign
         *
         * @this {Object}
         *
         * @param {string=}        _mode_ - mode for assignation 'shallow'|'deep'. default is 'shallow'
         * @param {...Object} ___sources  - one or more object sources
         *
         * @return {Object} this - this after assignation
         */
        assign: function(_mode_, ___sources)
        {   "use strict";

            var mode = _mode_ === 'deep' || 'shallow' ? _mode_ : 'shallow';
            var i    = _mode_ === 'deep' || 'shallow' ? 1      : 0;
            var from;
            var to = this;
            var symbols;

            for (; i < arguments.length; i++) {
                from = Object(arguments[i]);

                for (var key in from) {
                    if (!from.hasOwnProperty(key)) {continue}

                    if(mode === 'deep' && _.isObject(to[key]) && _.isObject(from[key]))
                    {
                        to[key]._.assign(mode, from[key])
                    }
                    else if(to.hasOwnProperty(key) && Object.getOwnPropertyDescriptor(to, key).writable === false)
                    {

                    }
                    else
                    {
                        to[key] = from[key];
                    }
                }

                if (Object.getOwnPropertySymbols) {
                    symbols = Object.getOwnPropertySymbols(from);
                    for (var s = 0; s < symbols.length; s++) {
                        if (propIsEnumerable.call(from, symbols[s])) {
                            to[symbols[s]] = from[symbols[s]];
                        }
                    }
                }
            }

            return to;
        },
        /**
         * Counts the number of occurrences of an element
         *
         * @public
         * @method obj#count
         *
         * @param   {any}   elm  - value to push
         *
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
         * Counts the number of occurrences of an element. Based on the match function
         *
         * @public
         * @method obj#countFn
         *
         * @param   {Function}  matchFn     - match function should return a boolean or 0 1
         *
         * @return  {number}    occurrences - occurrences of the elm int he object
         */
        countFn: function(matchFn) {
            var occurrences = 0;

            this._.each(function(e) {
                occurrences += matchFn(e); // js magic true = 1 false = 0
            });

            return occurrences;
        },
        /**
         * Shortcut to Object.defineProperty. If no descriptor property is given enumerable, configurable & writable will all be false
         *
         * @public
         * @method obj#define
         *
         * @this   {Object}
         *
         * @param  {string} prop       - the property name
         * @param  {Object} descriptor - descriptor object
         *
         * @return {Object} this        - object for chaining
         */
        define: function(prop, descriptor)
        {
            return Object.defineProperty(this, prop, descriptor)
        },
        /**
         * Defines a constant: enumerable, configurable & writable will all be false
         *
         * @public
         * @method obj#constant
         *
         * @this   {Object}
         *
         * @param  {string} prop  - the constant name
         * @param  {Object} value - the value of the constant.
         *
         * @return {Object} this  - object for chaining
         */
        constant: function(prop, value)
        {
            return Object.defineProperty(this, prop, {value:value, enumerable: true})
        },
        /**
         * Remove elements based on index
         *
         * @public
         * @method obj#del
         *
         * @this       {Object}
         *
         * @param  {...number} ___keys - indices SORTED
         *
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
         *
         * @public
         * @method obj#delFn
         *
         * @this   {Array}
         *
         * @param  {function(index, arr, delta)} match - function specifying the indices to delete
         * @param  {Object=}                     ctx_   - optional context for the match function
         *
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
         *
         * @public
         * @method obj#Del
         *
         * @this       {Array}
         *
         * @param  {...number} ___keys - keys
         *
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
         *
         * @public
         * @method obj#DelFn
         *
         * @this   {Array}
         *
         * @param  {function(index, arr, delta)} match - function specifying the indices to delete
         * @param  {Object=}                     ctx_   - optional context for the match function
         *
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
         * Gets the descriptor of a property. Will search through the prototype chain
         *
         * @public
         * @method obj#descriptor
         *
         * @this   {Object}
         *
         * @param  {string}       prop - the property name
         *
         * @return {Object} descriptor - descriptor object
         */
        descriptor: {aliases: ['dsc'], value: function(prop)
        {
            return Object.getOwnPropertyDescriptor(_.owner(prop, this), prop)
        }},
        /**
         * Object iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         *
         * @public
         * @method obj#each
         *
         * @this  {Object}
         *
         * @param {Function} cb   - callback function to be called for each element
         * @param {Object=}  ctx_ - optional context
         *
         * @return {any|boolean}  - output from the callback function
         */
        each: function(cb, ctx_) {
            if(_.isArguments(this)) return _.arr.methods.each.apply(this, arguments); // handle arguments.
            var output;

            for (var key in this) {
                if (!this.hasOwnProperty(key)) continue;
                if ((output = cb.call(ctx_, this[key], key, this)) === false) break;
            }

            return output;
        },
        /**
         * Object descriptor iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         *
         * @public
         * @method obj#eachDsc
         *
         * @this  {Object}
         *
         * @param {Function} cb   - callback function to be called for each element
         * @param {Object=}  ctx_ - optional context
         *
         * @return {any|boolean}  - output from the callback function
         */
        eachDsc: function(cb, ctx_) {
            var output;

            for (var key in this) {
                if (!this.hasOwnProperty(key)) continue;
                if ((output = cb.call(ctx_, this._.descriptor(key), key, this)) === false) break;
            }

            return output;
        },
        /**
         * Object iterator without hasOWnProperty check.
         * If the value false is returned, iteration is canceled. This can be used to stop iteration
         *
         * @public
         * @method obj#each$
         * @this  {Object}
         *
         * @param {Function} cb   - callback function to be called for each element
         * @param {Object=}  ctx_ - optional context
         *
         * @return {any|boolean}  - output from the callback function
         */
        each$: function(cb, ctx_) {
            if(_.isArguments(this)) return _.arr.methods.each.apply(this, arguments); // handle arguments.
            var output;

            for (var key in this) {
                if ((output = cb.call(ctx_, this[key], key, this)) === false) break;
            }

            return output;
        },
        /**
         * Object descriptor iterator without hasOWnProperty check.
         * If the value false is returned, iteration is canceled. This can be used to stop iteration
         *
         * @public
         * @method obj#each$Dsc
         * @this  {Object}
         *
         * @param {Function} cb   - callback function to be called for each element
         * @param {Object=}  ctx_ - optional context
         *
         * @return {any|boolean}  - output from the callback function
         */
        each$Dsc: function(cb, ctx_) {
            var output;

            for (var key in this) {
                if ((output = cb.call(ctx_, this._.descriptor(key), key, this)) === false) break;
            }

            return output;
        },
        /**
         * Inverse iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         *
         * @public
         * @method obj#eachRight
         *
         * @this  {Object}
         *
         * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
         * @param {function} cb    - callback function to be called for each element
         * @param {Object=}  ctx_  - optional context for the callback function
         *
         * @return {any|boolean}   - output from the callback function
         */
        eachRight: function(cb, ctx_) {
            if(_.isArguments(this)) return _.arr.methods.eachRight.apply(this, arguments); // handle arguments.

            return this._.keys()._.eachRight(function(key) {
                return cb.call(ctx_, this[key], key, this); // loop is broken upon returning false
            }, this);
        },
        /**
         * Inverse iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         *
         * @public
         * @method obj#eachDscRight
         *
         * @this  {Object}
         *
         * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
         * @param {function} cb    - callback function to be called for each element
         * @param {Object=}  ctx_  - optional context for the callback function
         *
         * @return {any|boolean}   - output from the callback function
         */
        eachDscRight: function(cb, ctx_) {
            return this._.keys()._.eachRight(function(key) {
                return cb.call(ctx_, this._.descriptor(key), key, this); // loop is broken upon returning false
            }, this);
        },
        /**
         * Filters
         *
         * @public
         * @method obj#filter
         *
         * @this   {Object}
         *
         * @param  {Function} cb      - callback function to be called for each element
         * @param  {Object=}  opt_ctx - optional context
         *
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
         *
         * @public
         * @method obj#find
         *
         * @param  {Function} cb   - callback function to be called for each element
         * @param  {Object=}  ctx_ - optional context
         *
         * @return {any} first value that is found
         */
        find: function(cb, ctx_) {
            var found;

            this._.each(function(elm) {
                if(cb.call(ctx_, elm)) return found = elm, false; // break iteration
            });

            return found;
        },
        /**
         * Finds first element that is picked by the callback function. Starting from the rioght
         *
         * @public
         * @method obj#findRight
         *
         * @param  {Function} cb   - callback function to be called for each element
         * @param  {Object=}  ctx_ - optional context
         *
         * @return {any} first value that is found
         */
        findRight: function(cb, ctx_) {
            var found;

            this._.eachRight(function(elm) {
                if(cb.call(ctx_, elm)) return found = elm, false; // break iteration
            });

            return found;
        },
        /**
         * Checks if a value is contained ia a object
         *
         * @public
         * @method obj#has
         *
         * @param {any} value - value to search for
         *
         * return {boolean} - boolean indicating if the object has the value
         */
        has: {aliases: ['contains'], value: function(value) {
            var has = false;

            this._.each(function(val) {
                if(value === val) return !(has = true);
            });

            return has;
        }},
        /**
         * Checks if a value is contained ia a object, matching the callback function
         *
         * @public
         * @method obj#hasFn
         *
         * @param {Function} cb   - callback matching a value
         * @param {Object=}  ctx_ - optional context for the callback function
         *
         * return {boolean} - boolean indicating if the object has the value
         */
        hasFn: {aliases: ['containsFn'], value: function(cb, ctx_) {
            return !!this._.find(cb, ctx_);
        }},
        /**
         * InstanceOf function that doesn't lie and returns true if the instance was created by the actual class or prototype
         *
         * @public
         * @method obj#instanceOf
         *
         * @param {Function|Object} class_prototype - either a function or a prototype depending on the type of inheritance you are using
         *
         * @returns {boolean} - boolean indicating if the instance was created by the actual class or prototype
         */
        instanceOf: function(class_prototype) {
            var cp = class_prototype;

            return cp.prototype? this.constructor === cp : Object.getPrototypeOf(this) === cp;
        },
        keyOf: {aliases: ['indexOf'], value: function(value) {
            var key = -1;

            this._.each(function(val, k) {
                if(value === val) return key = k, false;
            });

            return key;
        }},
        keyOfFn: {aliases: ['indexOfFn'], value: function(cb, ctx_) {
            var key = -1;

            this._.each(function(val, k) {
                if(cb.call(ctx_, val)) return key = k, false;
            });

            return key;
        }},
        /**
         * Returns an array containing the keys of an object (enumerable properties))
         *
         * @public
         * @method obj#keys
         *
         * @this   {Object}
         *
         * @return {Array} keys of the object
         */
        keys: function() {
            return Object.keys(this);
        },
        /**
         * Removes 1st values from an object|array
         *
         * @public
         * @method obj#remove
         *
         * @this   {Object}
         *
         * @param  {...any}       ___values - values to remove
         *
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
         *
         * @public
         * @method obj#removeFn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                          ctx_   - optional context for the match function
         *
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
         *
         * @this   {Object}
         *
         * @param  {...any} ___values - values to remove
         *
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
         *
         * @public
         * @method obj#RemoveFn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                          ctx_   - optional context for the match function
         *
         * @return {Array}                            output - new array without the value specified
         */
        RemoveFn: function(match, ctx_) {
            var output  =  _.create(this._.proto());
            var matched = false;

            this._.each(function(val, key, obj, delta) {
                if(!matched && match.call(ctx_, val, key, obj, delta)) {matched = true}
                else                                                   {output._._add(val, key)}
            }, this);

            return output;
        },
        /**
         * Removes all specified values from an array
         *
         * @public
         * @method obj#remove$
         *
         * @this       {Array}
         *
         * @param     {...any} ___values - values to remove
         *
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
         *
         * @public
         * @method obj#remove$Fn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                            ctx_ - optional context for the match function
         *
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
         *
         * @public
         * @method obj#Remove$
         *
         * @this       {Array}
         *
         * @param     {...any} ___values - values to remove
         *
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
         *
         * @public
         * @method obj#Remove$Fn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
         * @param  {Object=}                            ctx_ - optional context for the match function
         *
         * @return {Array}                           output  - new array without the value specified
         */
        Remove$Fn: function(match, ctx_) {
            var output = _.create(this._.proto());

            this._.each(function(val, key, obj, delta) {
                if(!match.call(ctx_, val, key, obj, delta)) {output._._add(val, key)} // key is ignored in case of array
            }, this);

            return output;
        },
        /**
         * Selects 1st values from an object|array
         *
         * @public
         * @method obj#select
         *
         * @this   {Object}
         *
         * @param  {...any} ___values - values to select
         *
         * @return {Object|Array} this - mutated array for chaining
         */
        select: function(___values) {
            var args = arguments;
            return this._.remove$Fn(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
        },
        /**
         * Selects 1st value from an object|array based on a match function
         *
         * @public
         * @method obj#selectFn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to select
         * @param  {Object=}                          ctx_   - optional context for the match function
         *
         * @return {Object|Array} this - mutated array for chaining
         */
        selectFn: function(match, ctx_) {
            var matched = false;
            return this._.remove$Fn(function() {return (match.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
        },
        /**
         * Creates new array with the specified 1st values
         * @public
         * @method obj#Select
         *
         * @this   {Object}
         *
         * @param  {...any} ___values - values to select
         *
         * @return {Array} output - new array with the values
         */
        Select: function(___values) {
            var args = arguments;
            return this._.Remove$Fn(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
        },
        /**
         * Creates a new object|array with 1st value based on a match function
         *
         * @public
         * @method obj#SelectFn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to select
         * @param  {Object=}                          ctx_   - optional context for the match function
         *
         * @return {Array} output - new array with the value specified
         */
        SelectFn: function(match, ctx_) {
            var matched = false;
            return this._.Remove$Fn(function() {return (match.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
        },
        /**
         * Selects all specified values from an array
         *
         * @public
         * @method obj#select$
         *
         * @this {Array}
         *
         * @param {...any} ___values - values to select
         *
         * @return {Array} this - mutated array for chaining
         */
        select$: function(___values) {
            var args = arguments;
            return this._.remove$Fn(function(val) {return !~args._.indexOf(val)});
        },
        /**
         * Selects all values from an array based on a match function
         *
         * @public
         * @method obj#select$Fn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to select
         * @param  {Object=}                            ctx_ - optional context for the match function
         *
         * @return {Array} this - mutated array for chaining
         */
        select$Fn: function(match, ctx_) {
            return this._.remove$Fn(_.fnc.negate(match), ctx_);
        },
        /**
         * Creates new array with all specified values
         *
         * @public
         * @method obj#Select$
         *
         * @this {Object}
         *
         * @param {...any} ___values - values to remove
         *
         * @return {Array} output - new array with the values
         */
        Select$: function(___values) {
            var args = arguments;
            return this._.Remove$Fn(function(val) {return !~args._.indexOf(val)});
        },
        /**
         * Creates a new array with all value specified by the match function
         *
         * @public
         * @method obj#Select$Fn
         *
         * @this   {Array}
         *
         * @param  {function(val, index, arr, delta)} match - function specifying the value to select
         * @param  {Object=}                            ctx_ - optional context for the match function
         *
         * @return {Array} output - new array with the values specified
         */
        Select$Fn: {aliases: ['find$'], value: function(match, ctx_) {
            return this._.Remove$Fn(_.fnc.negate(match), ctx_);
        }},
        /**
         * Returns the number of own properties on an object
         *
         * @public
         * @method obj#size
         *
         * @this   {Object}
         *
         * @return {number} the 'length' of the object
         */
        size: {aliases: ['length'], value: function() {
            var len = 0;

            this._.each(function() {
                len++;
            });

            return len;
        }},
        /**
         * Returns an array containing the names of an object (includes non-enumerable properties)
         *
         * @public
         * @method obj#names
         *
         * @return {Array} keys of the object
         */
        names: {aliases: ['keys$'], value:function() {
            return Object.getOwnPropertyNames(this);
        }},
        /**
         * Shortcut for hasOwnProperty
         * @public
         * @method obj#owns
         *
         * @return {boolean} boolean indicating ownership
         */
        owns: Object.prototype.hasOwnProperty,
        /**
         * Returns an array containing the keys & values of an object (enumerable properties)
         *
         * @public
         * @method obj#pairs
         *
         * @this   {Object}
         *
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
         * NOTE setting a prototype using __proto__ is non standard (and SLOOWWW) use at your own risk!
         *
         * @public
         * @method obj#proto
         *
         * @param   {Array}        proto - the prototype to be set
         *
         * @returns {Array|Object} this  - the prototype of the object or the object itself for chaining
         */
        proto: function(proto) {
            if(proto === undefined) return Object.getPrototypeOf(this);

            this.__proto__ = proto;

            return this;
        },
        /**
         * Better to string version
         *
         * @public
         * @method obj#stringify
         *
         * @this    {Object}
         *
         * @returns {string} - string representation of the object
         */
        stringify: function(visited_)
        {
            var output = '';

            this._.each(function(obj, key) {
                var val;

                if(_.isPrimitive(obj))      {val = obj}
                else
                {
                    if(!visited_)           {visited_ = [this]}

                    if(visited_._.has(obj)) {val = '[[circular ref]]'}
                    else                    {visited_.push(obj); val = obj._.stringify(visited_)}
                }

                // TODO punctuation for strings & proper formatting
                output += (output? ', ' : '{') + key + ': ' + val
            });

            return output + '}';
        },
        /**
         * 'fixes' wrong implicit calls to the _methods object
         *
         * @public
         * @method obj#toString
         *
         * @this    {Object}
         *
         * @returns {string} - empty string
         */
        toString: {onoverride: null, value: function()
        {
            return ''
        }},
        /**
         * Returns an array containing the values of an object (enumerable properties)
         * @public
         *
         * @method obj#values
         *
         * @this   {Object}
         *
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