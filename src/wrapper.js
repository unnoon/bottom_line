/**
 * Create a wrapper function that can hold multiple callbacks that are executed in sequence The result of the last added function is returned
 * The returned function will be decorated with with additional functionality. such as add, addOnce, remove, removeAll
 *
 * @method _.wrap
 * @param   {...Function|Array=} ___fnc_arr_ - optional 1 or more functions or array of functions to initialize the callbacks array with
 * @returns {Function}                       - decorated wrapper function
 */
function wrap(___fnc_arr_) {
    var callbacks = Array.isArray(___fnc_arr_) ? ___fnc_arr_ : [];

    if(typeof(___fnc_arr_) === 'function')
    {
        for(var i = 0; i < arguments.length; i++) {
            callbacks.push(arguments[i]);
        }
    }

    var wrapper = function() {
        var result;

        for(var i = 0, max = callbacks.length; i < max; i++)
        {
            result = callbacks[i].apply(this, arguments);
        }

        return result; // return the result of the last added function
    };

    wrapper._callbacks = callbacks;

    wrapper.add = function(cb, ctx_) {
        cb = ctx_? cb.bind(ctx_) : ctx_;

        callbacks.push(cb);

        return this
    };

    wrapper.addOnce = function(cb, ctx_) {
        cb = ctx_? cb.bind(ctx_) : ctx_;

        var once = function() {
            wrapper.remove(once);
            return cb.apply(this, arguments);
        };

        callbacks.push(once);

        return this
    };

    wrapper.remove = function(cb) {
        var index = callbacks.indexOf(cb);

        if(~index) {callbacks.splice(index, 1)}
        else       {console.warn('trying to remove function from wrapper that is not registered as a callback')}

        return this
    };

    wrapper.removeAll = function() {
        callbacks = [];

        return this
    };

    wrapper.length = function() {
        return callbacks.length;
    };

    return wrapper
}