extend(Function.prototype, {overwrite: false}, {
    /**
     * Returns the name of a function
     * @public
     * @method Function#name
     * @returns {string} - name of the functino
     */
    name: function()
    {
        return this.toString().match(/^function\s?([^\s(]*)/)[1];
    }
});

extend(Math, {overwrite: false}, {
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