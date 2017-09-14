/**
 * Created by Rogier on 13/04/2017.
 */
import KeyPropertyDescriptor from '../classes/KeyPropertyDescriptor';
import { Class, MethodDecorator, Prototype } from '../types';
import decorator from './decorator';

/**
 * @decorator
 * Provides easy onexecute wrapping. The supplied function is executed last.
 *
 * @param fn - Function to be executed on execution of the method.
 *
 * @returns Method decorator.
 */
export function onexecute<T>(fn: (o: T) => T): MethodDecorator<T>
{
    return decorator<T>(<C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: KeyPropertyDescriptor<T>) =>
    {
        (descriptor as KeyPropertyDescriptor<any>).onexecute(fn);
    });
}

export default onexecute;
