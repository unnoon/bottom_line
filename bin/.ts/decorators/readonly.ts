/**
 * Created by Rogier on 13/04/2017.
 */
import { KeyPropertyDescriptor } from '../classes/KeyPropertyDescriptor';
import { Class, PropertyOrMethodDecorator, Prototype } from '../types';
import { decorator } from './decorator';

/**
 * @decorator
 * Provides readonly for properties & methods.
 */
export const readonly: PropertyOrMethodDecorator<any> = decorator(<C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: KeyPropertyDescriptor<any>) =>
{
    descriptor.writable = false;
});

export default readonly;
