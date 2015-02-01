_.extend(Function.prototype, {overwrite: false}, {
    name: function()
    {
        return this.toString().match(/^function\s?([^\s(]*)/)[1];
    }
});