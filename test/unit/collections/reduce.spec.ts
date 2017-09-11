/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import reduce from '../../../src/collections/reduce';
import { expect } from '../test-utils.spec';

describe('reduce', () =>
{
    it('should reduce collections', () =>
    {
        const obj     = {x: 1, y: 2, z: 3};

        const result = reduce(obj, (accumulator, value) => accumulator + value, 1);

        expect(result).to.eql(7);
    });

    it('should take the first value as accumulator in case no one is given', () =>
    {
        const obj     = {x: 1, y: 2, z: 3};

        const result = reduce(obj, (accumulator, value) => accumulator + value);

        expect(result).to.eql(6);
    });

    it('should reduce collections from a certain index/key', () =>
    {
        const obj     = {x: 1, y: 2, z: 3};

        const result = reduce(obj, (accumulator, value) => accumulator + value, 0, 'y');

        expect(result).to.eql(5);
    });

    it('should reduce collections to a certain index/key', () =>
    {
        const obj     = {x: 1, y: 2, z: 3, zz: 6};

        const result = reduce(obj, (accumulator, value) => accumulator + value, 0, 'y', 'zz');

        expect(result).to.eql(5);
    });

});
