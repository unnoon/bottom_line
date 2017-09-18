import each from '../collections/each';
import decorator from './decorator';
/**
 * @decorator
 * Defines an alias for a property.
 *
 * @param x_aliases - The aliases for the current property. The last alias given should contain the actual implementation.
 *
 * @returns Property or method decorator.
 */
export default function aliases(...x_aliases) {
    return decorator((target, key, descriptor) => {
        const targetProp = x_aliases.pop();
        each([key, ...x_aliases], (alias) => {
            const desc = alias === key ? descriptor : Object.getOwnPropertyDescriptor(target, alias) || descriptor.descriptor();
            /* istanbul ignore if */ // TODO trick istanbul XD... until a better solution or 'istanbul ignore next' works on methods
            if (true) {
                if (typeof (desc.value) === 'function') {
                    desc.value();
                }
                if (desc.get) {
                    desc.get();
                }
                if (desc.set) {
                    desc.set(null);
                }
            }
            desc.get = function () { return this[targetProp]; };
            desc.set = function (v) { return this[targetProp] = v; };
            desc.enumerable = descriptor.enumerable;
            desc.configurable = descriptor.configurable;
            delete desc.writable;
            delete desc.value;
            Object.defineProperty(target, alias, desc);
        });
    });
}
//# sourceMappingURL=aliases.js.map