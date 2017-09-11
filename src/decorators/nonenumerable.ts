/**
 * Created by Rogier on 13/04/2017.
 */
import { KeyPropertyDescriptor } from '../classes/KeyPropertyDescriptor';
import { Class, PropertyDecorator, Prototype } from '../types';
import { decorator } from './decorator';

/**
 * @decorator
 * Provides nonenumerability for properties.
 */
export const nonenumerable: PropertyDecorator = decorator(<C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: KeyPropertyDescriptor<any>) =>
{
    descriptor.enumerable = false;
});

export default nonenumerable;
