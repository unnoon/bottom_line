/**
 * Created by Rogier on 13/04/2017.
 */
import * as is from 'is_js';
import { Collection } from './types';

function* iterator()
{
    for (const key in this)
    {
        if(!this.hasOwnProperty(key)) { continue; }

        yield [key, this[key]];
    }
}

export default {
    iterator,
};
