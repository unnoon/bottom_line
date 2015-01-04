
// FIXME textcases and complete adaptation to static methods
constructWrapper(Function, 'fnc', {
    /**
     * @namespace fnc
     * @memberOf module:_
     */
    static: {
        /**
         * Delays a function by a given number of milliseconds
         * Use bind to prefill args and set context: fnc.bind(this, 'arg1', 'arg2').callAfter(10);
         * @public
         * @method module:_.fnc.callAfter
         * @param {number} delay   - optional arguments
         * @param {number} cb      - callback function to call after the delay
         * @param {number} opt_ctx - optional arguments
         */
        callAfter: function (delay, cb, opt_ctx) {
            setTimeout(function() {
                cb.call(opt_ctx)
            }, delay);
        },
        /**
         * Defers some methods so they'll get set to the end of the stack
         * @public
         * @method module:_.fnc.defer
         * @param {number} cb      - callback function to call after the delay
         * @param {number} opt_ctx - optional context
         */
        defer: function (cb, opt_ctx) {
            setTimeout(function() {
                cb.call(opt_ctx)
            }, 0);
        },
        /**
         * Memoization function
         * @public
         * @method module:_.fnc.memoize
         * @param {number}   delay   - optional arguments
         */
        memoize: function(ctx)
        {
            // TODO
        },
        /**
         * Creates a partial version of the function that can be partially prefilled/bootstrapped with arguments use undefined to leave blank
         * @public
         * @method module:_.fnc.partial
         * @param   {...any}   var_args - arguments to prefill/bootstrap. Use undefined to identify custom input
         * @returns {function}          - partial version of the function
         */
        partial: function (var_args, fnc) {
            var args = arguments;

            return function() {
                for(var i = 0, arg = 0; i < args.length && arg < arguments.length; i++)
                {
                    if(args[i] === undefined)
                    {
                        args[i] = arguments[arg++];
                    }
                }
                return fnc.apply(this, args);
            }
        },
        /**
         * Similar to bind but only prefills the arguments not the context
         * @public
         * @method module:_.fnc.strap
         * @param   {...any}   var_args - arguments to prefill
         * @param   {Function} fnc      - function to strap
         * @returns {Function}          - bootstrapped version of the function
         */
        // TODO add partial support
        strap: function(var_args, fnc) {
            var args = _.to.array(arguments); // convert to array

            fnc = args.pop();

            return fnc.bind.apply(fnc, [null]._.append(args));
        },
        /**
         * Similar to bind but only prefills the arguments not the context
         * @public
         * @method module:_.fnc.bind
         * @param   {...any}   var_args - arguments to prefill
         * @param   {Function} fnc      - function to strap
         * @returns {Function}          - bootstrapped version of the function
         */
        // TODO add partial support
        bind: function(ctx, var_args, fnc) {
            var args = _.arr(arguments); // convert to array

            fnc = args.pop();

            return fnc.bind.apply(fnc, args)
        },
        /**
         * Super simple inheritance function
         * @public
         * @method module:_.fnc.inherit
         * @param   {Function} child  - child
         * @param   {Function} parent - parent to inherit from
         */
        inherit: function(child, parent) {
            child.prototype = Object.create(parent.prototype);
            child.prototype.constructor = child;
            child._super = parent.prototype;
        },
        /**
         * Mixin properties on a class. It is assumed this function is called inside the constructor
         * @public
         * @method module:_.fnc.mixin
         * @param {Function}        child - child
         * @param {Function|Array} mixins - array or sinlge mixin classes
         */
        mixin: function(child, mixins) {

            child._mixin = function(mixin) {
                return mixin.prototype;
            };

            mixins._.each(function(mixin) {
                // copy static fucntions
                _.extend(child, mixin);
                // copy prototype functions
                _.extend(child.prototype, mixin.prototype);
            });
        },
        /**
         * Nests functions together.
         * @public
         * @method module:_.fnc.nest
         * @param {Array|Function} $arr_fnc - an array of functions or a single function in case of supplying
         * @param {...Function}    var_args - one or multiple functions
         */
        nest: function($arr_fnc, var_args) {
            var fns = (var_args === undefined)? $arr_fnc : arguments;

            return function() {
                for(var i = 0, max = fns.length; i < max; i++)
                {
                    fns[i].apply(this, arguments);
                }
            }
        }
    },
    prototype:
    {
        /**
         * Better to string version
         * @public
         * @method Function#toString
         * @this    {Function}
         * @returns {string} - string representation of the object
         */
        toString: function()
        {
            return this.toString();
        },
        /**
         * Returns the name of a function if it is an unnamed function it returns an empty string ''
         * NOTE avoid using this function as on older browsers name property is not defined and is shimmed
         * @public
         * @method Function#name
         * @this    {Function}
         * @returns {string} - the name of the function
         */
        // FIXME a better solution is to shim the name property in case it is not defined. In that case we we can use a simpler function
        get name()
        {
            if(_.isDefined(Function.prototype.name)) return this.name;
            else return this.toString().match(/^function\s?([^\s(]*)/)[1];
        }
    }
});