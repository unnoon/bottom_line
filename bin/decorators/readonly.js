import decorator from './decorator';
/**
 * @decorator
 * Provides readonly for properties & methods.
 */
export const readonly = decorator((target, propertyKey, descriptor) => {
    descriptor.writable = false;
});
export default readonly;
//# sourceMappingURL=readonly.js.map