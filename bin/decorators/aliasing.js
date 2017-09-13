import { decorator } from './decorator';
/**
 * @decorator
 * Defines an alias for a property.
 *
 * @param prop - The property name this is an alias for.
 *
 * @returns Property or method decorator.
 */
export function aliasing(prop) {
    return decorator((target, key, descriptor) => {
        const tdsc = Object.getOwnPropertyDescriptor(target, prop);
        descriptor.get = function () { return this[prop]; };
        descriptor.set = function (v) { return this[prop] = v; };
        descriptor.enumerable = tdsc ? tdsc.enumerable : descriptor.enumerable;
        descriptor.configurable = tdsc ? tdsc.configurable : descriptor.configurable;
    });
}
export default aliasing;
//# sourceMappingURL=aliasing.js.map