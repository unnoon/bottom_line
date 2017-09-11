/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { enumerable } from '../../../src/decorators/enumerable';
import { expect }     from '../test-utils.spec';

describe('decorators/enumerable', () =>
{
    it('we should set enumerable to the correct value for properties & methods', () =>
    {
        class Fish
        {
            @enumerable
            public static m1()
            {
                return 'stuff';
            }

            public static m2()
            {
                return 'stuff';
            }

            @enumerable
            public m1()
            {
                return 'stuff';
            }

            public m2()
            {
                return 'stuff';
            }
        }

        const fish = new Fish();

        expect(Fish.m1()).to.eql('stuff');
        expect(Fish.m2()).to.eql('stuff');
        expect(Object.getOwnPropertyDescriptor(Fish, 'm1').enumerable).to.be.true;
        expect(Object.getOwnPropertyDescriptor(Fish, 'm2').enumerable).to.be.false;

        expect(fish.m1()).to.eql('stuff');
        expect(fish.m2()).to.eql('stuff');
        expect(Object.getOwnPropertyDescriptor(Fish.prototype, 'm1').enumerable).to.be.true;
        expect(Object.getOwnPropertyDescriptor(Fish.prototype, 'm2').enumerable).to.be.false;
    });
});
