/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import defer from '../../../src/functions/defer';
import { expect } from '../test-utils.spec';

describe('functions/defer', () =>
{
    it('should defer any function', (done) =>
    {
        defer(() => done());
    });
});
