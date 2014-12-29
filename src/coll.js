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
            if(first && match && !finish) return finish = array? !$value._.without(val).length : true, !(normal && finish);
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
            if(first && match && !finish) return finish = array? !$index._.without(index).length : true, !(normal && finish);
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