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

				arr.$.append(['d', 'e']);

				expect(arr).to.eql(['a', 'b', 'c', 'd', 'e']);
			});
		});

        describe("$append", function() {

            it("$append an array", function() {
                var arr = ['a', 'b', 'c'];

                expect(arr.$.$append(['d', 'e'])).to.eql(['a', 'b', 'c', 'd', 'e']);
                expect(arr).to.eql(['a', 'b', 'c']);
                expect(arr).to.equal(arr);
            });
        });

        describe("diff", function() {

            it("simple difference", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'e'];

                expect(arr1.$.diff(arr2)).to.eql(['a', 'c']);
            });
        });

        describe("$diff", function() {

            it("simple difference", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'e'];

                expect(arr1.$.$diff(arr2)).to.eql(['a', 'c']);
                expect(arr1).to.eql(['a', 'b', 'c']);
                expect(arr1).to.equal(arr1);
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

                arr.$.eachRight(1, function(elm) {
                    div /= elm;
                });

                expect(div).to.eql(3);
            });

            it("elastic negative step each", function() {
                var arr = [1, 2, 3, 4, 5, 6];

                arr.$.eachRight(1, function(elm, i, arr) {
                    if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
                });

                expect(arr).to.eql([1, 5, 6]);
            });

            it("elastic negative step 2 each", function() {
                var arr = [1, 2, 3, 4, 5, 6];

                arr.$.eachRight(2, function(elm, i, arr) {
                    if(elm === 2 || elm === 3 || elm === 4) arr.splice(i, 1);
                });

                expect(arr).to.eql([1, 3, 5, 6]);
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

                arr.$$.append(['d']).first().without('b');

                expect(arr).to.eql([['a'], 'b', 'c', 'd']);
            });
        });

        describe("flatten", function() {

            it("1-dimensional flatten", function() {
                var arr1 = [['a', 'b'], 'c', ['d', 'e']];

                arr1.$.flatten();

                expect(arr1).to.eql(['a', 'b', 'c', 'd', 'e']);
            });
        });

        describe("$flatten", function() {

            it("1-dimensional flatten", function() {
                var arr1 = [['a', 'b'], 'c', ['d', 'e']];

                expect(arr1.$.$flatten()).to.eql(['a', 'b', 'c', 'd', 'e']);
                expect(arr1).to.eql([['a', 'b'], 'c', ['d', 'e']]);
                expect(arr1).to.equal(arr1);
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

        describe("intersect", function() {

            it("intersection simple", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'c', 'd', 'e'];

                expect(arr1.$.intersect(arr2)).to.eql(['b', 'c']);
            });

            it("non intersecting arrrays", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['d', 'e'];

                expect(arr1.$.intersect(arr2)).to.eql([]);
            });
        });

        describe("$intersect", function() {

            it("$intersection simple", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'c', 'd', 'e'];

                expect(arr1.$.$intersect(arr2)).to.eql(['b', 'c']);
                expect(arr1).to.eql(['a', 'b', 'c']);
                expect(arr1).to.equal(arr1);
            });

            it("non $intersecting arrrays", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['d', 'e'];

                expect(arr1.$.$intersect(arr2)).to.eql([]);
                expect(arr1).to.eql(['a', 'b', 'c']);
                expect(arr1).to.equal(arr1);
            });
        });

        describe("intersects", function() {

            it("intersection simple", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'c', 'd', 'e'];

                expect(arr1.$.intersects(arr2)).to.be.true;
            });

            it("non intersecting arrrays", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['d', 'e'];

                expect(arr1.$.intersects(arr2)).to.be.false;
            });
        });

        describe("modify", function() {

            it("modify ", function() {
                var arr = ['a', 'b', 'c'];

                arr.$.modify(function(val) {
                    return val + 'x';
                });

                expect(arr).to.eql(['ax', 'bx', 'cx']);
            });
        });

        describe("$modify", function() {

            it("$modify ", function() {
                var arr = ['a', 'b', 'c'];

                expect(arr.$.$modify(function(val) {
                    return val + 'x';
                })).to.eql(['ax', 'bx', 'cx']);
                expect(arr).to.eql(['a', 'b', 'c']);
                expect(arr).to.equal(arr);
            });
        });

        describe("select by value", function() {

            it("select one element", function() {
                var arr = ['a', 'b', 'a', 'c'];

                expect(arr.$.select('a')).to.eql(['a']);
                expect(arr).to.eql(['a']);
            });

            it("select multiple elements", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.select(['a', 'b'])).to.eql(['a', 'b']);
                expect(arr).to.eql(['a', 'b']);
            });

            it("select by function", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.select(function(elm) {
                    return elm === 'b';
                })).to.eql(['b']);
                expect(arr).to.eql(['b']);
            });

            xit("select by function advanced", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.select(function(elm) {
                    return elm === 'b' || elm === 'c';
                })).to.eql(['b', 'c']);
                expect(arr).to.eql(['b', 'c']);
            });

            xit("select by function 2", function() {
                var arr  = ['a', 'b', 'a', 'c', 'b'];
                var arr2 = ['a', 'c'];

                expect(arr.$.select(function(elm) {
                    return arr2.$.has(elm);
                })).to.eql(['a', 'c']);
                expect(arr.$.has('a')).to.be.true;
                expect(arr.$.has('c')).to.be.true;
                expect(arr).to.eql(['a', 'c']);
            });
        });

        describe("$select by value", function() {

            it("$select one element", function() {
                var arr = ['a', 'b', 'a', 'c'];

                expect(arr.$.$select('a')).to.eql(['a']);
                expect(arr).to.equal(arr);
            });

            it("$select multiple elements", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.$select(['a', 'b'])).to.eql(['a', 'b']);
                expect(arr).to.equal(arr);
            });

            it("$select by function", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.$select(function(elm) {
                    return elm === 'b';
                })).to.eql(['b']);
                expect(arr).to.equal(arr);
            });
        });

        describe("selectAll by value", function() {

            it("selectAll one element", function() {
                var arr = ['a', 'b', 'a', 'c'];

                expect(arr.$.selectAll('a')).to.eql(['a', 'a']);
                expect(arr).to.eql(['a', 'a']);
            });

            it("selectAll multiple elements", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.selectAll(['a', 'b'])).to.eql(['a', 'b', 'a', 'b']);
                expect(arr).to.eql(['a', 'b', 'a', 'b']);
            });

            it("selectAll by function", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.selectAll(function(elm) {
                    return elm === 'b';
                })).to.eql(['b', 'b']);
                expect(arr).to.eql(['b', 'b']);
            });
        });

        describe("$selectAll by value", function() {

            it("$selectAll one element", function() {
                var arr = ['a', 'b', 'a', 'c'];

                expect(arr.$.$selectAll('a')).to.eql(['a', 'a']);
                expect(arr).to.eql(['a', 'b', 'a', 'c']);
                expect(arr).to.equal(arr);
            });

            it("$selectAll multiple elements", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.$selectAll(['a', 'b'])).to.eql(['a', 'b', 'a', 'b']);
                expect(arr).to.eql(['a', 'b', 'a', 'c', 'b']);
                expect(arr).to.equal(arr);
            });

            it("$selectAll by function", function() {
                var arr = ['a', 'b', 'a', 'c', 'b'];

                expect(arr.$.$selectAll(function(elm) {
                    return elm === 'b';
                })).to.eql(['b', 'b']);
                expect(arr).to.eql(['a', 'b', 'a', 'c', 'b']);
                expect(arr).to.equal(arr);
            });
        });

        describe("selectKeys", function() {

            it("selectKeys one index", function() {
                var arr = ['a', 'b', 'c'];

                arr.$.selectKeys(1);

                expect(arr).to.deep.equal(['b']);
            });

            it("selectKeys from to index", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.selectKeys(1, 3);

                expect(arr).to.deep.equal(['b', 'c', 'd']);
            });

            it("selectKeys from to index out of bounds", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.selectKeys(1, 6);

                expect(arr).to.deep.equal(['b', 'c', 'd', 'e']);
            });

            it("selectKeys indexes with function", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.selectKeys(function(i) {
                    return i % 2 === 0;
                });

                expect(arr).to.eql(['a', 'c', 'e']);
            });

            it("selectKeys indexes within array", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.selectKeys([0, 3, 4]);

                expect(arr).to.eql(['a', 'd', 'e']);
            });
        });

        describe("$selectKeys", function() {

            it("$selectKeys one index", function() {
                var arr = ['a', 'b', 'c'];

                expect(arr.$.$selectKeys(1)).to.deep.equal(['b']);
                expect(arr).to.deep.equal(['a', 'b', 'c']);
            });

            it("$selectKeys from to index", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$selectKeys(1, 3)).to.deep.equal(['b', 'c', 'd']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });

            it("$selectKeys from to index out of bounds", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$selectKeys(1, 6)).to.deep.equal(['b', 'c', 'd', 'e']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });

            it("$selectKeys indexes with function", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$selectKeys(function(i) {
                    return i % 2 === 0;
                })).to.eql(['a', 'c', 'e']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });

            it("$selectKeys indexes within array", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$selectKeys([0, 3, 4])).to.eql(['a', 'd', 'e']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });
        });

        describe("unify", function() {

            it("simple union", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'c', 'd', 'e'];

                expect(arr1.$.unify(arr2)).to.eql(['a', 'b', 'c', 'd', 'e']);
            });

            it("union of empty arrays", function() {
                var arr1 = [];
                var arr2 = [];

                expect(arr1.$.unify(arr2)).to.eql([]);
            });
        });

        describe("$unify", function() {

            it("simple union", function() {
                var arr1 = ['a', 'b', 'c'];
                var arr2 = ['b', 'c', 'd', 'e'];

                expect(arr1.$.$unify(arr2)).to.eql(['a', 'b', 'c', 'd', 'e']);
                expect(arr1).to.eql(['a', 'b', 'c']);
                expect(arr1).to.equal(arr1);
            });
        });

        describe("unique", function() {

            it("simple unique", function() {
                var arr1 = ['a', 'b', 'a', 'b', 'c'];

                expect(arr1.$.unique()).to.eql(['a', 'b', 'c']);
            });
        });

        describe("$unique", function() {

            it("simple $unique", function() {
                var arr1 = ['a', 'b', 'a', 'b', 'c'];

                expect(arr1.$.$unique()).to.eql(['a', 'b', 'c']);
                expect(arr1).to.eql(['a', 'b', 'a', 'b', 'c']);
                expect(arr1).to.equal(arr1);
            });
        });

        describe("without by value", function() {

            it("without one element", function() {
                var arr = ['a', 'b', 'c'];

                arr.$.without('b');

                expect(arr).to.eql(['a', 'c']);
            });

            it("without multiple values", function() {
                var arr = ['a', 'b', 'c', 'd'];

                arr.$.without(['b','d']);

                expect(arr).to.eql(['a', 'c']);
            });

            it("without function", function() {
                var arr = ['a', 'b', 'c', 'd', 'bb'];

                arr.$.without(function(val) {
                    return val.$.startsWith('b');
                });

                expect(arr).to.eql(['a', 'c', 'd', 'bb']);
            });
        });

        describe("$without by value", function() {

            it("$without one element", function() {
                var arr = ['a', 'b', 'c'];

                expect(arr.$.$without('b')).to.eql(['a', 'c']);
                expect(arr).to.equal(arr);
                expect(arr).to.eql(['a', 'b', 'c']);
            });

            it("$without multiple values", function() {
                var arr = ['a', 'b', 'c', 'd'];

                expect(arr.$.$without(['b','d'])).to.eql(['a', 'c']);
                expect(arr).to.equal(arr);
                expect(arr).to.eql(['a', 'b', 'c', 'd']);
            });

            it("$without multiple values", function() {
                var arr = ['a', 'b', 'c', 'd', 'bb'];

                expect(arr.$.$without(function(val) {
                    return val.$.startsWith('b');
                })).to.eql(['a', 'c', 'd', 'bb']);
                expect(arr).to.equal(arr);
                expect(arr).to.eql(['a', 'b', 'c', 'd', 'bb']);
            });
        });

        describe("without all by value", function() {

            it("without one element", function() {
                var arr = ['a', 'b', 'a', 'c'];

                arr.$.withoutAll('a');

                expect(arr).to.eql(['b', 'c']);
            });

            it("without multiple values", function() {
                var arr = ['a', 'b', 'c', 'b', 'd', 'd'];

                arr.$.withoutAll(['b','d']);

                expect(arr).to.eql(['a', 'c']);
            });

            it("without multiple function", function() {
                var arr = ['a', 'b', 'c', 'd', 'bb', 'bb'];

                arr.$.withoutAll(function(val) {
                    return val.$.startsWith('b');
                });

                expect(arr).to.eql(['a', 'c', 'd']);
            });
        });

        describe("$withoutAll by value", function() {

            it("$withoutAll one element", function() {
                var arr = ['a', 'b', 'a', 'c'];

                expect(arr.$.$withoutAll('a')).to.eql(['b', 'c']);
                expect(arr).to.equal(arr);
                expect(arr).to.eql(['a', 'b', 'a', 'c']);
            });

            it("$withoutAll multiple values", function() {
                var arr = ['a', 'b', 'c', 'b', 'd', 'd'];

                expect(arr.$.$withoutAll(['b','d'])).to.eql(['a', 'c']);
                expect(arr).to.equal(arr);
                expect(arr).to.eql(['a', 'b', 'c', 'b', 'd', 'd']);
            });

            it("$withoutAll multiple function", function() {
                var arr = ['a', 'b', 'c', 'd', 'bb', 'bb'];

                expect(arr.$.$withoutAll(function(val) {
                    return val.$.startsWith('b');
                })).to.eql(['a', 'c', 'd']);
                expect(arr).to.equal(arr);
                expect(arr).to.eql(['a', 'b', 'c', 'd', 'bb', 'bb']);
            });
        });

        describe("withoutKeys", function() {

            it("withoutKeys one index", function() {
                var arr = ['a', 'b', 'c'];

                arr.$.withoutKeys(1);

                expect(arr).to.deep.equal(['a', 'c']);
            });

            it("withoutKeys from to index", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.withoutKeys(1, 3);

                expect(arr).to.deep.equal(['a', 'e']);
            });

            it("withoutKeys from to index out of bounds", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.withoutKeys(1, 6);

                expect(arr).to.deep.equal(['a']);
            });

            it("withoutKeys indexes with function", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.withoutKeys(function(i) {
                    return i % 2 === 0;
                });

                expect(arr).to.eql(['b', 'd']);
            });

            it("withoutKeys indexes within array", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                arr.$.withoutKeys([0, 3, 4]);

                expect(arr).to.eql(['b', 'c']);
            });
        });

        describe("$withoutKeys", function() {

            it("withoutKeys one index", function() {
                var arr = ['a', 'b', 'c'];

                expect(arr.$.$withoutKeys(1)).to.deep.equal(['a', 'c']);
                expect(arr).to.deep.equal(['a', 'b', 'c']);
            });

            it("$withoutKeys from to index", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$withoutKeys(1, 3)).to.deep.equal(['a', 'e']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });

            it("withoutKeys from to index out of bounds", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$withoutKeys(1, 6)).to.deep.equal(['a']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });

            it("withoutKeys indexes with function", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$withoutKeys(function(i) {
                    return i % 2 === 0;
                })).to.eql(['b', 'd']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });

            it("withoutKeys indexes within array", function() {
                var arr = ['a', 'b', 'c', 'd', 'e'];

                expect(arr.$.$withoutKeys([0, 3, 4])).to.eql(['b', 'c']);
                expect(arr).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
            });
        });
	});
});