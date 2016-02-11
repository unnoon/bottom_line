define([
    'bin/bottom_line'
], function(_) {
describe("Batcher", function() {

    describe("simple batcher", function() {

        it("empty batcher should return undefined", function() {
            var batcher = _.Batcher.create();

            expect(batcher()).to.be.undefined;
        });

        it("batcher initilized with muliple functions or add functions on the fly", function() {
            var closure = 0; // make a closure so we can make sure that all batched functions are executed

            var batcher = _.Batcher.create(
                function() {return ++closure + 555},
                function() {return ++closure + 666}
            );

            expect(batcher()).to.deep.equal(668);

            batcher.add(function(){return ++closure + 777});

            expect(batcher()).to.deep.equal(777+5);
        });

        it("batcher add functions once", function() {
            var closure = 0; // make a closure so we can make sure that all batched functions are executed

            var batcher = _.Batcher.create(function() {return ++closure + 555});
            batcher.addOnce(function(){return ++closure + 777});

            expect(batcher()).to.deep.equal(777+2);
            expect(batcher()).to.deep.equal(555+3);
        });

        it("should be able to remove functions", function() {
            var closure = 0; // make a closure so we can make sure that all batched functions are executed
            var fn      = function() {return ++closure + 555};
            var batcher = _.Batcher.create(fn);
            batcher.remove(fn);

            expect(batcher()).to.be.undefined;
        });

        it("Remove all functions", function() {
            var closure = 0; // make a closure so we can make sure that all batched functions are executed
            var batcher = _.Batcher.create(
                function() {return ++closure + 555},
                function() {return ++closure + 666}
            );
            batcher.removeAll();

            expect(batcher()).to.be.undefined;
        });

        it("We should be able to get the calbacks", function() {
            var closure = 0; // make a closure so we can make sure that all batched functions are executed
            var batcher = _.Batcher.create();
            var callbacks = [function() {return ++closure + 555}, function() {return ++closure + 666}];
            batcher.callbacks(callbacks);

            expect(batcher.callbacks()).to.equal(callbacks);
            expect(batcher()).to.equal(666 + 2);
        });

        it("We should be able to run functions in a different context", function() {
            var batcher = _.Batcher.create(function() {return this.duck});
            var ctx = {duck:'mandarin'};

            batcher.ctx(ctx);

            expect(batcher()).to.equal('mandarin');
            expect(batcher.ctx()).to.equal(ctx);
        });
    });
});
});
