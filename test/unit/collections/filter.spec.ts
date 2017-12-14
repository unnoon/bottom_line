/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import filter from '../../../src/collections/filter';
import { expect } from '../test-utils.spec';

describe('collections/filter', () =>
{
    it('should filter elements in collections', () =>
    {
        const arr = [0,1,2,1,0,6];

        expect(filter(arr, (e) => e > 1)).to.eql([2, 6]);
    });

    it('should filter elements in objects', () =>
    {
        const obj = {a: 6, x: 0, y: 3, z: 0};

        expect(filter(obj, (e, k) => e > 1)).to.eql([6, 3]);
    });

    it('should filter elements in collections between keys', () =>
    {
        const arr = [0, 1, 4, 1, 0, 6, 4, 8];

        expect(filter(arr, (e) => e > 3, 3)).to.eql([6,4,8]);
    });
});
