/**
 * Created by Rogier on 13/04/2017.
 */

import reduce from './reduce';
import { Collection } from './types';

export default function count<T>(collection: Collection<T>, match: (value: any) => boolean, from?: any|number, to?: any|number): number
{
    return reduce(collection, (accumulator, value) => accumulator + (match(value) ? 1 : 0), 0, from, to);
}
