/* tslint:disable:whitespace */
/**
 * Returns a random integer within the min and max value.
 *
 * @param min - Integer lower bound (inclusive).
 * @param max - Integer upper bound (exclusive).
 *
 * @returns Random integer in between the bounds.
 */
export default function random(min: number, max: number)
{
    min = min|0; max = max|0;

    return (min + ((Math.random() * (max - min))|0))|0
}