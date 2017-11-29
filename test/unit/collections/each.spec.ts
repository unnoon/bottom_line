/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import each from '../../../src/collections/each';
import { expect } from '../test-utils.spec';

describe('collections/each', () =>
{
    it('should iterate object', () =>
    {
        const obj     = {x: 0, y: 1, z: 2};
        const entries = [];

        const result = each(obj, (value, key) => entries.push([key, value]));

        expect(result).to.eql(true);
        expect(entries).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should iterate any iterable', () =>
    {
        const str     = '123';
        const entries = [];

        const result = each(str, (value, key) => entries.push([key, value]));

        expect(result).to.eql(true);
        expect(entries).to.eql([[0, '1'], [1, '2'], [2, '3']]);
    });

    it('should break if the iteratee returns "false"', () =>
    {
        const str     = '123';
        const entries = [];

        const result = each(str, (value, key) =>
        {
            entries.push([key, value]);

            return key !== 1; // break after index 1
        });

        expect(result).to.eql(false);
        expect(entries).to.eql([[0, '1'], [1, '2']]);
    });

    it('should break at a certain to index', () =>
    {
        const str     = '123';
        const entries = [];

        const result = each(str, (value, key) => entries.push([key, value]), 0, 2);

        expect(result).to.eql(true);
        expect(entries).to.eql([[0, '1'], [1, '2']]);
    });

    it('should break at a certain to key', () =>
    {
        const map     = new Map();
        const keyZ    = {};
        map.set('x', 1).set('y', 2).set(keyZ, 3);
        const entries = [];

        const result = each(map, (value, key) => entries.push([key, value]), 'x', keyZ);

        expect(result).to.eql(true);
        expect(entries).to.eql([['x', 1], ['y', 2]]);
    });

    it('should iterate partly over infinite generators', () =>
    {
        function* fibonacci()
        {
            let i0 = 1;
            let i1 = 0;

            while ( true )
            {
                yield i0;
                [i0, i1] = [i0 + i1, i0];
            }
        }

        const fib = fibonacci();

        const entries = [];

        const result = each(fib, (value, key) => entries.push([key, value]), 2, 5);

        expect(result).to.eql(true);
        expect(entries).to.eql([[2, 2], [3, 3], [4, 5]]);
    });

    it('should iterate multidimensional arrays', () =>
    {
        const arr     = [[1, 2], [3, 4], [5, 6]];
        const entries = [];

        const result = each(arr, (value, key) => entries.push([key, value]));

        expect(result).to.eql(true);
        expect(entries).to.eql([[0, [1, 2]], [1, [3, 4]], [2, [5, 6]]]);
    });

});
