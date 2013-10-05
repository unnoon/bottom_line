describe("String", function() {

	describe("prototype methods", function() {

		describe("after", function() {

			it("positive after test", function() {
				expect('one.two'.$.after('.t')).to.eql('wo');
			});

			it("negative after test", function() {
				expect('one'.$.after('.t')).to.eql('');
			});
		});

		describe("capitalize", function() {

			it("positive testcases", function() {
				expect('hello'.$.capitalize()).to.eql('Hello');
				expect('Hello'.$.capitalize()).to.eql('Hello');
			});

			it("empty string", function() {
				var empty_str = '';

				empty_str.$.capitalize();
				expect(empty_str).to.eql('');
			});
		});

		describe("isUpperCase", function() {

			it("positive uppercase case", function() {
				expect('HF_GD123'.$.isUpperCase()).to.be.true;
			});
		});
	});
});