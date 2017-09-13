import { Decorator, Handler } from '../types';
export declare enum DecoratorType {
    Class = 1,
    Property = 2,
    Method = 3,
    Parameter = 4,
}
/**
 * Decorator factory.
 *
 * @param handler - Handler function that will be provided with the proper args for the decorator.
 *
 * @returns Decorator
 */
export declare function decorator<T>(handler: Handler<T>): Decorator<T>;
