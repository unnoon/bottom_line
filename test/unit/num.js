describe("Number", function() {

	describe("static methods", function() {

		xdescribe("Number rebound", function() {

			it("number rebounds", function() {

			});
			it("negative number rebounds", function() {

			});
		});
	});

	describe("prototype methods", function() {

		describe("between", function() {

			it("simple", function() {
				expect((1).$.between(1, 6)).to.be.true;
				expect((3).$.between(1, 6)).to.be.true;
				expect((6).$.between(1, 6)).to.be.true;
			});

			it("negative statement", function() {
				expect((8).$.between(1, 6)).to.be.false;
				expect((-7).$.between(1, 6)).to.be.false;
			});
		});

		describe("odd", function() {

			it("simple", function() {
				expect((2).$.odd).to.be.false;
				expect((-2).$.odd).to.be.false;
				expect((-3).$.odd).to.be.true;
				expect((3).$.odd).to.be.true;
			});
		});
	});
});
