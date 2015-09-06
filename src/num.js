construct('num', {native:Number}, {
    /**
     * @namespace num
     */
    static: {
        /**
         * Checks if an object is a number
         * @public
         * @method   num.isNumber
         * @param   {any} num - object to check the number for
         * @returns {boolean} - indicating if it is a number
         */
        isNumber: function(num) {
            return typeof(num) === 'number' && !isNaN(num); // use the broken isNaN here because iOS doesn't support Number.isNaN
        },
        /**
         * Returns a random numer between the min and max value, or between 0 & 1) if no arguments are given.
         * In case a singular argument is given iy will return the bound between 0 and this value
         * @public
         * @method   num.random
         * @param   {number=} min_max_ - optional lower or upper bound
         * @param   {number=} max_min_ - optional lower or upper bound
         * @returns {number} - random number in between
         */
        random: function(min_max_, max_min_) {
            if(min_max_ === undefined) return Math.random(); // normal random functionality (no arguments)

            var diff   = (max_min_ || 0) - min_max_;
            var offset = diff? min_max_: 0; // cover the case in which both arguments have the same value

            return Math.random()*diff + offset;
        },
        // TODO left inclusive right inclusive or both
        /**
         * Rebounds a number between 2 values. Handy for number ranges that are continuous
         * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
         * @public
         * @method   num.rebound
         * @param   {number}   num - number value
         * @returns {function}     - function to add the range
         */
        rebound: function(num)
        {
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
    prototype: {
        /**
         * Gets or sets the sign of a number
         * @public
         * @method   num#sign
         * @returns {number} - sign of the number: -1, 0, 1
         */
        sign: function(sign)
        {
            if(sign === undefined) return this > 0?  1 :
                                          this < 0? -1 :
                                                     0 ;

            return sign*Math.abs(this);
        },
        /**
         * Getter: indicator if the the number is even
         * @public
         * @method   num#even
         * @returns {boolean} - indicating if the number is even
         */
        get even()
        {
            return !(this & 1);
        },
        /**
         * Getter: indicator if the the number is odd
         * @public
         * @method   num#odd
         * @returns {boolean} - indicating if the number is odd
         */
        get odd()
        {
            return !!(this & 1);
        },
        /**
         * Getter: parity for a number 0: even and 1: for odd
         * @public
         * @method   num#parity
         * @returns {number} - parity of the number
         */
        get parity()
        {
            return this & 1;
        },
        /**
         * Power of a number
         * @public
         * @method   num#pow
         * @param   {number}  exponent - the exponent
         * @returns {number}           - the powered number
         */
        pow: function(exponent)
        {
            return Math.pow(this, exponent)
        },
        /**
         * Checks if a number is between to values
         * @public
         * @method   num#between
         * @param   {number}  min - minimum value
         * @param   {number}  max - maximum value
         * @returns {boolean}     - boolean indicating if the value lies between the two values
         */
        between: function(min, max)
        {
            return min <= this && this <= max; // this is correct when saying between the endpoints should be included when saying from to the end point "to" is excluded well for mathematicians that is
        },
        /**
         * Bounds a number between 2 values
         * @public
         * @method   num#bound
         * @param   {number}  min - minimum value
         * @param   {number}  max - maximum value
         * @returns {boolean}     - bounded version of the number that falls between the 2 values
         */
        bound: {aliases:['clamp'], value:function(min, max)
        {
            return Math.min(Math.max(this, min), max);
        }},
        /**
         * Rebounds a number between 2 values. Handy for number ranges that are continuous
         * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
         * @public
         * @method   num#rebound
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
         * @method   num#toString
         * @returns {string} - string representation of the number
         */
        toString: {overrideaction: null, value: function()
        {
            return this.toString()
        }}
    }
});