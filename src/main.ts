/**
 * Created by Rogier on 13/04/2017.
 */

import each from './each';

const obj     = {x: 0, y: 1, z: 2};
const entries = [];

const result = each(obj, (value, key) => entries.push([key, value]));

console.log(entries);
