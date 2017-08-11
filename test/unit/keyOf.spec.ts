/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import keyOf from '../../src/keyOf';
import { expect } from './test-utils';

describe('keyOf', () =>
{
    it('should return the key in case the item is found in the collection', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const key = keyOf(obj, 2);

        expect(key).to.eql('z');
    });

    it('should return the undefined in case the item is found in the collection', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const key = keyOf(obj, 6);

        expect(key).to.eql(undefined);
    });

    it('should return the key in case the item is found in the collection between a from and to key', () =>
    {
        const arr = [5, 6, 2, 5, 8, 5];
        const key = keyOf(arr, 5, 1, 5);

        expect(key).to.eql(3);
    });
});
