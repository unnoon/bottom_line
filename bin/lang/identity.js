/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * Generic object keyedIterator.
 *
 * @generator
 *
 * @yields Array containing key & value [any , any].
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