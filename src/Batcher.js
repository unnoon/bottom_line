/**
 * Create a wrapper function that can hold multiple callbacks that are executed in sequence.
 * The result of the last added function is returned
 * The returned function will be decorated with with additional functionality. such as add, addOnce, remove, removeAll
 *
 * @method _.fnc.Batcher
 * @param   {...Function|Array=} ___fnc_arr_ - optional multiple functions or an array of functions.
 * @returns {Function}                       - decorated batcher function
 */
function Batcher(___fnc_arr_) {
    var callbacks = Array.isArray(___fnc_arr_) ? ___fnc_arr_ : [];

    if(typeof(arguments[0]) === 'function')
    {
        for(var i = 0; i < arguments.length; i++) {
            callbacks.push(arguments[i]);
        }
    }

    var batcher = function() {
        var result;

        for(var i = 0, max = callbacks.length; i < max; i++)
        {
            result = callbacks[i].apply(this, arguments);
        }

        return result; // return the result of the last added function
    };

    batcher._callbacks = callbacks;

    batcher.callbacks = function() {
        return this._callbacks;
    };

    batcher.add = function(cb, ctx_) {
        cb = ctx_? cb.bind(ctx_) : cb;

        this._callbacks.push(cb);

        return this
    };

    batcher.addOnce = function(cb, ctx_) {
        cb = ctx_? cb.bind(ctx_) : cb;

        var once = function() {
            batcher.remove(once);
            return cb.apply(this, arguments);
        };

        this.add(once);

        return this
    };

    batcher.remove = function(cb) {
        var index = this._callbacks.indexOf(cb);

        if(~index) {this._callbacks.splice(index, 1)}
        else       {console.warn('trying to remove a function from batcher that is not registered as a callback')}

        return this
    };

    batcher.removeAll = function() {
        this._callbacks = [];

        return this
    };

    return batcher
}

Batcher.create = function() {
    return Batcher.apply(null, arguments);
};