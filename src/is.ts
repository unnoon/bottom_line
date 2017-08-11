/**
 * Created by Rogier on 13/04/2017.
 */
import iterator from './iterator';
import negate from './negate';
import { Collection } from './types';

function empty<T>(collection: Collection<T>): boolean
{
    return iterator(collection).next().done;
}

function array(obj: any): boolean
{
    return Array.isArray(obj);
}

function undefined(obj: any): boolean
{
    return typeof(obj) === 'undefined';
}

// FIXME this needs type improvement
const not: {[key: string]: any} = {};

const is =
{
    array,
    empty,
    undefined,
    not,
};

// dynamically add the negated functions
for(const key in is)
{
    if(!is.hasOwnProperty(key)) {continue;}

    const fn = is[key];

    if(fn instanceof Function)
    {
        is.not[key] = negate(fn);
    }
}

export default is;
