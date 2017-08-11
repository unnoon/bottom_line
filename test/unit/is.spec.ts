/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import is from '../../src/is';
import { expect } from './test-utils.spec';

describe('is', () =>
{
    describe('empty', () =>
    {
        it('should be able to define for any collection if it is empty', () =>
        {
            expect(is.empty({})).to.be.true;
            expect(is.empty({x: 1})).to.be.false;

            expect(is.empty([])).to.be.true;
            expect(is.empty([1])).to.be.false;
        });
    });

    describe('array', () =>
    {
        it('should be able to define for any predicate if it is an array', () =>
        {
            expect(is.array([])).to.be.true;
            expect(is.array({x: 1})).to.be.false;
        });
    });

    describe('undefined', () =>
    {
        it('should be able to define for any predicate if it is undefined', () =>
        {
            expect(is.undefined(undefined)).to.be.true;
            expect(is.undefined({x: 1})).to.be.false;
        });
    });

    describe('not', () =>
    {
        it('should use negated versions when prefixing not.', () =>
        {
            expect(is.not.undefined(undefined)).to.be.false;
            expect(is.not.undefined({x: 1})).to.be.true;
        });
    });
});
