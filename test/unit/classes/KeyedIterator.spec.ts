/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import KeyedIterator from '../../../src/classes/KeyedIterator';
import { expect } from '../test-utils.spec';

describe('classes/KeyedIterator', () =>
{
    it('should return a generic KeyedIterator for any object', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const it = KeyedIterator.create(obj);

        expect([...it]).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should entries in case that is defined on the prototype', () =>
    {
        const set = new Set([1, 5, 3]);
        const it = KeyedIterator.create(set);

        expect([...it]).to.eql([[1, 1], [5, 5], [3, 3]]);
    });
});
