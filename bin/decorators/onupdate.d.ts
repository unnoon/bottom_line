import { PropertyDecorator } from '../types';
/**
 * @decorator
 * Provides easy onupdate wrapping. The supplied function is executed first.
 *
 * @param fn - Function to be executed on property update.
 *
 * @returns Property decorator.
 */
export declare function onupdate<T>(fn: (v: T) => T): PropertyDecorator;
export default onupdate;
