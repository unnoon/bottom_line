/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import * as is from '../../../src/lang/is';
import { expect } from '../test-utils.spec';

describe('lang/is', () =>
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

    describe('cloneable', () =>
    {
        it('should return a boolean indicating if a value is cloneable', () =>
        {
            expect(is.cloneable(new Error())).to.be.false;
            expect(is.cloneable(new Function())).to.be.false;
            expect(is.cloneable(() => 3)).to.be.false;
            expect(is.cloneable(new WeakMap())).to.be.false;
            expect(is.cloneable(Symbol())).to.be.false;
            expect(is.cloneable(document.createElement('p'))).to.be.false;
            expect(is.cloneable({})).to.be.true;
            expect(is.cloneable(6)).to.be.true;
        });
    });

    describe('iterable', () =>
    {
        it('should return the correct boolean value in case of iterability', () =>
        {
            expect(is.iterable(undefined)).to.be.false;
            expect(is.iterable(null)).to.be.false;
            expect(is.iterable(true)).to.be.false;
            expect(is.iterable({})).to.be.false;
            // expect(is.iterable(1)).to.be.false; // WOW mocha makes numbers iterable...
            expect(is.iterable('')).to.be.true;
            expect(is.iterable([])).to.be.true;
        });
    });

    describe('symbol', () =>
    {
        it('should be able to define for any predicate if it is undefined', () =>
        {
            expect(is.symbol(Symbol('symbol'))).to.be.true;
            expect(is.symbol({x: 1})).to.be.false;
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
