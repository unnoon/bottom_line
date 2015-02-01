constructWrapper(Function, 'fnc', {
    /**
     * @namespace fnc
     */
    static: {
        /**
         * Static version of bind. Implements partial in case an argument is undefined
         * @public
         * @static
         * @method fnc.bind
         * @param   {...any=}  ___args_ - arguments to prefill
         * @param   {function}    fnc   - function to bind
         * @param   {object=}     ctx_  - optional context
         * @returns {function}          - bootstrapped version of the function
         */
        bind: function(___args_, fnc, ctx_)
        {
            if(arguments.length <= 2
            && typeof(arguments[0]) === 'function'
            && typeof(arguments[1]) !== 'function')
            {
                return fnc.bind(ctx_)
            }

            // if ___args_ are given return a partial
            var args     = arguments;
            var argsMax  = args.length-(typeof(args[args.length-1]) === 'function' ? 1 : 2);
            var partials = 0;

            args._.each(function(arg) {if(arg === undefined) partials++});

            return function() {
                var max  = argsMax + arguments.length - partials;
                var tmp;

                for(var i = max-1, arg = arguments.length-1; i >= 0; i--)
                {
                    if(args[i] !== undefined && i < argsMax) {
                        arguments[i] = args[i]
                    }
                    else
                    {
                        tmp = arguments[arg--]; // we need an intermediate variable here otherwise the arg is undefined on setting
                        arguments[i] = tmp;
                    }
                }

                arguments.length = max; // set the new length of arguments
                return fnc.apply(ctx_, arguments);
            }
        },
        /**
         * Defers some methods so they'll get set to the end of the stack
         * @public
         * @method fnc.defer
         * @param {number} cb   - callback function to call after the delay
         * @param {number} ctx_ - optional context
         */
        defer: function (cb, ctx_) {
            setTimeout(function() {
                cb.call(ctx_)
            }, 0);
        },
        /**
         * Delays a function by a given number of milliseconds
         * @public
         * @static
         * @method fnc.delay
         * @param {number} ms   - delay in milliseconds
         * @param {number} cb   - callback function to call after the delay
         * @param {number} ctx_ - optional context for the callback
         */
        delay: {aliases: ['callAfter'], value: function (ms, cb, ctx_) {
            setTimeout(function() {
                cb.call(ctx_)
            }, ms);
        }},
        /**
         * Super simple inheritance function
         * @public
         * @method fnc.inherit
         * @param {function} child  - child
         * @param {function} parent - parent to inherit from
         * @param {string}   super_ - name for the object name storing the super prototype. default '_super'
         */
        inherit: function(child, parent, super_) {
            child.prototype = Object.create(parent.prototype);
            child.prototype.constructor = child;
            child[super_ || '_super'] = parent.prototype;
        },
        /**
         * returns a negated form of a function
         * @public
         * @method fnc.not
         * @param  {function} fnc - an array of functions or a single function in case of supplying
         * @return {function} negated form of the function
         */
        not: function(fnc) {
            return function() { return !fnc.apply(this, arguments)}
        }
    },
    prototype:
    {
        /**
         * toString wrapper for bottom_line
         * @public
         * @method fnc#toString
         * @returns {string} - string representation of the function
         */
        toString: function()
        {
            return this.toString();
        }
    }
});