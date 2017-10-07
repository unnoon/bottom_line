/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import * as rad from '../../../src/math/rad';
import { expect } from '../test-utils.spec';

describe('math/rad', () =>
{
    describe('from', () =>
    {
        it('should translate degrees to radians', () =>
        {
            expect(rad.from(180)).to.eql(Math.PI);
        });
    });

    describe('normalize', () =>
    {
        it('should normalize big angles', () =>
        {
            expect(rad.normalize(Math.PI - 4 * rad.PI2)).to.eql(Math.PI);
            expect(rad.normalize(Math.PI + 4 * rad.PI2)).to.eql(Math.PI);
        });
    });
});
