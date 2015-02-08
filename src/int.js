constructWrapper(null, 'int', {
    /**
     * @namespace int
     */
    static: {
        /**
         * Returns the length of an integer
         * @public
         * @method int.length
         * @param   {number} int - integer to measure the length
         * @returns {number} - length of the integer
         */
        length: function(int) {
            return int? 1+ Math.log10(int)|0 : 1;
        },
        /**
         * Returns the length of an integer
         * @public
         * @method int.length
         * @param   {number}        int           - integer to measure the length
         * @param   {string|number} format_length - format for the lead zero's for example '0000'
         * @returns {string}                      - string with leading zero's
         */
        leadZeros: function(int, format_length)
        {
            var length = (typeof(format_length) === 'string') ? format_length.length : format_length;

            int = (_.int.length(int) > length) ? Math.pow(10, length)-1 : int;

            return (int/Math.pow(10, length)).toFixed(length).substr(2);
        },
        /**
         * Returns a random integer between the min and max value
         * @public
         * @method int.random
         * @param   {number} min - integer lower bound
         * @param   {number} max - integer upper bound
         * @returns {number} - random integer in between
         */
        // TODO do all random options as for _.num.random see below
        random: function(min, max) {
            return min + (Math.random() * (max + 1 - min))|0;
        },
        /**
         * Rebounds a number between 2 values. Handy for arrays that are continuous
         * Curried version: for example - _.int.rebound(4)(-5, 7)
         * @public
         * @method int.rebound
         * @param   {number}  int - integer value
         * @returns {function} - function to add the range
         */
        rebound: function(int) {
            /**
             * Range function return by rebound
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