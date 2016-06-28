define([
    'bottom_line'
], function(_) {

    // before(function() {
    //     sinon.stub(console, 'warn');
    // });

    describe("BitSet", function() {

        describe("add", function() {

            it("should be able to add a number/index", function() {
                var bs = new _.BitSet().add(6).add(14);

                var str = bs.toString(-1);

                expect(str).to.eql('00000000000000000100000001000000');
                expect(str.length).to.eql(32);
            });

            it("should resize the bitset in case with the index falls out of bounds", function() {
                var bs = new _.BitSet().add(6).add(14).add(63);

                var str = bs.toString(-1);

                expect(str).to.eql('1000000000000000000000000000000000000000000000000100000001000000');
                expect(str.length).to.eql(64);
            });

            it("should be able to set an index to 0", function() {
                var bs = new _.BitSet().add(6).add(6, 0);

                var str = bs.toString(-1);

                expect(str).to.eql('00000000000000000000000000000000');
                expect(str.length).to.eql(32);
            });

        });

        describe("cardinality", function() {

            it("should return the cardinality of a set", function() {
                var bs  = new _.BitSet().add(6).add(14).add(63);

                expect(bs.cardinality).to.eql(3);
            });

            it("should return 0 if the bitset is empty", function() {
                var bs  = new _.BitSet();

                expect(bs.cardinality).to.eql(0);
            });

            it("should return a warning in case one tries to set the cardinality", function() {
                var bs  = new _.BitSet();

                bs.cardinality = 6;

                expect(console.warn.calledWith('Cardinality is read only')).to.be.true;
            });
        });

        describe("clear", function() {

            it("should clear a bitset retaining length", function() {
                var bs  = new _.BitSet().add(6).add(14).add(63);
                var cln = bs.clear();

                expect(bs.isEmpty()).to.be.true;
                expect(bs.length).to.eql(64);
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

                var str = bs.toString(2);

                expect(str).to.eql('011111111111111111111111111111111111111111111111011111110111111');
                expect(str.length).to.eql(63);

                var str_full = bs.toString(-1);

                expect(str_full).to.eql('0011111111111111111111111111111111111111111111111011111110111111');
                expect(str_full.length).to.eql(64);
            });

        });

        describe("difference", function() {

            it("should be able to calculate a simple difference", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(6).add(16);

                bs1.difference(bs2);

                var str = bs1.toString(2);

                expect(str).to.eql('100000000000000000000000000000000000000000000000100000000000000');
                expect(str.length).to.eql(63);

                var str_full = bs1.toString(-1);

                expect(str_full).to.eql('0100000000000000000000000000000000000000000000000100000000000000');
                expect(str_full.length).to.eql(64);
            });

            it("should be able to calculate the reverse case (first < second)", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet(20).add(6).add(16);

                bs2.difference(bs1);

                var str = bs2.toString(2);

                expect(str).to.eql('00010000000000000000');
                expect(str.length).to.eql(20);

                var str_full = bs2.toString(-1);

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

                    return i < 14
                });

                expect(indices).to.have.members([6, 14]);
                expect(result).to.be.false;
            });

        });

        describe("each$", function() {

            it("should be able to iterate the complete bitarray", function() {
                var bs      = new _.BitSet().add(6).add(14).add(62);
                var zeros = 0;
                var ones  = 0;

                var result = bs.each$(function(val, i, bsi) {
                    zeros += val === 0;
                    ones  += val === 1;
                    expect(bsi).to.eql(bs);
                });

                expect(zeros).to.eql(60);
                expect(ones).to.eql(3);
                expect(result).to.be.true;
            });

            it("should be able to prematurely break iteration", function() {
                var bs      = new _.BitSet().add(6).add(14).add(62);
                var zeros = 0;
                var ones  = 0;

                var result = bs.each$(function(val, i, bsi) {
                    zeros += val === 0;
                    ones  += val === 1;
                    expect(bsi).to.eql(bs);

                    return i < 14
                });

                expect(zeros).to.eql(13);
                expect(ones).to.eql(2);
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

                var str = bs1.toString(2);

                expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
                expect(str.length).to.eql(63);

                var str_full = bs1.toString(-1);

                expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
                expect(str_full.length).to.eql(64);
            });

            it("reverse case (exclusion)", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet(20).add(6).add(16);

                bs2.exclusion(bs1);

                var str = bs2.toString(2);

                expect(str).to.eql('100000000000000000000000000000000000000000000010100000000000000');
                expect(str.length).to.eql(63);

                var str_full = bs2.toString(-1);

                expect(str_full).to.eql('0100000000000000000000000000000000000000000000010100000000000000');
                expect(str_full.length).to.eql(64);
            });

        });

        describe("contains", function() {

            it("should be able to positively test if a mask contains", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62).add(123);
                var mask = new _.BitSet().add(6).add(14).add(62);

                expect(bs.contains(mask)).to.be.true;
            });

            it("should be able to positively test if a larger mask contains", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62).add(123);
                var mask = new _.BitSet().add(6).add(14).add(62).add(367, 0);

                expect(bs.contains(mask)).to.be.true;
            });

            it("should be able to negatively test if a mask don't fit", function() {
                var bs   = new _.BitSet().add(6).add(14).add(62);
                var mask = new _.BitSet().add(6).add(14).add(78);

                expect(bs.contains(mask)).to.be.false;
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

        describe("intersection", function() {

            it("should calculate the intersection between 2 sets", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(6).add(14);

                bs1.intersection(bs2);

                var str = bs1.toString();

                expect(str).to.eql('{6, 14}');
            });

            it("should be able to handle not intersecting sets", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(8).add(345);

                bs1.intersection(bs2);

                var str = bs1.toString();

                expect(str).to.eql('{}');
            });
        });

        describe("intersects", function() {

            it("should calculate if two sets intersect", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(6).add(14);

                expect(bs1.intersects(bs2)).to.true;
            });

            it("should return in case two do not intersect", function() {
                var bs1  = new _.BitSet().add(6).add(14).add(62);
                var bs2  = new _.BitSet().add(8).add(345);

                expect(bs1.intersects(bs2)).to.false;
            });
        });

        describe("isEmpty", function() {

            it("should return true is a set is empty", function() {
                var bs  = new _.BitSet(588);

                expect(bs.isEmpty()).to.true;
            });

            it("should return false in case a set is non empty", function() {
                var bs  = new _.BitSet().add(6).add(14).add(62);

                expect(bs.isEmpty()).to.false;
            });
        });

        describe("length", function() {

            it("should return the length of the underlying bitvector", function() {
                var bs  = new _.BitSet().add(6).add(14).add(63);

                expect(bs.length).to.eql(64);
            });

            it("should return 0 if the bitset is empty", function() {
                var bs  = new _.BitSet().resize(0);

                expect(bs.length).to.eql(0);
            });

            it("should give a waring if one tries to set the length", function() {
                var bs  = new _.BitSet();

                bs.length = 6;

                expect(console.warn.calledWith('Length is read only')).to.be.true;
            });
        });

        describe("max", function() {

            it("should return the max index of a bitset", function() {
                var bs  = new _.BitSet(588).add(9).add(14);

                expect(bs.max()).to.eql(14);
            });

            it("should return undefined in case the set is empty", function() {
                var bs  = new _.BitSet(666);

                expect(bs.max()).to.be.undefined;
            });
        });

        describe("min", function() {

            it("should return the min index of a bitset", function() {
                var bs  = new _.BitSet(588).add(9).add(14);

                expect(bs.min()).to.eql(9);
            });

            it("should return the min index of a bitset", function() {
                var bs  = new _.BitSet(588).add(400).add(324);

                expect(bs.min()).to.eql(324);
            });

            it("should return undefined in case the set is empty", function() {
                var bs  = new _.BitSet(666);

                expect(bs.min()).to.be.undefined;
            });
        });

        describe("remove", function() {

            it("should be able to remove an index", function() {
                var bs  = new _.BitSet().add(9).add(14).add(200);

                var str = bs.remove(14).remove(45).toString();

                expect(str).to.eql('{9, 200}');
            });

            it("should increase the length in case the index falls out of bounds", function() {
                var bs  = new _.BitSet().add(9).add(14).add(200);

                var str = bs.remove(14).remove(45).remove(400).toString();

                expect(str).to.eql('{9, 200}');
                expect(bs.length).to.eql(401);
            });
        });

        describe("resize", function() {

            it("should be able to resize a bitset to a bigger size", function() {
                var bs  = new _.BitSet().add(9).add(14).add(200);

                bs.resize(456);

                expect(bs.length).to.eql(456);
            });

            it("should be able to decrease the length of the bitset, trimming any trailing bits", function() {
                var bs  = new _.BitSet().add(9).add(63);

                bs.resize(60);

                expect(bs.length).to.eql(60);
                expect(bs.toString(-1)).to.eql('0000000000000000000000000000000000000000000000000000001000000000');
            });
        });

        describe("toArray", function() {

            it("should return an array containing the indices", function() {
                var bs  = new _.BitSet().add(9).add(14).add(60);

                expect(bs.toArray()).to.have.members([9, 14, 60]);
            });

            it("should return a typed array containing the indices depending on type", function() {
                var bs  = new _.BitSet().add(9).add(14).add(60).add(789);

                var arr = bs.toArray(8);

                expect(arr[0]).to.eql(9);
                expect(arr[1]).to.eql(14);
                expect(arr[2]).to.eql(60);
                expect(arr[3]).to.eql(21);
                expect(arr).instanceof(Uint8Array);
            });
        });

        describe("toBitArray", function() {

            it("should return an array containing all bits", function() {
                var bs  = new _.BitSet().add(9).add(14).add(33);

                var expected = [0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
                var arr      = bs.toBitArray(8);

                expect(expected.length).to.equal(arr.length);
                for(var i = 0; i < arr.length; i++){
                    expect(arr[i]).to.equal(expected[i]);
                }

                expect(arr).instanceof(Uint8Array);
            });
        });

        describe("toBitString", function() {

            it("should return set, bitstring or full bitstring depending on mode", function() {
                var bs  = new _.BitSet().add(9).add(14).add(60);

                expect(bs.toBitString()).to.eql('1000000000000000000000000000000000000000000000100001000000000');
                expect(bs.toBitString(-1)).to.eql('0001000000000000000000000000000000000000000000000100001000000000');
            });
        });

        describe("toString", function() {

            it("should return set, bitstring or full bitstring depending on mode", function() {
                var bs  = new _.BitSet().add(9).add(14).add(60);

                expect(bs.toString()).to.eql('{9, 14, 60}');
                expect(bs.toString(2)).to.eql('1000000000000000000000000000000000000000000000100001000000000');
                expect(bs.toString(-1)).to.eql('0001000000000000000000000000000000000000000000000100001000000000');
            });
        });

        describe("trim", function() {

            it("should trim a bitset to the most significant bit", function() {
                var bs  = new _.BitSet(123).add(9).add(14).add(60);

                bs.trim();

                expect(bs.length).to.eql(61);
                expect(bs.words.length).to.eql(2);
            });
        });

        describe("trimTrailingBits", function() {

            it("should return set, bitstring or full bitstring depending on mode", function() {
                var bs  = new _.BitSet(55).add(9).add(14).add(50);

                bs.words[1] |= (1 << 60); // set a 1 at index 60 the unofficial way :-)

                var str = bs.toString(-1);

                expect(str).to.eql('0001000000000100000000000000000000000000000000000100001000000000');
                expect(str.length).to.eql(64);
                expect(bs.length).to.eql(55);

                bs.trimTrailingBits();

                expect(bs.toString(-1)).to.eql('0000000000000100000000000000000000000000000000000100001000000000');
            });
        });

        describe("union", function() {

            it("should calculate the union of 2 sets", function() {
                var bv1  = new _.BitSet(32)
                    .add(7)
                    .add(54)
                    .add(23);
                var bv2  = new _.BitSet(63)
                    .add(7)
                    .add(67)
                    .add(23);

                bv1.union(bv2);

                var str = bv1.toString();

                expect(str).to.eql('{7, 23, 54, 67}');
                expect(bv1.length).to.eql(68);
            });
        });
    });
});
