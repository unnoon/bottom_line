import KeyPropertyDescriptor from './classes/KeyPropertyDescriptor';

export type Collection<T> = Iterable<T>|object;
export type Sequence<T>   = ArrayLike<T>;
export type Class<C>      = ({new(): C});
export type Prototype<C>  = object; // TODO see if we can improve this.... seems to be hard/impossible because type of constructor = Function

export type ClassDecorator     = <C>(target: Class<C>) => void;
export type PropertyDecorator  = <C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol) => void;
export type MethodDecorator<T> = <C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export type ParameterDecorator = <C>(target: Prototype<C>,          propertyKey: string|symbol, parameterIndex: number) => void;

export type PropertyOrMethodDecorator<T> = PropertyDecorator & MethodDecorator<T>;

export type Decorator<T> = ClassDecorator &  MethodDecorator<T> & PropertyDecorator & ParameterDecorator;

export type ClassHandler               = <C>(target: Class<C>) => void;
export type PropertyOrMethodHandler<T> = <C>(target: Class<C>|Prototype<C>, propertyKey: string|symbol, descriptor: KeyPropertyDescriptor<T>) => void;
export type ParameterHandler           = <C>(target: Prototype<C>,          propertyKey: string|symbol, parameterIndex: number) => void;

// export type Handler<T> = ClassHandler & PropertyOrMethodHandler<T> & ParameterHandler; // This would be nice but doesn't seem to work
export type Handler<T> = <C>(target: Class<C>|Prototype<C>, propertyKey?: string|symbol, descriptor?: KeyPropertyDescriptor<T>|number) => void;
