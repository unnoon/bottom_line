define([
    'bottom_line'
], function(_) {

        describe("Shims", function() {

        describe("bind", function() {
            beforeEach(function() {
                sinon.stub(console, 'log');
            });

            it("should be possible to use a shimmed version of bind", function() {
                "use strict";

                var obj = {x: 555};
                var fn  = (function(num) {return this.x+num}).bind(obj, 111);

                console.log("test");
                expect(fn()).to.deep.equal(666);
                expect(console.log.calledWith('test') ).to.be.true;
            })
        });
    });
});