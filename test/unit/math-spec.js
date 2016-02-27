define([
	'bottom_line'
], function(_) {

describe("math", function() {
	var PI2 = Math.PI*2;
	var PI = Math.PI;

	describe("byProb", function() {

		it("simple cases", function() {
			expect(_.math.byProb(0)).to.be.false;
			expect(_.math.byProb(1)).to.be.true;
		});

		it("should not crash :-)", function() {
			bool = _.math.byProb(0.6);
			isBoolean = bool === false || bool === true;
			expect(isBoolean).to.be.true;
		});

		it("should return false on no input", function() {
			expect(_.math.byProb()).to.be.false;
		});
	});

	describe("distance", function() {

		it("simple distance", function() {
			expect(_.math.distance(3, 5, -4, 6)).to.deep.equal(7.0710678118654755);
		});
	});

	describe("distanceSquared", function() {

		it("simple distanceSquared", function() {
			expect(_.math.distanceSquared(3, 5, -4, 6)).to.deep.equal(50);
		});
	});

	describe("max", function() {

		it("simple max", function() {
			expect(_.math.max(3, 5, -4, 8, 6)).to.deep.equal(8);
		});
	});

	describe("min", function() {

		it("simple min", function() {
			expect(_.math.min(3, 5, -4, 8, 6)).to.deep.equal(-4);
		});
	});

	describe("deg methods", function() {

		describe("convert", function() {

			it("simple conversions from radians to deg", function() {
				expect(_.math.deg.convert(PI2)).to.equal(360);
				expect(_.math.deg.convert(PI2/2)).to.equal(180);
				expect(_.math.deg.convert(PI2/4)).to.equal(90);
			});

			it("has an alias from", function() {
				expect(_.math.deg.from(PI2)).to.equal(360);
				expect(_.math.deg.from(PI2/2)).to.equal(180);
				expect(_.math.deg.from(PI2/4)).to.equal(90);
			});
		});

		describe("slope", function() {

			it("slope", function() {
				expect(_.math.deg.slope( 0,-1)).to.equal( -90);
				expect(_.math.deg.slope( 1,-1)).to.equal( -45);
				expect(_.math.deg.slope( 1, 0)).to.equal(   0);
				expect(_.math.deg.slope( 1, 1)).to.equal(  45);
				expect(_.math.deg.slope( 0, 1)).to.equal(  90);
				expect(_.math.deg.slope(-1, 1)).to.equal( 135);
				expect(_.math.deg.slope(-1, 0)).to.equal( 180);
				expect(_.math.deg.slope(-1,-1)).to.equal(-135);
			});
		});

		describe("invert", function() {

			it("should handle inversion of angles and prefer smaller angles", function() {
				expect(_.math.deg.invert( 360)).to.equal( 180);
				expect(_.math.deg.invert(-360)).to.equal(-180);
				expect(_.math.deg.invert(  90)).to.equal( 270);
				expect(_.math.deg.invert( -90)).to.equal(  90);
				expect(_.math.deg.invert( 180)).to.equal(   0);
				expect(_.math.deg.invert(-180)).to.equal(   0);
			});
		});

		describe("normalize", function() {

			it("should handle normalization of positive and negative angles ", function() {
				expect(_.math.deg.normalize(720)).to.equal(0);
				expect(_.math.deg.normalize(1170)).to.equal(90);
				expect(_.math.deg.normalize(-720)).to.equal(0);
				expect(_.math.deg.normalize(-1170)).to.equal(270);
			});
		});
	});

	describe("rad methods", function() {

		describe("convert", function() {

			it("simple conversions from radians to deg", function() {
				expect(_.math.rad.convert(360)).to.equal(PI2);
				expect(_.math.rad.convert(180)).to.equal(PI2/2);
				expect(_.math.rad.convert(90)).to.equal(PI2/4);
			});

			it("has an alias from", function() {
				expect(_.math.rad.from(360)).to.equal(PI2);
				expect(_.math.rad.from(180)).to.equal(PI2/2);
				expect(_.math.rad.from(90)).to.equal(PI2/4);
			});
		});

		describe("slope", function() {

			it("slope", function() {
				expect(_.math.rad.slope( 0,-1)).to.equal(-PI2/4);
				expect(_.math.rad.slope( 1,-1)).to.equal(-PI2/8);
				expect(_.math.rad.slope( 1, 0)).to.equal(   0);
				expect(_.math.rad.slope( 1, 1)).to.equal( PI2/8);
				expect(_.math.rad.slope( 0, 1)).to.equal( PI2/4);
				expect(_.math.rad.slope(-1, 1)).to.equal( 2.356194490192345);
				expect(_.math.rad.slope(-1, 0)).to.equal( PI2/2);
				expect(_.math.rad.slope(-1,-1)).to.equal(-2.356194490192345);
			});
		});

		describe("invert", function() {

			it("should handle inversion of angles and prefer smaller angles", function() {
				expect(_.math.rad.invert( PI2)).to.equal( PI);
				expect(_.math.rad.invert(-PI2)).to.equal(-PI);
				expect(_.math.rad.invert( PI2/4)).to.equal(4.71238898038469);
				expect(_.math.rad.invert(-PI2/4)).to.equal(PI2/4);
				expect(_.math.rad.invert( PI2/2)).to.equal(   0);
				expect(_.math.rad.invert(-PI2/2)).to.equal(   0);
			});
		});

		describe("normalize", function() {

			it("should handle normalization of positive and negative angles ", function() {
				expect(_.math.rad.normalize(2*PI2)).to.equal(0);
				expect(_.math.rad.normalize(4*PI2 + PI2/4)).to.equal(1.5707963267948983);
				expect(_.math.rad.normalize(-2*PI2)).to.equal(0);
				expect(_.math.rad.normalize(-4*PI2 - PI2/4)).to.equal(4.712388980384688);
			});
		});
	});
});
});