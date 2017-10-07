/**
 * Returns a string representation of an integer including leading zero's depending on a format.
 * Uses rebound in case of overflowing.
 *
 * @param int    - Integer to measure the length.
 * @param format - Format for the lead zero's. For example '0000'.
 *
 * @returns String with leading zero's.
 */
export default function stringify(int: number, format: string): string;
