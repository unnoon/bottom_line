describe("Array", function() {

	describe("static methods", function() {

		describe("intersection", function() {

			it("intersection simple", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(_.arr.intersection(arr1, arr2)).to.eql(['b', 'c']);
			});

			it("non intersecting arrrays", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['d', 'e'];

				expect(_.arr.intersection(arr1, arr2)).to.eql([]);
			});
		});

		describe("union", function() {

			it("simple union", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(_.arr.union(arr1, arr2)).to.eql(['a', 'b', 'c', 'd', 'e']);
			});

			it("union of empty arrays", function() {
				var arr1 = [];
				var arr2 = [];

				expect(_.arr.union(arr1, arr2)).to.eql([]);
			});
		});

		describe("diff", function() {

			it("simple difference", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'e'];

				expect(_.arr.diff(arr1, arr2)).to.eql(['a', 'c']);
			});
		});
	});

	describe("prototype methods", function() {
		describe("converter", function() {

			it("convert to array", function() {
				expect(_.arr(4)).to.deep.equal([4]);
			});
		});

		describe("append", function() {

			it("append an array", function() {
				var arr = ['a', 'b', 'c'];

				arr.$.append(['d', 'e']);

				expect(arr).to.eql(['a', 'b', 'c', 'd', 'e']);
			});
		});

		describe("delete", function() {

			it("delete one index", function() {
				var arr = ['a', 'b', 'c'];

				arr.$.delete(1);

				expect(arr).to.deep.equal(['a', 'c']);
			});

			it("delete from to index", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.$.delete(1, 3);

				expect(arr).to.deep.equal(['a', 'e']);
			});

			it("delete from to index out of bounds", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.$.delete(1, 6);

				expect(arr).to.deep.equal(['a']);
			});

			it("delete indexes with function", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.$.delete(function(i) {
					return i % 2 === 0;
				});

				expect(arr).to.eql(['b', 'd']);
			});

			it("delete indexes within array", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.$.delete([0, 3, 4]);

				expect(arr).to.eql(['b', 'c']);
			});
		});

		describe("remove by value", function() {

			it("remove one element", function() {
				var arr = ['a', 'b', 'c'];

				arr.$.remove('a');

				expect(arr).to.eql(['b', 'c']);
			});

			it("remove multiple values", function() {
				var arr = ['a', 'b', 'c', 'd'];

				arr.$.remove(['b','d']);

				expect(arr).to.eql(['a', 'c']);
			});

			it("remove multiple values", function() {
				var arr = ['a', 'b', 'c', 'd', 'bb'];

				arr.$.remove(function(val) {
					return val.$.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c', 'd', 'bb']);
			});
		});

		describe("remove all by value", function() {

			it("remove one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				arr.$.removeAll('a');

				expect(arr).to.eql(['b', 'c']);
			});

			it("remove multiple values", function() {
				var arr = ['a', 'b', 'c', 'b', 'd', 'd'];

				arr.$.removeAll(['b','d']);

				expect(arr).to.eql(['a', 'c']);
			});

			it("remove multiple values", function() {
				var arr = ['a', 'b', 'c', 'd', 'bb', 'bb'];

				arr.$.removeAll(function(val) {
					return val.$.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c', 'd']);
			});
		});

		describe("first: testting", function() {

			it("return first", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.$.first()).to.eql('a');
			});

			it("set first", function() {
				var arr = ['a', 'b', 'c'];

				arr.$.first('z');

				expect(arr.$.first()).to.eql('z');
				expect(arr).to.eql(['z', 'b', 'c']);
			});

			it("complex first chain", function() {
				var arr = [['a', 'b'], 'b', 'c'];

				arr.$$.append(['d']).first().remove('b');

				expect(arr).to.eql([['a'], 'b', 'c', 'd']);
			});
		});

		describe("insert", function() {

			it("insert beginning", function() {
				var arr = [1, 2, 3];

				arr.$.insert(0, 0);

				expect(arr).to.eql([0, 1, 2, 3]);
			});

			it("insert end", function() {
				var arr = [1, 2, 3];

				arr.$.insert(4, 3);

				expect(arr).to.eql([1, 2, 3, 4]);
			});

			it("insert middle", function() {
				var arr = [1, 2, 3];

				arr.$.insert(1.5, 1);

				expect(arr).to.eql([1, 1.5, 2, 3]);
			});

			it("insert out of bounds -", function() {
				var arr = [1, 2, 3];

				arr.$.insert(-1, -2);

				expect(arr).to.eql([1, -1, 2, 3]);
			});

			it("insert out of bounds", function() {
				var arr = [1, 2, 3];

				arr.$.insert(5, 4);

				expect(arr).to.eql([1, 2, 3, 5]);
			});
		});
	});

	describe("each", function() {

		it("simple each", function() {
			var arr = [1, 2, 3];

			var sum = 0;

			arr.$.each(function(elm) {
				sum += elm;
			});

			expect(sum).to.eql(6);
		});

		it("simple step each", function() {
			var arr = [1, 2, 3, 4, 5, 6];

			var sum = 0;

			arr.$.each(2,function(elm) {
				sum += elm;
			});

			expect(sum).to.eql(9);
		});

		it("elastic step each", function() {
			var arr = [1, 2, 3, 4, 5, 6];

			arr.$.each(function(elm, i, arr) {
				if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
			});

			expect(arr).to.eql([1, 5, 6]);
		});

		it("elastic step 2 each", function() {
			var arr = [1, 2, 3, 4, 5, 6];

			arr.$.each(2, function(elm, i, arr) {
				if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
			});

			expect(arr).to.eql([1, 2, 4, 5, 6]);
		});

		it("simple negative step each", function() {
			var arr = [1, 2, 6];

			var div = 36;

			arr.$.each(-1, function(elm) {
				div /= elm;
			});

			expect(div).to.eql(3);
		});

		it("elastic negative step each", function() {
			var arr = [1, 2, 3, 4, 5, 6];

			arr.$.each(-1, function(elm, i, arr) {
				if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
			});

			expect(arr).to.eql([1, 5, 6]);
		});

		it("elastic negative step 2 each", function() {
			var arr = [1, 2, 3, 4, 5, 6];

			arr.$.each(-2, function(elm, i, arr) {
				if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
			});

			expect(arr).to.eql([1, 3, 5, 6]);
		});
	});
});