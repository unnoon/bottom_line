"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Rogier on 13/04/2017.
 */
var KeyedIterator_1 = require("../classes/KeyedIterator");
var negate_1 = require("../functions/negate");
var not = {};
var is = {
    /**
     * Returns a boolean indicating if a value is an array.
     *
     * @param value - Value to identify as an array.
     *
     * @returns Boolean indicating if the value is an array.
     */
    array: Array.isArray,
    /**
     * returns true if a value is cloneable according to the structured clone algorithm.
     *
     * @param value - Value to check for cloneability.
     *
     * @returns Boolean indicating if the value is cloneable.
     */
    cloneable: function (value) {
        return !(value instanceof Function
            || value instanceof Error
            || value instanceof WeakMap
            || value instanceof HTMLElement
            || typeof (value) === 'symbol');
    },
    /**
     * Returns a boolean indicating if a collection is empty.
     *
     * @param collection - Collection to check.
     *
     * @returns Boolean indicating if the collection is empty.
     */
    empty: function (collection) {
        return KeyedIterator_1.default.create(collection).next().done;
    },
    /**
     * Returns a boolean indicating if an object is iterable.
     *
     * @param obj - Object to check iterability for.
     *
     * @returns Boolean indicating if the obj is iterable.
     */
    iterable: function (obj) {
        return obj !== null && obj !== undefined && typeof (obj[Symbol.iterator]) === 'function';
    },
    /**
     * Returns a boolean indicating if a value is NaN.
     *
     * @param value - Value to be identified as NaN.
     *
     * @returns Boolean indicating if the value is NaN.
     */
    nan: function (value) {
        return Object.is(value, NaN);
    },
    /**
     * Contains negated versions of functions.
     */
    not: not,
    /**
     * Returns a boolean indicating if a value is null.
     *
     * @param value - Value to be identified as null.
     *
     * @returns Boolean indicating if the value is null.
     */
    null: function (value) {
        return value === null;
    },
    /**
     * Returns a boolean indicating if a value is number.
     *
     * @param value - Value to be identified as a number.
     *
     * @returns Boolean indicating if the value is number.
     */
    number: function (value) {
        return typeof (value) === 'number';
    },
    /**
     * Returns a boolean indicating if a value is string.
     *
     * @param value - Value to be identified as a string.
     *
     * @returns Boolean indicating if the value is string.
     */
    string: function (value) {
        return typeof (value) === 'string';
    },
    /**
     * Returns a boolean indicating if a the value is a symbol.
     *
     * @param value - Value to identify as symbol.
     *
     * @returns Boolean indicating if value is a symbol.
     */
    symbol: function (value) {
        return typeof (value) === 'symbol';
    },
    /**
     * Returns a boolean indicating if a value is undefined.
     *
     * @param {any} value - Value test if undefined.
     *
     * @returns Boolean indicating if the value is undefined.
     */
    undefined: function (value) {
        return value === undefined;
    },
};
is.not = {
    array: negate_1.default(is.array),
    cloneable: negate_1.default(is.cloneable),
    empty: negate_1.default(is.empty),
    iterable: negate_1.default(is.iterable),
    nan: negate_1.default(is.nan),
    null: negate_1.default(is.null),
    number: negate_1.default(is.number),
    string: negate_1.default(is.string),
    symbol: negate_1.default(is.symbol),
    undefined: negate_1.default(is.undefined),
};
exports.default = is;
