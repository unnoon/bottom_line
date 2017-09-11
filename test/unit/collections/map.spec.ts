/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import map from '../../../src/collections/map';
import { expect } from '../test-utils.spec';

describe('map', () =>
{
    it('should map any iterable including objects', () =>
    {
        const obj = {x: 0, y: 1, z: 2};
        const m = map(obj, (value) => value * value);

        expect(obj).to.eql(obj);
        expect(m).to.eql([0, 1, 4]);
    });

    it('should map any iterable between two keys', () =>
    {
        const arr = [5, 4, 2, 4, 3, 2, 1, 1];
        const m = map(arr, (value) => value * value, 2, 4);

        expect(arr).to.eql(arr);
        expect(m).to.eql([4, 16]);
    });
});
