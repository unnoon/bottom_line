/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import rebound from '../../../src/integers/rebound';
import { expect } from '../test-utils.spec';

describe('integers/rebound', () =>
{
    it('should rebound positive overflowing indices', () =>
    {
        expect(rebound(1, 0, 3)).to.eql(1);
        expect(rebound(2, 0, 3)).to.eql(2);
        expect(rebound(0, 0, 3)).to.eql(0);
        expect(rebound(3, 0, 3)).to.eql(0);
        expect(rebound(5, 0, 3)).to.eql(2);
        expect(rebound(6, 0, 3)).to.eql(0);
        expect(rebound(14, 0, 7)).to.eql(0);
    });

    it('should rebound negative overflowing indices', () =>
    {
        // negatives
        expect(rebound(-1, 0, 3)).to.eql(2);
        expect(rebound(-2, 0, 3)).to.eql(1);
        expect(rebound(-3, 0, 3)).to.eql(0);

        expect(rebound(0, 1, 3)).to.eql(2);
        expect(rebound(-1, 1, 3)).to.eql(1);
        expect(rebound(-2, 1, 3)).to.eql(2);
        expect(rebound(-3, 1, 3)).to.eql(1);

        expect(rebound(-7, -5, 8)).to.eql(6);
        expect(rebound(-20, -5, 8)).to.eql(6);
        expect(rebound(-3, -5, 8)).to.eql(-3);
        expect(rebound(9, -5, 8)).to.eql(-4);
        expect(rebound(-5, -5, 8)).to.eql(-5);
    });
});
