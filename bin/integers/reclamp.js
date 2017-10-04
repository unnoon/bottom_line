/**
 * Rebounds a number between 2 values. Handy for arrays that are continuous
 * Curried version: for example - _.int.rebound(4)(-5, 7)
 *
 * @public
 * @method int.rebound
 *
 * @param   {number}  int - integer value
 *
 * @returns {function} - function to add the range
 */
export default function reclamp(int) {
    /**
     * Range function return by rebound
     * @private
     * @param   {number}  min - minimum value
     * @param   {number}  max - maximum value
     * @returns {boolean} - rebounded version of the number that falls between the 2 values
     */
    return function range(min, max) {
        const overflow = int % (Math.abs(max - min) + 1);
        return ((overflow < 0) ? max + 1 : min) + overflow;
    };
}
//# sourceMappingURL=reclamp.js.map