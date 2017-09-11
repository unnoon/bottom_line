/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import { nonenumerable } from '../../../src/decorators/nonenumerable';
import { expect } from '../test-utils.spec';

describe('decorators/nonenumerable', () =>
{
    it('we should set nonenumerable to the correct value for properties & methods', () =>
    {
        class Fish
        {
            @nonenumerable
            public static soup    = 'warm';

            public static terrine = 'warm';

            @nonenumerable
            public soup    = 'warm';

            public terrine = 'warm';
        }

        const fish = new Fish();

        expect(Fish.soup).to.eql('warm');
        expect(Fish.terrine).to.eql('warm');
        expect(Object.getOwnPropertyDescriptor(Fish, 'soup').enumerable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(Fish, 'terrine').enumerable).to.be.true;

        expect(fish.soup).to.eql('warm');
        expect(fish.terrine).to.eql('warm');
        expect(Object.getOwnPropertyDescriptor(fish, 'soup').enumerable).to.be.false;
        expect(Object.getOwnPropertyDescriptor(fish, 'terrine').enumerable).to.be.true;
    });
});
