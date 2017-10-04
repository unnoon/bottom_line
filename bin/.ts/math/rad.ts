const DEGREE_2_RADIAN_FACTOR = Math.PI / 180;
const PI2                    = 2 * Math.PI;

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
export function from(degrees)
{
    return degrees * DEGREE_2_RADIAN_FACTOR
}

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
export function normalize(radians)
{
    radians %= PI2;
    radians += radians < 0 ? PI2 : 0;

    return radians
}
