/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import indexOf from '../../../src/collections/indexOf';
import { expect } from '../test-utils.spec';

describe('collections/indexOf', () =>
{
    it('should return the key in case the item is found in the collection', () =>
    {
        const obj   = {x: 0, y: 1, z: 2};
        const index = indexOf(obj, 2);

        expect(index).to.eql(2);
    });

    it('should return -1 in case the item is found in the collection', () =>
    {
        const obj   = {x: 0, y: 1, z: 2};
        const index = indexOf(obj, 6);

        expect(index).to.eql(-1);
    });

    it('should return the index in case the item is found in the collection between a from and to key', () =>
    {
        const arr   = [5, 6, 2, 5, 8, 5];
        const index = indexOf(arr, 5, 1, 5);

        expect(index).to.eql(3);
    });
});
