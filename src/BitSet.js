!function(root, bitset) {
    var environments = true; switch(environments) {
    /*requirejs*/ case typeof(define) === 'function' && root.define === define && !!define.amd : define(bitset);                                                           break;
    /*nodejs*/    case typeof(module) === 'object'   && root === module.exports                : module.exports = bitset();                                                break;
    /*root*/      case !root.BitSet                                                            : Object.defineProperty(root, 'BitSet', {value: bitset(), enumerable: !0}); break; default : console.error("'BitSet' is already defined on root object")}
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
         * @public
         * @method BitSet#add
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
         * @public
         * @method BitSet#clone
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
         * @public
         * @method BitSet#complement
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
         * @public
         * @method BitSet#difference
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
         * Iterates over the set bits and calls the callback function with: value=1, index, this.
         * Can be broken prematurely by returning false
         *
         * @public
         * @method BitSet#each
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
        /**
         * Tests if 2 bitsets are equal
         *
         * @public
         * @method BitSet#equals
         *
         * @param {BitSet} bitset - bitset to compare to this
         *
         * @returns {boolean} - boolean indicating if the the 2 bitsets are equal
         */
        equals: function(bitset) { 
        {
            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                if(this.words[i] !== bitset.words[i]) {return false}
            }

            return true
        }},
        /**
         * Calculates the exclusion/symmetric difference between to bitsets. The result is stored in this.
         *
         * @public
         * @method BitSet#exclusion
         * @alias  symmetricDifference
         *
         * @param {BitSet} bitset - the bitset to calculate the symmetric difference with.
         *
         * @returns {BitSet} this
         */
        exclusion: function(bitset) { "@aliases: symmetricDifference";
        {
            if(bitset.length > this.length) {this.resize(bitset.length)}

            for(var i = 0|0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] ^= bitset.words[i];
            }

            return this
        }},
        /**
         * Calculates if the bitset contains a certain bitset.
         * In bitmask terms it will calculate if a bitmask fits a bitset
         *
         * @public
         * @method BitSet#fits
         * @alias  contains
         *
         * @param {BitSet} mask - bitset mask to test fit. i.e. subset to test containment
         *
         * @returns {boolean} - boolean indicating if the mask fits the bitset or is a subset
         */
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
        /**
         * Flips a bit in the bitset. In case index will fall out of bounds the bitset is enlarged
         *
         * @public
         * @method BitSet#flip
         *
         * @param {number} index - index of the bit to be flipped
         *
         * @returns {BitSet} this
         */
        flip: function(index) { 
        {   if((index |= 0) >= this.length) {this.resize(index+1)}

            this.words[index >>> WORD_LOG] ^= (1 << index);

            return this
        }},
        /**
         * Gets a specific bit from the bitset
         *
         * @public
         * @method BitSet#get
         *
         * @param {number} index - index of the bit to get
         *
         * @returns {number} - the value of the bit at the given index
         */
        get: function(index) { 
        {   if((index |= 0) >= this.length) {return 0|0}

            return ((this.words[index >>> WORD_LOG] >>> index) & 1)|0;
        }},
        /**
         * Calculate the hamming weight i.e. the number of ones in a bitstring/word
         *
         * @public
         * @static
         * @method BitSet#hammingWeight
         *
         * @param {number} w - word to get the number of set bits from
         *
         * @returns {number} - the number of set bits in the word
         */
        hammingWeight: function(w)
        {
            w -= ((w >>> 1) & 0x55555555)|0;
            w  = (w & 0x33333333) + ((w >>> 2) & 0x33333333);

            return (((w + (w >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24)|0;
        },
        /**
         * Checks is the bitsets has a value/index
         *
         * @public
         * @method BitSet#has
         * @alias  member
         *
         * @param {number} index - the index/value to check membership for
         *
         * @returns {boolean} - boolean indicating if the bitset has the vale/index
         */
        has: function(index) { "@aliases: member";
        {
            return !!this.get(index);
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