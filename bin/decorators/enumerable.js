import { decorator } from './decorator';
/**
 * @decorator
 * Provides enumerability for methods.
 */
export const enumerable = decorator((target, propertyKey, descriptor) => {
    descriptor.enumerable = true;
});
export default enumerable;
//# sourceMappingURL=enumerable.js.map