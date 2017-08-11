/**
 * Created by Rogier on 13/04/2017.
 */

import enumerate from './generators/enumerate';
import each from './each';
import { Collection } from './types';

// export default function rightOf<T>(collection: Collection<T>, ...substrings: string[]): string
// {
//     const output;
//
//     for(const [key, value] of enumerate(collection, from, to))
//     {
//
//     }
// }

export default function rightOf(string: string, ...substrings: string[]): string
{
    let output: string = string || '';
    let index: number;

    each(substrings, (substring: string) =>
    {
        index  = output.indexOf(substring);
        output = ~index ? output.slice(index + substring.length) : output;
    });

    return output;
}
