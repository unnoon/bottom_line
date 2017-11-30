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
// import KeyPropertyDescriptor from '../../src/classes/KeyPropertyDescriptor';

// const r1 = rebound(-3)(-5, 7); // -3
// const r2 = rebound(-7)(-5, 7); // 6
const r2 = rebound(-1, 1, 2); // 6
