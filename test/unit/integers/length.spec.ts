/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import length from '../../../src/integers/length';
import { expect } from '../test-utils.spec';

describe('integers/length', () =>
{
    it('should calculate the length of positive integers', () =>
    {
        expect(length(-502)).to.eql(3);
        expect(length(-1)).to.eql(1);
        expect(length(0)).to.eql(1);
        expect(length(5)).to.eql(1);
        expect(length(6)).to.eql(1);
        expect(length(9)).to.eql(1);
        expect(length(10)).to.eql(2);
        expect(length(50)).to.eql(2);
        expect(length(51)).to.eql(2);
        expect(length(99)).to.eql(2);
        expect(length(100)).to.eql(3);
        expect(length(500)).to.eql(3);
        expect(length(501)).to.eql(3);
        expect(length(999)).to.eql(3);
        expect(length(6424615)).to.eql(7);
        expect(length(999554329)).to.eql(9);
    });
});
