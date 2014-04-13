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
					_a: 'jeweetzelluf',
					get a() {
						return this._a;
					}
				};

				_.extend(obj, module);

				expect(obj.fnc()).to.equal('tralala');
				expect(obj.prop).to.equal(666);
				expect(obj.a).to.equal('jeweetzelluf');

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

				expect(_.typeOf(animal)).to.eql('object');
			});

			it("custom types: UNnamed constructor", function() {
				var Cat = function () {};  // unnamed constructor
				var cat = new Cat();

				expect(_.typeOf(cat)).to.eql('object');
			});
		});
	});

	describe("Object prototype methods", function() {

		describe("each", function() {

			it("simple iteration", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				var sum = 0;

				obj._each(function(elm) {
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

				obj._each(function(elm) {
					if(elm === 2) return false;

					sum += elm;
				});

				expect(sum).to.be.below(6);
			});

			// FIXME somehow catching a type error doesn't work...
//			xit("will throw a TypeError if no callback function is provided", function() {
//				var obj = {
//					x: 1,
//					y: 2,
//					z: 3
//				};
//
//				expect(obj._each()).to.throw(TypeError);
//			});

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

				obj._each(function(elm) {
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

				var result = obj._filter(function(elm) {
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

				expect(obj._find(function(elm) {return elm > 2})).to.deep.equal(3);
			});
		});

		describe("pairs", function() {

			it("simple values", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3,
					t: 666
				};

				expect(obj._pairs()).to.deep.equal(['x', 1, 'y', 2, 'z', 3, 't', 666]);
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

				expect(obj._values()).to.deep.equal([1,2,3,666]);
			});
		});

        describe("length", function() {

            it("simple values", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3,
                    t: 666
                };

                expect(obj._length).to.deep.equal(4);
            });
        });

		describe("without by value", function() {

			it("without one element", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3,
					t: 2
				};

				obj._without(2);

				expect(obj).to.eql({
					x: 1,
					z: 3,
					t: 2
				});
			});

			it("without multiple values", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3,
					t: 2
				};

				obj._without([2,3]);

				expect(obj).to.eql({
					x: 1,
					t: 2
				});
			});

			it("without function", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3,
					t: 666
				};

				obj._without(function(val) {
					return val > 2;
				});

				expect(obj).to.eql({
					x: 1,
					y: 2,
					t: 666
				});
			});
		});

        describe("$without by value", function() {

            it("$without one element", function() {
                var obj = { x: 1,y: 2,z: 3,t: 2};

                expect(obj._$without(2)).to.eql({ x: 1,z: 3,t: 2});
                expect(obj).to.eql({ x: 1,y: 2,z: 3,t: 2});
            });

            it("$without multiple values", function() {
                var obj = { x: 1,y: 2,z: 3,t: 2};

                expect(obj._$without([2, 1])).to.eql({z: 3,t: 2});
                expect(obj).to.eql({ x: 1,y: 2,z: 3,t: 2});
            });

            it("$without multiple values", function() {
                var obj = {x: 'a',y: 'b', z: 'bb',t: 't'};

                expect(obj._$without(function(val) {
                    return val._startsWith('b');
                })).to.eql({x: 'a', z: 'bb',t: 't'});
                expect(obj).to.eql({x: 'a',y: 'b', z: 'bb',t: 't'});
            });
        });

		describe("withoutKeys", function() {

			it("withoutKeys", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				expect(obj._withoutKeys('y')).to.deep.equal({
					x: 1,
					z: 3
				});
			});

			it("withoutKeys an array of elements", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				expect(obj._withoutKeys(['x', 'z'])).to.deep.equal({
					y: 2
				});
			});

			it("withoutKeys based on function", function() {
				var obj = {
					x: 1,
					y: 2,
					xy: 4,
					z: 3
				};

				expect(obj._withoutKeys(function(key) {return key._startsWith('x')})).to.deep.equal({
					y: 2,
					z: 3
				});
			});
		});
	});
});