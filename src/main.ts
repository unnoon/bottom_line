/**
 * Created by Rogier on 13/04/2017.
 */

import XDArray from './XDArray';
import reduce from './reduce';

let xdarray = new XDArray([2, 2, 2], (pos) =>
{
    const index = reduce(pos, (acc, val) => (acc + val));
    console.log(index, pos);
    return index;
});