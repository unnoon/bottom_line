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
                    if(arr[i] === undefined && arr._.not.owns(i)) continue; // take into account broken arrays
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
            return this._.removeAll$(function(val) {return !val});
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
            return this._.$removeAll$(function(val) {return !val});
        },
        // FIXME added temporarily
        _cpKeys: function(invert, target, $value, opt_to_ctx)
        {
            return this._._editKeys(invert, function(i, _this) {this.push(_this[i]);}, false, target, $value, opt_to_ctx);
        },
        _cp: function(all, invert, target, $value, opt_ctx)
        {
            return this._._edit(all, invert, function(val) {this.push(val)}, false, target, $value, opt_ctx);
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
         * @param   {Object}             ctx_ - optional context for the function
         * @returns {Array}                      - new array with the copied elements
         */
        // TODO decide we make a specialized array version of edit
        _edit: function(all, invert, onmatch, reverse, target, $value, ctx_)
        {
            var first = !all, normal = !invert;
            var array, match, finish = false;

            var cb = (typeof($value) === 'function')? 	$value                                   :
                     (array = _.is.array($value))? 		function(val) {return $value._.has(val)} : // TODO decode if we should remove the array option
                         (_.typeOf($value) === 'arguments') ? function() {console.log('ARGUMENTS given')} :
                         function(val) {return val === $value};

            // note the reverse check should be fixed when this is also implemented for strings
            this._['each'+(reverse?'Right':'')](function(val, i, _this, delta) {
                match = cb.call(ctx_, val, i, _this, delta);
                // remove normal or inverted match
                if(match === normal || finish) onmatch.call(target, val, i, _this, delta);
                // if first and the first match is made check if we are done
                if(first && match && !finish) return finish = array? !$value._.remove(val).length : true, !(normal && finish);
            }, this);

            return target;
        },

        remove: function(__values) {
            var args = arguments;
            var index;

            this._.each(function(val, i) {
                index = args._.indexOf(val);
                if(~index) {this.splice(i, 1); return !!Array.prototype.splice.call(args, index, 1).length}
            }, this);

            return this;
        },

        remove$: function(match$, ctx_) {
            this._.each(function(val, i, arr, delta) {
                if(match$.call(ctx_, val, i, arr, delta)) {this.splice(i, 1); return false}
            }, this);

            return this;
        },

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

        $remove$: function(match$, ctx_) {
            var output  =  _.create(Object.getPrototypeOf(this));
            var matched = false;

            this._.each(function(val, i, arr, delta) {
                if(!matched && match$.call(ctx_, val, i, arr, delta)) {matched = true}
                else {output.push(val)}
            }, this);

            return output;
        },

        removeAll: function(__values) {
            var args = arguments;

            this._.eachRight(function(val, i) { // eachRight is a little bit faster
                if(~args._.indexOf(val)) {this.splice(i, 1)}
            }, this);

            return this;
        },
        removeAll$: function(match$, ctx_) {
            this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                if(match$.call(ctx_, val, i, arr, delta)) {this.splice(i, 1)}
            }, this);

            return this;
        },
        $removeAll: function(__values) {
            var output = _.create(Object.getPrototypeOf(this));
            var args   = arguments;

            this._.each(function(val) {
                if(!~args._.indexOf(val)) {output.push(val)}
            }, this);

            return output;
        },
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
        $selectAll$: function(match$, ctx_) {
            return this._.$removeAll$(_.fnc.not(match$), ctx_);
        },
        /**
         * Removes the occurrences from an array
         * @private
         * @method Array#_del
         * @this    {Array}
         * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
         * @param   {any|Array|Function} $index  - Element to be deleted | Array of element | or a function
         * @param   {Object}             opt_to_ctx - optional context for the function
         * @returns {Array}                      - The array remove the element
         */
        _del: function(invert, $index, opt_to_ctx)
        {
            return this._._editKeys(invert, function(i) {this.splice(i, 1);}, false, this, $index, opt_to_ctx);
        },
        /**
         * @alias remove
         * Returns the difference between 2 arrays
         * @public
         * @method Array#diff
         * @this     {Array}
         * @param {...Array} __arrays - 2 or more arrays to calc the difference from
         * @returns  {Array}          - this for chaining
         */
        //diff: function(__arrays) {...},
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
            return this._.$remove.apply(this, arr);
        },
        diff: function(arr)
        {
            return this._.remove.apply(this, arr);
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
         * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
         * @param  {function} cb       - callback function to be called for each element
         * @param  {Object=}  ctx_  - optional context for the callback function
         * @return {Array}             - this array for chaining
         */
        each: function(step_, cb, ctx_) {
            if(typeof(step_) === 'function')
                return this._._each(1, step_, cb);
            else
                return this._._each(step_, cb, ctx_);
        },
        /**
         * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         * each is eachlastic in the sense that one can add and delete elements at the current index
         * @private
         * @method Array#_each
         * @this   {Array}
         * @param  {number=}  step     - step for the iteration. In case this is a negative value it will do a reverse iteration
         * @param  {function} cb       - callback function to be called for each element
         * @param  {Object=}  ctx_  - optional context for the callback function
         * @return {boolean}           - the result for the halting condition of the callback function.
         * 								 false means iteration was broken prematurely.
         * 								 This information can passed on in nested loops for multi-dimensional arrays
         */
        _each: function(step, cb, ctx_) {
            var from = 0, to = this.length;
            var val, diff, size = to, delta = 0;

            for(var i = from; i < to; i += step)
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
         * @public
         * @method Array#eachRight
         * @this  {Array}
         * @param {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
         * @param {function} cb       - callback function to be called for each element
         * @param {Object=}  ctx_  - optional context for the callback function
         * @return {Array}            - this array for chaining
         */
        eachRight: function(step_, cb, ctx_) {
            if(typeof(step_) === 'function')
                return this._._eachRight(1, step_, cb);
            else
                return this._._eachRight(step_, cb, ctx_);
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
         * @alias $selectAll
         * Finds all elements according to the callback function
         * @public
         * @method Array#_findAll
         * @this   {Array}
         * @param  {Function} cb      - callback function to be called for each element
         * @param  {Object=}  opt_ctx - optional context
         * @return {Array} first value that is found
         */
        //_findAll: function(cb, opt_ctx) {...},
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
                if(_.is.array(val)) this.splice.apply(this, val._.insert(1)._.insert(i));
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
        has: {aliases: ['contains'], value: function(elm) {
            return this.indexOf(elm) > -1;
        }},
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
            return this._.select.apply(this, arr);
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
            return this._.$select.apply(this, arr);
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
                if(arr._.has(val)) {intersects = true; return false}
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
         * @param   {Function} compare$_ - optional function to determine the the max in case of non-numeric array
         * @returns {number|any} - maximum number or element in the array
         */
        max: function(compare$_) {
            if(compare$_ === undefined)
            {
                return Math.max.apply(null, this);
            }
            else
            {
                var max = this[0];

                this._.each(function(elm) {
                    max = compare$_(elm, max) > 0? elm : max;
                });

                return max;
            }
        },
        /**
         * Accessor: Returns the minimum value of an array with numbers
         * @public
         * @method Array#min
         * @this    {Array<number>|Array<any>}
         * @param   {Function=} compare$_ - optional compare function
         * @returns {number|any} - minimum element in the array
         */
        min: function(compare$_) {
            if(compare$_ === undefined)
            {
                return Math.min.apply(null, this);
            }
            else
            {
                var min = this[0];

                this._.each(function(elm) {
                    min = compare$_(elm, min) < 0? elm : min;
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
         * @param   {Object=}  ctx_  - optional context for the modifier function
         * @returns {Array}             - the modified array
         */
        modify: function(modifier, ctx_) {
            this._.each(function(val, i) {
                this[i] = modifier.call(ctx_, val, i, this);
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
         * @returns {Array}                      - The array remove the element
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
         * @returns {Array}                      - The array remove the element
         */
        _rmAll: function(invert, $value, opt_ctx)
        {
            return this._._edit(true, invert, function(val, i) {this.splice(i, 1);}, false, this, $value, opt_ctx);
        },
        ///**
        // * Select the first occurrence in an array
        // * @public
        // * @method Array#select
        // * @this    {Array}
        // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
        // * @param   {Object}             opt_ctx - optional context or the function
        // * @returns {Array }                     - array with the selected element
        // */
        //select: function($value, opt_ctx) {
        //    return this._._rm(true, $value, opt_ctx);
        //},
        ///**
        // * Accessor: Returns the first element found by the selector function
        // * @public
        // * @method Array#$select
        // * @this    {Array}
        // * @param   {Function} $value   - selector function callback to be called on each element
        // * @param   {Object=}  opt_ctx  - optional context for the callback function
        // * @returns {any}               - the found element or undefined otherwise
        // */
        //$select: function($value, opt_ctx) {
        //    return this._._cp(false, false, [], $value, opt_ctx);
        //},
        ///**
        // * Select all occurrence in an array
        // * @public
        // * @method Array#selectAll
        // * @this    {Array}
        // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
        // * @param   {Object}             opt_ctx - optional context or the function
        // * @returns {Array}                      - array with the selected elements
        // */
        //selectAll: function($value, opt_ctx) {
        //    return this._._rmAll(true, $value, opt_ctx);
        //},
        ///**
        // * Select all occurrence in an array and copies them to a new array
        // * @public
        // * @method Array#$selectAll
        // * @this    {Array}
        // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
        // * @param   {Object}             opt_ctx - optional context or the function
        // * @returns {Array}                      - array with the selected elements
        // */
        //$selectAll: {aliases: ['findAll'], value: function($value, opt_ctx) {
        //    return this._._cp(true, false, [], $value, opt_ctx);
        //}},
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
         * @returns {Array} - new array remove duplicates
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
         * Accessor: Returns a new version of the array remove duplicates
         * @public
         * @method Array#$unique
         * @this    {Array}
         * @returns {Array} - new array remove duplicates
         */
        $unique: function() {
            var unique = [];

            this._.each(function(val) {
                if(!unique._.has(val)) unique.push(val);
            }, this);

            return unique;
        },
        ///**
        // * Removes the first occurrence in an array
        // * @public
        // * @method Array#remove
        // * @this    {Array}
        // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
        // * @param   {Object}             opt_ctx - optional context or the function
        // * @returns {Array }                     - The array remove the element
        // */
        //remove: function($value, opt_ctx) {
        //    return this._._rm(false, $value, opt_ctx);
        //},
        ///**
        // * Removes the first occurrence in an array
        // * @public
        // * @method Array#$remove
        // * @this    {Array}
        // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
        // * @param   {Object}             opt_ctx - optional context or the function
        // * @returns {Array }                     - NEW array remove the element
        // */
        //$remove: function($value, opt_ctx) {
        //    return this._._cp(false, true, [], $value, opt_ctx);
        //},
        /**
         * Removes the all occurrence in an array
         * @public
         * @method Array#removeAll
         * @this    {Array}
         * @param   {any|Array|Function} $value - Element to be deleted | Array of elements | or a function
         * @param   {Object=}             ctx_  - optional context or the function
         * @returns {Array}                     - The array remove the element
         */
        //removeAll: function($value, opt_ctx) {
        //    return this._._rmAll(false, $value, opt_ctx);
        //},
        //removeAll: function($value, ctx_) {
        //    return this._._rmAll(false, $value, ctx_);
        //},
        ///**
        // * Removes the all occurrence in an array
        // * @public
        // * @method Array#$removeAll
        // * @this    {Array}
        // * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
        // * @param   {Object}             opt_ctx - optional context or the function
        // * @returns {Array}                      - NEW array remove the element
        // */
        //$removeAll: function($value, opt_ctx) {
        //    return this._._cp(true, true, [], $value, opt_ctx);
        //},
        /**
         * Remove elements based on index
         * @public
         * @method Array#del
         * @this   {Array}
         * @param  {...number} __keys - indices SORTED
         * @return {Array}       this - mutated array for chaining
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
         * @method Array#$del
         * @this   {Array}
         * @param  {number|Array|Function} match$ - singular index, a from index, an array of indices or a function specifying specific indexes
         * @param  {number=} ctx_ - to index to delete to | or the context for the function
         * @return {Array}   this   - mutated array for chaining
         */
        del$: function(match$, ctx_)
        {
            this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                if(match$.call(ctx_, i, arr, delta)) {this.splice(i, 1)}
            }, this);

            return this;
        },
        $del: function(__keys)
        {
            var args   = arguments;
            var output = _.create(Object.getPrototypeOf(this));

            this._.each(function(val, i) { // eachRight is a little bit faster
                if(args._.not.has(i)) {output.push(val)}
            }, this);

            return output;
        },
        $del$: function(match$, ctx_)
        {
            var output = _.create(Object.getPrototypeOf(this));

            this._.each(function(val, i, arr, delta) { // eachRight is a little bit faster
                if(!match$.call(ctx_, i, arr, delta)) {output.push(val)}
            }, this);

            return output;
        }
    }
});