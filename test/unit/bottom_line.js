describe("Bottom_Line.$$.⌡S", function() {

	describe("bottom line js", function() {

		it("singular", function() {
			var names = ['bobby', 'jean'];

			var namesExt = names.$.append(['xavier']);

			expect(namesExt).to.eql(['bobby', 'jean', 'xavier']);

			expect(names.$.has('jean')).to.equal(true);
		});

		it("chaining", function() {
			var names = ['bobby', 'jean'];

			names.$$.append(['xavier']).del('bobby');

			expect(names).to.eql(['jean', 'xavier']);
		});

		it("chaining different types", function() {
			var arr = [4,5,6,2];

			expect(arr.$$.del(2).min().$$.bound(1, 3).between(2,4).value).to.be.true;
		});

		it("singular type chaining", function() {
			var arr = [4,5,6,2];

			expect(arr.$.min().$.bound(-1, 1)).to.equal(1);
		});
	});

	describe("Object", function() {

		describe("static methods", function() {

			describe("clone", function() {

				it("simple clone", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3,
						t: 666
					};

					expect(_.clone(obj)).to.deep.equal({
						x: 1,
						y: 2,
						z: 3,
						t: 666
					});
					expect(_.clone(obj)).to.not.equal({
						x: 1,
						y: 2,
						z: 3,
						t: 666
					});
					expect(_.clone(obj)).to.not.equal(obj);
				});
			});

			describe("extend", function() {

				it("simple extend", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3,
						t: 666
					};
					var module = {
						fnc: function() {
							return 'tralala';
						},
						prop: 666,
						_x: 'jeweetzelluf',
						get x() {
							return this._x;
						}
					};

					_.extend(obj,module);

					expect(obj.fnc()).to.equal('tralala');
					expect(obj.prop).to.equal(666);
					expect(obj.x).to.equal('jeweetzelluf');

					var descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');

					expect(descriptor.writable).to.be.true;
					expect(descriptor.enumerable).to.be.true;
					expect(descriptor.configurable).to.be.true;
				});

				it("adding custom descriptors", function() {
					var obj = {
						x: 1,
						y: 2
					};
					var module = {
						prop: 666
					};

					_.extend(obj,{writable:false, enumerable:false, configurable:false}, module);

					expect(obj.prop).to.equal(666);

					var descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');

					expect(descriptor.writable).to.be.false;
					expect(descriptor.enumerable).to.be.false;
					expect(descriptor.configurable).to.be.false;
				});
			});

			describe("typeof", function() {

				it("javascript types", function() {
					expect(_.typeof(6)).to.eql('number');
					expect(_.typeof(NaN)).to.eql('number');
					expect(_.typeof(Infinity)).to.eql('number');
					expect(_.typeof('s')).to.eql('string');
					expect(_.typeof([])).to.eql('array');
					expect(_.typeof({})).to.eql('object');
					expect(_.typeof(function(){})).to.eql('function');
					expect(_.typeof(null)).to.eql('null');
					expect(_.typeof(undefined)).to.eql('undefined');
				});

				it("custom types: named constructor", function() {
					function Animal() {} // make sure the constructor is a named function
					var animal = new Animal();

					expect(_.typeof(animal)).to.eql('object');
				});

				it("custom types: UNnamed constructor", function() {
					var Cat = function () {};  // unnamed constructor
					var cat = new Cat();

					expect(_.typeof(cat)).to.eql('object');
				});
			});
		});

		describe("prototype methods", function() {

			describe("del", function() {

				it("delete an element", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3
					};

					expect(obj.$.del(2)).to.deep.equal({
						x: 1,
						z: 3
					});
				});
			});

			describe("iterate", function() {

				it("simple iteration", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3
					};

					var sum = 0;

					obj.$.iterate(function(elm) {
						sum += elm;
					});

					expect(sum).to.equal(6);
				});

				it("iteration can be stoppped by returning false", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3
					};

					var sum = 0;

					obj.$.iterate(function(elm) {
						if(elm === 2) return false;

						sum += elm;
					});

					expect(sum).to.be.below(6);
				});

				it("will throw a TypeError if no callback function is provided", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3
					};

					expect(obj.$.iterate).to.throw(TypeError);
				});

				it("it is possible to pass a different context for the callback function", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3
					};

					var obj2 = {
						c: 1
					};

					var sum = 0;

					obj.$.iterate(function(elm) {
						sum += elm + this.c;
					}, obj2);

					expect(sum).to.equal(9);
				});
			});

			describe("filter", function() {

				it("simple filter", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3,
						t: 666
					};

					var result = obj.$.filter(function(elm) {
						return elm < 3;
					});

					expect(result).to.deep.equal([1,2]);
				});
			});

			describe("find", function() {

				it("simple find", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3,
						t: 666
					};

					expect(obj.$.find(function(elm) {return elm > 2})).to.deep.equal(3);
				});
			});

			describe("values", function() {

				it("simple values", function() {
					var obj = {
						x: 1,
						y: 2,
						z: 3,
						t: 666
					};

					expect(obj.$.values()).to.deep.equal([1,2,3,666]);
				});
			});
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

				    arr.$.append(['d', 'e']);

				    expect(arr).to.eql(['a', 'b', 'c', 'd', 'e']);
			    });
		    });

			describe("del", function() {

				it("delete one element", function() {
					var arr = ['a', 'b', 'c'];

					arr.$.del('a');

					expect(arr).to.eql(['b', 'c']);
				});

				it("delete one element that does not exists in the array", function() {
					var arr = ['a', 'b', 'c'];

					arr.$.del('d');

					expect(arr).to.eql(['a', 'b', 'c']);
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

					arr.$$.append(['d']).first().del('b');

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

		describe("iterate", function() {

			it("simple iterate", function() {
				var arr = [1, 2, 3];

				var sum = 0;

				arr.$.iterate(function(elm) {
					sum += elm;
				});

				expect(sum).to.eql(6);
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
					expect('one.two'.$.after('.t')).to.eql('wo');
				});

				it("negative after test", function() {
					expect('one'.$.after('.t')).to.eql('');
				});
			});

			describe("capitalize", function() {

				it("positive testcases", function() {
					expect('hello'.$.capitalize()).to.eql('Hello');
					expect('Hello'.$.capitalize()).to.eql('Hello');
				});

				it("empty string", function() {
					var empty_str = '';

					empty_str.$.capitalize();
					expect(empty_str).to.eql('');
				});
			});

		    describe("isUpperCase", function() {

			    it("positive uppercase case", function() {
				    expect('HF_GD123'.$.isUpperCase()).to.be.true;
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