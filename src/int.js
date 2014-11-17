/**
 * Integer
 * // TODO check if we can do something with signed arrays
 */
constructWrapper(null, 'int', {
    /*
     * Converter function
     */
    init: function(num) {
        return num|0;
    },
    /**
     * @namespace int
     * @memberOf module:_
     */
    static: {
        /**
         * Returns the length of an integer
         * @public
         * @method module:_.int.length
         * @param   {number} int - integer to measure the length
         * @returns {number} - length of the integer
         */
        len: function(int) {
            return int? 1+ _.log10(int)|0 : 1;
//				return (int+'').length;
        },
        /**
         * Returns the length of an integer
         * @public
         * @method module:_.int.length
         * @param   {number} int    - integer to measure the length
         * @param   {number} length - total length of the string including leading zero's
         * @returns {string} - string with leading zero's
         */
        leadZeros: function(int, length) {
            return (int/Math.pow(10, length)).toFixed(length).substr(2);
        },
        /**
         * Returns a random integer between the min and max value
         * @public
         * @method module:_.int.random
         * @param   {number} min - integer lower bound
         * @param   {number} max - integer upper bound
         * @returns {number} - random integer in between
         */
        // TODO do all random options as for _.num.random see below
        random: function(min, max) {
            return min + (Math.random() * (max + 1 - min))|0;
        },
        //random: function(min_max_, max_min_) {
        //    if(min_max_ === undefined) return Math.random(); // normal random functionality
        //
        //    var diff   = (max_min_ || 0) - min_max_;
        //    var offset = diff? min_max_: 0;
        //
        //    return min + (Math.random() * (max + 1 - min))|0;
        //},
        /**
         * Rebounds a number between 2 values. Handy for arrays that are continuous
         * Curried version: for example - __int.rebound(4)(-5, 7)
         * @public
         * @method module:_.int.rebound
         * @param   {number}  int - integer value
         * @returns {function} - function to add the range
         */
        rebound: function(int) {
            /**
             * Rebounds a number between 2 values. Handy for arrays that are continuous
             * @private
             * @param   {number}  min - minimum value
             * @param   {number}  max - maximum value
             * @returns {boolean} - rebounded version of the number that falls between the 2 values
             */
            return function range(min, max) {
                var overflow = int % (Math.abs(max - min) + 1);

                return ((overflow < 0)? max+1 : min) + overflow;
            }
        }
    }
});