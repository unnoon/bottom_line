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
	});

	describe("Object prototype methods", function() {

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

			// FIXME somehow catching a type error doesn't work...
//			xit("will throw a TypeError if no callback function is provided", function() {
//				var obj = {
//					x: 1,
//					y: 2,
//					z: 3
//				};
//
//				expect(obj._.each()).to.throw(TypeError);
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