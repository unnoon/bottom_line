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

		describe("int length", function() {

			it("int length", function() {
				expect(_.int.length(0)).to.eql(1);
				expect(_.int.length(5)).to.eql(1);
				expect(_.int.length(6)).to.eql(1);
				expect(_.int.length(9)).to.eql(1);
				expect(_.int.length(10)).to.eql(2);
				expect(_.int.length(50)).to.eql(2);
				expect(_.int.length(51)).to.eql(2);
				expect(_.int.length(99)).to.eql(2);
				expect(_.int.length(100)).to.eql(3);
				expect(_.int.length(500)).to.eql(3);
				expect(_.int.length(501)).to.eql(3);
				expect(_.int.length(999)).to.eql(3);
				expect(_.int.length(6424615)).to.eql(7);
				expect(_.int.length(999554329)).to.eql(9);
			});
		});

		describe("int leadZeros", function() {

			it("int leadZeros", function() {
				expect(_.int.leadZeros(0, 6)).to.eql('000000');
				expect(_.int.leadZeros(5, 6)).to.eql('000005');
				expect(_.int.leadZeros(6, 6)).to.eql('000006');
				expect(_.int.leadZeros(9, 9)).to.eql('000000009');
				expect(_.int.leadZeros(10, 4)).to.eql('0010');
				expect(_.int.leadZeros(50, 3)).to.eql('050');
				expect(_.int.leadZeros(51, 10)).to.eql('0000000051');
				expect(_.int.leadZeros(99, 7)).to.eql('0000099');
				expect(_.int.leadZeros(100, 2)).to.eql('00');

			});
		});
	});
});
