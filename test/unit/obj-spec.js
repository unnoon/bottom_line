define([
    'bottom_line'
], function(_) {

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

            it("clone primitives", function() {
                expect(_.clone(null)).to.deep.equal(null);
                expect(_.clone(undefined)).to.deep.equal(undefined);
                expect(_.clone(666)).to.deep.equal(666);
            });

            it("should clone object properties", function() {
                var obj1 = {x:1}; Object.freeze(obj1);
                var obj2 = {x:2}; Object.seal(obj2);
                var obj3 = {x:3}; Object.preventExtensions(obj3);

                var cln1 = _.clone(obj1);
                var cln2 = _.clone(obj2);
                var cln3 = _.clone(obj3);

                expect(Object.isFrozen(cln1)).to.be.true;
                expect(Object.isSealed(cln2)).to.be.true;
                expect(Object.isExtensible(cln3)).to.be.false;
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
                var clone = _.clone('deep', obj);

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

            it("complex clone", function() {

                var obj = {
                    x: 1,
                    y: [{y1: {circ: null}}, {}],
                    z: 3,
                    t: {z: 666}
                };

                obj.y[0].y1.circ = obj;

                var cobj = {
                    x: 1,
                    y: [{y1: {circ: null}}, {}],
                    z: 3,
                    t: {z: 666}
                };

                cobj.y[0].y1.circ = cobj;

                var clone = _.clone('deep', obj);

                expect(clone).to.deep.equal(cobj);
                obj.t.z = 777;

                expect(clone.t.z).to.equal(666);
                expect(clone).to.not.equal(obj);
                expect(clone.y[0].y1.circ).to.equal(clone);
            });

            it("simple clone.deep", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3,
                    t: {z: 666}
                };
                var clone = _.clone.deep(obj);

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

            it("getters & setters", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    nest: {
                        birdo: 'the egg shooter'
                    }
                };

                var module = {
                    toLocaleString: 'aap',
                    y:7,
                    prop: 666,
                    get theX() {
                        return this.nest.birdo;
                    },
                    set theX(val) {
                        this.nest.birdo = val
                    }
                };

                _.extend(obj, module);

                obj.theX = 'smb2';
                expect(obj.theX).to.equal('smb2');
                expect(obj.nest.birdo).to.equal('smb2');
            });

		});

        describe("isEmpty", function() {

            it("simple cases", function() {
                expect(_.isEmpty({g:4})).to.be.false;
                expect(_.isEmpty({})).to.be.true;
            });
        });

        describe("isString", function() {

            it("simple cases", function() {
                expect(_.isString('')).to.be.true;
                expect(_.isString('string')).to.be.true;
                expect(_.isString(new String('string'))).to.be.true;
                expect(_.isString({})).to.be.false;
                expect(_.isString(null)).to.be.false;
                expect(_.isString(undefined)).to.be.false;
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
                expect(_.typeOf(new String('s'))).to.eql('string');
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

        describe("names", function() {

            it("simple cases", function() {
                expect(_.names(null)).to.deep.equal([]);
                expect(_.names(undefined)).to.deep.equal([]);
                expect(_.names()).to.deep.equal([]);
                expect(_.names({x: 666, y: 777})).to.deep.equal(['x', 'y']);
                expect(_.names([1, 2])).to.deep.equal(['0', '1', 'length']);
            });
        });


        describe("owner", function() {
            var proto1 = {x: 666};
            var proto2 = Object.create(proto1, {y: {value: 777}});
            var obj    = Object.create(proto2, {z: {value: 888}});

            it("simple cases", function() {
                expect(_.owner('x', obj)).to.deep.equal(proto1);
                expect(_.owner('y', obj)).to.deep.equal(proto2);
                expect(_.owner('z', obj)).to.deep.equal(obj);
            });
        });
	});

	describe("Object prototype methods", function() {

        describe("constant", function() {

            it("simple", function() {
                var obj = {};

                obj._.constant('x', 666);

                var dsc = Object.getOwnPropertyDescriptor(obj, 'x');

                expect(dsc.configurable).to.be.false;
                expect(dsc.writable).to.be.false;
                expect(dsc.enumerable).to.be.true;
            });
        });

        describe("countFn", function() {

            it("simple simple", function() {
                var obj = {x: 666, y: 777, z: 888};

                expect(obj._.countFn(function(v) {return v < 800})).to.deep.equal(2);
            });

        });

        describe("chaining", function() {

            it("simple simple", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj._.chain
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

                expect(obj._.chain
                        .keys()
                        .first()
                        .value
                ).to.equal('x');
            });

        });

        describe("safe chaining", function() {

            it("simple simple", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj._.chain
                        .names()
                        .keys()
                        .value
                ).to.eql(['0', '1', '2']);
            });

        });

        describe("safe chaining different types", function() {

            it("simple safe chain", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj._.chain
                        .keys()
                        .first()
                        .value
                ).to.eql('x');
            });
        });

        describe("define: shortcut to defineProperty", function() {

            it("simple", function() {
                var obj = {x: 666, y: 777};

                obj._.define('z', {value: 777});

                expect(obj.z).to.deep.equal(777);
            });

        });

        describe("descriptor without own property check", function() {

            var proto1 = {x: 666};
            var proto2 = Object.create(proto1, {y: {value: 777}});
            var obj    = Object.create(proto2, {z: {value: 888}});

            it("simple cases", function() {
                expect(obj._.descriptor('x').value).to.deep.equal(666);
            });
        });

        describe("eachDsc", function() {
            var obj    = {x: 666, y: 777};
            var values = [];

            obj._.eachDsc(function(dsc) {values.push(dsc.value)});

            it("simple cases", function() {
                expect(values).to.deep.equal([666, 777]);
            });
        });

        describe("each$", function() {
            var proto1 = {x: 666};
            var proto2 = Object.create(proto1, {y: {value: 777, enumerable: true}});
            var obj    = Object.create(proto2, {z: {value: 888, enumerable: true}});

            var values = [];

            obj._.each$(function(v) {values.push(v)});

            it("simple cases", function() {
                expect(values).to.deep.equal([888, 777, 666]);
            });
        });

        describe("each$Dsc", function() {
            var proto1 = {x: 666};
            var proto2 = Object.create(proto1, {y: {value: 777, enumerable: true}});
            var obj    = Object.create(proto2, {z: {value: 888, enumerable: true}});

            var values = [];

            obj._.each$Dsc(function(dsc) {values.push(dsc.value)});

            it("simple cases", function() {
                expect(values).to.deep.equal([888, 777, 666]);
            });
        });

        describe("eachRight", function() {
            var obj    = {x: 666, y: 777, z: 888};
            var values = [];

            obj._.eachRight(function(v) {values.push(v)});

            it("simple cases", function() {
                expect(values).to.deep.equal([888, 777, 666]);
            });
        });

        describe("eachDscRight", function() {
            var obj    = {x: 666, y: 777, z: 888};
            var values = [];

            obj._.eachDscRight(function(dsc) {values.push(dsc.value)});

            it("simple cases", function() {
                expect(values).to.deep.equal([888, 777, 666]);
            });
        });

        describe("findRight", function() {
            var obj    = {x: 666, y: 777, z: 888, q: 999};

            it("simple cases", function() {
                expect(obj._.findRight(function(v) {return v > 800})).to.deep.equal(999);
                expect(obj._.findRight(function(v) {return v < 100})).to.deep.equal(undefined);
            });
        });

        describe("hasFn", function() {
            var obj    = {x: 666, y: 777, z: 888, q: 999};

            it("simple cases", function() {
                expect(obj._.hasFn(function(v) {return v > 888})).to.be.true;
                expect(obj._.hasFn(function(v) {return v > 1000})).to.be.false;
            });
        });

        describe("instanceOf", function() {

            it("prototype", function() {
                var fproto = function() {};
                var proto1 = {x: 666};
                var proto2 = Object.create(proto1, {y: {value: 777, enumerable: true}});
                var obj    = Object.create(proto2, {z: {value: 888, enumerable: true}});

                expect(obj._.instanceOf(proto1)).to.be.false;
                expect(obj._.instanceOf(proto2)).to.be.true;
                expect(obj._.instanceOf(fproto)).to.be.false;
            });

            it("functional", function() {
                var Fake = function() {};
                var Class1 = function () {this.x = 666};
                var Class2 = function () {this.y = 777};

                Class2.prototype = Object.create(Class1.prototype);
                Class2.prototype.constructor = Class2;

                var obj = new Class2;

                expect(obj._.instanceOf(Class1)).to.be.false;
                expect(obj._.instanceOf(Class2)).to.be.true;
                expect(obj._.instanceOf(Fake)).to.be.false;
            });
        });

        describe("keyOfFn", function() {

            it("simple", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3
                };

                expect(obj._.keyOfFn(function(v) {return v > 2})).to.eql('z');
            });

        });

		describe("keys", function() {

			it("simple keys", function() {
				var obj = {
					x: 1,
					y: 2,
					z: 3
				};

				expect(obj._.keys()).to.eql(['x', 'y', 'z']);
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

				obj._.each(function(elm) {
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

				obj._.each(function(elm) {
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

				expect(obj._.each).to.throw(TypeError);
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

				obj._.each(function(elm) {
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

				var result = obj._.filter(function(elm) {
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

				expect(obj._.find(function(elm) {return elm > 2})).to.deep.equal(3);
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

				expect(obj._.pairs()).to.deep.equal(['x', 1, 'y', 2, 'z', 3, 't', 666]);
			});
		});

        describe("proto", function() {

            it("get", function() {
                var proto = {
                    x: 1,
                    y: 2,
                    z: 3,
                    t: 666
                };

                var obj = Object.create(proto);

                expect(obj._.proto()).to.deep.equal(proto);
            });

            it("set", function() {
                var proto = {
                    x: 1,
                    y: 2,
                    z: 3,
                    t: 666
                };

                var obj = {}._.proto(proto);

                expect(obj._.proto()).to.deep.equal(proto);
            });
        });

        describe("toString: fake toString", function() {

            it("simple values", function() {
                var obj = {
                    x: 1
                };

                expect(obj._.toString()).to.deep.equal('');
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

				expect(obj._.values()).to.deep.equal([1,2,3,666]);
			});
		});

        describe("_size", function() {

            it("simple values", function() {
                var obj = {
                    x: 1,
                    y: 2,
                    z: 3,
                    t: 666
                };

                expect(obj._.size()).to.deep.equal(4);
            });
        });

        describe("_stringify", function() {

            it("simple _stringify", function() {
                var obj = {x: 1, y: 2, z: 3};

                expect(obj._.stringify()).to.eql('{x: 1, y: 2, z: 3}');
            });

            it("complex _stringify", function() {
                var obj = {
                    x: 1,
                    str: 'aap',
                    z: 3,
                    arr: [[6, 6], [7, 7, [8]]],
                    fnc: function() {},
                    obj: {xt: 666, arr: [{really: 'yes'}]}
                };

				// we remove spaces to regard for differences in spacing from for example stringify of functions
				var expected = '{x: 1, str: aap, z: 3, arr: [[6, 6], [7, 7, [8]]], fnc: function () {}, obj: {xt: 666, arr: [{really: yes}]}}'.replace(/\s/g, '');
				var result   = obj._.stringify().replace(/\s/g, '');

                expect(result).to.eql(expected);
            });

			it("falsey _stringify", function() {
				var obj = {
					x: 0,
					y: undefined,
					z: null,
					a: NaN,
					b: 0,
					c: '',
					d: false,
					e: 666,
					f: {x: 0, y:1}
				};

				expect(obj._.stringify()).to.eql('{x: 0, y: undefined, z: null, a: NaN, b: 0, c: , d: false, e: 666, f: {x: 0, y: 1}}');
			});
        });

		describe("remove", function() {

			it("remove by value", function() {
				var obj = {x: 1,y: 2,z: 3,t: 2};

				obj._.remove(2);

				expect(obj).to.eql({x: 1,z: 3,t: 2});
			});

			it("remove multiple values", function() {
				var obj = {x: 1,y: 2,z: 3,t: 2};

				obj._.remove(2,3);

				expect(obj).to.eql({x: 1,t: 2});
			});

			it("remove function", function() {
				var obj = {x: 1,y: 2,z: 3,t: 666 };

				obj._.removeFn(function(val) {
					return val > 2;
				});

				expect(obj).to.eql({x: 1,y: 2,t: 666});
			});
		});

        describe("Remove", function() {

            it("Remove one element", function() {
                var obj = { x: 1,y: 2,z: 3,t: 2};

                expect(obj._.Remove(2)).to.eql({ x: 1,z: 3,t: 2});
                expect(obj).to.eql({ x: 1,y: 2,z: 3,t: 2});
            });

            it("Remove multiple values", function() {
                var obj = { x: 1,y: 2,z: 3,t: 2};

                expect(obj._.Remove(2, 1)).to.eql({z: 3,t: 2});
                expect(obj).to.eql({ x: 1,y: 2,z: 3,t: 2});
            });

            it("Remove function", function() {
                var obj = {x: 'a',y: 'b', z: 'bb',t: 't'};

                expect(obj._.RemoveFn(function(val) {
                    return val._.startsWith('b');
                })).to.eql({x: 'a', z: 'bb',t: 't'});
                expect(obj).to.eql({x: 'a',y: 'b', z: 'bb',t: 't'});
            });
        });

        describe("remove$", function() {

            it("remove$ by value", function() {
                var obj = {x: 1,y: 2,z: 3,t: 2};

                obj._.remove$(2);

                expect(obj).to.eql({x: 1,z: 3});
            });

            it("remove$ multiple values", function() {
                var obj = {x: 1,y: 2,z: 3,t: 2, p:3};

                obj._.remove$(2,3);

                expect(obj).to.eql({x: 1});
            });

            it("remove$ function", function() {
                var obj = {x: 1,y: 2,z: 3,t: 666 };

                obj._.remove$Fn(function(val) {
                    return val > 2;
                });

                expect(obj).to.eql({x: 1,y: 2});
            });
        });

        describe("Remove$", function() {

            it("Remove$ one element", function() {
                var obj = { x: 1,y: 2,z: 3,t: 2};

                expect(obj._.Remove$(2)).to.eql({ x: 1,z: 3});
                expect(obj).to.eql({ x: 1,y: 2,z: 3,t: 2});
            });

            it("Remove$ multiple values", function() {
                var obj = { x: 1,y: 2,z: 3,t: 2};

                expect(obj._.Remove$(2, 1)).to.eql({z: 3});
                expect(obj).to.eql({ x: 1,y: 2,z: 3,t: 2});
            });

            it("Remove$ function", function() {
                var obj = {x: 'a',y: 'b', z: 'bb',t: 't'};

                expect(obj._.Remove$Fn(function(val) {
                    return val._.startsWith('b');
                })).to.eql({x: 'a',t: 't'});
                expect(obj).to.eql({x: 'a',y: 'b', z: 'bb',t: 't'});
            });
        });        
        
		describe("del", function() {

			it("del", function() {
				var obj = {x: 1,y: 2,z: 3};

				expect(obj._.del('y')).to.deep.equal({x: 1,z: 3});
			});

			it("del an array of elements", function() {
				var obj = {x: 1,y: 2,z: 3};

				expect(obj._.del('x', 'z')).to.deep.equal({y: 2});
			});

			it("del based on function", function() {
				var obj = {x: 1,y: 2,xy: 4,z: 3};

				expect(obj._.delFn(function(key) {return key._.startsWith('x')})).to.deep.equal({y: 2,z: 3});
			});
		});

        describe("Del", function() {

            it("Del", function() {
                var obj = {x: 1,y: 2,z: 3};

                expect(obj._.Del('y')).to.deep.equal({x: 1,z: 3});
                expect(obj).to.eql({x: 1,y: 2,z: 3})
            });

            it("Del an array of elements", function() {
                var obj = {x: 1,y: 2,z: 3};

                expect(obj._.Del('x', 'z')).to.deep.equal({y: 2});
                expect(obj).to.eql({x: 1,y: 2,z: 3})
            });

            it("Del based on function", function() {
                var obj = {x: 1,y: 2,xy: 4,z: 3};

                expect(obj._.DelFn(function(key) {return key._.startsWith('x')})).to.deep.equal({y: 2,z: 3});
                expect(obj).to.eql({x: 1,y: 2,xy: 4,z: 3})
            });
        });
	});
});
});