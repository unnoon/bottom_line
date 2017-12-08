/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import { partial, _ }  from '../../../src/functions/partial';
import { expect } from '../test-utils.spec';

describe('functions/partial', () =>
{
    it('should partialize a function', () =>
    {
        /* tslint:disable-next-line:only-arrow-functions */
        const fn = function(a, b, c, d, e)
        {
            return a + b + c + d + e
        };

        const partialFn = partial(fn, [1, _, 3, _, 5]);

        expect(fn(1, 2, 3, 4, 5)).to.eql(15);
        expect(partialFn(2, 4)).to.eql(15);
    });

    it('should partialize a function with more arguments then partials', () =>
    {
        /* tslint:disable-next-line:only-arrow-functions */
        const fn = function(a, b, c, d, e)
        {
            return a + b + c + d + (e || 5)
        };

        const partialFn = partial(fn, [1, _, 3, _]);

        expect(fn(1, 2, 3, 4, 5)).to.eql(15);
        expect(partialFn(2, 4)).to.eql(15);
    });
});
