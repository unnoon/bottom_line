var deg = _.extend({}, {
    /**
     * Convert radians to degrees
     *
     * @static
     * @method math.deg.convert
     *
     * @param   {number} radians
     *
     * @returns {number} degrees
     */
    convert: {aliases: 'from', value: (function() {
        var radianToDegreesFactor = 180/Math.PI;

        return function (radians) {
            return radians*radianToDegreesFactor;
        };
    })()},
    /**
     * Calculates the angle between a horizontal axis and a line through a point x, y calculated counter clockwise (slope)
     *
     * @public
     * @static
     * @method math.deg.slope
     *
     * @param   {number}  x - x value
     * @param   {number}  y - y value. note that this function assumes a normal math axis so you might need to negate y
     *
     * @returns {number} - slope in degrees
     */
    slope: function(x, y) {
        return _.math.deg.from(Math.atan2(y, x))
    },
    /**
     * Inverts an angle
     *
     * @public
     * @static
     * @method math.deg.invert
     *
     * @param   {number} degrees - angle in degrees to be inverted
     *
     * @returns {number} - inverted angle
     */
    invert: function(degrees) {
        degrees += degrees < 180 ? 180 : -180;

        return degrees
    },
    /**
     * normalizes an angle between 0 & 360 degrees. This function will prefer smaller angles
     *
     * @public
     * @static
     * @method math.deg.normalize
     *
     * @param   {number} degrees - angle in degrees to be normalized
     *
     * @returns {number} - normalized angle
     */
    normalize: function(degrees)
    {
        degrees %= 360;
        degrees += degrees < 0 ? 360 : 0;

        return degrees
    }
});

var rad =  _.extend({}, {
    /**
     * Convert degrees to radians.
     *
     * @static
     * @method math.rad.convert
     *
     * @param {number} degrees
     *
     * @returns {number} radians
     */
    convert: {aliases: 'from', value: (function() {
        var degreeToRadiansFactor = Math.PI/180;

        return function(degrees) {
            return degrees*degreeToRadiansFactor
        }
    })()},
    /**
     * Calculates the angle between a horizontal axis and a line through a point x, y calculated counter clockwise (slope)
     *
     * @public
     * @method math.rad.slope
     *
     * @param   {number} x - x value
     * @param   {number} y - y value. note that this function assumes a normal math axis so you might need to negate y
     *
     * @returns {number} - angle in radians
     */
    slope: function(x, y) {
        return Math.atan2(y, x)
    },
    /**
     * Inverts an angle
     *
     * @public
     * @method math.rad.invert
     *
     * @param   {number} radians - angle in radians
     *
     * @returns {number} - inverted angle
     */
    invert: (function() {
        var PI = Math.PI;

        return function(radians) {
            radians += radians < PI ? PI : -PI;

            return radians
        }
    })(),
    /**
     * normalizes an angle between 0 & 2*PI radians
     *
     * @public
     * @static
     * @method math.rad.normalize
     *
     * @param   {number} degrees - angle in radians
     *
     * @returns {number} - normalized angle
     */
    normalize: (function() {
        var PI2 = 2*Math.PI;

        return function(radians)
        {
            radians %= PI2;
            radians += radians < 0 ? PI2 : 0;

            return radians
        }
    })()
});

construct('math', {native:Math, cloneAsBase:true}, {
    /**
     * @namespace math
     */
    static: {
        /**
         * Return true based on a certain probability based on a number between 0 & 1;
         *
         * @public
         * @method math.byProb
         *
         * @param   {number} p - probability to return true
         *
         * @returns {boolean} - true or false based on the probability
         */
        byProb: function(p) {
            return Math.random() < p;
        },
        /**
         * angle functions based on degrees
         */
        deg: deg,
        /**
         * Return the distance between 2 points in Euclidean space
         *
         * @public
         * @method math.distance
         *
         * @param   {number}  x1 - x position for point1
         * @param   {number}  y1 - y position for point1
         * @param   {number}  x2 - x position for point2
         * @param   {number}  y2 - y position for point2
         *
         * @returns {number} - distance between the 2 points
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        },
        /**
         * Returns the squared distance between 2 points in Euclidean space.
         * Should be a little bit faster in case you don't need the exact distance.
         *
         * @public
         * @method math.distanceSquared
         *
         * @param   {number}  x1 - x position for point1
         * @param   {number}  y1 - y position for point1
         * @param   {number}  x2 - x position for point2
         * @param   {number}  y2 - y position for point2
         *
         * @returns {number} - squared distance between the 2 points
         */
        distanceSquared: function(x1, y1, x2, y2) {
            return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        },
        /**
         * Significantly faster version of Math.max if there are more then 2+x elements
         *
         * @method math.max
         *
         * @param {...number} ___numbers - 2 or more numbers to find the max
         *
         * @return {number} The highest value from those given.
         */
        max: function (___numbers)
        {
            for (var i = 1, max = 0, len = arguments.length; i < len; i++)
            {
                if (arguments[max] < arguments[i])
                {
                    max = i;
                }
            }

            return arguments[max];
        },

        /**
         * Significantly faster version of Math.min if there are more then 2+x elements
         *
         * @method math.min
         *
         * @param {...number} ___numbers - 2 or more numbers to find the min
         *
         * @return {number} The lowest value from those given.
         */
        min: function (___numbers) {

            for (var i = 1 , min = 0, len = arguments.length; i < len; i++)
            {
                if (arguments[i] < arguments[min])
                {
                    min = i;
                }
            }

            return arguments[min];
        },
        rad: rad
    }
});