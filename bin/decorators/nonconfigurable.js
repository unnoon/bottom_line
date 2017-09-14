import decorator from './decorator';
/**
 * @decorator
 * Provides nonconfigurability for properties & methods.
 */
export const nonconfigurable = decorator((target, propertyKey, descriptor) => {
    descriptor.configurable = false;
});
export default nonconfigurable;
//# sourceMappingURL=nonconfigurable.js.map