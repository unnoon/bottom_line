/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import Value from '../../../src/classes/Value';
import { expect } from '../test-utils.spec';

describe('Value', () =>
{
    it('should create a value wrapping container using .of or the normal constructor', () =>
    {
        const val1 = new Value(1);
        const val2 = Value.of(2);

        expect(val1.valueOf()).to.eql(1);
        expect(val2.valueOf()).to.eql(2);
    });
});
