describe("Function", function() {

	describe("static methods", function() {

		describe("bind", function() {

			it("positive bind test", function() {
				function multiply(num1, num2) {
					return num1*num2;
				}

				var multiply6 = _.bind(6, multiply);

				expect(multiply6(6)).to.equal(36);
			});
		});
	});
});