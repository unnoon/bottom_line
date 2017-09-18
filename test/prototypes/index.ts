/**
 * Created by Rogier on 13/04/2017.
 */
/* tslint:disable: max-classes-per-file no-console */

import 'reflect-metadata';
// import BitSet  from '../../src/BitSet';
import aliases from '../../src/decorators/aliases';
// import KeyPropertyDescriptor from '../../src/classes/KeyPropertyDescriptor';

class Fish
{
    @aliases<(distance: number) => string>('go', 'swim')
    public move(distance: number): string {return;}
    public go(distance: number): string {return;}
    public swim(distance: number): string
    {
        return 'swimming';
    }
}

const fish = new Fish();

console.assert(fish.move(0) === 'swimming');
console.assert(fish.go(0) === 'swimming');
console.assert(fish.swim(0) === 'swimming');

// console.assert(tdp['_id'].hasOwnProperty(), '_id should be defined on instance');
