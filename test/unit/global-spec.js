define([
    'bottom_line'
], function(_) {

        describe("Global", function() {

    describe("static methods", function() {

        describe("isFunction", function() {

            it("simple", function() {
                expect(_.isFunction(function(){})).to.be.true;
                expect(_.isFunction({})).to.be.false;
            });

            it("not", function() {
                expect(_.not.isFunction(function(){})).to.be.false;
                expect(_.not.isFunction({})).to.be.true;
            });
        });

    });
});
});
