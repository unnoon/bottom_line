define([
    'bottom_line'
], function(_) {

    describe("BitVector", function() {

        describe("and", function() {

            it("simple", function() {
                var bv1 = new _.BitVector(64)
                    .set(7)
                    .set(12)
                    .set(16)
                    .set(28)
                    .set(50);

                var bv2 = new _.BitVector(24)
                    .set(12);

                bv2.and(bv1);

                var str = bv2.stringify();

                expect(str).to.eql('000000000001000000000000');
                expect(str.length).to.eql(24);
            });
        });

        describe("or", function() {

            it("simple", function() {
                var bv1 = new _.BitVector(64)
                    .set(7)
                    .set(16)
                    .set(28)
                    .set(50);

                var bv2 = new _.BitVector(24)
                    .set(12);

                bv2.or(bv1);

                var str = bv2.stringify();

                expect(str).to.eql('000000010001000010000000');
                expect(str.length).to.eql(24);
                expect(bv2.words[0]).to.eql(69760);
            });
        });
    });
});
