describe("Array", function() {

	describe("static methods", function() {
		describe("concat: concatenates multiple arrays into 1 new array", function() {

			it("simple concatenation", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				expect(_.arr.concat(arr1, arr2)).to.deep.equal([1, 2, 3, 4, 5, 6]);
				expect(arr1).to.deep.equal([1, 2, 3]);
				expect(arr2).to.deep.equal([4, 5, 6]);
			});

			it("1st arg empty array", function() {
				var arr1 = [];
				var arr2 = [4, 5, 6];

				expect(_.arr.concat(arr1, arr2)).to.deep.equal([4, 5, 6]);
				expect(arr1).to.deep.equal([]);
				expect(arr2).to.deep.equal([4, 5, 6]);
			});

			it("2nd arg empty array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [];

				expect(_.arr.concat(arr1, arr2)).to.deep.equal([1, 2, 3]);
				expect(arr1).to.deep.equal([1, 2, 3]);
				expect(arr2).to.deep.equal([]);
			});

			it("single argument", function() {
				var arr1 = [1, 2, 3];

				expect(_.arr.concat(arr1)).to.deep.equal([1, 2, 3]);
				expect(arr1).to.deep.equal([1, 2, 3]);
			});

			it("no args", function() {
				expect(_.arr.concat()).to.deep.equal([]);
			});

			it("broken arrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				delete arr1[1];
				delete arr2[2];

				var testArr = [1, 2, 3, 4, 5, 6];
				delete testArr[1];
				delete testArr[5];

				expect(_.arr.concat(arr1, arr2)).to.deep.equal(testArr);
			});
		});
	});

	describe("prototype methods", function() {
		// TODO proper unit tests
		describe("converter", function() {

			it("convert to array", function() {
				expect(_.arr(4)).to.deep.equal([4]);
			});
		});

		describe("append", function() {

			it("append an array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				arr1._.append(arr2);

				expect(arr1).to.eql([1, 2, 3, 4, 5, 6]);
				expect(arr2).to.eql([4, 5, 6]);
			});

			it("append an broken front array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				delete arr2[0];

				var testArr = [1, 2, 3, 4, 5, 6];
				delete testArr[3];

				arr1._.append(arr2);

				expect(arr1).to.eql(testArr);
			});

			it("append an broken middle array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				delete arr2[1];

				var testArr = [1, 2, 3, 4, 5, 6];
				delete testArr[4];

				arr1._.append(arr2);

				expect(arr1).to.eql(testArr);
			});

			it("append an broken back array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				delete arr2[2];

				var testArr = [1, 2, 3, 4, 5, 6];
				delete testArr[5];

				arr1._.append(arr2);

				expect(arr1).to.eql(testArr);
			});

			it("handle undefined values", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [undefined, undefined, undefined];

				arr1._.append(arr2);

				expect(arr1).to.eql([1, 2, 3, undefined, undefined, undefined]);
			});

			it("no input", function() {
				var arr1 = [1, 2, 3];

				arr1._.append();

				expect(arr1).to.eql([1, 2, 3]);
			});

			it("multiple arrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];
				var arr3 = [7, 8, 9];

				delete arr2[2];

				var testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				delete testArr[5];

				arr1._.append(arr2, arr3);

				expect(arr1).to.eql(testArr);
			});
		});

		describe("$append", function() {

			it("$append an array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				expect(arr1._.$append(arr2)).to.eql([1, 2, 3, 4, 5, 6]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr2).to.eql([4, 5, 6]);
			});

			it("$append an broken front array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [];

				arr2[1] = 5;
				arr2[2] = 6;

				var testArr = [1, 2, 3];
				testArr[4] = 5;
				testArr[5] = 6;

				expect(arr1._.$append(arr2)).to.eql(testArr);
				expect(arr1).to.eql([1, 2, 3]);
			});
			// no further as this basically uses clone and the normal append
		});

		describe("avg: average of a umber based array", function() {

			it("avg", function() {
				var arr = [1, 2, 3];

				expect(arr._.avg()).to.eql(2);
			});

			it("not number array given", function() {
				var arr = [1, [], {}];

				expect(Number.isNaN(arr._.avg())).to.true;
			});

			it("length 1", function() {
				var arr = [1];

				expect(arr._.avg()).to.eql(1);
			});

			it("length 0", function() {
				expect([]._.avg()).to.be.undefined;
			});
		});

		describe("compact", function() {

			it("compact array", function() {
				var arr1 = [0, 1, '', false, 2, null, undefined, 3, NaN];

				expect(arr1._.compact()).to.eql([1, 2, 3]);
			});

			it("compact empty array", function() {
				expect([]._.compact()).to.eql([]);
			});
		});

		describe("$compact", function() {

			it("$compact array", function() {
				var arr1 = [0, 1, '', false, 2, null, undefined, 3, NaN];

				expect(arr1._.$compact()).to.eql([1, 2, 3]);
				// we cannot normally compare because NaN === NaN fails...
				expect(arr1[0]).to.eql(0);
				expect(arr1[1]).to.eql(1);
				expect(arr1[2]).to.eql('');
				expect(arr1[3]).to.eql(false);
				expect(arr1[4]).to.eql(2);
				expect(arr1[5]).to.eql(null);
				expect(arr1[6]).to.eql(undefined);
				expect(arr1[7]).to.eql(3);
				expect(Number.isNaN(arr1[8])).to.be.true;
			});


			it("compact empty array", function() {
				expect([]._.$compact()).to.eql([]);
			});
		});

		describe("copy", function() {

			it("copy value", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copy(arr2, 2)).to.eql([2, 5, 2]);
			});

			it("copy values", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copy(arr2, [2, 3])).to.eql([2, 5, 2, 3]);
			});

			it("copy function", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copy(arr2, function(val) {return val === 2})).to.eql([2, 5, 2]);
			});
		});

		describe("copyAll", function() {

			it("copyAll value", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copyAll(arr2, 2)).to.eql([2, 5, 2, 2]);
			});

			it("copyAll values", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copyAll(arr2, [2, 3])).to.eql([2, 5, 2, 3, 2]);
			});

			it("copyAll function", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copyAll(arr2, function(val) {return val === 2})).to.eql([2, 5, 2, 2]);

			});
		});

		describe("copyKeys", function() {

			it("copyKeys value", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copyKeys(arr2, 1)).to.eql([2, 5, 2]);
			});

			it("copyKeys values", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copyKeys(arr2, [1, 2])).to.eql([2, 5, 2, 3]);
			});

			it("copyKeys function", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.copyKeys(arr2, function(i) {return i > 1})).to.eql([2, 5, 3, 2]);

			});
		});

		describe("cut", function() {

			it("cut value", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cut(arr2, 2)).to.eql([2, 5, 2]);
				expect(arr1).to.eql([1, 3, 2]);
			});

			it("cut values", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cut(arr2, [2, 3])).to.eql([2, 5, 2, 3]);
				expect(arr1).to.eql([1, 2]);
			});

			it("cut function", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cut(arr2, function(val) {return val === 2})).to.eql([2, 5, 2]);
				expect(arr1).to.eql([1, 3, 2]);
			});
		});

		describe("cutAll", function() {

			it("cutAll value", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cutAll(arr2, 2)).to.eql([2, 5, 2, 2]);
				expect(arr1).to.eql([1, 3]);
			});

			it("cutAll values", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cutAll(arr2, [2, 3])).to.eql([2, 5, 2, 3, 2]);
				expect(arr1).to.eql([1]);
			});

			it("cutAll function", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cutAll(arr2, function(val) {return val === 2})).to.eql([2, 5, 2, 2]);
				expect(arr1).to.eql([1, 3]);

			});
		});

		describe("cutKeys", function() {

			it("cutKeys value", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cutKeys(arr2, 1)).to.eql([2, 5, 2]);
				expect(arr1).to.eql([1, 3, 2]);
			});

			it("cutKeys values", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cutKeys(arr2, [1, 2])).to.eql([2, 5, 2, 3]);
				expect(arr1).to.eql([1, 2]);
			});

			it("cutKeys function", function() {
				var arr1 = [1, 2, 3, 2];
				var arr2 = [2, 5];

				expect(arr1._.cutKeys(arr2, function(i) {return i > 1})).to.eql([2, 5, 3, 2]);
				expect(arr1).to.eql([1, 2]);

			});
		});

		describe("diff", function() {

			it("simple difference", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 5];

				expect(arr1._.diff(arr2)).to.eql([1, 3]);
			});
		});

		describe("$diff", function() {

			it("simple difference", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 5];

				expect(arr1._.$diff(arr2)).to.eql([1, 3]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("dimit", function() {

			it("2D array", function() {
				var arr = [2, 3]._.dimit(0);

				expect(arr).to.eql([
					[0,0,0],
					[0,0,0]
				]);
			});

			it("2D array: init undefined", function() {
				var arr = [2, 3]._.dimit();

				expect(arr).to.eql([
					[],
					[]
				]);
				expect(arr.length).to.eql(2);
				expect(arr[0].length).to.eql(3);
				expect(arr[1].length).to.eql(3);
			});
		});

		describe("each", function() {

			it("simple each", function() {
				var arr = [1, 2, 3];

				var sum = 0;

				arr._.each(function(elm) {
					sum += elm;
				});

				expect(sum).to.eql(6);
			});

			it("simple step each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				var sum = 0;

				arr._.each(2,function(elm) {
					sum += elm;
				});

				expect(sum).to.eql(9);
			});

			it("elastic step each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr._.each(function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 5, 6]);
			});

			it("elastic step 2 each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr._.each(2, function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 2, 4, 5, 6]);
			});

			it("simple negative step each", function() {
				var arr = [1, 2, 6];

				var div = 36;

				arr._.eachRight(1, function(elm) {
					div /= elm;
				});

				expect(div).to.eql(3);
			});

			it("elastic negative step each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr._.eachRight(1, function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 5, 6]);
			});

			it("elastic negative step 2 each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr._.eachRight(2, function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 3, 5, 6]);
			});

			it("broken arrays", function() {
				var arr = [];

				arr[4] = 3;
				arr[6] = 4;

				var sum   = 0;
				var count = 0;

				arr._.each(function(elm, i, arr) {
					sum += elm;
					count++;
				});

				expect(sum).to.eql(7);
				expect(count).to.eql(2);
			});

			it("broken arrays: can handle undefined as values", function() {
				var arr = [];

				arr[4] = 3;
				arr[6] = undefined;
				arr[8] = 4;

				var sum   = 0;
				var count = 0;

				arr._.each(function(elm, i, arr) {
					sum += elm;
					count++;
				});

				expect(Number.isNaN(sum)).to.be.true;
				expect(count).to.eql(3);
			});
		});

		describe("first: testting", function() {

			it("return first", function() {
				var arr = [1, 2, 3];

				expect(arr._.first()).to.eql(1);
			});

			it("set first", function() {
				var arr = [1, 2, 3];

				arr._.first('z');

				expect(arr._.first()).to.eql('z');
				expect(arr).to.eql(['z', 2, 3]);
			});

			it("complex first chain", function() {
				var arr = [[1, 2], 2, 3];

				arr._.append([4])._.first()._.without(2);

				expect(arr).to.eql([[1], 2, 3, 4]);
			});
		});

		describe("flatten", function() {

			it("1-dimensional flatten", function() {
				var arr1 = [[1, 2], 3, [4, 5]];

				arr1._.flatten();

				expect(arr1).to.eql([1, 2, 3, 4, 5]);
			});
		});

		describe("$flatten", function() {

			it("1-dimensional flatten", function() {
				var arr1 = [[1, 2], 3, [4, 5]];

				expect(arr1._.$flatten()).to.eql([1, 2, 3, 4, 5]);
				expect(arr1).to.eql([[1, 2], 3, [4, 5]]);
			});
		});

		describe("has", function() {

			it("contains functionality", function() {
				var arr1 = [[1, 2], 3, [4, 5]];

				expect(arr1._.has(3)).to.be.true;
			});
		});

		describe("insert", function() {

			it("insert beginning", function() {
				var arr = [1, 2, 3];

				arr._.insert(0, 0);

				expect(arr).to.eql([0, 1, 2, 3]);
			});

			it("insert end", function() {
				var arr = [1, 2, 3];

				arr._.insert(4, 3);

				expect(arr).to.eql([1, 2, 3, 4]);
			});

			it("insert middle", function() {
				var arr = [1, 2, 3];

				arr._.insert(1.5, 1);

				expect(arr).to.eql([1, 1.5, 2, 3]);
			});

			it("insert out of bounds -", function() {
				var arr = [1, 2, 3];

				arr._.insert(-1, -2);

				expect(arr).to.eql([1, -1, 2, 3]);
			});

			it("insert out of bounds", function() {
				var arr = [1, 2, 3];

				arr._.insert(5, 4);

				expect(arr).to.eql([1, 2, 3, 5]);
			});
		});

		describe("intersect", function() {

			it("intersection simple", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.intersect(arr2)).to.eql([2, 3]);
			});

			it("non intersecting arrrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5];

				expect(arr1._.intersect(arr2)).to.eql([]);
			});
		});

		describe("$intersect", function() {

			it("$intersection simple", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.$intersect(arr2)).to.eql([2, 3]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});

			it("non $intersecting arrrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5];

				expect(arr1._.$intersect(arr2)).to.eql([]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("intersects", function() {

			it("intersection simple", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.intersects(arr2)).to.be.true;
			});

			it("non intersecting arrrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5];

				expect(arr1._.intersects(arr2)).to.be.false;
			});
		});

		describe("modify", function() {

			it("modify ", function() {
				var arr = [1, 2, 3];

				arr._.modify(function(val) {
					return val + 'x';
				});

				expect(arr).to.eql(['1x', '2x', '3x']);
			});
		});

		describe("$modify", function() {

			it("$modify ", function() {
				var arr = [1, 2, 3];

				expect(arr._.$modify(function(val) {
					return val + 'x';
				})).to.eql(['1x', '2x', '3x']);
				expect(arr).to.eql([1, 2, 3]);
				expect(arr).to.equal(arr);
			});
		});

		describe("select by value", function() {

			it("select one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.select(1)).to.eql([1]);
				expect(arr).to.eql([1]);
			});

			it("select multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.select([1, 2])).to.eql([1, 2]);
				expect(arr).to.eql([1, 2]);
			});

			it("select by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.select(function(elm) {
					return elm === 2;
				})).to.eql([2]);
				expect(arr).to.eql([2]);
			});
		});

		describe("$select by value", function() {

			it("$select one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.$select(1)).to.eql([1]);
				expect(arr).to.equal(arr);
			});

			it("$select multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.$select([1, 2])).to.eql([1, 2]);
				expect(arr).to.equal(arr);
			});

			it("$select by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.$select(function(elm) {
					return elm === 2;
				})).to.eql([2]);
				expect(arr).to.equal(arr);
			});
		});

		describe("selectAll by value", function() {

			it("selectAll one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.selectAll(1)).to.eql([1, 1]);
				expect(arr).to.eql([1, 1]);
			});

			it("selectAll multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.selectAll([1, 2])).to.eql([1, 2, 1, 2]);
				expect(arr).to.eql([1, 2, 1, 2]);
			});

			it("selectAll by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.selectAll(function(elm) {
					return elm === 2;
				})).to.eql([2, 2]);
				expect(arr).to.eql([2, 2]);
			});
		});

		describe("$selectAll by value", function() {

			it("$selectAll one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.$selectAll(1)).to.eql([1, 1]);
				expect(arr).to.eql([1, 2, 1, 3]);
				expect(arr).to.equal(arr);
			});

			it("$selectAll multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.$selectAll([1, 2])).to.eql([1, 2, 1, 2]);
				expect(arr).to.eql([1, 2, 1, 3, 2]);
				expect(arr).to.equal(arr);
			});

			it("$selectAll by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.$selectAll(function(elm) {
					return elm === 2;
				})).to.eql([2, 2]);
				expect(arr).to.eql([1, 2, 1, 3, 2]);
				expect(arr).to.equal(arr);
			});
		});

		describe("selectKeys", function() {

			it("selectKeys one index", function() {
				var arr = [1, 2, 3];

				arr._.selectKeys(1);

				expect(arr).to.deep.equal([2]);
			});

			it("selectKeys from to index", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.selectKeys(1, 3);

				expect(arr).to.deep.equal([2, 3, 4]);
			});

			it("selectKeys from to index out of bounds", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.selectKeys(1, 6);

				expect(arr).to.deep.equal([2, 3, 4, 5]);
			});

			it("selectKeys indexes with function", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.selectKeys(function(i) {
					return i % 2 === 0;
				});

				expect(arr).to.eql([1, 3, 5]);
			});

			it("selectKeys indexes within array", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.selectKeys([0, 3, 4]);

				expect(arr).to.eql([1, 4, 5]);
			});
		});

		describe("$selectKeys", function() {

			it("$selectKeys one index", function() {
				var arr = [1, 2, 3];

				expect(arr._.$selectKeys(1)).to.deep.equal([2]);
				expect(arr).to.deep.equal([1, 2, 3]);
			});

			it("$selectKeys from to index", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$selectKeys(1, 3)).to.deep.equal([2, 3, 4]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("$selectKeys from to index out of bounds", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$selectKeys(1, 6)).to.deep.equal([2, 3, 4, 5]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("$selectKeys indexes with function", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$selectKeys(function(i) {
					return i % 2 === 0;
				})).to.eql([1, 3, 5]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("$selectKeys indexes within array", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$selectKeys([0, 3, 4])).to.eql([1, 4, 5]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});
		});

        describe("_toString", function() {

            it("simple _toString", function() {
                var arr1 = [1, 2, 3];

                expect(arr1._.toString()).to.eql('[1, 2, 3]');
            });

            it("multi dimensional _toString", function() {
                var arr1 = [[6, 6], [7, 7, [8]]];

                expect(arr1._.toString()).to.eql("[[6, 6], [7, 7, [8]]]");
            });
        });

		describe("unify", function() {

			it("simple union", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.unify(arr2)).to.eql([1, 2, 3, 4, 5]);
			});

			it("union of empty arrays", function() {
				var arr1 = [];
				var arr2 = [];

				expect(arr1._.unify(arr2)).to.eql([]);
			});
		});
        // FIXME
		xdescribe("$unify", function() {

			it("simple union", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.$unify(arr2)).to.eql([1, 2, 3, 4, 5]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("unique", function() {

			it("simple unique", function() {
				var arr1 = [1, 2, 1, 2, 3];

				expect(arr1._.unique()).to.eql([1, 2, 3]);
			});
		});

		describe("$unique", function() {

			it("simple $unique", function() {
				var arr1 = [1, 2, 1, 2, 3];

				expect(arr1._.$unique()).to.eql([1, 2, 3]);
				expect(arr1).to.eql([1, 2, 1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("without by value", function() {

			it("without one element", function() {
				var arr = [1, 2, 3];

				arr._.without(2);

				expect(arr).to.eql([1, 3]);
			});

			it("without multiple values", function() {
				var arr = [1, 2, 3, 4];

				arr._.without([2,4]);

				expect(arr).to.eql([1, 3]);
			});

			it("without function", function() {
				var arr = ['a', 'b', 'c', 'bb'];

				arr._.without(function(val) {
					return val._.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c', 'bb']);
			});
		});

		describe("$without by value", function() {

			it("$without one element", function() {
				var arr = [1, 2, 3];

				expect(arr._.$without(2)).to.eql([1, 3]);
				expect(arr).to.eql([1, 2, 3]);
			});

			it("$without multiple values", function() {
				var arr = [1, 2, 3, 4];

				expect(arr._.$without([2,4])).to.eql([1, 3]);
				expect(arr).to.eql([1, 2, 3, 4]);
			});

			it("$without function", function() {
				var arr = ['a', 'b', 'c', 'bb'];

				expect(arr._.$without(function(val) {
					return val._.startsWith('b');
				})).to.eql(['a', 'c', 'bb']);
				expect(arr).to.eql(['a', 'b', 'c', 'bb']);
			});
		});

		describe("without all by value", function() {

			it("without one element", function() {
				var arr = [1, 2, 1, 3];

				arr._.withoutAll(1);

				expect(arr).to.eql([2, 3]);
			});

			it("without one element", function() {
				var arr = [1, 2, 1, 3];

				arr._.withoutAll(function(val) {return val === 3});

				expect(arr).to.eql([1, 2, 1]);
			});

			it("without multiple values", function() {
				var arr = [1, 2, 3, 2, 4, 4];

				arr._.withoutAll([2,4]);

				expect(arr).to.eql([1, 3]);
			});

			it("without multiple function", function() {
				var arr = ['a', 'b', 'c', 'bb', 'bb'];

				arr._.withoutAll(function(val) {
					return val._.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c']);
			});
		});

		describe("$withoutAll by value", function() {

			it("$withoutAll one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.$withoutAll(1)).to.eql([2, 3]);
				expect(arr).to.eql([1, 2, 1, 3]);
			});

			it("$withoutAll multiple values", function() {
				var arr = [1, 2, 3, 2, 4, 4];

				expect(arr._.$withoutAll([2,4])).to.eql([1, 3]);
				expect(arr).to.eql([1, 2, 3, 2, 4, 4]);
			});

			it("$withoutAll multiple function", function() {
				var arr = ['a', 'b', 'c', 'bb', 'bb'];

				expect(arr._.$withoutAll(function(val) {return val._.startsWith('b')})).to.eql(['a', 'c']);
				expect(arr).to.eql(['a', 'b', 'c', 'bb', 'bb']);
			});
		});

		describe("withoutKeys", function() {

			it("withoutKeys one index", function() {
				var arr = [1, 2, 3];

				arr._.withoutKeys(1);

				expect(arr).to.deep.equal([1, 3]);
			});

			it("withoutKeys from to index", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.withoutKeys(1, 3);

				expect(arr).to.deep.equal([1, 5]);
			});

			it("withoutKeys from to index out of bounds", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.withoutKeys(1, 6);

				expect(arr).to.deep.equal([1]);
			});

			it("withoutKeys indexes with function", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.withoutKeys(function(i) {
					return i % 2 === 0;
				});

				expect(arr).to.eql([2, 4]);
			});

			it("withoutKeys indexes within array", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.withoutKeys([0, 3, 4]);

				expect(arr).to.eql([2, 3]);
			});
		});

		describe("$withoutKeys", function() {

			it("withoutKeys one index", function() {
				var arr = [1, 2, 3];

				expect(arr._.$withoutKeys(1)).to.deep.equal([1, 3]);
				expect(arr).to.deep.equal([1, 2, 3]);
			});

			it("$withoutKeys from to index", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$withoutKeys(1, 3)).to.deep.equal([1, 5]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("withoutKeys from to index out of bounds", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$withoutKeys(1, 6)).to.deep.equal([1]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("withoutKeys indexes with function", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$withoutKeys(function(i) {
					return i % 2 === 0;
				})).to.eql([2, 4]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("withoutKeys indexes within array", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.$withoutKeys([0, 3, 4])).to.eql([2, 3]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});
		});
	});
});