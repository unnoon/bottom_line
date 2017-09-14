import { PropertyOrMethodDecorator } from '../types';
/**
 * @decorator
 * Defines an alias for a property.
 *
 * @param x_aliases - The aliases for the current property. The last alias given should contain the actual implementation.
 *
 * @returns Property or method decorator.
 */
export default function aliases<T>(...x_aliases: string[]): PropertyOrMethodDecorator<T>;
