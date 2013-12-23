describe("math", function() {

	describe("static methods", function() {

		describe("angle", function() {

			xit("old angle", function() {
				expect(_.angle( 0, 1)).to.equal(0);
				expect(_.angle( 1, 1)).to.equal(45);
				expect(_.angle( 1, 0)).to.equal(90);
				expect(_.angle( 1,-1)).to.equal(135);
				expect(_.angle( 0,-1)).to.equal(180);
				expect(_.angle(-1,-1)).to.equal(225);
				expect(_.angle(-1, 0)).to.equal(270);
				expect(_.angle(-1, 1)).to.equal(315);
			});

			it("angle", function() {
				expect(_.angle( 0,-1)).to.equal(0);
				expect(_.angle( 1,-1)).to.equal(45);
				expect(_.angle( 1, 0)).to.equal(90);
				expect(_.angle( 1, 1)).to.equal(135);
				expect(_.angle( 0, 1)).to.equal(180);
				expect(_.angle(-1, 1)).to.equal(225);
				expect(_.angle(-1, 0)).to.equal(270);
				expect(_.angle(-1,-1)).to.equal(315);
			});

			it("angleSloped", function() {
				expect(_.angleSloped( 1, 0)).to.equal(  0);
				expect(_.angleSloped( 1,-1)).to.equal( 45);
				expect(_.angleSloped( 0,-1)).to.equal( 90);
				expect(_.angleSloped(-1,-1)).to.equal(135);
				expect(_.angleSloped(-1, 0)).to.equal(180);
				expect(_.angleSloped(-1, 1)).to.equal(225);
				expect(_.angleSloped( 0, 1)).to.equal(270);
				expect(_.angleSloped( 1, 1)).to.equal(315);
			});

//			it("angleCustom", function() {
//				expect(_.angleCustom( 0, 1)).to.equal(  0);
//				expect(_.angleCustom(-1, 1)).to.equal( 45);
//				expect(_.angleCustom(-1, 0)).to.equal( 90);
//				expect(_.angleCustom(-1,-1)).to.equal(135);
//				expect(_.angleCustom( 0,-1)).to.equal(180);
//				expect(_.angleCustom( 1,-1)).to.equal(225);
//				expect(_.angleCustom( 1, 0)).to.equal(270);
//				expect(_.angleCustom( 1, 1)).to.equal(315);
//			});

			it("reference atan2", function() {
				expect(_.rad2Deg(Math.atan2( 0, 1))).to.equal(0);  // huh? I would expect 90
				expect(_.rad2Deg(Math.atan2( 1, 1))).to.equal(45);
				expect(_.rad2Deg(Math.atan2( 1, 0))).to.equal(90);
				expect(_.rad2Deg(Math.atan2( 1,-1))).to.equal(135);
				expect(_.rad2Deg(Math.atan2( 0,-1))).to.equal(180);
				expect(_.rad2Deg(Math.atan2(-1,-1))).to.equal(-135);
				expect(_.rad2Deg(Math.atan2(-1, 0))).to.equal(-90);
				expect(_.rad2Deg(Math.atan2(-1, 1))).to.equal(-45);
			});
		});
	});
});