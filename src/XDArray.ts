/**
 * Created by Rogier on 13/04/2017.
 */
import { clone } from 'lodash';
import Value from './Value';

/**
 * @class  XDArray
 * @desc
 *         Array extension that supports initialized multi-dimensional arrays of any size.
 *
 */
export default class XDArray extends Array
{
    public static dimensionalize(arr, dimensions, init, position = [])
    {
        const dim = dimensions[position.length];
        let   i   = 0;
        let   pos;

        for(; i < dim; i++)
        {
            pos = clone(position); pos.push(i);

            if(dimensions.length === pos.length)
            {
                arr[i] = init instanceof Function
                    ? init(pos, dimensions)
                    : clone((init instanceof Value) ? init.valueOf() : init);
            }
            else
            {
                XDArray.dimensionalize(arr[i] = [], dimensions, init, pos); // add another dimension. Tail call recursive YAY!
            }
        }
    }

    constructor(dimensions: number[], init: any|Value|((position: number[], dimensions: number[]) => any) = null)
    {
        super();

        XDArray.dimensionalize(this, dimensions, init);
    }
}
