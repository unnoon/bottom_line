describe("Object", function() {

	describe("Object prototype methods", function() {

		describe("keys", function() {

			it("simple keys", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				expect(obj.bl.keys()).to.eql(['x', 'y', 'z']);
			});

		});

        describe("chaining", function() {

            it("simple simple", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj.bl.chain
                    .faux()
                    .keys()
                    .value
                ).to.eql(['x', 'y', 'z']);
            });

        });

        describe("chaining different types", function() {

            it("simple simple", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj.bl.chain
                        .faux()
                        .keys()
                        .first()
                        .value
                ).to.eql('x');
            });

        });

        describe("safe chaining", function() {

            it("simple simple", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj.bl.$chain
                        .faux()
                        .keys()
                        .value
                ).to.eql(['x', 'y', 'z']);
            });

        });
        // FIXME this is currently not possuble
        xdescribe("safe chaining different types", function() {

            it("simple safe chain", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj.bl.$chain
                        .faux()
                        .keys()
                        .first()
                        .value
                ).to.eql('x');
            });

        });
    });

    xdescribe("static methods", function() {

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

        describe("cloneDeep", function() {

            it("simple clone", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3,
                    t: {z: 666}
                };
                var clone = _.cloneDeep(obj);
                expect(clone).to.deep.equal({
                    x: 1,
                    y: 2,
                    z: 3,
                    t: {z: 666}
                });
                obj.t.z = 777;

                expect(clone.t.z).to.equal(666);
                expect(clone).to.not.equal(obj);
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


            it("don't override/overwrite properties", function() {
                var obj = {
                    x: 1,
                    y: 2
                };
                var module = {
                    toLocaleString: 'aap',
                    y:7,
                    prop: 666
                };

                _.extend(obj,{override:false, overwrite:false}, module);

                expect(obj.x).to.equal(1);
                expect(obj.y).to.equal(2);
                expect(obj.prop).to.equal(666);
                expect(typeof(obj.toLocaleString)).to.equal('function');
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
});