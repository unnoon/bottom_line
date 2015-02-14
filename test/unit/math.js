describe("math", function() {

	describe("static methods", function() {

		describe("angle", function() {

			xit("old angle", function() {
				expect(_.math.deg.angle( 0, 1)).to.equal(0);
				expect(_.math.deg.angle( 1, 1)).to.equal(45);
				expect(_.math.deg.angle( 1, 0)).to.equal(90);
				expect(_.math.deg.angle( 1,-1)).to.equal(135);
				expect(_.math.deg.angle( 0,-1)).to.equal(180);
				expect(_.math.deg.angle(-1,-1)).to.equal(225);
				expect(_.math.deg.angle(-1, 0)).to.equal(270);
				expect(_.math.deg.angle(-1, 1)).to.equal(315);
			});

			it("angle", function() {
				expect(_.math.deg.angle( 0,-1)).to.equal(0);
				expect(_.math.deg.angle( 1,-1)).to.equal(45);
				expect(_.math.deg.angle( 1, 0)).to.equal(90);
				expect(_.math.deg.angle( 1, 1)).to.equal(135);
				expect(_.math.deg.angle( 0, 1)).to.equal(180);
				expect(_.math.deg.angle(-1, 1)).to.equal(-135);
				expect(_.math.deg.angle(-1, 0)).to.equal(-90);
				expect(_.math.deg.angle(-1,-1)).to.equal(-45);
			});

			it("angleSloped", function() {
				expect(_.math.deg.angleSloped( 1, 0)).to.equal(  0);
				expect(_.math.deg.angleSloped( 1,-1)).to.equal( 45);
				expect(_.math.deg.angleSloped( 0,-1)).to.equal( 90);
				expect(_.math.deg.angleSloped(-1,-1)).to.equal(135);
				expect(_.math.deg.angleSloped(-1, 0)).to.equal(180);
				expect(_.math.deg.angleSloped(-1, 1)).to.equal(225);
				expect(_.math.deg.angleSloped( 0, 1)).to.equal(-90);
				expect(_.math.deg.angleSloped( 1, 1)).to.equal(-45);
			});

			it("reference atan2", function() {
				expect(_.math.deg.convert(Math.atan2( 0, 1))).to.equal(0);  // huh? I would expect 90
				expect(_.math.deg.convert(Math.atan2( 1, 1))).to.equal(45);
				expect(_.math.deg.convert(Math.atan2( 1, 0))).to.equal(90);
				expect(_.math.deg.convert(Math.atan2( 1,-1))).to.equal(135);
				expect(_.math.deg.convert(Math.atan2( 0,-1))).to.equal(180);
				expect(_.math.deg.convert(Math.atan2(-1,-1))).to.equal(-135);
				expect(_.math.deg.convert(Math.atan2(-1, 0))).to.equal(-90);
				expect(_.math.deg.convert(Math.atan2(-1, 1))).to.equal(-45);
			});
		});
	});
});