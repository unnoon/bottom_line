constructWrapper(Math, 'math', {
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
         * Calculates the angle between a the y-axis and a line through a point x, y calculated clockwise (slope)
         * @public
         * @method math.angle
         * @param   {number}  x -
         * @param   {number}  y -
         * @returns {number} - angle in degrees
         */
        angle: function(x, y) {
            return (_.math.rad2Deg(Math.atan2(x, -y))+360)%360;
        },
        /**
         * Calculates the angle between a the x-axis and a line through a point x, y calculated counter-clockwise (slope)
         * @public
         * @method math.angle
         * @param   {number}  x -
         * @param   {number}  y -
         * @returns {number} - angle in degrees
         */
        angleSloped: function(x, y) {
            return (90-_.math.rad2Deg(Math.atan2(x, -y))+360)%360;
        },
        /**
         * Calculates the angle between a the x-axis and a line through a point x, y calculated counter-clockwise (slope)
         * @public
         * @method math.angle
         * @param   {number}  angle - angle in degrees
         * @returns {number} - angle in degrees
         */
        angleInvert: function(angle) {
            return (angle+540)%360;
        },
        /**
         * Convert degrees to radians.
         *
         * @method math.deg2Rad
         * @param {number} degrees
         * @returns {number} radians
         */
        deg2Rad: function() {
            var degreeToRadiansFactor = Math.PI/180;

            return function (degrees) {
                return degrees*degreeToRadiansFactor;
            };
        }(),
        /**
         * Convert radians to degrees
         *
         * @method math.rad2Deg
         * @param {number} radians
         * @returns {number} degrees
         */
        rad2Deg: function() {
            var radianToDegreesFactor = 180/Math.PI;

            return function (radians) {
                return radians*radianToDegreesFactor;
            };
        }(),
        /**
         * Significantly faster version of Math.max if there are more then 2+x elements
         * See http://jsperf.com/math-s-min-max-vs-homemade/5
         * Borrowed from phaser
         *
         * @method math.max$
         * @return {number} The highest value from those given.
         */
        max: function ()
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
         * See http://jsperf.com/math-s-min-max-vs-homemade/5
         * Borrowed from phaser
         *
         * @method math.min$
         * @return {number} The lowest value from those given.
         */
        min: function () {

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