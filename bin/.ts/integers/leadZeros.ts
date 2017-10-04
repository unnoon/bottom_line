import * as is from '../lang/is'
import length  from './length';

/**
 * Returns a string representation of an integer including leading zero's depending on a length or format
 *
 * @public
 * @method int.leadZeros
 *
 * @param   {number}        int           - integer to measure the length
 * @param   {string|number} format_length - format for the lead zero's for example '0000' or a number defining the length
 *
 * @returns {string} - string with leading zero's
 */
export default function leadZeros(int, format_length)
{
    const len = is.string(format_length) ? format_length.length : format_length;

    int = (length(int) > len) ? Math.pow(10, len) - 1 : int;

    return (int / Math.pow(10, len)).toFixed(len).substr(2);
}
