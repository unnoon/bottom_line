describe("String", function() {

	describe("prototype methods", function() {

		describe("after", function() {

			it("positive after test", function() {
				expect('one.two'._after('.t')).to.eql('wo');
			});

			it("negative after test", function() {
				expect('one'._after('.t')).to.eql('');
			});
		});

		describe("capitalize", function() {

			it("positive testcases", function() {
				expect('hello'._capitalize()).to.eql('Hello');
				expect('Hello'._capitalize()).to.eql('Hello');
			});

			it("empty string", function() {
				var empty_str = '';

				empty_str._capitalize();
				expect(empty_str).to.eql('');
			});
		});

		describe("isUpperCase", function() {

			it("positive uppercase case", function() {
				expect('HF_GD123'._isUpperCase()).to.be.true;
			});
		});
	});
});