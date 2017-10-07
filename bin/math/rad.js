export const DEGREE_2_RADIAN_FACTOR = Math.PI / 180;
export const PI2 = 2 * Math.PI;
/**
 * Convert degrees to radians.
 *
 * @param degrees - The angle in degrees to convert.
 *
 * @returns The converted angle in radians.
 */
export function from(degrees) {
    return degrees * DEGREE_2_RADIAN_FACTOR;
}
/**
 * Normalizes an angle to the smallest positive angle.
 *
 * @param radians - The angle in radians.
 *
 * @returns Normalized angle.
 */
export function normalize(radians) {
    radians %= PI2;
    radians += radians < 0 ? PI2 : 0;
    return radians;
}
//# sourceMappingURL=rad.js.map