/**
 * Created by Rogier on 13/04/2017.
 */

/**
 * @function not
 * @desc
 *       Negates a given predicate.
 *
 * @param {any} predicate - Predicate to negate.
 *
 * @returns {boolean} - The negated predicate.
 */
export default function not(predicate: any): boolean
{
    return !predicate;
}
