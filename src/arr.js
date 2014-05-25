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
        /**
         * Concats 2 or more array. Result is an new array
         * @public
         * @static
         * @method module:_.arr.concat
         * @param {...Array} var_args     - 2 or more arrays
         * @returns  {Array} array containing the concatenated array
         */
        concat: function(var_args) {
            return Array.prototype.concat.apply([], arguments);
        }
    },
    /**
     * @class Array
     */
    prototype: {
        /**
         * Mutator: Append 1 or more arrays to the current array
         * @public
         * @method Array#append
         * @this       {Array}
         * @param      {Array} arr  - array to be appended
         * @returns    {Array} this - Array appended with arr
         */
        append: function(arr) {
            var val;
            var start = this.length;

            for(var i = 0, max = arr.length; i < max; i++)
            {
                if((val = arr[i]) === undefined && !arr.hasOwnProperty(i)) continue; // take in account broken arrays
                this[start+i] = val;
            }

            return this;
        },
        /**
         * appends 1 or more arrays toa new array
         * @public
         * @method Array#$append
         * @this       {Array}
         * @param   {...Array} var_args - 1 or more arrays to be appended
         * @returns    {Array}  this     - Array appended with arr
         */
        $append: function(var_args) {
            // FIXME this need to be adapated for broken arrays I think
            return _.clone(this).bl.append(var_args);
        },
        /**
         * Accessor: Returns the average of an array with numbers
         * @public
         * @method Array#avg
         * @this    {Array<number>}
         * @returns {Number} - Average of the numbers in the array
         */
        avg: function() {
            return this.sum()/this.length;
        },
        /**
         * Removes al falsey values from an array
         * @public
         * @method Array#compact
         * @this   {Array}
         * @return {Array}                 this       - mutated array for chaining
         */
        compact: function()
        {
            return this.bl.withoutAll(function(val) {return !val});
        },
        /**
         * Removes al falsey values from an array into a new array
         * @public
         * @method Array#$compact
         * @this   {Array}
         * @return {Array}                 this       - mutated array for chaining
         */
        $compact: function()
        {
            return this.bl.$withoutAll(function(val) {return !val});
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
            return this.bl._cp(false, false, to, $value, opt_ctx);
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
            return this.bl._cp(true, false, to, $value, opt_ctx);
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
            return this.bl._cpKeys(false, to, $index, opt_to_ctx);
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
            return this.bl._edit(all, invert, function(val) {this.push(val);}, false, target, $value, opt_ctx);
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
            return this.bl._edit(all, invert, function(val, i, _this) {this.push(val); _this.splice(i, 1)}, false, target, $value, opt_ctx);
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
            return this.bl._editKeys(invert, function(i, _this) {this.push(_this[i]); _this.splice(i, 1)}, false, target, $value, opt_ctx);
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
            return this.bl._cut(false, false, to, $value, opt_ctx);
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
            return this.bl._cut(true, false, to, $value, opt_ctx);
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
            return this.bl._cutKeys(false, to, $index, opt_to_ctx);
        },
        /**
         * Copies the occurrences from an array to an new array
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
            return this.bl._editKeys(invert, function(i, _this) {this.push(_this[i]);}, false, target, $value, opt_to_ctx);
        },
        /**
         * Edits the occurrences of an array
         * @private
         * @method Array#_edit
         * @this    {Array}
         * @param   {boolean}            all     - Boolean indicating if we should remove the first occurrence only
         * @param   {boolean}            invert  - Boolean indicating if we should invert the condition
         * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
         * @param   {Object}             opt_ctx - optional context for the function
         * @returns {Array}                      - new array with the copied elements
         */
        _edit: __coll._edit,
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
            return this.bl._editKeys(invert, function(i) {this.splice(i, 1);}, false, this, $index, opt_to_ctx);
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
            return this.bl.without(arr);
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
            return this.bl.$selectAll(function(val) {return !arr.bl.has(val)});
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
         * i.e. [3, 6].bl.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
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
                return this.bl._each(1, opt_step, cb);
            else
                return this.bl._each(opt_step, cb, opt_ctx);
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
                return this.bl._eachRight(1, opt_step, cb);
            else
                return this.bl._eachRight(opt_step, cb, opt_ctx);
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
            var val;

            cb = opt_ctx? cb.bind(opt_ctx) : cb;

            for(var i = from; i > to; i -= step)
            {
                if((val = this[i]) === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                if(cb(this[i], i, this) === false) break;
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
            return this.bl.$selectAll(cb, opt_ctx);
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
            return this.bl.each(function(val, i) {
                if(_.isArray(val)) this.splice.apply(this, val.bl.insert(1).bl.insert(i));
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
            return this.bl.selectAll(function(val) {
                return arr.bl.has(val);
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
            return this.bl.$selectAll(function(val) {
                return arr.bl.has(val);
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

            this.bl.each(function(val) {
                if(arr.bl.has(val)) return !(intersects = true);
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

                this.bl.each(function(elm) {
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

                this.bl.each(function(elm) {
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
            this.bl.each(function(val, i) {
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
            return _.clone(this).bl.modify(modifier, opt_ctx);
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
        _rm: function(all, invert, $value, opt_ctx)
        {
            return this.bl._edit(all, invert, function(val, i) {this.splice(i, 1);}, false, this, $value, opt_ctx);
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
            return this.bl._rm(false, true, $value, opt_ctx);
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
            return this.bl._cp(false, false, [], $value, opt_ctx);
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
            return this.bl._rm(true, true, $value, opt_ctx);
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
            return this.bl._cp(true, false, [], $value, opt_ctx);
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
            return this.bl._del(true, $index, opt_to_ctx);
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
            return this.bl._cpKeys(false, [], $index, opt_to_ctx);
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
            return this.reduce(function(a, b) { return a + b; });
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
                output += (i? ', ' : '') + this[i].bl.toString();
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
            return this.bl.append(arr).bl.unique();
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
            var app = this.bl.$append(arr);
            var output = app.bl.unique();

            return output;

//				return this.bl.$append(arr).bl.unique();
        },
        /**
         * Removes duplicate values in an array
         * @public
         * @method Array#unique
         * @this    {Array}
         * @returns {Array} - new array without duplicates
         */
        unique: function() {
            this.bl.eachRight(function(val, i) {
                this.bl.each(function(duplicate, j) {
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

            this.bl.each(function(val) {
                if(!unique.bl.has(val)) unique.push(val);
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
            return this.bl._rm(false, false, $value, opt_ctx);
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
            return this.bl._cp(false, true, [], $value, opt_ctx);
        },
        /**
         * Removes the all occurrence in an array
         * @public
         * @method Array#withoutAll
         * @this    {Array}
         * @param   {any|Array|Function} $value  - Element to be deleted | Array of element | or a function
         * @param   {Object}             opt_ctx - optional context or the function
         * @returns {Array}                      - The array without the element
         */
        withoutAll: function($value, opt_ctx) {
            return this.bl._rm(true, false, $value, opt_ctx);
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
            return this.bl._cp(true, true, [], $value, opt_ctx);
        },
        /**
         * Remove elements based on index
         * @public
         * @method Array#withoutKeys
         * @this   {Array}
         * @param  {number|Array|Function} $index - singular index, a from index, an array of indices or a function specifying specific indexes
         * @param  {number=} opt_to_ctx - to index to delete to | or the context for the function
         * @return {Array}   this   - mutated array for chaining
         */
        withoutKeys: function($index, opt_to_ctx)
        {
            return this.bl._del(false, $index, opt_to_ctx);
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
            return this.bl._cpKeys(true, [], $index, opt_to_ctx);
        }
    }
});