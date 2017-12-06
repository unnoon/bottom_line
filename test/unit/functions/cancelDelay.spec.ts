/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import cancelDelay from '../../../src/functions/cancelDelay';
import { expect } from '../test-utils.spec';

describe('functions/cancelDelay', () =>
{
    it('should cancel a delayed function', (done) =>
    {
        const id = setTimeout(() => expect(true).to.be.false, 500);

        cancelDelay(id);

        setTimeout(() => done(), 1000);
    });
});
