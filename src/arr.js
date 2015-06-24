construct('arr', {native:Array}, {
    /**
     * @namespace arr
     */
    static: {
        /**
         * Concatenates arrays into a new array
         * @public
         * @static
         * @method arr.concat
         * @param {...Array} ___arrays - arrays to concat
         * @returns  {Array}           - the concatenated array
         */
        concat: function(___arrays) {
            return Array.prototype.concat.apply([], arguments);
        }
    },
    prototype: {
        /**
         * Append one or more arrays to the current array. Takes into account broken arrays
         * @public
         * @method   arr#append
         * @param   {...Array} ___arrays - arrays to be appended
         * @returns    {Array}      this - this appended with the arrays
         */
        append: function(___arrays) {
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
         * Append one or more arrays to the current array into a new array
         * @public
         * @method   arr#Append
         * @param   {...Array} ___arrays - arrays to be appended
         * @returns    {Array}           - The new array that is the result of appending
         */
        Append: function(___arrays) {
            return _.clone(this)._.append.apply(null, arguments); // we can use a null context here since it will get the value from the stack
        },
        /**
         * Returns the average of a number based array
         * @public
         * @method   arr#avg
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
         * @method  arr#compact
         * @this   {Array}
         * @return {Array} this - mutated array for chaining
         */
        compact: function()
        {
            return this._.remove$Fn(function(val) {return !val});
        },
        /**
         * Removes all falsey values from an array into a new array
         * @public
         * @method  arr#Compact
         * @this   {Array}
         * @return {Array} this - new array instance without falsey values
         */
        Compact: function()
        {
            return this._.Remove$Fn(function(val) {return !val});
        },
        /**
         * Remove elements based on index
         * @public
         * @method arr#del
         * @this       {Array}
         * @param  {...number} ___indices - indices SORTED
         * @return     {Array}       this - mutated array for chaining
         */
        del: {overrideaction: 'ignore', value: function(___indices)
        {
            arguments._.eachRight(function(key) {
                this.splice(key, 1);
            }, this);

            return this;
        }},
        /**
         * Remove elements based on index
         * @public
         * @method  arr#delFn
         * @param  {function(index, arr, delta)} match - function specifying the indices to delete
         * @param  {Object=}                     ctx_   - optional context for the match function
         * @return {Array}                       this   - mutated array for chaining
         */
        delFn: {overrideaction: 'ignore', value: function(match, ctx_)
        {
            this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                if(match.call(ctx_, i, arr, delta)) {this.splice(i, 1)}
            }, this);

            return this;
        }},
        /**
         * Removes all specified values from an array
         * @public
         * @method  arr#remove$
         * @param  {...any} ___values - values to remove
         * @return {Array}       this - mutated array for chaining
         */
        remove$: {overrideaction: 'ignore', value: function(___values) {
            var args = arguments;

            this._.eachRight(function(val, i) { // eachRight is a little bit faster
                if(~args._.indexOf(val)) {this.splice(i, 1)}
            }, this);

            return this;
        }},
        /**
         * Removes all values from an array based on a match function
         * @public
         * @method  arr#remove$Fn
         * @this   {Array}
         * @param  {function(val, index, arr, delta)} match  - function specifying the value to delete
         * @param  {Object=}                            ctx_ - optional context for the match function
         * @return {Array}                             this  - mutated array for chaining
         */
        remove$Fn: {overrideaction: 'ignore', value: function(match, ctx_) {
            this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                if(match.call(ctx_, val, i, arr, delta)) {this.splice(i, 1)}
            }, this);

            return this;
        }},

        /**
         * Difference between the current and other arrays
         * @public
         * @method   arr#diff
         * @param   {...Array} ___arrays - arrays to subtract from this
         * @returns {Array}         this - array mutated by difference
         */
        diff: function(___arrays)
        {
            arguments._.each(function(arr) {
                return this._.remove.apply(this, arr);
            }, this);

            return this
        },
        /**
         * Returns the difference between the current and multiple other arrays in a new array
         * @public
         * @method   arr#Diff
         * @param   {...Array} ___arrays - array to subtract from this
         * @returns {Array}              - new array containing the difference
         */
        Diff: function(___arrays)
        {
            if(arguments.length === 1) {return this._.Remove.apply(this, ___arrays)}

            return _.clone(this)._.diff.apply(null, arguments); // we can use a null context here since it will get the value from the stack
        },
        /**
         * Creates a multidimensional array. The dimensions come from the array itself
         * i.e. [3, 6]._.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
         * @public
         * @method arr#Dimit
         * @this   {Array}
         * @param  {any|Function=} init_ - initial value for the array. Can be either a value or a function specifying the value
         * @return {Array}               - this initialized multi-dimensional array
         */
        dimit: {aliases: ['dimensionalize'], value: function(init_)
        {
            var dimensions    = this;
            var arr           = new Array(dimensions[0]);
            var lastDimension = dimensions.length-1;

            // add other dimensions
            addDimension(arr, 0, dimensions);

            return arr;

            function addDimension(arr, dim, dimensions)
            {
                for(var i = 0, max = dimensions[dim]; i < max; i++)
                {
                    arr[i] = (dim === lastDimension)? _.clone(init_) : new Array(dimensions[dim+1]);

                    addDimension(arr[i], dim+1, dimensions); // add another dimension
                }
            }
        }},
        /**
         * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         * each is eachlastic in the sense that one can add and delete elements at the current index
         * @public
         * @method arr#each
         * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
         * @param  {function} cb    - callback function to be called for each element
         * @param  {Object=}  ctx_  - optional context for the callback function
         * @return {any|boolean}    - output from the callback function
         */
        each: {overrideaction: 'ignore', value: function(step_, cb, ctx_) {
            if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}

            var from = 0, to = this.length;
            var val, diff, size = to, delta = 0;
            var output;

            for(var i = from; i < to; i += step_)
            {
                if((val = this[i]) === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                if((output = cb.call(ctx_, this[i], i, this, delta)) === false) break;
                if(diff = this.length - size) i += diff, to += diff, size += diff, delta += diff; // correct index after insertion or deletion
            }

            return output;
        }},
        /**
         * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
         * @public
         * @method arr#eachRight
         * @this   {Array}
         * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
         * @param  {function} cb    - callback function to be called for each element
         * @param  {Object=}  ctx_  - optional context for the callback function
         * @return {any|boolean}    - output from the callback function
         */
        eachRight: {overrideaction: 'ignore', value: function(step_, cb, ctx_) {
            if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}

            var from = this.length-1, to = -1;
            var output;

            for(var i = from; i > to; i -= step_)
            {
                if(this[i] === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                if((output = cb.call(ctx_, this[i], i, this)) === false) break;
            }

            return output;
        }},
        /**
         * Get/sets: the first element of an array
         * @public
         * @method arr#first
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
         * @method   arr#flatten
         * @returns {Array} - this for chaining
         */
        // TODO multi dimensional flattening
        flatten: function() {
            this._.each(function(val, i) {
                if(_.isArray(val)) this.splice.apply(this, val._.insert(1)._.insert(i));
            }, this);

            return this
        },
        /**
         * Flattens a 2 dimensional array into a new array
         * @public
         * @method arr#Flatten
         * @returns {Array} - new flattened version of the array
         */
        Flatten: function() {
            return this.concat.apply([], this);
        },
        /**
         * Check is an array contains a certain value
         * @public
         * @method   arr#has
         * @param   {Object}  elm - element to check membership of
         * @returns {boolean}     - boolean indicating if the array contains the element
         */
        has: {aliases: ['contains'], overrideaction: 'ignore', value: function(elm) {
            return this.indexOf(elm) > -1;
        }},
        /**
         * Inserts an element in a specific location in an array
         * @public
         * @method   arr#insert
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
         * @method arr#intersect
         * @param  {Array} arr - 2 or more arrays
         * @return {Array}     - this for chaining
         */
        intersect: function(arr) {
            return this._.select.apply(this, arr);
        },
        /**
         * Calculates the intersection for 2 or more arrays
         * @public
         * @method arr#Intersect
         * @this   {Array}
         * @param  {Array} arr - 2 or more arrays
         * @return {Array}     - this for chaining
         */
        Intersect: function(arr) {
            return this._.Select.apply(this, arr);
        },
        /**
         * Checks if an array intersects an other
         * @public
         * @method arr#intersects
         * @this    {Array}
         * @param   {Array}  arr - array to check intersection with
         * @returns {boolean}    - boolean indicating if the 2 arrays intersect
         */
        intersects: function(arr) {
            var intersects = false;

            this._.each(function(val) {
                if(arr._.has(val)) {return !(intersects = true)}
            });

            return intersects;
        },
        /**
         * gets/sets the last element of an array
         * @public
         * @method arr#last
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
         * @method arr#max
         * @this    {Array<number>|Array<any>}
         * @param   {function}   compareFn_ - optional function to determine the the max in case of non-numeric array
         * @returns {number|any}           - maximum number or element in the array
         */
        max: function(compareFn_) {
            if(compareFn_ === undefined) {return Math.max.apply(null, this)}
            else
            {
                var max = this[0];

                this._.each(function(elm) {
                    if(compareFn_(elm, max) > 0) max = elm;
                });

                return max;
            }
        },
        /**
         * Returns the minimum value of an array with numbers
         * @public
         * @method arr#min
         * @this    {Array<number>|Array<any>}
         * @param   {Function=} compareFn_ - optional compare function
         * @returns {number|any} - minimum element in the array
         */
        min: function(compareFn_) {
            if(compareFn_ === undefined) {return Math.min.apply(null, this)}
            else
            {
                var min = this[0];

                this._.each(function(elm) {
                    if(compareFn_(elm, min) < 0) min = elm;
                });

                return min;
            }
        },
        /**
         * Modifies the members of an array according to a certain function
         * @public
         * @method arr#modify
         * @this    {Array}
         * @param   {Function} modifier  - function that modifies the array members
         * @param   {Object=}       ctx_  - optional context for the modifier function
         * @returns {Array}               - the modified array
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
         * @method arr#Modify
         * @this    {Array}
         * @param   {Function} modifier - function that modifies the array members
         * @param   {Object=}       ctx_ - optional context for the modifier function
         * @returns {Array}              - the modified array
         */
        Modify: function(modifier, ctx_)
        {
            return _.clone(this)._.modify(modifier, ctx_);
        },
        /**
         * Chainable version of push
         * @public
         * @method arr#push
         * @this    {Array}
         * @param  {...any} ___args - one or more elements to add to an array
         * @return  {Array}    this - this for chaining
         */
        push: function(___args) {
            this.push.apply(this, arguments);

            return this;
        },
        /**
         * Singular push function to solve problems with differences between objects & arrays
         * @private
         * @method  arr#_add
         * @param  {any}   val  - value to push
         * @return {Array} this - this for chaining
         */
        _add: {overrideaction: 'ignore', value: function(val) {
            this.push(val);

            return this;
        }},
        /**
         * Returns a random element from the array
         * @public
         * @method arr#random
         * @this   {Array}
         * @return {any} - random element from the array
         */
        random: function() {
            return this[_.int.random(0, this.length - 1)];
        },
        /**
         * Removes one occurrence of of an element from an array
         * @public
         * @method arr#rm
         * @param  {any}   - elm
         * @return {Array} - this for chaining
         */
        rm: function(elm) {
            this.splice(this.indexOf(elm), 1);
            return this;
        },
        /**
         * Shuffles an array
         * @public
         * @method arr#shuffle
         * @return {Array} - this for chaining
         */
        shuffle: function()
        {
            for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        },
        /**
         * Retrieves and sets the size of an array
         * @public
         * @method arr#size
         * @this    {Array}
         * @param   {number} size_ - the new size of the array. In case no size is given the size is returned
         * @returns {number|Array} - the length of the array or the array itself
         */
        size: {overrideaction: 'ignore', value: function(size_) {
            if(size_ === undefined) return this.length;

            this.length = size_;

            return this;
        }},
        /**
         * Returns the sum of all numbers in a number array
         * @public
         * @method arr#sum
         * @this    {Array<number>}
         * @returns {number} - sum of the  number array
         */
        sum: function() {
            if(!this.length) return 0;

            return this.reduce(function(a, b) { return a + b });
        },
        /**
         * Better to string version
         * @public
         * @method arr#toString
         * @this    {Array}
         * @returns {string} - string representation of the array
         */
        toString: {overrideaction: 'ignore', value: function()
        {
            var output = '[';

            for(var i = 0, max = this.length; i < max; i++)
            {
                output += (i? ', ' : '') + this[i]._.toString();
            }

            return output + ']';
        }},
        /**
         * Calculates the union for 2 arrays
         * @public
         * @method arr#unify
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
         * @method arr#Unify
         * @this   {Array}
         * @param  {Array} arr - array to unify
         * @return {Array}     - new array containing the unification
         */
        Unify: function(arr) {
            var app = this._.Append(arr);

            return app._.unique();
        },
        /**
         * Removes duplicate values in an array
         * @public
         * @method arr#unique
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
         * @method arr#Unique
         * @this    {Array}
         * @returns {Array} - new array remove duplicates
         */
        Unique: function() {
            var unique = [];

            this._.each(function(val) {
                if(unique._.not.has(val)) unique.push(val);
            }, this);

            return unique;
        }
    }
});