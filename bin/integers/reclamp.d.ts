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
export default function reclamp(int: any): (min: any, max: any) => any;
