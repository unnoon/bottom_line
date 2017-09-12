/* tslint:disable:no-unused-expression max-classes-per-file no-console no-shadowed-variable*/
import reduce from '../../../src/collections/reduce';
import Value from '../../../src/classes/Value';
import XDArray from '../../../src/classes/XDArray';
import { expect } from '../test-utils.spec';

describe('classes/XDArray', () =>
{
    it('should initialize a multi-dimensional array using an init function', () =>
    {
        const xdarray = new XDArray([3, 2, 4], (pos, dimensions) =>
        {   // calculate the index
            const index = reduce(pos, (acc, val, i) => acc + (val / dimensions[i]) * reduce(dimensions, (acc, val, j) => acc * dimensions[j], 1, i), 1);

            return index;
        });

        expect(xdarray[1][0][2]).to.eql(11);
    });

    it('should initialize a multi-dimensional array using an init value (shallow-cloned)', () =>
    {
        const init    = {x: 1};
        const xdarray = new XDArray([3, 2, 4], init);

        expect(xdarray[1][0][2]).to.eql({x: 1});
        expect(xdarray[1][0][2] === init).to.be.false;
    });

    it('should initialize a multi-dimensional array using an Value wrapped uncloneable', () =>
    {
        const fnValue = () => 3;
        const init    = Value.of(fnValue);
        const xdarray = new XDArray([3, 2, 4], init);

        expect(xdarray[1][0][2]()).to.eql(3);
    });

});
