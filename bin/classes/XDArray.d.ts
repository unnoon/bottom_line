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
     */
    static dimensionalize(arr: any[], dimensions: number[], init?: any | Value | ((position: number[], dimensions: number[]) => any), position?: number[]): void;
    /**
     * Creates a new XDArray based on a dimensions array and an optional initializer.
     *
     * @param dimensions - Array containing the dimensions.
     * @param init       - Value (shallow-cloned) or initializer function to initialize the array.
     */
    constructor(dimensions: number[], init?: any | Value | ((position: number[], dimensions: number[]) => any));
}
