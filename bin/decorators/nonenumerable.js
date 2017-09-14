import decorator from './decorator';
/**
 * @decorator
 * Provides nonenumerability for properties.
 */
export const nonenumerable = decorator((target, propertyKey, descriptor) => {
    descriptor.enumerable = false;
});
export default nonenumerable;
//# sourceMappingURL=nonenumerable.js.map