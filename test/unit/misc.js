function asyncFunction(cb) {
    setTimeout(function() {
        cb("super strange error message shown");
    }, 1999)
}

xdescribe("Misc", function() {

	describe("async", function() {

        it("simple", function(done) {
            setTimeout(function() {
                assert.equal(false, true);
                done();
            }, 50)
        });

        it("async nested", function(done) {
            asyncFunction(function(err) {
//                assert.equal(false, true, "false is not true?!?!");
                assert.isNull(err, err);
//                expect(true).to.be.false;

                expect(false).to.be.true;
                done();
            })
        });
	});
});