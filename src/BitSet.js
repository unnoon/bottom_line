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
        this.size  = (length_ || WORD_SIZE)|0;
        this.words = new Uint32Array(Math.ceil(this.size / WORD_SIZE));
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
        {   if((index |= 0) >= this.size) {this.resize(index+1)}

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

            clone.size  = this.size|0;
            clone.words = new Uint32Array(this.words);

            return clone;
        }},
        /**
         * Calculates the inverse of the set. Any trailing bits outside the size bound will be set to 0.
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
        difference: function(bitset) { 
        {
            for(var i = 0|0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= ~bitset.words[i];
            }

            return this
        }},
        each: function(fnc, ctx_)
        {
            var word;
            var tmp;

            for (var i = 0, max = this.words.length; i < max; i++)
            {
                word = this.words[i];

                while (word !== 0)
                {
                    tmp = word & -word;

                    fnc.call(ctx_, (i << WORD_LOG) + this.hammingWeight(tmp - 1));
                    word ^= tmp;
                }
            }
        },
        hammingWeight: function(v)
        {
            v -= ((v >>> 1) & 0x55555555);// works with signed or unsigned shifts
            v  = (v & 0x33333333) + ((v >>> 2) & 0x33333333);

            return ((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24;
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
            if(bitset.size > this.size) {this.resize(bitset.size)}

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
        {   if(index >= this.size) {return this}

            this.words[index >>> WORD_LOG] ^= (1 << index);

            return this
        }},
        get: function(index) { 
        {   if(index >= this.size) {return}

            var word = this.words[index >>> WORD_LOG];

            return (word >>> index) & 1;
        }},
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
        resize: function(size) {
        {   if(this.size === (size |= 0)) {return}

            var diff      =  size - this.size;
            var newLength = (size - 1 + WORD_SIZE) >>> WORD_LOG;
            var newWords;

            this.size = size;

            if(newLength !== this.words.length)
            {
                newWords = new Uint32Array(newLength);

                for(var i = 0|0, max = Math.min(newLength, this.words.length); i < max; i++)
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
                case  2 /*binary*/      : return this.toBinary().slice(-this.size);
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
            var diff        = wordsLength*WORD_SIZE - this.size;

            this.words[wordsLength-1] = this.words[wordsLength-1] << diff >>> diff;

            return this
        }},
        union: function(bitset) { 
        {
            if(bitset.size > this.size) {this.resize(bitset.size)}

            for(var i = 0|0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] |= bitset.words[i];
            }

            return this
        }}
    };

    return BitSet
});