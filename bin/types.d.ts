import KeyPropertyDescriptor from './classes/KeyPropertyDescriptor';
export declare type Collection<T> = Iterable<T> | object;
export declare type Sequence = string | any[];
export declare type Class<C> = ({
    new (): C;
});
export declare type Prototype<C> = object;
export declare type ClassDecorator = <C>(target: Class<C>) => void;
export declare type PropertyDecorator = <C>(target: Class<C> | Prototype<C>, propertyKey: string | symbol) => void;
export declare type MethodDecorator<T> = <C>(target: Class<C> | Prototype<C>, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare type ParameterDecorator = <C>(target: Prototype<C>, propertyKey: string | symbol, parameterIndex: number) => void;
export declare type PropertyOrMethodDecorator<T> = PropertyDecorator & MethodDecorator<T>;
export declare type Decorator<T> = ClassDecorator & MethodDecorator<T> & PropertyDecorator & ParameterDecorator;
export declare type ClassHandler = <C>(target: Class<C>) => void;
export declare type PropertyOrMethodHandler<T> = <C>(target: Class<C> | Prototype<C>, propertyKey: string | symbol, descriptor: KeyPropertyDescriptor<T>) => void;
export declare type ParameterHandler = <C>(target: Prototype<C>, propertyKey: string | symbol, parameterIndex: number) => void;
export declare type Handler<T> = <C>(target: Class<C> | Prototype<C>, propertyKey?: string | symbol, descriptor?: KeyPropertyDescriptor<T> | number) => void;
