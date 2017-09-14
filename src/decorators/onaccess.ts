/**
 * Created by Rogier on 13/04/2017.
 */
import KeyPropertyDescriptor from '../classes/KeyPropertyDescriptor';
import { Class, PropertyDecorator, Prototype } from '../types';
import decorator from './decorator';

/**
 * @decorator
 * Provides easy onaccess wrapping. The supplied function is executed last.
 *
 * @param fn - Function to be executed on property access.
 *
 * @returns Property decorator.
 */
export function onaccess<T>(fn: (v: T) => T): PropertyDecorator
{
    return decorator<T>(<C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: KeyPropertyDescriptor<T>) =>
    {
        (descriptor as KeyPropertyDescriptor<any>).onaccess(fn);
    });
}

export default onaccess;
