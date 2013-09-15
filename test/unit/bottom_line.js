describe("Bottom_Line._.⌡S", function() {

	describe("new arr", function() {

		it("simple", function() {
			var names = ['bobby', 'jean'];

			var namesExt = names._.append(['xavier']);

			expect(namesExt).to.eql(['bobby', 'jean', 'xavier']);

			expect(names._.has('jean')).to.equal(true);
		});

		it("chain", function() {
			var names = ['bobby', 'jean'];

			var arr = names.$.append(['xavier']).del('bobby').value;

			expect(arr).to.eql(['jean', 'xavier']);
		});
	});

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

				    arr._.append(['d', 'e']);

				    expect(arr).to.eql(['a', 'b', 'c', 'd', 'e']);
			    });
		    });

			describe("first: testting getters setters", function() {

				it("append an array", function() {
					var arr = ['a', 'b', 'c'];

					expect(arr._.first).to.eql('a');
				});

				it("append an array", function() {
					var arr = ['a', 'b', 'c'];

					arr._.first = 'z';

					expect(arr._.first).to.eql('z');
					expect(arr).to.eql(['z', 'b', 'c']);
				});

				it("append an array", function() {
					var arr = [['a', 'b'], 'b', 'c'];

					arr.$.append(['d']).first.del('b').value;

					expect(arr).to.eql([['a'], 'b', 'c', 'd']);
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

		    describe("del", function() {

			    it("delete one element", function() {
				    var arr = ['a', 'b', 'c'];

				    arr._.del('a');

				    expect(arr).to.eql(['b', 'c']);
			    });

			    it("delete one element that does not exists in the array", function() {
				    var arr = ['a', 'b', 'c'];

				    arr._.del('d');

				    expect(arr).to.eql(['a', 'b', 'c']);
			    });
		    });
	    });
    });
/*
	describe("Number", function() {

		describe("prototype methods", function() {

			describe("Number rebound", function() {

				it("number rebounds", function() {
					expect(__int.rebound(1)(0, 2)).to.eql(1);
					expect(__int.rebound(2)(0, 2)).to.eql(2);
					expect(__int.rebound(0)(0, 2)).to.eql(0);
					expect(__int.rebound(3)(0, 2)).to.eql(0);
					expect(__int.rebound(5)(0, 2)).to.eql(2);
					expect(__int.rebound(6)(0, 2)).to.eql(0);
				});
				it("negative number rebounds", function() {
					// negatives
					expect(__int.rebound(-1)(0, 2)).to.eql(2);
					expect(__int.rebound(-2)(0, 2)).to.eql(1);
					expect(__int.rebound(-3)(0, 2)).to.eql(0);

					expect(__int.rebound(-1)(1, 2)).to.eql(2);
					expect(__int.rebound(-2)(1, 2)).to.eql(1);
					expect(__int.rebound(-3)(1, 2)).to.eql(2);
			      //expect(__int(-3).rebound(1, 2)).to.eql(2);
				});
			});
		});
	});
*/

	describe("String", function() {

		describe("prototype methods", function() {

			describe("after", function() {

		        it("positive after test", function() {
					expect('one.two'._.after('.t')).to.eql('wo');
				});

				it("negative after test", function() {
					expect('one'._.after('.t')).to.eql('');
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

		    describe("isUpperCase", function() {

			    it("positive uppercase case", function() {
				    expect('HF_GD123'._.isUpperCase()).to.be.true;
			    });
		    });
	    });
	});

	describe("Function", function() {

		describe("static methods", function() {

			describe("strap", function() {

				it("positive after test", function() {
					function multiply(num1, num2) {
						return num1*num2;
					}

					var multiply6 = _.strap(6, multiply);

					expect(multiply6(6)).to.equal(36);
				});
			});
		});
	});
/*
	describe("Underscore", function() {

		describe("static methods", function() {

			describe("typeOf", function() {

				it("javascript types", function() {
					expect(_.typeOf(6)).to.eql('number');
					expect(_.typeOf(NaN)).to.eql('number');
					expect(_.typeOf(Infinity)).to.eql('number');
					expect(_.typeOf('s')).to.eql('string');
					expect(_.typeOf([])).to.eql('array');
					expect(_.typeOf({})).to.eql('object');
					expect(_.typeOf(function(){})).to.eql('function');
					expect(_.typeOf(null)).to.eql('null');
					expect(_.typeOf(undefined)).to.eql('undefined');
				});

				it("custom types: named constructor", function() {
					function Animal() {} // make sure the constructor is a named function
					var animal = new Animal();

					expect(_.typeOf(animal)).to.eql('Animal');
				});

				it("custom types: UNnamed constructor", function() {
					var Cat = function () {};  // unnamed constructor
					var cat = new Cat();

					expect(_.typeOf(cat)).to.eql('object');
				});
			});

			describe("Object properties available from underscore", function() {

				it("test keys Object properties", function() {
					 var obj = {x:1, y:2};

					expect(_.keys(obj)).to.eql(['x', 'y']);
				});
			});

			describe("Iterate", function() {

				it("test keys Object properties", function() {
					var obj = {x:1, y:2, z:3};
					var values = []

					_.iterate(obj, function(e) {values.push(e)});

					expect(values).to.eql([1, 2, 3]);
				});
			});

			describe("Integer", function() {

				it("test keys Object properties", function() {
					var num = new __num(4);

					expect(num.rebound(1, 2)).to.eql(1);
				});

				it("test keys Object properties", function() {
					var int = new __int(4);

					expect(int.rebound(1, 2)).to.eql(1);
				});
			});
		});
	}); */
});