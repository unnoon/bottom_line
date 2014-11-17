describe("String", function() {

	describe("prototype methods", function() {

		describe("after", function() {

			it("positive after test", function() {
				expect('one.two'._.after('.t')).to.eql('wo');
			});

			it("negative after test", function() {
				expect('one'._.after('.t')).to.eql('one');
			});
		});

		describe("capitalize", function() {

			it("positive testcases", function() {
				expect('hello'._.capitalize()).to.eql('Hello');
				expect('Hello'._.capitalize()).to.eql('Hello');
			});

			it("empty string", function() {
				var empty_str = '';

				empty_str._.capitalize();
				expect(empty_str).to.eql('');
			});
		});

		describe("endsWith", function() {

			it("positive testcases", function() {
				expect('hello'._.endsWith('lo')).to.be.true;
			});

			it("neg case", function() {
				expect('hello'._.endsWith('dough')).to.be.false;
			});
		});

		describe("isUpperCase", function() {

			it("positive uppercase case", function() {
				expect('HF_GD123'._.isUpperCase()).to.be.true;
			});
		});
	});
});