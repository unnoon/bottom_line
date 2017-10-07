/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import random from '../../../src/integers/random';
import { expect } from '../test-utils.spec';

describe('integers/random', () =>
{
    it('should generate random positive integers', () =>
    {
        let iterations = 1000;
        const min = 2;
        const max = 6;

        while(iterations--)
        {
            let r = random(min, max);
            // console.error(r);
            expect(r).to.be.within(min, max - 1);
        }
    });

    it('should generate random integers between negative to positive range', () =>
    {
        let iterations = 1000;
        const min = -8;
        const max = 14;

        while(iterations--)
        {
            let r = random(min, max);
            // console.error(r);
            expect(r).to.be.within(min, max - 1);
        }
    });

    it('should generate random integers between negative to negative range', () =>
    {
        let iterations = 1000;
        const min = -8;
        const max = -2;

        while(iterations--)
        {
            let r = random(min, max);
            // console.error(r);
            expect(r).to.be.within(min, max - 1);
        }
    });
});
