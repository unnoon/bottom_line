export const RADIAN_2_DEGREE_FACTOR = 180 / Math.PI;
/**
 * Convert radians to degrees.
 *
 * @param radians - The angle in radians.
 *
 * @returns The converted angle in degrees.
 */
export function from(radians) {
    return radians * RADIAN_2_DEGREE_FACTOR;
}
/**
 * Normalizes an angle to the smallest positive angle.
 *
 * @param degrees - The angle in degrees.
 *
 * @returns Normalized angle.
 */
export function normalize(degrees) {
    degrees %= 360;
    degrees += degrees < 0 ? 360 : 0;
    return degrees;
}
//# sourceMappingURL=deg.js.map