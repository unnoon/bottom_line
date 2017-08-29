/**
 * Created by Rogier on 13/04/2017.
 */

import { clone } from 'lodash';
import Value from '../../src/Value';
import XDArray from '../../src/XDArray';

const fnValue = () => 3;
const init    = Value.of(fnValue);
const xdarray = new XDArray([3, 2, 4], init);

const o = clone(fnValue);
console.log(xdarray[1][0][2](), 666);
