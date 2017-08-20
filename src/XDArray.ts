/**
 * Created by Rogier on 13/04/2017.
 */
import { clone } from 'lodash';
import is from './is';
import Value from './Value';

/**
 * @class  XDArray
 * @desc
 *         Array extension that supports initialized multi-dimensional arrays of any size.
 */
export default class XDArray extends Array
{
    /**
     * @method XDArray.dimensionalize
     * @desc
     *         Adds dimensions to a source array.
     *
     * @param {any[]}                                                                  arr           - Source array to add dimensions to.
     * @param {number[]}                                                               dimensions    - Array containing the dimensions.
     * @param {any | Value | function(position: number[], dimensions: number[]): any=} [init=null]   - Value (shallow-cloned) or initializer function to initialize the array. The Value wrapper can be used to force uncloneable values.
     * @param {number[]=}                                                              [position=[]] - Array containing the position of the source array in the root array.
     */
    public static dimensionalize(arr: any[], dimensions: number[], init: any|Value|((position: number[], dimensions: number[]) => any) = null, position: number[] = [])
    {
        const dim = dimensions[position.length];
        let   i   = 0;
        let   pos;

        for(; i < dim; i++)
        {
            pos = clone(position);
            pos.push(i);

            if(dimensions.length === pos.length)
            {
                switch(true)
                {
                    case init instanceof Function : arr[i] = init(pos, dimensions); break;
                    case init instanceof Value    : arr[i] = init.valueOf(); break;
                    default                       : arr[i] = clone(init);
                }
            }
            else
            {
                XDArray.dimensionalize(arr[i] = [], dimensions, init, pos); // add another dimension.
            }
        }
    }

    /**
     * @constructor XDArray
     * @desc
     *         Creates a new XDArray based on a dimensions array and an optional initializer.
     *
     * @param {number[]}                                                               dimensions  - Array containing the dimensions.
     * @param {any | Value | function(position: number[], dimensions: number[]): any=} [init=null] - Value (shallow-cloned) or initializer function to initialize the array.
     */
    constructor(dimensions: number[], init: any|Value|((position: number[], dimensions: number[]) => any) = null)
    {
        super();

        XDArray.dimensionalize(this, dimensions, init);
    }
}
