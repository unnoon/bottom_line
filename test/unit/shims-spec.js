define([
    'bottom_line'
], function(_) {

        describe("Shims", function() {

            describe("bind", function() {

                it("should be possible to use a shimmed version of bind", function() {
                    "use strict";

                    var obj = {x: 555};
                    var fn  = (function(num) {return this.x+num}).bind(obj, 111);

                    expect(fn()).to.deep.equal(666);
                });

                it("should throw an error if it is called in a non callable context", function() {
                    "use strict";

                    function nonCallableBindCall() {
                        return Function.prototype.bind.call({});
                    }

                    expect(nonCallableBindCall).to.throw('Function.prototype.bind - what is trying to be bound is not callable');
                });
            });
    });
});