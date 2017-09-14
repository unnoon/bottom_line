import decorator from './decorator';
/**
 * @decorator
 * Provides easy onexecute wrapping. The supplied function is executed last.
 *
 * @param fn - Function to be executed on execution of the method.
 *
 * @returns Method decorator.
 */
export function onexecute(fn) {
    return decorator((target, propertyKey, descriptor) => {
        descriptor.onexecute(fn);
    });
}
export default onexecute;
//# sourceMappingURL=onexecute.js.map