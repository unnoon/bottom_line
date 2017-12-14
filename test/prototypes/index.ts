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
import { partial, _ } from '../../src/functions/partial';
import leftOf from '../../src/sequences/leftOf';
import {expect} from '../unit/test-utils.spec';
// import {expect} from '../unit/test-utils.spec';

const arraylike =  {
    0: 2,
    1: 3,
    2: 5,
    3: 3,
    4: 6,
    length: 5,
};

const leftOfArguments = leftOf(arraylike, 5);

console.log(leftOfArguments === [2, 3]);
