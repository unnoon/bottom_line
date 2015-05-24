construct('fnc', {native:Function}, {
    /**
     * @namespace fnc
     */
    static: {
        /**
         * Static version of bind. Implements partial in case an argument is undefined
         * @public
         * @static
         * @method fnc.bind
         * @param   {Array=}     _args_ - arguments to prefill
         * @param   {function}    fnc   - function to bind
         * @param   {Object=}     ctx_  - optional context
         * @returns {function}          - bootstrapped version of the function
         */
        bind: function(_args_, fnc, ctx_)
        {
            if(_.isFunction(_args_))       {return _args_.bind(fnc)}
            if(_args_._.not.has(undefined)) {return _args_.unshift(ctx_), fnc.bind.apply(fnc, _args_)}

            var blanks  = _args_._.count(undefined);
            var prefils = _args_.length;

            return function() {
                var args = arguments.length;
                var max  = prefils + args - blanks;

                for(var i = max-1, arg = args-1; i >= 0; i--)
                {
                    arguments[i] = (_args_[i] !== undefined && i < prefils)? _args_[i] : arguments[arg--];
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
         * @param {string=}   super_ - name for the object name storing the super prototype. default '_super'
         */
        inherit: function(child, parent, super_) {
            child.prototype = Object.create(parent.prototype);
            child.prototype.constructor = child;
            child[super_ || '_super'] = parent.prototype;
        },
        /**
         * Mixin properties on a class. It is assumed this function is called inside the constructor
         * @public
         * @method module:_.fnc.mixin
         * @param {Function}        child - child
         * @param {Function|Array} mixins - array or sinlge mixin classes
         */
        // TODO this needs to be moved to Cell.Type
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
         * returns a negated form of a function
         * @public
         * @method fnc.negate
         * @param  {function} fnc - an array of functions or a single function in case of supplying
         * @return {function} negated form of the function
         */
        negate: function(fnc) {
            return function() { return !fnc.apply(this, arguments)}
        },
        /**
         * repeats a function x times. The repeater value is passed to the function
         * @static
         * @public
         * @method _.repeat
         * @param {number}   times - the number of times the function is to be repeated
         * @param {Function} cb    - callback function to be repeated
         * @param {Object}   ctx_  - optional context for the callback
         */
        repeat: function(times, cb, ctx_)
        {
            for(var i = 0; i < times; i++)
            {
                cb.call(ctx_, i);
            }
        },
        /**
         * See wrapper.js for documentation details
         */
        wrap: wrap
    },
    prototype:
    {
        /**
         * toString wrapper for bottom_line
         * @public
         * @method fnc#toString
         * @returns {string} - string representation of the function
         */
        toString: {overrideaction: 'ignore', value: function()
        {
            return this.toString();
        }}
    }
});