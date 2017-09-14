/**
 * Created by Rogier on 13/04/2017.
 */
import KeyPropertyDescriptor from '../classes/KeyPropertyDescriptor';
import each from '../collections/each';
import { PropertyOrMethodDecorator } from '../types';
import decorator from './decorator';

/**
 * @decorator
 * Defines an alias for a property.
 *
 * @param x_aliases - The aliases for the current property. The last alias given should contain the actual implementation.
 *
 * @returns Property or method decorator.
 */
export default function aliases<T>(...x_aliases: string[]): PropertyOrMethodDecorator<T>
{
    return decorator((target, key, descriptor: KeyPropertyDescriptor<T>) =>
    {
        const targetProp  = x_aliases.pop();
        const targetDesc  = Object.getOwnPropertyDescriptor(target, targetProp);

        each([...x_aliases, key], (alias) =>
        {
            const desc = alias === targetProp ? Object.getOwnPropertyDescriptor(target, alias) : descriptor;

            desc.get = function():     T {return this[targetProp];};
            desc.set = function(v: T): T {return this[targetProp] = v;};

            desc.enumerable   = targetDesc ? targetDesc.enumerable   : desc.enumerable;
            desc.configurable = targetDesc ? targetDesc.configurable : desc.configurable;

            if(!!desc.get || !!desc.set) // accessor
            {
                delete desc.writable;
                delete desc.value;
            }
            
            if(alias !== targetProp) {Object.defineProperty(target, alias, desc);}
        });
    });
}
