describe("Number", function() {

	describe("static methods", function() {

		describe("random", function() {

			it("simple", function() {
				expect(_.random(2, 6)).to.be.at.least(2);
				expect(_.random(2, 6)).to.be.below(6);

				expect(_.random(-2, 6)).to.be.at.least(-2);
				expect(_.random(-2, 6)).to.be.below(6);

				expect(_.random(-6, 2)).to.be.at.least(-6);
				expect(_.random(-6, 2)).to.be.below(2);

				// inverted
				expect(_.random(6, 2)).to.be.at.least(2);
				expect(_.random(6, 2)).to.be.below(6);

				expect(_.random(6, -2)).to.be.at.least(-2);
				expect(_.random(6, -2)).to.be.below(6);

				expect(_.random(2, -6)).to.be.at.least(-6);
				expect(_.random(2, -6)).to.be.below(2);

				// equal
				expect(_.random(6, 6)).to.equal(0);
				expect(_.random(0, 0)).to.equal(0);

				// standard random
				expect(_.random()).to.be.at.least(0);
				expect(_.random()).to.be.below(1);

				// singular
				expect(_.random(6)).to.be.at.least(0);
				expect(_.random(6)).to.be.below(6);

				expect(_.random(-2)).to.be.at.least(-2);
				expect(_.random(-2)).to.be.below(0);
			});
		});

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
