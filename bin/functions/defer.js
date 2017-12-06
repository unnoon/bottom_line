/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * Defers a function call to the end of the stack
 *
 * @param fn - Function to defer.
 */
/* tslint:disable-next-line:ban-types */
export default function defer(fn) {
    setTimeout(fn, 0);
}
//# sourceMappingURL=defer.js.map