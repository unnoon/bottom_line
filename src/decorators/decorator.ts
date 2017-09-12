/**
 * Created by Rogier on 13/04/2017.
 */
import KeyPropertyDescriptor from '../classes/KeyPropertyDescriptor';
import count from '../collections/count';
import { Class, Decorator, Handler, Prototype } from '../types';

export enum DecoratorType {
    Class = 1,
    Property,
    Method,
    Parameter,
}

/**
 * Decorator factory.
 *
 * @param handler - Handler function that will be provided with the proper args for the decorator.
 *
 * @returns Decorator
 */
export function decorator<T>(handler: Handler<T>): Decorator<T>
{
    return (...args) =>
    {
        const [target, key, dsc_index] = args;
        const n_args = count(args, (elm) => elm !== undefined);
        let dsc: KeyPropertyDescriptor<T>;

        switch (true) {
            case DecoratorType.Class === n_args :
                handler(target); break;
            case DecoratorType.Property === n_args :
                handler(target, key, dsc = getPropertyDescriptor<T>(target, key)), dsc.defineProperty(target); break;
            case DecoratorType.Method === n_args && typeof(dsc_index) !== 'number' :
                handler(target, key, dsc = getPropertyDescriptor<T>(target, key, dsc_index)); return dsc.descriptor();
            case DecoratorType.Parameter === n_args + 1 :
                handler(target, key, dsc_index); break;
            /* istanbul ignore next */
            default:
                throw new Error('Decorators are not valid here!');
        }
    };
}

/**
 * Provides the correct KeyPropertyDescriptor based on the target (i.e. static/instance)
 *
 * @param target - Class or prototype.
 * @param key    - The key of the property.
 * @param dsc    - Descriptor object whose values should be assigned.
 *
 * @returns Initialized KeyPropertyDescriptor.
 */
function getPropertyDescriptor<T>(target: Class<any>|Prototype<any>, key: string|symbol, dsc?: TypedPropertyDescriptor<T>): KeyPropertyDescriptor<T>
{
    const defaultDescriptor = {enumerable: true, configurable: true, writable: true};

    return (target instanceof Function) // static
        ? new KeyPropertyDescriptor<T>().key(key).descriptor(dsc || Object.getOwnPropertyDescriptor(target, key) || defaultDescriptor) // static
        : new KeyPropertyDescriptor<T>().key(key).descriptor(dsc || Reflect.getMetadata('design:descriptor', target, key) || defaultDescriptor); // instance
}
