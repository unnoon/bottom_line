/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import * as identity from '../../../src/lang/identity';
import { expect } from '../test-utils.spec';

describe('lang/identity', () =>
{
    describe('iterator', () =>
    {
        it('should iterate any object', () =>
        {
            const obj     = {x: 0, y: 1, z: 2};
            const it  = identity.iterator.call(obj);

            expect([...it]).to.eql([['x', 0], ['y', 1], ['z', 2]]);
        });
    });

});
