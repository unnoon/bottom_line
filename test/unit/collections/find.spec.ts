/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/

import find from '../../../src/collections/find';
import { expect } from '../test-utils.spec';

describe('collections/find', () =>
{
    it('should find elements in collections', () =>
    {
        const arr = [0,1,2,1,0];

        expect(find(arr, (e) => e > 1)).to.eql(2);
    });

    it('should find elements in objects', () =>
    {
        const obj = {x: 0, y: 3, z: 0};

        expect(find(obj, (e, k) => k === 'y')).to.eql(3);
    });

    it('should find elements in collections between keys', () =>
    {
        const arr = [0, 1, 4, 1, 0, 6, 4, 8];

        expect(find(arr, (e) => e > 3, 3)).to.eql(6);
    });
});
