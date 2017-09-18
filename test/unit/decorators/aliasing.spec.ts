/**
 * Created by Rogier on 05/05/2017.
 */
/* tslint:disable:no-unused-expression max-classes-per-file no-console */

import aliases from '../../../src/decorators/aliases';
import { expect } from '../test-utils.spec';

describe('decorators/aliases', () =>
{
    it('we should be able to define aliases for properties', () =>
    {
        class Fish
        {
            @aliases<boolean>('flipper')
            public toes: boolean; // how to type check this shit??!?!?
            public flipper: boolean = true;
        }

        const fish = new Fish();

        expect(Fish.prototype.hasOwnProperty('toes')).to.be.true;
        expect(Fish.prototype.hasOwnProperty('flipper')).to.be.false;
        expect(fish.hasOwnProperty('toes')).to.be.false;
        expect(fish.hasOwnProperty('flipper')).to.be.true;
        expect(fish.toes).to.be.true;
        expect(fish.flipper).to.be.true;
        fish.toes = false;
        expect(fish.toes).to.be.false;
        expect(fish.flipper).to.be.false;
    });

    it('we should be able to define aliases for static properties', () =>
    {
        class Fish
        {
            @aliases<boolean>('flipper')
            public static toes: boolean; // how to type check this shit??!?!?
            public static flipper: boolean = true;
        }

        expect(Fish.hasOwnProperty('toes')).to.be.true;
        expect(Fish.hasOwnProperty('flipper')).to.be.true;
        expect(Fish.toes).to.be.true;
        expect(Fish.flipper).to.be.true;
        Fish.toes = false;
        expect(Fish.toes).to.be.false;
        expect(Fish.flipper).to.be.false;
    });

    it('we should be able to define aliases for methods', () =>
    {
        class Fish
        {
            @aliases<(distance: number) => string>('go', 'swim') // @readonly @nonconfigurable
            public move(distance: number): string {return;}
            public go(distance: number): string {return;}
            public swim(distance: number): string
            {
                return 'swimming';
            }
        }

        const fish = new Fish();

        expect(Fish.prototype.hasOwnProperty('swim')).to.be.true;
        expect(Fish.prototype.hasOwnProperty('move')).to.be.true;
        expect(Fish.prototype.hasOwnProperty('go')).to.be.true;
        expect(fish.swim(0)).to.eql('swimming');
        expect(fish.move(0)).to.eql('swimming');
        expect(fish.go(0)).to.eql('swimming');
    });

    it('we should be able to define aliases for static methods', () =>
    {
        class Fish
        {
            @aliases<(distance: number) => string>('swim')
            public static move(distance: number): string {return;}
            public static swim(distance: number): string
            {
                return 'swimming';
            }
        }

        expect(Fish.hasOwnProperty('swim')).to.be.true;
        expect(Fish.hasOwnProperty('move')).to.be.true;
        expect(Fish.swim(0)).to.eql('swimming');
        expect(Fish.move(0)).to.eql('swimming');
    });

    it('we should be able to define aliases without an implementation', () =>
    {
        class Fish
        {
            @aliases<(distance: number) => string>('noimplementation', 'swim')
            public static move(distance: number): string {return;}
            public static swim(distance: number): string
            {
                return 'swimming';
            }
        }

        expect(Fish.hasOwnProperty('swim')).to.be.true;
        expect(Fish.hasOwnProperty('move')).to.be.true;
        expect(Fish.hasOwnProperty('noimplementation')).to.be.true;
        expect(Fish.swim(0)).to.eql('swimming');
        expect(Fish.move(0)).to.eql('swimming');
        expect(Fish['noimplementation'](0)).to.eql('swimming');
    });
});
