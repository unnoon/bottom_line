/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import reduce from '../../src/reduce';
import XDArray from '../../src/XDArray';
import { expect } from './test-utils';

describe('XDArray', () =>
{
    it('should initialize a multi-dimensional array', () =>
    {
        const xdarray = new XDArray([3, 2, 4], (pos, dimensions) =>
        {   // calculate the index
            const index = reduce(pos, (acc, val, i) => acc + (val / dimensions[i]) * reduce(dimensions, (acc, val, j) => acc * dimensions[j], 1, i), 1);

            return index;
        });

        expect(xdarray[1][0][2]).to.eql(11);
    });
});
