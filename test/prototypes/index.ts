/**
 * Created by Rogier on 13/04/2017.
 */
/* tslint:disable: max-classes-per-file no-console */

import 'reflect-metadata';
import * as is from '../../src/lang/is';
// import { decorator }              from '../../src/decorators/decorator';
// import KeyPropertyDescriptor from '../../src/classes/KeyPropertyDescriptor';

class TestDefineProperty
{
    public static id = 11;

    public static method() { return 'do moar stuff';}

    public id;

    constructor()
    {
        this.id = 10;
    }

    public method() { return 'do stuff';}
}

const td = new TestDefineProperty();

const dsc1 = Object.getOwnPropertyDescriptor(TestDefineProperty, 'id');
const dsc2 = Object.getOwnPropertyDescriptor(TestDefineProperty, 'method');
const dsc3 = Object.getOwnPropertyDescriptor(td, 'id');
const dsc4 = Object.getOwnPropertyDescriptor(TestDefineProperty.prototype, 'method');

// console.assert(tdp['_id'].hasOwnProperty(), '_id should be defined on instance');
