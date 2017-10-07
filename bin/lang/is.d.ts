import { Collection } from '../types';
declare const is: {
    array: (arg: any) => arg is any[];
    cloneable: (value: any) => boolean;
    empty: (collection: Collection<any>) => boolean;
    iterable: (obj: any) => obj is IterableIterator<any> | Iterable<any>;
    nan: (value: any) => boolean;
    not: {
        [key: string]: (...args: any[]) => boolean;
    };
    null: (value: any) => boolean;
    number: (value: any) => value is number;
    string: (value: any) => value is string;
    symbol: (value: any) => boolean;
    undefined: (value: any) => boolean;
};
export default is;
