import { MethodDecorator } from '../types';
/**
 * @decorator
 * Provides easy onexecute wrapping. The supplied function is executed last.
 *
 * @param fn - Function to be executed on execution of the method.
 *
 * @returns Method decorator.
 */
export declare function onexecute<T>(fn: (o: T) => T): MethodDecorator<T>;
export default onexecute;
