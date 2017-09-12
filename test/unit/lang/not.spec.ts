/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import not from '../../../src/lang/not';
import { expect } from '../test-utils.spec';

describe('lang/not', () =>
{
    it('should negate any predicate', () =>
    {
        expect(not(true)).to.be.false;
    });
});
