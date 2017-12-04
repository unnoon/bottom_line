/**
 * Created by Rogier on 13/04/2017.
 */
/* tslint:disable: max-classes-per-file no-console */

import 'reflect-metadata';
// import BitSet  from '../../src/BitSet';
import KeyedIterator from '../../src/classes/KeyedIterator';
import count from '../../src/collections/count';
import each from '../../src/collections/each';
import aliases from '../../src/decorators/aliases';
import rebound from '../../src/integers/rebound';
import partial from '../../src/functions/partial';

/* tslint:disable-next-line:only-arrow-functions */
const fn = function(a, b, c, d, e)
{
    return a + b + c + d + e
};

const partialFn = partial(fn, [1, undefined, 3, undefined, 5]);

console.assert(fn(1, 2, 3, 4, 5) === 15);
console.assert(partialFn(2, 4) === 15);
