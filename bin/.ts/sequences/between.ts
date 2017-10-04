/**
 * Created by Rogier on 13/04/2017.
 */
import { Sequence } from '../types';

import leftOf  from './leftOf';
import rightOf from './rightOf';

/**
 * Returns the string between a prefix && post substring
 * @public
 * @method str#between
 * @param   {Sequence} seq  - substring to identify the return string
 * @param   {string} prefix  - substring to identify the return string
 * @param   {string} postfix - substring to identify the return string
 *
 * @returns {string}             - new string containing the string before the given substring
 */
// TODO handle non existence of pre or post substr
export default function between<T>(seq: Sequence<T>, prefix, postfix): Sequence<T>
{
    return leftOf(rightOf(seq, prefix), postfix);
}
