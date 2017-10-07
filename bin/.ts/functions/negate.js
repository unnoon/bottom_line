"use strict";
/**
 * Created by Rogier on 13/04/2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Return a function with negated output of the original function.
 *
 * @param fn - Function to negate.
 *
 * @returns The negated function.
 */
/* tslint:disable-next-line:ban-types */
function negate(fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return !fn.apply(this, args);
    };
}
exports.default = negate;
