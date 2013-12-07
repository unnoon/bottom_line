describe("Number", function() {

	describe("static methods", function() {

	});

	describe("prototype methods", function() {

		describe("between", function() {

			it("simple", function() {
				expect((1)._between(1, 6)).to.be.true;
				expect((3)._between(1, 6)).to.be.true;
				expect((6)._between(1, 6)).to.be.true;
			});

			it("negative statement", function() {
				expect((8)._between(1, 6)).to.be.false;
				expect((-7)._between(1, 6)).to.be.false;
			});
		});

		describe("odd", function() {

			it("simple", function() {
				expect((2)._odd).to.be.false;
				expect((-2)._odd).to.be.false;
				expect((-3)._odd).to.be.true;
				expect((3)._odd).to.be.true;
			});
		});
	});
});
