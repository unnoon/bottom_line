/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import each from '../../src/each';
import { expect } from './test-utils';

describe('each', () =>
{
    it('should iterate object', () =>
    {
        const obj     = {x: 0, y: 1, z: 2};
        const entries = [];

        const result = each(obj, (value, key) => entries.push([key, value]));

        expect(result).to.eql(obj);
        expect(entries).to.eql([['x', 0], ['y', 1], ['z', 2]]);
    });

    it('should iterate any iterable', () =>
    {
        const str     = '123';
        const entries = [];

        const result = each(str, (value, key) => entries.push([key, value]));

        expect(result).to.eql(str);
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

        expect(result).to.eql(str);
        expect(entries).to.eql([[0, '1'], [1, '2']]);
    });

    it('should break at a certain to index', () =>
    {
        const str     = '123';
        const entries = [];

        const result = each(str, (value, key) => entries.push([key, value]), 0, 2);

        expect(result).to.eql(str);
        expect(entries).to.eql([[0, '1'], [1, '2']]);
    });

    it('should break at a certain to key', () =>
    {
        const map     = new Map();
        const keyZ    = {};
        map.set('x', 1).set('y', 2).set(keyZ, 3);
        const entries = [];

        const result = each(map, (value, key) => entries.push([key, value]), 0, keyZ);

        expect(result).to.eql(map);
        expect(entries).to.eql([['x', 1], ['y', 2]]);
    });
});
