/**
 * Created by Rogier on 13/04/2017.
 */
/**
 * Cancels a delayed function based on the returned identifier.
 *
 * @param id - The delayed function identifier.
 */
/* tslint:disable-next-line:ban-types */
export default function cancelDelay(id) {
    clearTimeout(id);
}
//# sourceMappingURL=cancelDelay.js.map