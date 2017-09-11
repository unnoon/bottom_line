/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { nonconfigurable } from '../../../src/decorators/nonconfigurable';
import { expect } from '../test-utils.spec';

describe('decorators/nonconfigurable', () =>
{
    it('we should set nonconfigurable to the correct value for properties & methods', () =>
    {
        class Fish
        {
            @nonconfigurable
            public static soup    = 'warm';

            public static terrine = 'warm';

            @nonconfigurable
            public static m1()
            {
                return 'stuff';
            }

            public static m2()
            {
                return 'stuff';
            }

            @nonconfigurable
            public soup    = 'warm';

            public terrine = 'warm';

            @nonconfigurable
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

        expect(Fish.soup).to.eql('warm');
        expect(Fish.terrine).to.eql('warm');
        expect(Object.getOwnPropertyDescriptor(Fish, 'soup').configurable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish, 'terrine').configurable).to.be.true;

        expect(Fish.m1()).to.eql('stuff');
        expect(Fish.m2()).to.eql('stuff');
        expect(Object.getOwnPropertyDescriptor(Fish, 'm1').configurable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish, 'm2').configurable).to.be.true;

        expect(fish.soup).to.eql('warm');
        expect(fish.terrine).to.eql('warm');
        expect(Object.getOwnPropertyDescriptor(fish, 'soup').configurable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(fish, 'terrine').configurable).to.be.true;

        expect(fish.m1()).to.eql('stuff');
        expect(fish.m2()).to.eql('stuff');
        expect(Object.getOwnPropertyDescriptor(Fish.prototype, 'm1').configurable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish.prototype, 'm2').configurable).to.be.true;
    });
});
