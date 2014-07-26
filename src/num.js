
/**
 * Number
 */
constructWrapper(Number, 'num', {
    /**
     * @namespace num
     * @memberOf module:_
     */
    static: {
        /**
         * Checks if an object is a number
         * @public
         * @method module:_.num.isNumber
         * @param   {any} num - object to check the number for
         * @returns {boolean} - indicating if it is a number
         */
        isNumber: function(num) {
            return typeof(num) === 'number' && !isNaN(num); // use the broken isNaN here because iOS doesn't support Number.isNaN
        },
        /**
         * Returns a random integer between the min and max value, or between 0 & 1) if no arguments are given
         * @public
         * @method module:_.num.random
         * @param   {number=} opt_min - integer lower bound
         * @param   {number=} opt_max - integer upper bound
         * @returns {number} - random number in between
         */
        random: function(opt_min, opt_max) {
            var min = opt_min || 0;
            var max = opt_max || 1;

            return (opt_max !== undefined)? Math.random() * (max - min) + min : Math.random();
        },
        // TODO left inclusive right inclusive or both
        /**
         * Rebounds a number between 2 values. Handy for number ranges that are continuous
         * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
         * @public
         * @method module:_.num.rebound
         * @param   {number}   num - number value
         * @returns {function}     - function to add the range
         */
        rebound: function(num) { // TODO (negative) testcases
            /**
             * Rebounds a number between 2 values. For continuous number ranges
             * @public
             * @param   {number}  min - minimum value
             * @param   {number}  max - maximum value
             * @returns {boolean} - rebounded version of the number that falls between the 2 values
             */
            return function range(min, max)
            {
                return min + num % (max - min);
            }
        }
    },
    /**
     * @class Number
     */
    prototype: {
        /**
         * Getter: returns the sign of a number
         * @public
         * @method Number#sign
         * @returns {number} - sign of the number: -1, 0, 1
         */
        get sign() {
            return this > 0?  1 :
                   this < 0? -1 :
                              0 ;
        },
        /**
         * Getter: indicator if the the number is even
         * @public
         * @method Number#even
         * @returns {boolean} - indicating if the number is even
         */
        get even() {
            return !(this & 1);
        },
        /**
         * Getter: indicator if the the number is odd
         * @public
         * @method Number#odd
         * @returns {boolean} - indicating if the number is odd
         */
        get odd() {
            return !!(this & 1);
        },
        /**
         * Getter: parity for a number 0: even and 1: for odd
         * @public
         * @method Number#parity
         * @returns {number} - parity of the number
         */
        get parity() {
            return this & 1;
        },
        /**
         * Power of a number
         * @public
         * @method Number#pow
         * @param   {number}  exponent - the exponent
         * @returns {number}           - the powered number
         */
        pow: function(exponent) {
            return Math.pow(this, exponent)
        },
        /**
         * Checks if a number is between to values
         * @public
         * @method Number#between
         * @param   {number}  min - minimum value
         * @param   {number}  max - maximum value
         * @returns {boolean}     - boolean indicating if the value lies between the two values
         */
        between: function(min, max) {
            return min <= this && this <= max; // this is correct when saying between the endpoints should be included when saying from to the end point "to" is excluded well for mathematicians that is
        },
        /**
         * Bounds a number between 2 values
         * @public
         * @method Number#bound
         * @param   {number}  min - minimum value
         * @param   {number}  max - maximum value
         * @returns {boolean}     - bounded version of the number that falls between the 2 values
         */
        bound: function(min, max) {
            return Math.min(Math.max(this, min), max);
        },
        /**
         * Rebounds a number between 2 values. Handy for number ranges that are continuous
         * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
         * @public
         * @method Number#rebound
         * @param   {number}   num - number value
         * @returns {function}     - function to add the range
         */
        rebound: function(min, max)
        {
            return min + this % (max - min);
        },
        /**
         * Better to string version
         * @public
         * @method Number#toString
         * @this    {Number}
         * @returns {string} - string representation of the number
         */
        toString: function()
        {
            return this+'';
        }
    }
});