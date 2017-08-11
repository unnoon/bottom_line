/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import iterator from '../../src/iterator';
import { expect } from './test-utils';

describe('iterator', () =>
{
    it('should return a generic iterator for any collection', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const it = iterator(obj);

        expect([...it]).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should iterator return an artificial key in case of key-less data-structures', () =>
    {
        const set = new Set([1, 5, 3]);
        const it = iterator(set);

        expect([...it]).to.eql([[0, 1], [1, 5], [2, 3]]);
    });
});
