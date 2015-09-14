/**
 * Create a wrapper function that can hold multiple callbacks that are executed in sequence.
 * The result of the last added function is returned
 * The returned function will be decorated with with additional functionality. such as add, addOnce, remove, removeAll
 *
 * @method _.fnc.Batcher
 *
 * @param  {...Function=} ___fnc_ - optional multiple functions.
 *
 * @return {Function} - decorated batcher function
 */
function Batcher(___fnc_) {

    // store callbacks & context on the batcher function for easy debugging
    batcher._callbacks = [];
    batcher._ctx       = null;

    function batcher() {
        var result;

        for(var i = 0, max = batcher._callbacks.length; i < max; i++)
        {
            result = batcher._callbacks[i].apply(batcher._ctx || this, arguments);
        }

        return result; // return the result of the last added function
    }

    // initialize the batcher function
    if(___fnc_) add.apply(batcher, arguments);

    /**
     * Getter/Setter function for the internal callbacks array
     *
     * @this batcher
     *
     * @param  {Array=} functionArray - an array of functions.
     *
     * @return {Array|Function} - callbacks array or batcher function
     */
    batcher.callbacks = function(functionArray)
    {
        if(functionArray === undefined) {return this._callbacks}

        this._callbacks = functionArray;

        return this
    };
    /**
     * Getter/Setter function for batcher context
     *
     * @this batcher
     *
     * @param {Object=} ctx_ - context for the batcher function
     *
     * @return {Object|Function} - context or batcher function
     */
    batcher.ctx = function(ctx_)
    {
        if(ctx_ === undefined) {return this._ctx}

        this._ctx = ctx_;

        return this
    };
    /**
     * Adds a callback to the callback array
     *
     * @this batcher
     *
     * @param {...Function} ___cb - one or multiple callbacks to add
     *
     * @return {Function} - the batcher function
     */
    batcher.add = add; function add(___cb)
    {
        for(var i = 0, max = arguments.length; i < max; i++)
        {
            this._callbacks.push(arguments[i]);
        }

        return this
    }
    /**
     * Adds a callback, that is only executed once, to the callback array
     *
     * @param {...Function} ___cb - the callback function one likes to add
     *
     * @returns {Function} - the batcher function
     */
    batcher.addOnce = function(___cb)
    {
        for(var i = 0, max = arguments.length; i < max; i++)
        {
            !function(cb) {
                function once() {
                    batcher.remove(once);
                    return cb.apply(this, arguments);
                }

                batcher.add(once);
            }(arguments[i])
        }

        return this
    };
    /**
     * Removes a callbacks from the callback array
     *
     * @this batcher
     *
     * @param {...Function} ___cb - callback functions to remove
     *
     * @return {Function} - the batcher function
     */
    batcher.remove = function(___cb)
    {
        for(var i = 0, max = arguments.length, index; i < max; i++)
        {
            index = this._callbacks.indexOf(arguments[i]);

            if (~index) {this._callbacks.splice(index, 1)}
            else        {console.warn('trying to remove a function from batcher that is not registered as a callback')}
        }

        return this
    };
    /**
     * Removes all callbacks
     *
     * @this batcher
     *
     * @return {Function} - the batcher function
     */
    batcher.removeAll = function()
    {
        this._callbacks = [];

        return this
    };

    return batcher
}
/**
 * Wrapper to create a new batcher function avoiding the new keyword
 *
 * @returns {Function}
 */
Batcher.create = function()
{
    return Batcher.apply(null, arguments);
};