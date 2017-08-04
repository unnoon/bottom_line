/**
 * Created by Rogier on 13/04/2017.
 */

import each from './each';

export default function after(string: string, ...substrings: string[]): string
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
