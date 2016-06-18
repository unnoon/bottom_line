!function(root, bitvector) {
    var environments = true; switch(environments) {
    /*requirejs*/ case typeof(define) === 'function' && root.define === define && !!define.amd : define(bitvector);            break;
    /*nodejs*/    case typeof(module) === 'object'   && root === module.exports                : module.exports = bitvector(); break;
    /*root*/      case !root.BitVector                                                         : root.BitVector = bitvector(); break; default : console.error("'BitVector' is already defined on root object")}
}(this, function bitvector() {
    var WORD_SIZE = 32;
    var WORD_LOG  = 5;
    /**
     * BitVector no worrying about 32bits restrictions
     *
     * @method _.BitVector
     *
     * @param  {number=32} length_ - optional length
     *
     * @return {BitVector} - BitVector object
     */
    function BitVector(length_) { "use strict";
    {
        this.length = length_ || WORD_SIZE;
        this.words  = new Uint32Array(Math.ceil(this.length / WORD_SIZE));
    }}

    BitVector.prototype = {
        and: function(bitvector) { "use strict";
        {
            for(var i = 0, max = this.words.length, word; i < max; i++)
            {
                if((word = bitvector.words[i]) === undefined) {break}

                this.words[i] &= word;
            }

            return this
        }},
        fits: function(mask) { "use strict";
        {
            var word;
            var maskword;

            for(var i = 0, max = mask.words.length; i < max; i++)
            {
                word     = this.words[i];
                maskword = mask.words[i];

                if(maskword === 0)                                       {continue} // no need to do anything & allows for bigger masks in case later words are empty
                if(word === undefined || (word & maskword) !== maskword) {return false}
            }

            return true
        }},
        flip: function(index) { "use strict";
        {   if(index >= this.length) {return this}

            this.words[index >>> WORD_LOG] ^= (1 << index);

            return this
        }},
        get: function(index) { "use strict";
        {   if(index >= this.length) {return}

            var word = this.words[index >>> WORD_LOG];

            return (word >>> index) & 1;
        }},
        not: function() { "use strict";
        {
            for(var i = this.words.length-1; i >= 0; i--)
            {
                this.words[i] = ~this.words[i];
            }

            return this
        }},
        or: function(bitvector) { "use strict";
        {
            for(var i = 0, max = this.words.length, word; i < max; i++)
            {
                if((word = bitvector.words[i]) === undefined) {break}

                this.words[i] |= word;
            }

            if(this.length < bitvector.length)
            {
                var diff = i*WORD_SIZE - this.length;
                this.words[i-1] = this.words[i-1] <<  diff;
                this.words[i-1] = this.words[i-1] >>> diff;
            }

            return this
        }},
        set: function(index, val_) { "use strict";
        {   if(index >= this.length) {return this} // TODO automatic extension of vector if index falls out of bounds

            if (val_ === undefined || val_)
            {
                this.words[index >>> WORD_LOG] |= (1 << index);
            }
            else
            {
                this.words[index >>> WORD_LOG] &= ~(1 << index);
            }

            return this;
        }},
        stringify: function(all_) { "use strict";
        {
            var output = '';
            var all    = all_ === 'all';

            for(var i = this.words.length-1; i >= 0; i--)
            {   // typed arrays will discard any leading zero's when using toString
                // TODO some fancy bitshifting or something
                output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
            }
            // FIXME cleanup
            if(!all) {output = output.slice(-this.length)}

            return output
        }},
        unset: function(index) { "use strict";
        {
            return this.set(index, 0);
        }},
        xor: function(bitvector) { "use strict";
        {
            for(var i = 0, max = this.words.length, word; i < max; i++)
            {
                if((word = bitvector.words[i]) === undefined) {break}

                this.words[i] ^= word;
            }

            return this
        }}
    };

    return BitVector
});