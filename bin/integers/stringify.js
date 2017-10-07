/* tslint:disable:whitespace */
import rebound from './rebound';
/**
 * Returns a string representation of an integer including leading zero's depending on a format.
 * Uses rebound in case of overflowing.
 *
 * @param int    - Integer to measure the length.
 * @param format - Format for the lead zero's for example '0000'.
 *
 * @returns String with leading zero's.
 */
export default function stringify(int, format) {
    int = int | 0;
    const len = format.length;
    const max = Math.pow(10, len);
    int = rebound(int)(0, max);
    return (int / max).toFixed(len).substr(2);
}
//# sourceMappingURL=stringify.js.map