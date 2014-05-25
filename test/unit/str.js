describe("String", function() {

	describe("prototype methods", function() {

		describe("after", function() {

			it("positive after test", function() {
				expect('one.two'.bl.after('.t')).to.eql('wo');
			});

			it("negative after test", function() {
				expect('one'.bl.after('.t')).to.eql('');
			});
		});

		describe("capitalize", function() {

			it("positive testcases", function() {
				expect('hello'.bl.capitalize()).to.eql('Hello');
				expect('Hello'.bl.capitalize()).to.eql('Hello');
			});

			it("empty string", function() {
				var empty_str = '';

				empty_str.bl.capitalize();
				expect(empty_str).to.eql('');
			});
		});

		describe("endsWith", function() {

			it("positive testcases", function() {
				expect('hello'.bl.endsWith('lo')).to.be.true;
			});

			it("neg case", function() {
				expect('hello'.bl.endsWith('dough')).to.be.false;
			});
		});

		describe("isUpperCase", function() {

			it("positive uppercase case", function() {
				expect('HF_GD123'.bl.isUpperCase()).to.be.true;
			});
		});
	});
});