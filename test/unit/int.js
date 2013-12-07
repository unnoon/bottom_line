describe("Integer", function() {

	describe("static methods", function() {

		describe("Number rebound", function() {

			it("number rebounds", function() {
				expect(_.int.rebound(1)(0, 2)).to.eql(1);
				expect(_.int.rebound(2)(0, 2)).to.eql(2);
				expect(_.int.rebound(0)(0, 2)).to.eql(0);
				expect(_.int.rebound(3)(0, 2)).to.eql(0);
				expect(_.int.rebound(5)(0, 2)).to.eql(2);
				expect(_.int.rebound(6)(0, 2)).to.eql(0);
			});
			it("negative number rebounds", function() {
				// negatives
				expect(_.int.rebound(-1)(0, 2)).to.eql(2);
				expect(_.int.rebound(-2)(0, 2)).to.eql(1);
				expect(_.int.rebound(-3)(0, 2)).to.eql(0);

				expect(_.int.rebound(-1)(1, 2)).to.eql(2);
				expect(_.int.rebound(-2)(1, 2)).to.eql(1);
				expect(_.int.rebound(-3)(1, 2)).to.eql(2);
				//expect(_.int(-3).rebound(1, 2)).to.eql(2);
			});
		});
	});
});
