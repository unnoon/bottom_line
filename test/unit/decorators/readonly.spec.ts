/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { readonly } from '../../../src/decorators/readonly';
import { expect } from '../test-utils.spec';

describe('decorators/readonly', () =>
{
    it('we should set readonly to the correct value for properties & methods', () =>
    {
        class Fish
        {
            @readonly
            public static soup    = 'warm';

            public static terrine = 'warm';

            @readonly
            public static m1()
            {
                return 'stuff';
            }

            public static m2()
            {
                return 'stuff';
            }

            @readonly
            public soup    = 'warm';

            public terrine = 'warm';

            @readonly
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
        expect(Object.getOwnPropertyDescriptor(Fish, 'soup').writable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish, 'terrine').writable).to.be.true;

        expect(Fish.m1()).to.eql('stuff');
        expect(Fish.m2()).to.eql('stuff');
        expect(Object.getOwnPropertyDescriptor(Fish, 'm1').writable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish, 'm2').writable).to.be.true;

        expect(fish.soup).to.eql('warm');
        expect(fish.terrine).to.eql('warm');
        expect(Object.getOwnPropertyDescriptor(fish, 'soup').writable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(fish, 'terrine').writable).to.be.true;

        expect(fish.m1()).to.eql('stuff');
        expect(fish.m2()).to.eql('stuff');
        expect(Object.getOwnPropertyDescriptor(Fish.prototype, 'm1').writable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish.prototype, 'm2').writable).to.be.true;
    });
});
