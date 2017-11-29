/**
 * Created by Rogier on 13/04/2017.
 */
import { clone } from 'lodash';
import Value from './Value';
/**
 * Array extension that supports (initialized) multi-dimensional arrays of any size.
 */
export default class XDArray extends Array {
    /**
     * Adds dimensions to a source array.
     *
     * @param arr        - Source array to add dimensions to.
     * @param dimensions - Array containing the dimensions.
     * @param init       - Value (shallow-cloned) or initializer function to initialize the array. The Value wrapper can be used to force uncloneable values.
     * @param position   - Array containing the position of the source array in the root array.
     *
     * @returns dimensionalized input arr.
     */
    static dimensionalize(arr, dimensions, init = null, position = []) {
        const dim = dimensions[position.length];
        let i = 0;
        let pos;
        for (; i < dim; i++) {
            pos = [...position, i];
            if (dimensions.length === pos.length) {
                switch (true) {
                    case init instanceof Function:
                        arr[i] = init(pos, dimensions);
                        break;
                    case init instanceof Value:
                        arr[i] = init.valueOf();
                        break; // pass through value as is i.e uncloneables such as functions.
                    default: arr[i] = clone(init);
                }
            }
            else {
                XDArray.dimensionalize(arr[i] = [], dimensions, init, pos); // add another dimension.
            }
        }
        return arr;
    }
    /**
     * Creates a new XDArray based on a dimensions array and an optional initializer.
     *
     * @param dimensions - Array containing the dimensions.
     * @param init       - Value (shallow-cloned) or initializer function to initialize the array.
     */
    constructor(dimensions, init = null) {
        super();
        XDArray.dimensionalize(this, dimensions, init);
    }
}
//# sourceMappingURL=XDArray.js.map