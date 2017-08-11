/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import enumerate from '../../../src/generators/enumerate';
import { expect } from '../test-utils.spec';

describe('generators/enumerate', () =>
{
    it('should enumerate any iterable including objects', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const m = enumerate(obj);

        expect([...m]).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should enumerate any iterable between two keys', () =>
    {
        const arr = [5, 4, 2, 4, 3, 2, 1, 1];
        const m = enumerate(arr, 2, 4);

        expect([...m]).to.eql([[2, 2], [3, 4]]);
    });
});
