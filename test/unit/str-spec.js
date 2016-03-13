define([
	'bottom_line'
], function(_) {

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

			describe("format", function() {

				it("simple format", function() {
					expect('{0} is dead, but {1} is alive! {0} {2}'._.format('ASP', 'ASP.NET')).to.deep.equal('ASP is dead, but ASP.NET is alive! ASP {2}');
				});
			});

			describe("isUpperCase", function() {

				it("positive uppercase case", function() {
					expect('HF_GD123'._.isUpperCase()).to.be.true;
				});
			});

			describe("between", function() {

				it("positive testcase", function() {
					expect('12[345]67'._.between('[', ']')).to.eql('345');
				});
			});
		});
	});
});