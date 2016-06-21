define([
    'bottom_line'
], function(_) {

    describe("BitSet", function() {

        describe("add", function() {

            it("simple", function() {
                var bs = new _.BitSet().add(6).add(14);

                var str = bs.stringify(-1);

                expect(str).to.eql('00000000000000000100000001000000');
                expect(str.length).to.eql(32);
            });

            it("with resize", function() {
                var bs = new _.BitSet().add(6).add(14).add(63);

                var str = bs.stringify(-1);

                expect(str).to.eql('1000000000000000000000000000000000000000000000000100000001000000');
                expect(str.length).to.eql(64);
            });

        });

        describe("clone", function() {

            it("simple case", function() {
                var bs  = new _.BitSet().add(6).add(14).add(63);
                var cln = bs.clone();

                expect(bs.equals(cln)).to.be.true;
                expect(bs === cln).to.be.false;
            });

        });

        describe("complement", function() {

            it("simple case", function() {
                var bs  = new _.BitSet().add(6).add(14).add(62);

                bs.complement();

                var str = bs.stringify(2);

                expect(str).to.eql('011111111111111111111111111111111111111111111111011111110111111');
                expect(str.length).to.eql(63);

                var str_full = bs.stringify(-1);

                expect(str_full).to.eql('0011111111111111111111111111111111111111111111111011111110111111');
                expect(str_full.length).to.eql(64);
            });

        });

        describe("difference", function() {

            it("simple difference", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(6).add(16);

                bs1.difference(bs2);

                var str = bs1.stringify(2);

                expect(str).to.eql('100000000000000000000000000000000000000000000000100000000000000');
                expect(str.length).to.eql(63);

                var str_full = bs1.stringify(-1);

                expect(str_full).to.eql('0100000000000000000000000000000000000000000000000100000000000000');
                expect(str_full.length).to.eql(64);
            });

            it("reverse case", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet(20).add(6).add(16);

                bs2.difference(bs1);

                var str = bs2.stringify(2);

                expect(str).to.eql('00010000000000000000');
                expect(str.length).to.eql(20);

                var str_full = bs2.stringify(-1);

                expect(str_full).to.eql('00000000000000010000000000000000');
                expect(str_full.length).to.eql(32);
            });            
            
        });

        describe("exclusion", function() {

            it("simple symmetric difference", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(6).add(16);

                bs1.exclusion(bs2);

                var str = bs1.stringify(2);

                expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
                expect(str.length).to.eql(63);

                var str_full = bs1.stringify(-1);

                expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
                expect(str_full.length).to.eql(64);
            });

            it("reverse case (exclusion)", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet(20).add(6).add(16);

                bs2.exclusion(bs1);

                var str = bs2.stringify(2);

                expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
                expect(str.length).to.eql(63);

                var str_full = bs2.stringify(-1);

                expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
                expect(str_full.length).to.eql(64);
            });

        });

        xdescribe("and", function() {

            it("simple", function() {
                var bv1 = new _.BitSet(64)
                    .set(7)
                    .set(12)
                    .set(16)
                    .set(28)
                    .set(50);

                var bv2 = new _.BitSet(24)
                    .set(12);

                bv2.and(bv1);

                var str = bv2.stringify();

                expect(str).to.eql('000000000001000000000000');
                expect(str.length).to.eql(24);
            });
        });

        xdescribe("or", function() {

            it("simple", function() {
                var bv1 = new _.BitSet(64)
                    .set(7)
                    .set(16)
                    .set(28)
                    .set(50);

                var bv2 = new _.BitSet(24)
                    .set(12);

                bv2.or(bv1);

                var str = bv2.stringify();

                expect(str).to.eql('000000010001000010000000');
                expect(str.length).to.eql(24);
                expect(bv2.words[0]).to.eql(69760);
            });
        });

        xdescribe("union", function() {

            it("simple", function() {
                var bv1  = new _.BitSet(32)
                    .set(7)
                    .set(54)
                    .set(23);
                var bv2  = new _.BitSet(63)
                    .set(7)
                    .set(67)
                    .set(23);

                bv1.union(bv2);

                var str = bv1.stringify();

                expect(str).to.eql('000000010001000010000000');
                expect(str.length).to.eql(63);
            });
        });
    });
});
