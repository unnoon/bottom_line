define([
	'bottom_line'
], function(_) {

	describe("Function", function() {

	describe("static methods", function() {

		describe("bind", function() {

			it("simple context test", function() {
				function getX() {
					return this.x;
				}

				var obj = {
					x: 666
				};

				var getXBonded = _.bind(getX, obj);

				expect(getXBonded()).to.equal(666);
			});

			it("positive bind test", function() {
				function multiply(num1, num2) {
					return num1*num2;
				}

				var multiply6 = _.fnc.bind([6], multiply);

				expect(multiply6(6)).to.equal(36);
			});

			it("positive bind test", function() {
				function concat(s1, s2, s3, s4, s5, s6) {
					return s1+s2+s3+s4+s5+s6;
				}

				var concat3 = _.fnc.bind(['1', undefined, '3', undefined, '5', undefined], concat);

				expect(concat3('2', '4', '6')).to.equal('123456');
			});
		});
	});
});
});