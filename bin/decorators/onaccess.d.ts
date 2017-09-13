import { PropertyDecorator } from '../types';
/**
 * @decorator
 * Provides easy onaccess wrapping. The supplied function is executed last.
 *
 * @param fn - Function to be executed on property access.
 *
 * @returns Property decorator.
 */
export declare function onaccess<T>(fn: (v: T) => T): PropertyDecorator;
export default onaccess;
