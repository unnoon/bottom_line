export declare const DEGREE_2_RADIAN_FACTOR: number;
export declare const PI2: number;
/**
 * Convert degrees to radians.
 *
 * @param degrees - The angle in degrees to convert.
 *
 * @returns The converted angle in radians.
 */
export declare function from(degrees: number): number;
/**
 * Normalizes an angle to the smallest positive angle.
 *
 * @param radians - The angle in radians.
 *
 * @returns Normalized angle.
 */
export declare function normalize(radians: number): number;
