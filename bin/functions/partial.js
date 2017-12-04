/**
 * Created by Rogier on 13/04/2017.
 */
import is from '../lang/is';
import count from '../collections/count';
/**
 * Return a function with negated output of the original function.
 *
 * @param fn - Function to negate.
 *
 * @returns The negated function.
 */
/* tslint:disable-next-line:ban-types */
export default function partial(fn, partials) {
    const blanks = count(partials, (part) => is.undefined(part));
    const n_partials = partials.length;
    return function (...args) {
        const max = n_partials + args.length - blanks;
        const filledArgs = [];
        let i = 0;
        let arg = 0;
        for (; i < max; i++) {
            filledArgs[i] = (partials[i] !== undefined) ? partials[i] : args[arg++];
        }
        return fn.apply(this, filledArgs);
    };
}
//# sourceMappingURL=partial.js.map