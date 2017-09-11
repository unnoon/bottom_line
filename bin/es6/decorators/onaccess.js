import { decorator } from './decorator';
/**
 * @decorator
 * Provides easy onaccess wrapping. The supplied function is executed last.
 *
 * @param fn - Function to be executed on property access.
 *
 * @returns Property decorator.
 */
export function onaccess(fn) {
    return decorator((target, propertyKey, descriptor) => {
        descriptor.onaccess(fn);
    });
}
export default onaccess;
