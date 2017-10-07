/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import * as deg from '../../../src/math/deg';
import { expect } from '../test-utils.spec';

describe('math/deg', () =>
{
    describe('from', () =>
    {
        it('should translate radians to degrees', () =>
        {
            expect(deg.from(Math.PI)).to.eql(180);
        });
    });

    describe('normalize', () =>
    {
        it('should normalize big angles', () =>
        {
            expect(deg.normalize(45 - 6 * 360)).to.eql(45);
            expect(deg.normalize(45 + 6 * 360)).to.eql(45);
        });
    });
});
