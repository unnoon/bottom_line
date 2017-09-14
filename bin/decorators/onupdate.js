import decorator from './decorator';
/**
 * @decorator
 * Provides easy onupdate wrapping. The supplied function is executed first.
 *
 * @param fn - Function to be executed on property update.
 *
 * @returns Property decorator.
 */
export function onupdate(fn) {
    return decorator((target, propertyKey, descriptor) => {
        descriptor.onupdate(fn);
    });
}
export default onupdate;
//# sourceMappingURL=onupdate.js.map