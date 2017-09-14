/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * @generator
 * Generic object keyedIterator.
 *
 * @yields {[any , any]} - Array containing key & value.
 */
export function* iterator() {
    for (const key in this) {
        /* istanbul ignore if */
        if (!this.hasOwnProperty(key)) {
            continue;
        }
        yield [key, this[key]];
    }
}
//# sourceMappingURL=identity.js.map