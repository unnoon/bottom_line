define([
    'bottom_line'
], function(_) {

    describe("Global", function() {

        describe("static methods", function() {

            describe("isFunction", function() {

                it("simple", function() {
                    expect(_.isFunction(function(){})).to.be.true;
                    expect(_.isFunction({})).to.be.false;
                });

                it("not", function() {
                    expect(_.not.isFunction(function(){})).to.be.false;
                    expect(_.not.isFunction({})).to.be.true;
                });
            });

            describe("isInteger", function() {

                it("simple", function() {
                    expect(_.isInteger(666.00)).to.be.true;
                    expect(_.isInteger(666.001)).to.be.false;
                    expect(_.isInteger({})).to.be.false;
                });
            });

            describe("isNull", function() {

                it("simple", function() {
                    expect(_.isNull(null)).to.be.true;
                    expect(_.isNull(666.001)).to.be.false;
                });
            });

            describe("isNumber", function() {

                it("simple", function() {
                    expect(_.isNumber(null)).to.be.false;
                    expect(_.isNumber(666.001)).to.be.true;
                    expect(_.isNumber(new Number(666.001))).to.be.true;
                });
            });

            describe("isObject", function() {

                it("simple", function() {
                    expect(_.isObject(null)).to.be.false;
                    expect(_.isObject(666.001)).to.be.false;
                    expect(_.isObject(new Number(666.001))).to.be.false;
                    expect(_.isObject({})).to.be.true;
                });
            });

            describe("isUndefined", function() {

                it("simple", function() {
                    expect(_.isUndefined(new Number(666.001))).to.be.false;
                    expect(_.isUndefined(undefined)).to.be.true;
                });
            });

            describe("isDefined", function() {

                it("simple", function() {
                    expect(_.isDefined(new Number(666.001))).to.be.true;
                    expect(_.isDefined(undefined)).to.be.false;
                });
            });

            describe("inject", function() {

                it("should be possible to inject prototype methods", function() {
                    _.inject(_.arr, 'superFancyNewArrayMethod', {value: function() {return this[0] + 'SuperFancy'}});

                    expect(['IM']._.superFancyNewArrayMethod()).to.deep.equal('IMSuperFancy');
                });

                it("should be possible to inject static methods", function() {
                    _.inject(_.arr, 'superFancyNewStaticArrayMethod', {static: true, value: function() {return 'IMSuperFancy'}});

                    expect(_.arr.superFancyNewStaticArrayMethod()).to.deep.equal('IMSuperFancy');
                });
            });

            describe("toArray", function() {

                it("should be possible to convert arguments to array", function() {

                    function returnArgsAsArray() {
                        "use strict";

                        return _.toArray(arguments)
                    }

                    expect(returnArgsAsArray.call(null, 1, 2, 3)).to.deep.equal([1, 2, 3]);
                });

                it("should be possible to convert objects to arrays", function() {

                    var obj = {
                        a: 1,
                        b: 2,
                        c: 3
                    };

                    expect(_.toArray(obj)).to.deep.equal([1, 2, 3]);
                });

                it("should be possible trying to convert an array without errors", function() {

                    var arr = [1, 2, 3];

                    expect(_.toArray(arr)).to.deep.equal([1, 2, 3]);
                });

                it("should return an empty array in all other cases", function() {
                    expect(_.toArray(1)).to.deep.equal([]);
                    expect(_.toArray(null)).to.deep.equal([]);
                    expect(_.toArray(undefined)).to.deep.equal([]);
                    expect(_.toArray('string')).to.deep.equal([]);
                });
            });

            describe("toInteger", function() {

                it("should be possible to convert doubles to integers", function() {
                    expect(_.toInteger( 2.356)).to.deep.equal( 2);
                    expect(_.toInteger(-2.356)).to.deep.equal(-2);
                    expect(_.toInteger( 2)).to.deep.equal( 2);
                    expect(_.toInteger(-2)).to.deep.equal(-2);
                    expect(_.toInteger( '2.356')).to.deep.equal( 2);
                    expect(_.toInteger('-2.356')).to.deep.equal(-2);
                });

                it("should return NaN in other cases", function() {
                    expect(_.toInteger([])).to.deep.equal(NaN);
                    expect(_.toInteger(null)).to.deep.equal(NaN);
                });

            });

            describe("toNumber", function() {

                it("should be possible to convert doubles to integers", function() {
                    expect(_.toNumber( 2.356)).to.deep.equal( 2.356);
                    expect(_.toNumber(-2.356)).to.deep.equal(-2.356);
                    expect(_.toNumber( 2)).to.deep.equal( 2);
                    expect(_.toNumber(-2)).to.deep.equal(-2);
                    expect(_.toNumber( '2.356')).to.deep.equal( 2.356);
                    expect(_.toNumber('-2.356')).to.deep.equal(-2.356);
                });

                it("should return NaN in other cases", function() {
                    expect(_.toNumber([])).to.deep.equal(NaN);
                    expect(_.toNumber(null)).to.deep.equal(NaN);
                });

            });

            describe("stringify", function() {

                it("should be possible to call stringify globally", function() {
                    expect(_.stringify({a: 1, b: 2})).to.deep.equal('{a: 1, b: 2}');
                    expect(_.stringify(null)).to.deep.equal('null');
                });
            });
        });
});
});
