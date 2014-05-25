describe("Number", function() {

	describe("static methods", function() {

	});

	describe("prototype methods", function() {

		describe("between", function() {

			it("simple", function() {
				expect((1)._.between(1, 6)).to.be.true;
				expect((3)._.between(1, 6)).to.be.true;
				expect((6)._.between(1, 6)).to.be.true;
			});

			it("negative statement", function() {
				expect((8)._.between(1, 6)).to.be.false;
				expect((-7)._.between(1, 6)).to.be.false;
			});
		});

		describe("odd", function() {

			it("simple", function() {
				expect((2)._.odd).to.be.false;
				expect((-2)._.odd).to.be.false;
				expect((-3)._.odd).to.be.true;
				expect((3)._.odd).to.be.true;
			});
		});
	});
});
