/*
 * Just a reminder of how Javascript handles certain things
 */


describe("Extensions", function() {

	describe("Javascript", function() {

		describe("logical evaluations", function() {

			it("js types", function() {
				expect('0').to.be.ok;
				expect(-6).to.be.ok;
				expect(6).to.be.ok;
				expect(Infinity).to.be.ok;
				expect([]).to.be.ok;
				expect({}).to.be.ok;
				expect(function(){}).to.be.ok;

				expect(0).to.not.be.ok;
				expect("").to.not.be.ok;
				expect(NaN).to.not.be.ok;
				expect(null).to.not.be.ok;
				expect(undefined).to.not.be.ok;
			});
		});

		describe("enumerations", function() {
			var superProto = Object.create(Object.prototype);
			var proto      = Object.create(superProto);
			var obj        = Object.create(proto);

			Object.defineProperty(obj, 'a1', {value: 'a1', enumerable: true});
			Object.defineProperty(obj, 'b1', {value: 'b1', enumerable: false});
			Object.defineProperty(proto, 'a2', {value: 'a2', enumerable: true});
			Object.defineProperty(proto, 'b2', {value: 'b2', enumerable: false});
			Object.defineProperty(superProto, 'a3', {value: 'a3', enumerable: true});
			Object.defineProperty(superProto, 'b3', {value: 'b3', enumerable: false});

			it("for in: retrieves all 'enumerable' properties over de prototype chain", function() {
				var props = [];

				for(var prop in obj)
				{
					props.push(prop);
				}

				expect(props).to.eql(['a1', 'a2', 'a3']);
			});

			it("for in + hasOwnProperty: retrieves all 'enumerable' properties off the object itself", function() {
				var props = [];

				for(var prop in obj)
				{
					if(obj.hasOwnProperty(prop)) props.push(prop);
				}

				expect(props).to.eql(['a1']);
			});

			it("Object.keys: retrieves all 'enumerable' properties off the object itself", function() {
				expect(Object.keys(obj)).to.eql(['a1']);
			});
			// NOTE this is the only way to get non enumarable properties
			it("Object.get: retrieves all properties of the object itself", function() {
				expect(Object.getOwnPropertyNames(obj)).to.eql(['a1', 'b1']);
			});
		});

		describe("typeof", function() {

			it("javascript types", function() {
				expect(typeof 6).to.eql('number');
				expect(typeof NaN).to.eql('number');
				expect(typeof Infinity).to.eql('number');
				expect(typeof 's').to.eql('string');
				expect(typeof []).to.eql('object'); // counter intuitive
				expect(typeof {}).to.eql('object');
				expect(typeof function(){}).to.eql('function');
				expect(typeof null).to.eql('object'); // counter intuitive. Although only objects can have the value null...
				expect(typeof undefined).to.eql('undefined');
			});

			it("javascript types", function() {
				expect(new Number(6) instanceof Number).to.be.true;
				expect(6 instanceof Number).to.be.false;
				expect(new String('str') instanceof String).to.be.true;
				expect('str' instanceof String).to.be.false; // works only on objects
				expect([] instanceof Array).to.be.true; // counter intuitive
				expect({} instanceof Object).to.be.true;
				expect(function(){} instanceof Function).to.be.true;
				expect(null instanceof Object).to.be.false; // counter intuitive. Although only objects can have the value null...
				expect(undefined instanceof Object).to.be.false;
			});

			it("custom types: named constructor", function() {
				function Animal() {} // make sure the constructor is a named function
				var animal = new Animal();

				expect(typeof(animal)).to.eql('object');
			});

			it("custom types: UNnamed constructor", function() {
				var Cat = function () {};  // unnamed constructor
				var cat = new Cat();

				expect(typeof(cat)).to.eql('object');
			});
		});

		describe("instanceof", function() {

			it("javascript types", function() {
				expect(new Number(6) instanceof Number).to.be.true;
				expect(6 instanceof Number).to.be.false;
				expect(new String('str') instanceof String).to.be.true;
				expect('str' instanceof String).to.be.false; // works only on objects
				expect([] instanceof Array).to.be.true; // counter intuitive
				expect({} instanceof Object).to.be.true;
				expect(function(){} instanceof Function).to.be.true;
				expect(null instanceof Object).to.be.false; // counter intuitive. Although only objects can have the value null...
				expect(undefined instanceof Object).to.be.false;
			});

			it("custom types: named constructor", function() {
				function Animal() {} // make sure the constructor is a named function
				var animal = new Animal();

				expect(animal instanceof Animal).to.be.true;
			});

			it("custom types: UNnamed constructor", function() {
				var Cat = function () {};  // unnamed constructor
				var cat = new Cat();

				expect(cat instanceof Cat).to.be.true;
			});
		});

		describe("closures", function() {

			it("vars in closures continue to work as normal vars", function() {
				var setNummie;

				var clo = (function() {
				    var nummie = 555;

					var fnc = function() {
						return nummie;
					};

					setNummie = function(val) {
						nummie = val;
					};

					return fnc;
				})();

				expect(clo()).to.eql(555);

				setNummie(666);

				expect(clo()).to.eql(666);
			});
		});

		describe("getters/setters", function() {

			it("setters cannot return values", function() {
				var obj = {
					get x() {
						return this._x;
					},
					set x(val) {
						this._x = val;

						return this;
					}
				};

				expect((obj.x = 666)).to.equal(666);
			});
		});
	});
});