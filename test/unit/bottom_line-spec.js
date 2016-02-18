define([
	'bottom_line'
], function(_) {

	describe("bottom_line.js", function() {

		describe("bottom line js", function() {

			it("singular", function() {
				var names    = ['bobby', 'jean'];
				var namesExt = names._.append(['xavier']);

				expect(namesExt).to.eql(['bobby', 'jean', 'xavier']);

				expect(names._.has('jean')).to.equal(true);
			});

			it("chaining", function() {
				var names = ['bobby', 'jean'];

				names._.chain
					.append(['xavier'])
					.remove('bobby');

				expect(names).to.eql(['jean', 'xavier']);
			});

			it("chaining different types", function() {
				var arr = [4,5,6,2];

				expect(arr._.chain
					.remove(2)
					.min()
					.bound(1, 3)
					.between(2,4)
					.value
				).to.be.true;
			});

			it("singular type chaining", function() {
				var arr = [4,5,6,2];

				expect(arr._.chain
					.min()
					.bound(-1, 1)
					.value
				).to.equal(1);
			});
		});

		describe("aliases", function() {

			it("has & contains aliases", function() {
				var arr1 = [[1, 2], 3, [4, 5]];

				expect(arr1._.has(3)).to.be.true;
				expect(arr1._.contains(3)).to.be.true;
			});
		});
	});
});