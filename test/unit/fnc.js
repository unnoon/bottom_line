describe("Function", function() {

	describe("static methods", function() {

		describe("strap", function() {

			it("positive strap test", function() {
				function multiply(num1, num2) {
					return num1*num2;
				}

				var multiply6 = _.strap(6, multiply);

				expect(multiply6(6)).to.equal(36);
			});
		});
	});
});