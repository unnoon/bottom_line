/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import negate from '../../src/negate';
import { expect } from './test-utils.spec';

describe('negate', () =>
{
    it('should negate any function', () =>
    {
        const fnTrue  = function() {return true;};
        const fnFalse = negate(fnTrue);

        expect(fnTrue()).to.be.true;
        expect(fnFalse()).to.be.false;
    });
});
