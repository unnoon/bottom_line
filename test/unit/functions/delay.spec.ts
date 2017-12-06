/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import delay from '../../../src/functions/delay';
import { expect } from '../test-utils.spec';

describe('functions/delay', () =>
{
    it('should delay any function', (done) =>
    {
        delay(1000, () => done());
    });
});
