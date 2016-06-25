define([
    'bottom_line'
], function(_) {

    describe("BitSet", function() {

        describe("add", function() {

            it("should be able to add a number/index", function() {
                var bs = new _.BitSet().add(6).add(14);

                var str = bs.stringify(-1);

                expect(str).to.eql('00000000000000000100000001000000');
                expect(str.length).to.eql(32);
            });

            it("should resize the bitset in case with the index falls out of bounds", function() {
                var bs = new _.BitSet().add(6).add(14).add(63);

                var str = bs.stringify(-1);

                expect(str).to.eql('1000000000000000000000000000000000000000000000000100000001000000');
                expect(str.length).to.eql(64);
            });

            it("should be able to set an index to 0", function() {
                var bs = new _.BitSet().add(6).add(6, 0);

                var str = bs.stringify(-1);

                expect(str).to.eql('00000000000000000000000000000000');
                expect(str.length).to.eql(32);
            });

        });

        describe("clone", function() {

            it("should be able to make a clone", function() {
                var bs  = new _.BitSet().add(6).add(14).add(63);
                var cln = bs.clone();

                expect(bs.equals(cln)).to.be.true;
                expect(bs === cln).to.be.false;
            });

        });

        describe("complement", function() {

            it("should be able to calculate the complement and trim any trailing bits", function() {
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

            it("should be able to calculate a simple difference", function() {
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

            it("should be able to calculate the reverse case (first < second)", function() {
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

        describe("each", function() {

            it("should be able to iterate over the bitset", function() {
                var bs      = new _.BitSet().add(6).add(14).add(62);
                var indices = [];

                var result = bs.each(function(val, i, bsi) {
                    indices.push(i);
                    expect(val).to.eql(1);
                    expect(bsi).to.eql(bs);
                });

                expect(indices).to.have.members([6, 14, 62]);
                expect(result).to.be.true;
            });

            it("should be able to prematurely break iteration", function() {
                var bs      = new _.BitSet().add(6).add(14).add(62);
                var indices = [];

                var result = bs.each(function(val, i, bsi) {
                    indices.push(i);
                    expect(val).to.eql(1);
                    expect(bsi).to.eql(bs);

                    return i !== 14
                });

                expect(indices).to.have.members([6, 14]);
                expect(result).to.be.false;
            });

        });

        describe("equals", function() {

            it("should be able to positively compare two bitsets", function() {
                var bs1 = new _.BitSet().add(6).add(14).add(62);
                var bs2 = new _.BitSet().add(6).add(14).add(62);

                expect(bs1.equals(bs2)).to.be.true;
            });

            it("should be able to positively compare two bitsets", function() {
                var bs1 = new _.BitSet().add(6).add(14).add(62);
                var bs2 = new _.BitSet().add(6).add(14).add(78);

                expect(bs1.equals(bs2)).to.be.false;
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

        describe("fits", function() {

            it("should be able to positively test if a mask fits", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62).add(123);
                var mask = new _.BitSet().add(6).add(14).add(62);

                expect(bs.fits(mask)).to.be.true;
            });

            it("should be able to positively test if a larger mask fits", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62).add(123);
                var mask = new _.BitSet().add(6).add(14).add(62).add(367, 0);

                expect(bs.fits(mask)).to.be.true;
            });

            it("should be able to negatively test if a mask don't fit", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62);
                var mask = new _.BitSet().add(6).add(14).add(78);

                expect(bs.fits(mask)).to.be.false;
            });

        });


        describe("flip", function() {

            it("should be able to flip a bit in the bitset", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62).add(123);

                bs
                    .flip(16)
                    .flip(14);

                expect(bs.get(16)).to.eql(1);
                expect(bs.get(14)).to.eql(0);
            });

            it("should be able to enlarge the bitset in case the flipdex is out of bounds", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62);

                bs
                    .flip(16)
                    .flip(123);

                expect(bs.get(16)).to.eql(1);
                expect(bs.get(123)).to.eql(1);
            });
        });

        describe("get", function() {

            it("should get the value of bits in the bitset", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62).add(123);

                expect(bs.get(16)).to.eql(0);
                expect(bs.get(14)).to.eql(1);
            });

            it("should return 0 if the index is out of bounds", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62);

                expect(bs.get(123)).to.eql(0);
            });
        });

        describe("has", function() {

            it("should return the correct boolean values for membership", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62);

                expect(bs.has(14)).to.be.true;
                expect(bs.has(16)).to.be.false;
                expect(bs.has(123)).to.be.false;
            });
        });

        xdescribe("union", function() {

            it("simple", function() {
                var bv1  = new _.BitSet(32)
                    .add(7)
                    .add(54)
                    .add(23);
                var bv2  = new _.BitSet(63)
                    .add(7)
                    .add(67)
                    .add(23);

                bv1.union(bv2);

                var str = bv1.stringify();

                expect(str).to.eql('000000010001000010000000');
                expect(str.length).to.eql(63);
            });
        });
    });
});
