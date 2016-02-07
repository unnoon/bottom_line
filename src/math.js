construct('math', {native:Math, cloneAsBase:true}, {
    /**
     * @namespace math
     */
    static: {
        /**
         * Return true based on a certain probability based on a number between 0 & 1;
         * @public
         * @method math.byProb
         * @param   {number}  p - probability to return true
         * @returns {boolean}   - true or false based on the probability
         */
        byProb: function(p) {
            return Math.random() < p;
        },
        /**
         * angle functions based on degrees
         */
        deg: {
            /**
             * Convert radians to degrees
             *
             * @method math.deg.convert
             * @param {number} radians
             * @returns {number} degrees
             */
            convert: function() {
                var radianToDegreesFactor = 180/Math.PI;

                return function (radians) {
                    return radians*radianToDegreesFactor;
                };
            }(),
            /**
             * Calculates the angle between a the y-axis and a line through a point x, y calculated clockwise (slope)
             * @public
             * @method math.deg.angle
             * @param   {number}  x -
             * @param   {number}  y -
             * @returns {number} - angle in degrees
             */
            angle: function(x, y) {
                return _.math.deg.convert(Math.atan2(x, -y))
            },
            /**
             * Calculates the angle between a the x-axis and a line through a point x, y calculated counter-clockwise (slope)
             * @public
             * @method math.deg.angleSloped
             * @param   {number}  x -
             * @param   {number}  y -
             * @returns {number} - angle in degrees
             */
            angleSloped: function(x, y) {
                return 90-_.math.deg.angle(x, y);
            },
            /**
             * Inverts an angle
             * @public
             * @method math.deg.invert
             * @param   {number} degrees - angle in degrees
             * @returns {number} - inverted angle
             */
            invert: function(degrees) {
                return degrees+180;
            },
            /**
             * normalizes an angle between 0 & 360 degrees
             * @public
             * @static
             * @method math.deg.normalize
             * @param   {number} degrees - angle in degrees
             * @returns {number}         - normalized angle
             */
            normalize: function(degrees)
            {
                return (degrees+360)%360
            }
        },
        rad: {
            /**
             * Convert degrees to radians.
             *
             * @method math.rad.convert
             * @param {number} degrees
             * @returns {number} radians
             */
            convert: function() {
                var degreeToRadiansFactor = Math.PI/180;

                return function (degrees) {
                    return degrees*degreeToRadiansFactor;
                };
            }()
        },
        /**
         * Return the distance between 2 points in Euclidean space
         * @public
         * @method math.distance
         * @param   {number}  x1 - x position for point1
         * @param   {number}  y1 - y position for point1
         * @param   {number}  x2 - x position for point2
         * @param   {number}  y2 - y position for point2
         * @returns {number} - distance between the 2 points
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        },
        /**
         * Return the squared distance between 2 points in Euclidean space
         * @public
         * @method math.distanceSquared
         * @param   {number}  x1 - x position for point1
         * @param   {number}  y1 - y position for point1
         * @param   {number}  x2 - x position for point2
         * @param   {number}  y2 - y position for point2
         * @returns {number} - squared distance between the 2 points
         */
        distanceSquared: function(x1, y1, x2, y2) {
            return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
        },
        /**
         * Significantly faster version of Math.max if there are more then 2+x elements
         *
         * @method math.max$
         * @return {number} The highest value from those given.
         */
        maxm: function ()
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
         * @method math.min$
         * @return {number} The lowest value from those given.
         */
        minm: function () {

            for (var i = 1 , min = 0, len = arguments.length; i < len; i++)
            {
                if (arguments[i] < arguments[min])
                {
                    min = i;
                }
            }

            return arguments[min];
        }
    }
});