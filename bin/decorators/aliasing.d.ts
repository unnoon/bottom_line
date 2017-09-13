import { PropertyOrMethodDecorator } from '../types';
/**
 * @decorator
 * Defines an alias for a property.
 *
 * @param prop - The property name this is an alias for.
 *
 * @returns Property or method decorator.
 */
export declare function aliasing<T>(prop: string): PropertyOrMethodDecorator<T>;
export default aliasing;
