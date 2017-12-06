/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * Delays a function call by a given number of milliseconds.
 *
 * @param ms - Delay in milliseconds.
 * @param fn - Function to delay.
 *
 * @returns Identifier to be used by cancelDelay
 */
/* tslint:disable-next-line:ban-types */
export default function delay(ms, fn) {
    return setTimeout(fn, ms);
}
//# sourceMappingURL=delay.js.map