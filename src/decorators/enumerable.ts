/**
 * Created by Rogier on 13/04/2017.
 */
import { KeyPropertyDescriptor } from '../classes/KeyPropertyDescriptor';
import { Class, MethodDecorator, Prototype } from '../types';
import { decorator } from './decorator';

/**
 * @decorator
 * Provides enumerability for methods.
 */
export const enumerable: MethodDecorator<any> = decorator(<C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: KeyPropertyDescriptor<any>) =>
{
    descriptor.enumerable = true;
});

export default enumerable;
