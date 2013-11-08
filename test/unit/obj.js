xdescribe("Object", function() {

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

	describe("Object prototype methods", function() {

		describe("delete", function() {

			it("delete an element", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				expect(obj.$.delete('y')).to.deep.equal({
					x: 1,
					z: 3
				});
			});

			it("delete an array of elements", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				expect(obj.$.delete(['x', 'z'])).to.deep.equal({
					y: 2
				});
			});

			it("delete based on function", function() {
				var obj = {
					x: 1,
					y: 2,
					xy: 4,
					z: 3
				};

				expect(obj.$.delete(function(key) {return key.$.startsWith('x')})).to.deep.equal({
					y: 2,
					z: 3
				});
			});
		});

		describe("each", function() {

			it("simple iteration", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				var sum = 0;

				obj.$.each(function(elm) {
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

				obj.$.each(function(elm) {
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

				expect(obj.$.each).to.throw(TypeError);
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

				obj.$.each(function(elm) {
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

		describe("pairs", function() {

			it("simple values", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3,
					t: 666
				};

				expect(obj.$.pairs()).to.deep.equal(['x', 1, 'y', 2, 'z', 3, 't', 666]);
			});
		});
	});
});