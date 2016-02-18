/* @ifdef TEST
 var shimOptions = {overwrite: true, onoverwrite: null, override: true, onoverride: null};
 /* @endif */
/* @ifndef TEST */
var shimOptions = {shim: true};
/* @endif */

extend(Function.prototype, shimOptions, {
    bind: function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    }
});

extend(Math, shimOptions, {
    /**
     * Decimal log function
     * @public
     * @method Math.log10
     * @param   {number} val - value to get the log10 from
     * @returns {number}     - angle in degrees
     */
    log10: function(val) {
        return Math.log(val)/Math.LN10;
    }
});

extend(Number, shimOptions, {
    /**
     * Check for isNaN conform the ES6 specs
     * @public
     * @method Number.isNaN
     * @param   {number} value - value to check is NaN for
     * @returns {boolean}      - boolean indicating if the value is NaN
     */
    isNaN: function(value) {
        return typeof value === "number" && value !== value;
    }
});