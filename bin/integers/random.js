/* tslint:disable:whitespace */
/**
 * Returns a random integer within the min and max value.
 *
 * @param min - Integer lower bound (inclusive).
 * @param max - Integer upper bound (exclusive).
 *
 * @returns Random integer in between the bounds (inclusive).
 */
export default function random(min, max) {
    min = min | 0;
    max = max | 0;
    return (min + ((Math.random() * (max - min)) | 0)) | 0;
}
//# sourceMappingURL=random.js.map