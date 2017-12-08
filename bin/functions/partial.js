/**
 * Created by Rogier on 13/04/2017.
 */
import count from '../collections/count';
const _ = Symbol('blank');
/**
 * Return a function with partial default arguments.
 *
 * @param fn       - Function to partialize.
 * @param partials - Array containing default argument values. Use 'undefined' for blanks.
 *
 * @returns The partial function.
 */
/* tslint:disable-next-line:ban-types */
export default function partial(fn, partials) {
    const blanks = count(partials, (part) => (part === _));
    const n_partials = partials.length;
    return function (...args) {
        const max = n_partials + args.length - blanks;
        const filledArgs = [];
        let i = 0;
        let arg = 0;
        for (; i < max; i++) {
            filledArgs[i] = (partials[i] !== _) ? partials[i] : args[arg++];
        }
        return fn.apply(this, filledArgs);
    };
}
export { partial, _ };
//# sourceMappingURL=partial.js.map