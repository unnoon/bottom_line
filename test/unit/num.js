/*
	describe("Number", function() {

		describe("prototype methods", function() {

			describe("Number rebound", function() {

				it("number rebounds", function() {
					expect(__int.rebound(1)(0, 2)).to.eql(1);
					expect(__int.rebound(2)(0, 2)).to.eql(2);
					expect(__int.rebound(0)(0, 2)).to.eql(0);
					expect(__int.rebound(3)(0, 2)).to.eql(0);
					expect(__int.rebound(5)(0, 2)).to.eql(2);
					expect(__int.rebound(6)(0, 2)).to.eql(0);
				});
				it("negative number rebounds", function() {
					// negatives
					expect(__int.rebound(-1)(0, 2)).to.eql(2);
					expect(__int.rebound(-2)(0, 2)).to.eql(1);
					expect(__int.rebound(-3)(0, 2)).to.eql(0);

					expect(__int.rebound(-1)(1, 2)).to.eql(2);
					expect(__int.rebound(-2)(1, 2)).to.eql(1);
					expect(__int.rebound(-3)(1, 2)).to.eql(2);
			      //expect(__int(-3).rebound(1, 2)).to.eql(2);
				});
			});
		});
	});
*/