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
        const targetDesc = Object.getOwnPropertyDescriptor(target, targetProp);
        each([...x_aliases, key], (alias) => {
            const desc = alias === targetProp ? Object.getOwnPropertyDescriptor(target, alias) : descriptor;
            desc.get = function () { return this[targetProp]; };
            desc.set = function (v) { return this[targetProp] = v; };
            desc.enumerable = targetDesc ? targetDesc.enumerable : desc.enumerable;
            desc.configurable = targetDesc ? targetDesc.configurable : desc.configurable;
            if (!!desc.get || !!desc.set) {
                delete desc.writable;
                delete desc.value;
            }
            if (alias !== targetProp) {
                Object.defineProperty(target, alias, desc);
            }
        });
    });
}
//# sourceMappingURL=aliases.js.map