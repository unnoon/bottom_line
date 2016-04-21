define([
	'bottom_line'
], function(_) {

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
				expect(_.toArray(4)).to.deep.equal([]);
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

		describe("Append", function() {

			it("Append an array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5, 6];

				expect(arr1._.Append(arr2)).to.eql([1, 2, 3, 4, 5, 6]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr2).to.eql([4, 5, 6]);
			});

			it("Append an broken front array", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [];

				arr2[1] = 5;
				arr2[2] = 6;

				var testArr = [1, 2, 3];
				testArr[4] = 5;
				testArr[5] = 6;

				expect(arr1._.Append(arr2)).to.eql(testArr);
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

		describe("Compact", function() {

			it("Compact array", function() {
				var arr1 = [0, 1, '', false, 2, null, undefined, 3, NaN];

				expect(arr1._.Compact()).to.eql([1, 2, 3]);
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
				expect([]._.Compact()).to.eql([]);
			});
		});

		describe("diff", function() {

			it("simple difference", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 5];

				expect(arr1._.diff(arr2)).to.eql([1, 3]);
			});
		});

		describe("Diff", function() {

			it("simple difference", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 5];

				expect(arr1._.Diff(arr2)).to.eql([1, 3]);
				expect(arr1).to.eql([1, 2, 3]);
			});

			it("Difference multiple arrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 5];
				var arr3 = [1, 7];

				expect(arr1._.Diff(arr2, arr3)).to.eql([3]);
				expect(arr1).to.eql([1, 2, 3]);
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
					[undefined, undefined, undefined],
					[undefined, undefined, undefined]
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

				arr._.append([4])._.first()._.remove(2);

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

		describe("Flatten", function() {

			it("1-dimensional flatten", function() {
				var arr1 = [[1, 2], 3, [4, 5]];

				expect(arr1._.Flatten()).to.eql([1, 2, 3, 4, 5]);
				expect(arr1).to.eql([[1, 2], 3, [4, 5]]);
			});
		});

		describe("harvest", function() {

			it("multidimensional arrays", function() {
				var arr = [['aap', 3], ['hanuman', 6]];

				expect(arr._.harvest(1)).to.deep.equal([3, 6]);
			});

			it("object arrays", function() {
				var arr = [{'aap': 3}, {aap: 6}];

				expect(arr._.harvest('aap')).to.deep.equal([3, 6]);
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

		describe("Intersect", function() {

			it("$intersection simple", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.Intersect(arr2)).to.eql([2, 3]);
				expect(arr1).to.eql([1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});

			it("non $intersecting arrrays", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [4, 5];

				expect(arr1._.Intersect(arr2)).to.eql([]);
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

		describe("last", function() {

			it("get", function() {
				expect([1, 2, 3]._.last()).to.deep.equal(3);
				expect([]._.last()).to.be.undefined;
			});

			it("set", function() {
				expect([1, 2, 3]._.last(4)).to.deep.equal([1, 2, 4]);
				expect([]._.last(4)).to.deep.equal([]);
			});
		});

		describe("max", function() {

			it("simple number array", function() {
				expect([1, 2, 3, 6, 3, 2]._.max()).to.deep.equal(6);
				expect([]._.max()).to.be.undefined;
			});

			it("simple functional", function() {
				expect([1, 2, 3, -8, 6, 5]._.max(function(a, b) {return Math.abs(a) - Math.abs(b)})).to.deep.equal(-8);
				expect([]._.max(function(a, b) {return Math.abs(a) - Math.abs(b)})).to.be.undefined;
			});
		});

		describe("min", function() {

			it("simple number array", function() {
				expect([1, 2, 3, 6, 3, 2]._.min()).to.deep.equal(1);
				expect([]._.min()).to.be.undefined;
			});

			it("simple functional", function() {
				expect([2, 3, -8, -1, 6, 5]._.min(function(a, b) {return Math.abs(a) - Math.abs(b)})).to.deep.equal(-1);
				expect([]._.min(function(a, b) {return Math.abs(a) - Math.abs(b)})).to.be.undefined;
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

		describe("Modify", function() {

			it("Modify ", function() {
				var arr = [1, 2, 3];

				expect(arr._.Modify(function(val) {
					return val + 'x';
				})).to.eql(['1x', '2x', '3x']);
				expect(arr).to.eql([1, 2, 3]);
				expect(arr).to.equal(arr);
			});
		});

		describe("push", function() {

			it("simple ", function() {
				var arr = [1, 2, 3];

				expect(arr._.push(4, 5)).to.equal(arr);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
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

				expect(arr._.select(1, 2)).to.eql([1, 2]);
				expect(arr).to.eql([1, 2]);
			});

			it("select by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.selectFn(function(elm) {
					return elm === 2;
				})).to.eql([2]);
				expect(arr).to.eql([2]);
			});
		});

		describe("Select by value", function() {

			it("Select one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.Select(1)).to.eql([1]);
				expect(arr).to.equal(arr);
			});

			it("Select multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.Select(1, 2)).to.eql([1, 2]);
				expect(arr).to.equal(arr);
			});

			it("Select by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.SelectFn(function(elm) {
					return elm === 2;
				})).to.eql([2]);
				expect(arr).to.equal(arr);
			});
		});

		describe("select$ by value", function() {

			it("select$ one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.select$(1)).to.eql([1, 1]);
				expect(arr).to.eql([1, 1]);
			});

			it("select$ multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.select$(1, 2)).to.eql([1, 2, 1, 2]);
				expect(arr).to.eql([1, 2, 1, 2]);
			});

			it("select$ by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.select$Fn(function(elm) {
					return elm === 2;
				})).to.eql([2, 2]);
				expect(arr).to.eql([2, 2]);
			});
		});

		describe("Select$ by value", function() {

			it("Select$ one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.Select$(1)).to.eql([1, 1]);
				expect(arr).to.eql([1, 2, 1, 3]);
				expect(arr).to.equal(arr);
			});

			it("Select$ multiple elements", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.Select$(1, 2)).to.eql([1, 2, 1, 2]);
				expect(arr).to.eql([1, 2, 1, 3, 2]);
				expect(arr).to.equal(arr);
			});

			it("Select$ by function", function() {
				var arr = [1, 2, 1, 3, 2];

				expect(arr._.Select$Fn(function(elm) {
					return elm === 2;
				})).to.eql([2, 2]);
				expect(arr).to.eql([1, 2, 1, 3, 2]);
				expect(arr).to.equal(arr);
			});
		});
		// TODO
		xdescribe("selectKeys", function() {

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
		// TODO
		xdescribe("$selectKeys", function() {

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

        describe("_stringify", function() {

            it("simple _stringify", function() {
                var arr1 = [1, 2, 3];

                expect(arr1._.stringify()).to.eql('[1, 2, 3]');
            });

            it("multi dimensional _stringify", function() {
                var arr1 = [[6, 6], [7, 7, [8]]];

                expect(arr1._.stringify()).to.eql("[[6, 6], [7, 7, [8]]]");
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

		describe("Unify", function() {

			it("simple union", function() {
				var arr1 = [1, 2, 3];
				var arr2 = [2, 3, 4, 5];

				expect(arr1._.Unify(arr2)).to.eql([1, 2, 3, 4, 5]);
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

		describe("Unique", function() {

			it("simple Unique", function() {
				var arr1 = [1, 2, 1, 2, 3];

				expect(arr1._.Unique()).to.eql([1, 2, 3]);
				expect(arr1).to.eql([1, 2, 1, 2, 3]);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("remove by value", function() {

			it("remove one element", function() {
				var arr = [1, 2, 3];

				arr._.remove(2);

				expect(arr).to.eql([1, 3]);
			});

			it("remove multiple values", function() {
				var arr = [1, 2, 3, 4, 4];

				arr._.remove(2,4);

				expect(arr).to.eql([1, 3, 4]);
			});

			it("remove function", function() {
				var arr = ['a', 'b', 'c', 'bb'];

				arr._.removeFn(function(val) {
					return val._.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c', 'bb']);
			});
		});

		describe("Remove by value", function() {

			it("Remove one element", function() {
				var arr = [1, 2, 3];

				expect(arr._.Remove(2)).to.eql([1, 3]);
				expect(arr).to.eql([1, 2, 3]);
			});

			it("Remove multiple values", function() {
				var arr = [1, 2, 3, 4];

				expect(arr._.Remove(2,4)).to.eql([1, 3]);
				expect(arr).to.eql([1, 2, 3, 4]);
			});

			it("Remove function", function() {
				var arr = ['a', 'b', 'c', 'bb'];

				expect(arr._.RemoveFn(function(val) {
					return val._.startsWith('b');
				})).to.eql(['a', 'c', 'bb']);
				expect(arr).to.eql(['a', 'b', 'c', 'bb']);
			});
		});

		describe("remove$ by value", function() {

			it("remove one element", function() {
				var arr = [1, 2, 1, 3];

				arr._.remove$(1);

				expect(arr).to.eql([2, 3]);
			});

			it("remove one element", function() {
				var arr = [1, 2, 1, 3];

				arr._.remove$Fn(function(val) {return val === 3});

				expect(arr).to.eql([1, 2, 1]);
			});

			it("remove multiple values", function() {
				var arr = [1, 2, 3, 2, 4, 4];

				arr._.remove$(2,4);

				expect(arr).to.eql([1, 3]);
			});

			it("remove multiple function", function() {
				var arr = ['a', 'b', 'c', 'bb', 'bb'];

				arr._.remove$Fn(function(val) {
					return val._.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c']);
			});
		});

		describe("Remove$ by value", function() {

			it("Remove$ one element", function() {
				var arr = [1, 2, 1, 3];

				expect(arr._.Remove$(1)).to.eql([2, 3]);
				expect(arr).to.eql([1, 2, 1, 3]);
			});

			it("Remove$ multiple values", function() {
				var arr = [1, 2, 3, 2, 4, 4];

				expect(arr._.Remove$(2,4)).to.eql([1, 3]);
				expect(arr).to.eql([1, 2, 3, 2, 4, 4]);
			});

			it("Remove$ multiple function", function() {
				var arr = ['a', 'b', 'c', 'bb', 'bb'];

				expect(arr._.Remove$Fn(function(val) {return val._.startsWith('b')})).to.eql(['a', 'c']);
				expect(arr).to.eql(['a', 'b', 'c', 'bb', 'bb']);
			});
		});

		describe("del", function() {

			it("del one index", function() {
				var arr = [1, 2, 3];

				arr._.del(1);

				expect(arr).to.deep.equal([1, 3]);
			});

			it("del from to index", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.del(1, 3);

				expect(arr).to.deep.equal([1, 3, 5]);
			});

			it("del from to index out of bounds", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.del(1, 6);

				expect(arr).to.deep.equal([1, 3, 4, 5]);
			});

			it("del indexes with function", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.delFn(function(i) {
					return i % 2 === 0;
				});

				expect(arr).to.eql([2, 4]);
			});

			it("del indexes within array", function() {
				var arr = [1, 2, 3, 4, 5];

				arr._.del(0, 3, 4);

				expect(arr).to.eql([2, 3]);
			});
		});

		describe("Del", function() {

			it("del one index", function() {
				var arr = [1, 2, 3];

				expect(arr._.Del(1)).to.deep.equal([1, 3]);
				expect(arr).to.deep.equal([1, 2, 3]);
			});

			it("Del from to index", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.Del(1, 3)).to.deep.equal([1, 3, 5]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("del from to index out of bounds", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.Del(1, 6)).to.deep.equal([1, 3, 4, 5]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("del indexes with function", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.DelFn(function(i) {
					return i % 2 === 0;
				})).to.eql([2, 4]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});

			it("del indexes within array", function() {
				var arr = [1, 2, 3, 4, 5];

				expect(arr._.Del(0, 3, 4)).to.eql([2, 3]);
				expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
			});
		});
	});
});
});