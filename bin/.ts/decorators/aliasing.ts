/**
 * Created by Rogier on 13/04/2017.
 */
import { KeyPropertyDescriptor } from '../classes/KeyPropertyDescriptor';
import { PropertyOrMethodDecorator } from '../types';
import { decorator } from './decorator';

/**
 * @decorator
 * Defines an alias for a property.
 *
 * @param prop - The property name this is an alias for.
 *
 * @returns Property or method decorator.
 */
export function aliasing<T>(prop: string): PropertyOrMethodDecorator<T>
{
    return decorator((target, key, descriptor: KeyPropertyDescriptor<T>) =>
    {
        const tdsc: TypedPropertyDescriptor<T> = Object.getOwnPropertyDescriptor(target, prop);

        descriptor.get = function():     T {return this[prop];};
        descriptor.set = function(v: T): T {return this[prop] = v;};

        descriptor.enumerable   = tdsc ? tdsc.enumerable   : descriptor.enumerable;
        descriptor.configurable = tdsc ? tdsc.configurable : descriptor.configurable;
    });
}

export default aliasing;
