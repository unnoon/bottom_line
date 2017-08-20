/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import iterator from '../../src/keyedIterator';
import { expect } from './test-utils.spec';

describe('iterator', () =>
{
    it('should return a generic keyedIterator for any collection', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const it = iterator(obj);

        expect([...it]).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should keyedIterator return an artificial key in case of key-less data-structures', () =>
    {
        const set = new Set([1, 5, 3]);
        const it = iterator(set);

        expect([...it]).to.eql([[0, 1], [1, 5], [2, 3]]);
    });
});
