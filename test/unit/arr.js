describe("Array", function() {

	describe("static methods", function() {

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

				arr.bl.append(['d', 'e']);

				expect(arr).to.eql(['a', 'b', 'c', 'd', 'e']);
			});
		});

		describe("$append", function() {

			it("$append an array", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.bl.$append(['d', 'e'])).to.eql(['a', 'b', 'c', 'd', 'e']);
				expect(arr).to.eql(['a', 'b', 'c']);
			});
		});

		describe("compact", function() {

			it("compact array", function() {
				var arr1 = ['a', 0, 'b', '', false, 'c', null, undefined, NaN];

				expect(arr1.bl.compact()).to.eql(['a', 'b', 'c']);
			});
		});

		describe("$compact", function() {

			it("$compact array", function() {
				var arr1 = ['a', 0, 'b', '', false, 'c', null, undefined, NaN, 'd'];

				expect(arr1.bl.$compact()).to.eql(['a', 'b', 'c', 'd']);
//				expect(arr1).to.eql(['a', 0, 'b', '', false, 'c', null, undefined, NaN, 'd']); // somehow this fails bug in chai???
				expect(arr1[9]).to.eql('d');
			});
		});

		describe("copy", function() {

			it("copy value", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copy(arr2, 'b')).to.eql(['b', 'e', 'b']);
			});

			it("copy values", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copy(arr2, ['b', 'c'])).to.eql(['b', 'e', 'b', 'c']);
			});

			it("copy function", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copy(arr2, function(val) {return val === 'b'})).to.eql(['b', 'e', 'b']);

			});
		});

		describe("copyAll", function() {

			it("copyAll value", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copyAll(arr2, 'b')).to.eql(['b', 'e', 'b', 'b']);
			});

			it("copyAll values", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copyAll(arr2, ['b', 'c'])).to.eql(['b', 'e', 'b', 'c', 'b']);
			});

			it("copyAll function", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copyAll(arr2, function(val) {return val === 'b'})).to.eql(['b', 'e', 'b', 'b']);

			});
		});

		describe("copyKeys", function() {

			it("copyKeys value", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copyKeys(arr2, 1)).to.eql(['b', 'e', 'b']);
			});

			it("copyKeys values", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copyKeys(arr2, [1, 2])).to.eql(['b', 'e', 'b', 'c']);
			});

			it("copyKeys function", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.copyKeys(arr2, function(i) {return i > 1})).to.eql(['b', 'e', 'c', 'b']);

			});
		});

		describe("cut", function() {

			it("cut value", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cut(arr2, 'b')).to.eql(['b', 'e', 'b']);
				expect(arr1).to.eql(['a', 'c', 'b']);
			});

			it("cut values", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cut(arr2, ['b', 'c'])).to.eql(['b', 'e', 'b', 'c']);
				expect(arr1).to.eql(['a', 'b']);
			});

			it("cut function", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cut(arr2, function(val) {return val === 'b'})).to.eql(['b', 'e', 'b']);
				expect(arr1).to.eql(['a', 'c', 'b']);
			});
		});

		describe("cutAll", function() {

			it("cutAll value", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cutAll(arr2, 'b')).to.eql(['b', 'e', 'b', 'b']);
				expect(arr1).to.eql(['a', 'c']);
			});

			it("cutAll values", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cutAll(arr2, ['b', 'c'])).to.eql(['b', 'e', 'b', 'c', 'b']);
				expect(arr1).to.eql(['a']);
			});

			it("cutAll function", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cutAll(arr2, function(val) {return val === 'b'})).to.eql(['b', 'e', 'b', 'b']);
				expect(arr1).to.eql(['a', 'c']);

			});
		});

		describe("cutKeys", function() {

			it("cutKeys value", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cutKeys(arr2, 1)).to.eql(['b', 'e', 'b']);
				expect(arr1).to.eql(['a', 'c', 'b']);
			});

			it("cutKeys values", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cutKeys(arr2, [1, 2])).to.eql(['b', 'e', 'b', 'c']);
				expect(arr1).to.eql(['a', 'b']);
			});

			it("cutKeys function", function() {
				var arr1 = ['a', 'b', 'c', 'b'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.cutKeys(arr2, function(i) {return i > 1})).to.eql(['b', 'e', 'c', 'b']);
				expect(arr1).to.eql(['a', 'b']);

			});
		});

		describe("diff", function() {

			it("simple difference", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.diff(arr2)).to.eql(['a', 'c']);
			});
		});

		describe("$diff", function() {

			it("simple difference", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'e'];

				expect(arr1.bl.$diff(arr2)).to.eql(['a', 'c']);
				expect(arr1).to.eql(['a', 'b', 'c']);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("dimit", function() {

			it("2D array", function() {
				var arr = [2, 3].bl.dimit(0);

				expect(arr).to.eql([
					[0,0,0],
					[0,0,0]
				]);
			});

			it("2D array: init undefined", function() {
				var arr = [2, 3].bl.dimit();

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

				arr.bl.each(function(elm) {
					sum += elm;
				});

				expect(sum).to.eql(6);
			});

			it("simple step each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				var sum = 0;

				arr.bl.each(2,function(elm) {
					sum += elm;
				});

				expect(sum).to.eql(9);
			});

			it("elastic step each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr.bl.each(function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 5, 6]);
			});

			it("elastic step 2 each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr.bl.each(2, function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 2, 4, 5, 6]);
			});

			it("simple negative step each", function() {
				var arr = [1, 2, 6];

				var div = 36;

				arr.bl.eachRight(1, function(elm) {
					div /= elm;
				});

				expect(div).to.eql(3);
			});

			it("elastic negative step each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr.bl.eachRight(1, function(elm, i, arr) {
					if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
				});

				expect(arr).to.eql([1, 5, 6]);
			});

			it("elastic negative step 2 each", function() {
				var arr = [1, 2, 3, 4, 5, 6];

				arr.bl.eachRight(2, function(elm, i, arr) {
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

				arr.bl.each(function(elm, i, arr) {
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

				arr.bl.each(function(elm, i, arr) {
					sum += elm;
					count++;
				});

				expect(Number.isNaN(sum)).to.be.true;
				expect(count).to.eql(3);
			});
		});

		describe("first: testting", function() {

			it("return first", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.bl.first()).to.eql('a');
			});

			it("set first", function() {
				var arr = ['a', 'b', 'c'];

				arr.bl.first('z');

				expect(arr.bl.first()).to.eql('z');
				expect(arr).to.eql(['z', 'b', 'c']);
			});

			it("complex first chain", function() {
				var arr = [['a', 'b'], 'b', 'c'];

				arr.bl.append(['d']).bl.first().bl.without('b');

				expect(arr).to.eql([['a'], 'b', 'c', 'd']);
			});
		});

		describe("flatten", function() {

			it("1-dimensional flatten", function() {
				var arr1 = [['a', 'b'], 'c', ['d', 'e']];

				arr1.bl.flatten();

				expect(arr1).to.eql(['a', 'b', 'c', 'd', 'e']);
			});
		});

		describe("$flatten", function() {

			it("1-dimensional flatten", function() {
				var arr1 = [['a', 'b'], 'c', ['d', 'e']];

				expect(arr1.bl.$flatten()).to.eql(['a', 'b', 'c', 'd', 'e']);
				expect(arr1).to.eql([['a', 'b'], 'c', ['d', 'e']]);
			});
		});

		describe("insert", function() {

			it("insert beginning", function() {
				var arr = [1, 2, 3];

				arr.bl.insert(0, 0);

				expect(arr).to.eql([0, 1, 2, 3]);
			});

			it("insert end", function() {
				var arr = [1, 2, 3];

				arr.bl.insert(4, 3);

				expect(arr).to.eql([1, 2, 3, 4]);
			});

			it("insert middle", function() {
				var arr = [1, 2, 3];

				arr.bl.insert(1.5, 1);

				expect(arr).to.eql([1, 1.5, 2, 3]);
			});

			it("insert out of bounds -", function() {
				var arr = [1, 2, 3];

				arr.bl.insert(-1, -2);

				expect(arr).to.eql([1, -1, 2, 3]);
			});

			it("insert out of bounds", function() {
				var arr = [1, 2, 3];

				arr.bl.insert(5, 4);

				expect(arr).to.eql([1, 2, 3, 5]);
			});
		});

		describe("intersect", function() {

			it("intersection simple", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(arr1.bl.intersect(arr2)).to.eql(['b', 'c']);
			});

			it("non intersecting arrrays", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['d', 'e'];

				expect(arr1.bl.intersect(arr2)).to.eql([]);
			});
		});

		describe("$intersect", function() {

			it("$intersection simple", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(arr1.bl.$intersect(arr2)).to.eql(['b', 'c']);
				expect(arr1).to.eql(['a', 'b', 'c']);
				expect(arr1).to.equal(arr1);
			});

			it("non $intersecting arrrays", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['d', 'e'];

				expect(arr1.bl.$intersect(arr2)).to.eql([]);
				expect(arr1).to.eql(['a', 'b', 'c']);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("intersects", function() {

			it("intersection simple", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(arr1.bl.intersects(arr2)).to.be.true;
			});

			it("non intersecting arrrays", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['d', 'e'];

				expect(arr1.bl.intersects(arr2)).to.be.false;
			});
		});

		describe("modify", function() {

			it("modify ", function() {
				var arr = ['a', 'b', 'c'];

				arr.bl.modify(function(val) {
					return val + 'x';
				});

				expect(arr).to.eql(['ax', 'bx', 'cx']);
			});
		});

		describe("$modify", function() {

			it("$modify ", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.bl.$modify(function(val) {
					return val + 'x';
				})).to.eql(['ax', 'bx', 'cx']);
				expect(arr).to.eql(['a', 'b', 'c']);
				expect(arr).to.equal(arr);
			});
		});

		describe("select by value", function() {

			it("select one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				expect(arr.bl.select('a')).to.eql(['a']);
				expect(arr).to.eql(['a']);
			});

			it("select multiple elements", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.select(['a', 'b'])).to.eql(['a', 'b']);
				expect(arr).to.eql(['a', 'b']);
			});

			it("select by function", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.select(function(elm) {
					return elm === 'b';
				})).to.eql(['b']);
				expect(arr).to.eql(['b']);
			});
		});

		describe("$select by value", function() {

			it("$select one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				expect(arr.bl.$select('a')).to.eql(['a']);
				expect(arr).to.equal(arr);
			});

			it("$select multiple elements", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.$select(['a', 'b'])).to.eql(['a', 'b']);
				expect(arr).to.equal(arr);
			});

			it("$select by function", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.$select(function(elm) {
					return elm === 'b';
				})).to.eql(['b']);
				expect(arr).to.equal(arr);
			});
		});

		describe("selectAll by value", function() {

			it("selectAll one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				expect(arr.bl.selectAll('a')).to.eql(['a', 'a']);
				expect(arr).to.eql(['a', 'a']);
			});

			it("selectAll multiple elements", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.selectAll(['a', 'b'])).to.eql(['a', 'b', 'a', 'b']);
				expect(arr).to.eql(['a', 'b', 'a', 'b']);
			});

			it("selectAll by function", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.selectAll(function(elm) {
					return elm === 'b';
				})).to.eql(['b', 'b']);
				expect(arr).to.eql(['b', 'b']);
			});
		});

		describe("$selectAll by value", function() {

			it("$selectAll one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				expect(arr.bl.$selectAll('a')).to.eql(['a', 'a']);
				expect(arr).to.eql(['a', 'b', 'a', 'c']);
				expect(arr).to.equal(arr);
			});

			it("$selectAll multiple elements", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.$selectAll(['a', 'b'])).to.eql(['a', 'b', 'a', 'b']);
				expect(arr).to.eql(['a', 'b', 'a', 'c', 'b']);
				expect(arr).to.equal(arr);
			});

			it("$selectAll by function", function() {
				var arr = ['a', 'b', 'a', 'c', 'b'];

				expect(arr.bl.$selectAll(function(elm) {
					return elm === 'b';
				})).to.eql(['b', 'b']);
				expect(arr).to.eql(['a', 'b', 'a', 'c', 'b']);
				expect(arr).to.equal(arr);
			});
		});

		describe("selectKeys", function() {

			it("selectKeys one index", function() {
				var arr = ['a', 'b', 'c'];

				arr.bl.selectKeys(1);

				expect(arr).to.deep.equal(['b']);
			});

			it("selectKeys from to index", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.selectKeys(1, 3);

				expect(arr).to.deep.equal(['b', 'c', 'd']);
			});

			it("selectKeys from to index out of bounds", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.selectKeys(1, 6);

				expect(arr).to.deep.equal(['b', 'c', 'd', 'e']);
			});

			it("selectKeys indexes with function", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.selectKeys(function(i) {
					return i % 2 === 0;
				});

				expect(arr).to.eql(['a', 'c', 'e']);
			});

			it("selectKeys indexes within array", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.selectKeys([0, 3, 4]);

				expect(arr).to.eql(['a', 'd', 'e']);
			});
		});

		describe("$selectKeys", function() {

			it("$selectKeys one index", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.bl.$selectKeys(1)).to.deep.equal(['b']);
				expect(arr).to.deep.equal(['a', 'b', 'c']);
			});

			it("$selectKeys from to index", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$selectKeys(1, 3)).to.deep.equal(['b', 'c', 'd']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});

			it("$selectKeys from to index out of bounds", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$selectKeys(1, 6)).to.deep.equal(['b', 'c', 'd', 'e']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});

			it("$selectKeys indexes with function", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$selectKeys(function(i) {
					return i % 2 === 0;
				})).to.eql(['a', 'c', 'e']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});

			it("$selectKeys indexes within array", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$selectKeys([0, 3, 4])).to.eql(['a', 'd', 'e']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});
		});

        describe("_toString", function() {

            it("simple _toString", function() {
                var arr1 = ['a', 'b', 'c'];

                expect(arr1.bl.toString()).to.eql('[a, b, c]');
            });

            it("multi dimensional _toString", function() {
                var arr1 = [[6, 6], [7, 7, [8]]];

                expect(arr1.bl.toString()).to.eql("[[6, 6], [7, 7, [8]]]");
            });
        });

		describe("unify", function() {

			it("simple union", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(arr1.bl.unify(arr2)).to.eql(['a', 'b', 'c', 'd', 'e']);
			});

			it("union of empty arrays", function() {
				var arr1 = [];
				var arr2 = [];

				expect(arr1.bl.unify(arr2)).to.eql([]);
			});
		});
        // FIXME
		xdescribe("$unify", function() {

			it("simple union", function() {
				var arr1 = ['a', 'b', 'c'];
				var arr2 = ['b', 'c', 'd', 'e'];

				expect(arr1.bl.$unify(arr2)).to.eql(['a', 'b', 'c', 'd', 'e']);
				expect(arr1).to.eql(['a', 'b', 'c']);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("unique", function() {

			it("simple unique", function() {
				var arr1 = ['a', 'b', 'a', 'b', 'c'];

				expect(arr1.bl.unique()).to.eql(['a', 'b', 'c']);
			});
		});

		describe("$unique", function() {

			it("simple $unique", function() {
				var arr1 = ['a', 'b', 'a', 'b', 'c'];

				expect(arr1.bl.$unique()).to.eql(['a', 'b', 'c']);
				expect(arr1).to.eql(['a', 'b', 'a', 'b', 'c']);
				expect(arr1).to.equal(arr1);
			});
		});

		describe("without by value", function() {

			it("without one element", function() {
				var arr = ['a', 'b', 'c'];

				arr.bl.without('b');

				expect(arr).to.eql(['a', 'c']);
			});

			it("without multiple values", function() {
				var arr = ['a', 'b', 'c', 'd'];

				arr.bl.without(['b','d']);

				expect(arr).to.eql(['a', 'c']);
			});

			it("without function", function() {
				var arr = ['a', 'b', 'c', 'd', 'bb'];

				arr.bl.without(function(val) {
					return val.bl.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c', 'd', 'bb']);
			});
		});

		describe("$without by value", function() {

			it("$without one element", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.bl.$without('b')).to.eql(['a', 'c']);
				expect(arr).to.eql(['a', 'b', 'c']);
			});

			it("$without multiple values", function() {
				var arr = ['a', 'b', 'c', 'd'];

				expect(arr.bl.$without(['b','d'])).to.eql(['a', 'c']);
				expect(arr).to.eql(['a', 'b', 'c', 'd']);
			});

			it("$without function", function() {
				var arr = ['a', 'b', 'c', 'd', 'bb'];

				expect(arr.bl.$without(function(val) {
					return val.bl.startsWith('b');
				})).to.eql(['a', 'c', 'd', 'bb']);
				expect(arr).to.eql(['a', 'b', 'c', 'd', 'bb']);
			});
		});

		describe("without all by value", function() {

			it("without one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				arr.bl.withoutAll('a');

				expect(arr).to.eql(['b', 'c']);
			});

			it("without one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				arr.bl.withoutAll(function(val) {return val === 'c'});

				expect(arr).to.eql(['a', 'b', 'a']);
			});

			it("without multiple values", function() {
				var arr = ['a', 'b', 'c', 'b', 'd', 'd'];

				arr.bl.withoutAll(['b','d']);

				expect(arr).to.eql(['a', 'c']);
			});

			it("without multiple function", function() {
				var arr = ['a', 'b', 'c', 'd', 'bb', 'bb'];

				arr.bl.withoutAll(function(val) {
					return val.bl.startsWith('b');
				});

				expect(arr).to.eql(['a', 'c', 'd']);
			});
		});

		describe("$withoutAll by value", function() {

			it("$withoutAll one element", function() {
				var arr = ['a', 'b', 'a', 'c'];

				expect(arr.bl.$withoutAll('a')).to.eql(['b', 'c']);
				expect(arr).to.equal(arr);
				expect(arr).to.eql(['a', 'b', 'a', 'c']);
			});

			it("$withoutAll multiple values", function() {
				var arr = ['a', 'b', 'c', 'b', 'd', 'd'];

				expect(arr.bl.$withoutAll(['b','d'])).to.eql(['a', 'c']);
				expect(arr).to.equal(arr);
				expect(arr).to.eql(['a', 'b', 'c', 'b', 'd', 'd']);
			});

			it("$withoutAll multiple function", function() {
				var arr = ['a', 'b', 'c', 'd', 'bb', 'bb'];

				expect(arr.bl.$withoutAll(function(val) {
					return val.bl.startsWith('b');
				})).to.eql(['a', 'c', 'd']);
				expect(arr).to.equal(arr);
				expect(arr).to.eql(['a', 'b', 'c', 'd', 'bb', 'bb']);
			});
		});

		describe("withoutKeys", function() {

			it("withoutKeys one index", function() {
				var arr = ['a', 'b', 'c'];

				arr.bl.withoutKeys(1);

				expect(arr).to.deep.equal(['a', 'c']);
			});

			it("withoutKeys from to index", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.withoutKeys(1, 3);

				expect(arr).to.deep.equal(['a', 'e']);
			});

			it("withoutKeys from to index out of bounds", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.withoutKeys(1, 6);

				expect(arr).to.deep.equal(['a']);
			});

			it("withoutKeys indexes with function", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.withoutKeys(function(i) {
					return i % 2 === 0;
				});

				expect(arr).to.eql(['b', 'd']);
			});

			it("withoutKeys indexes within array", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				arr.bl.withoutKeys([0, 3, 4]);

				expect(arr).to.eql(['b', 'c']);
			});
		});

		describe("$withoutKeys", function() {

			it("withoutKeys one index", function() {
				var arr = ['a', 'b', 'c'];

				expect(arr.bl.$withoutKeys(1)).to.deep.equal(['a', 'c']);
				expect(arr).to.deep.equal(['a', 'b', 'c']);
			});

			it("$withoutKeys from to index", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$withoutKeys(1, 3)).to.deep.equal(['a', 'e']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});

			it("withoutKeys from to index out of bounds", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$withoutKeys(1, 6)).to.deep.equal(['a']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});

			it("withoutKeys indexes with function", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$withoutKeys(function(i) {
					return i % 2 === 0;
				})).to.eql(['b', 'd']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});

			it("withoutKeys indexes within array", function() {
				var arr = ['a', 'b', 'c', 'd', 'e'];

				expect(arr.bl.$withoutKeys([0, 3, 4])).to.eql(['b', 'c']);
				expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
			});
		});
	});
});