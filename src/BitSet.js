!function(root, bitset) {
    var environments = true; switch(environments) {
    /*requirejs*/ case typeof(define) === 'function' && root.define === define && !!define.amd : define(bitset);            break;
    /*nodejs*/    case typeof(module) === 'object'   && root === module.exports                : module.exports = bitset(); break;
    /*root*/      case !root.BitSet                                                            : root.BitSet    = bitset(); break; default : console.error("'BitSet' is already defined on root object")}
}(this, function bitset() { "use strict";
    var WORD_SIZE = 32;
    var WORD_LOG  = 5;
    /**
     * BitSet: no worrying about 32bits restrictions
     *
     * @method _.BitSet
     *
     * @param  {number=32} length_ - optional length
     *
     * @return {BitSet} - new BitSet
     */
    function BitSet(length_) { 
    {
        this.length = (length_ || WORD_SIZE)|0;
        this.words  = new Uint32Array(Math.ceil(this.length / WORD_SIZE));
    }}

    BitSet.prototype = {
        /**
         *  Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
         *
         * @param {number}   index - index/number to add to the set
         * @param {number=1} val_  - optional value to be set. Either 0 or 1
         *
         * @returns {BitSet} this
         */
        add: function(index, val_) { "@aliases: set";
        {   if((index |= 0) >= this.length) {this.resize(index+1)}

            if(val_ === undefined || val_)
            {
                this.words[index >>> WORD_LOG] |=  (1 << index);
            }
            else
            {
                this.words[index >>> WORD_LOG] &= ~(1 << index);
            }

            return this;
        }},
        /**
         * Creates a clone of the bitset
         *
         * @returns {BitSet} clone
         */
        clone: function() { 
        {
            var clone = Object.create(BitSet.prototype);

            clone.length = this.length|0;
            clone.words  = new Uint32Array(this.words);

            return clone;
        }},
        /**
         * Calculates the inverse of the set. Any trailing bits outside the length bound will be set to 0.
         *
         * @returns {BitSet} this
         */
        complement: function() { 
        {
            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] = ~this.words[i];
            }

            this.trimTrailingBits();

            return this
        }},
        /**
         * Calculates the difference between 2 bitsets the result is stored in this
         *
         * @param {BitSet} bitset - the bit set to subtract from the current one
         *
         * @returns {BitSet} this
         */
        difference: function(bitset) { 
        {
            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= ~bitset.words[i];
            }

            return this
        }},
        /**
         * Iterates over the set bits and calls the callback function with value=1, index, this.
         * Can be broken prematurely by returning false
         *
         * @param {function} cb   - callback function o be called on each set bit
         * @param {Object}   ctx_ - optional context to be called upon the callback function
         *
         * @returns {boolean} - boolean indicating if the loop finished completely=true or was broken=false
         */
        each: function(cb, ctx_)
        {
            var word;
            var tmp;

            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                word = this.words[i];

                while (word !== 0)
                {
                    tmp = (word & -word)|0;
                    if(cb.call(ctx_, 1|0, (i << WORD_LOG) + this.hammingWeight(tmp - 1|0), this) === false) {return false}
                    word ^= tmp;
                }
            }

            return true
        },
        equals: function(bitset) { 
        {
            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                if(this.words[i] !== bitset.words[i]) {return false}
            }

            return true
        }},
        exclusion: function(bitset) { "@aliases: symmetricDifference";
        {
            if(bitset.length > this.length) {this.resize(bitset.length)}

            for(var i = 0|0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] ^= bitset.words[i];
            }

            return this
        }},
        fits: function(mask) { "@aliases: contains";
        {
            var word;
            var maskword;

            for(var i = 0|0, max = mask.words.length; i < max; i++)
            {
                word     = this.words[i];
                maskword = mask.words[i];

                if(maskword === 0)                                       {continue} // no need to do anything & allows for bigger masks in case later words are empty
                if(word === undefined || (word & maskword) !== maskword) {return false}
            }

            return true
        }},
        flip: function(index) { 
        {   if(index >= this.length) {return this}

            this.words[index >>> WORD_LOG] ^= (1 << index);

            return this
        }},
        get: function(index) { 
        {   if(index >= this.length) {return}

            var word = this.words[index >>> WORD_LOG];

            return (word >>> index) & 1;
        }},
        hammingWeight: function(w)
        {
            w -= ((w >>> 1) & 0x55555555)|0;// works with signed or unsigned shifts
            w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

            return ((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
        },
        has: function() { 
        {   // TODO
        }},
        intersection: function(bitset) { 
        {
            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= bitset.words[i] || 0;
            }

            return this
        }},
        intersects: function() { 
        {   // TODO
        }},
        isEmpty: function() { 
        {   // TODO
        }},
        max: function() { 
        {   // TODO
        }},
        min: function() { 
        {   // TODO
        }},
        remove: function(index) {
        {
            return this.add(index, 0);
        }},
        resize: function(len) {
        {   if(this.length === (len |= 0)) {return}

            var diff      =   len - this.length;
            var newLength = ((len - (1|0) + WORD_SIZE) >>> WORD_LOG)|0;
            var newWords;

            this.length = len;

            if(newLength !== this.words.length)
            {
                newWords = new Uint32Array(newLength);

                for(var i = 0|0, max = Math.min(newLength, this.words.length)|0; i < max; i++)
                {
                    newWords[i] = this.words[i];
                }

                this.words  = newWords;
            }

            // trim trailing bits
            if(diff < 0) {this.trimTrailingBits()}

            return this
        }},
        stringify: function(mode) { 
        {
            switch(mode)
            {
                case -1 /*binary full*/ : return this.toBinary();
                case  2 /*binary*/      : return this.toBinary().slice(-this.length);
                default /*set*/         : return ''; // TODO
            }

        }},
        toBinary: function() { 
        {
            var output = '';

            for(var i = this.words.length-1; i >= 0; i--)
            {   // typed arrays will discard any leading zero's when using toString
                // TODO some fancy bitshifting or something
                output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
            }

            return output
        }},
        trim: function() { 
        {   // TODO
        }},
        trimTrailingBits: function() { 
        {
            var wordsLength = this.words.length;
            var diff        = wordsLength*WORD_SIZE - this.length;

            this.words[wordsLength-1] = this.words[wordsLength-1] << diff >>> diff;

            return this
        }},
        union: function(bitset) { 
        {
            if(bitset.length > this.length) {this.resize(bitset.length)}

            for(var i = 0|0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] |= bitset.words[i];
            }

            return this
        }}
    };

    return BitSet
});