describe("Bottom_Line._.⌡S", function() {

	describe("bottom line js", function() {

		it("singular", function() {
			var names    = ['bobby', 'jean'];
			var namesExt = names._.append(['xavier']);

			expect(namesExt).to.eql(['bobby', 'jean', 'xavier']);

			expect(names._.has('jean')).to.equal(true);
		});

		it("chaining", function() {
			var names = ['bobby', 'jean'];

			names._.chain
                .append(['xavier'])
                .without('bobby');

			expect(names).to.eql(['jean', 'xavier']);
		});

		it("chaining different types", function() {
			var arr = [4,5,6,2];

			expect(arr._.chain
                .without(2)
                .min()
                .bound(1, 3)
                .between(2,4)
                .value
            ).to.be.true;
		});

		it("singular type chaining", function() {
			var arr = [4,5,6,2];

			expect(arr._.chain
                .min()
                .bound(-1, 1)
                .value
            ).to.equal(1);
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

					_.each(obj, function(e) {values.push(e)});

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