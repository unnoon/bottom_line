!function(root, bitset) {
    var environments = true; switch(environments) {
    /*requirejs*/ case typeof(define) === 'function' && root.define === define && !!define.amd : define(bitset);            break;
    /*nodejs*/    case typeof(module) === 'object'   && root === module.exports                : module.exports = bitset(); break;
    /*root*/      case !root.BitSet                                                            : root.BitSet    = bitset(); break; default : console.error("'BitSet' is already defined on root object")}
}(this, function bitset() {
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
    function BitSet(length_) { "use strict";
    {
        this.size  = length_ || WORD_SIZE;
        this.words = new Uint32Array(Math.ceil(this.size / WORD_SIZE));
    }}

    BitSet.prototype = {
        /**
         * Adds a number(index) to the set. It will resize the set in case the index falls out of bounds.
         *
         * @param index - index/number to add to the set
         *
         * @returns {BitSet} this
         */
        add: function(index) { "use strict";
        {
            if(index >= this.size) {this.resize(index+1)}

            return this.set(index)
        }},
        /**
         * Creates a clone of the bitset
         *
         * @returns {BitSet} clone
         */
        clone: function() {
            var clone = Object.create(BitSet.prototype);

            clone.size  = this.size;
            clone.words = new Uint32Array(this.words);

            return clone;
        },
        /**
         * Calculates the inverse of the set. Any trailing bits outside the size bound will be set to 0.
         *
         * @returns {BitSet} this
         */
        complement: function() { "use strict";
        {
            for(var i = 0, max = this.words.length; i < max; i++)
            {
                this.words[i] = ~this.words[i];
            }

            this.trimTrailingBits();

            return this
        }},
        difference: function(bitset) { "use strict";
        {
            for(var i = 0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= ~bitset.words[i];
            }

            return this
        }},
        each: function() { "use strict";
        {
            // TODO
        }},
        equals: function(bitset) { "use strict";
        {
            for(var i = 0, max = this.words.length; i < max; i++)
            {
                if(this.words[i] !== bitset.words[i]) {return false}
            }

            return true
        }},
        exclusion: function(bitset) { "use strict"; "@aliases: symmetricDifference";
        {
            if(bitset.size > this.size) {this.resize(bitset.size)}

            for(var i = 0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] ^= bitset.words[i];
            }

            return this
        }},
        fits: function(mask) { "use strict"; "@aliases: contains";
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
        {   if(index >= this.size) {return this}

            this.words[index >>> WORD_LOG] ^= (1 << index);

            return this
        }},
        get: function(index) { "use strict";
        {   if(index >= this.size) {return}

            var word = this.words[index >>> WORD_LOG];

            return (word >>> index) & 1;
        }},
        has: function() { "use strict";
        {   // TODO
        }},
        intersection: function(bitset) { "use strict";
        {
            if(bitset.size > this.size) {this.resize(bitset.size)}

            for(var i = 0, max = this.words.length; i < max; i++)
            {
                this.words[i] &= bitset.words[i] || 0;
            }

            return this
        }},
        intersects: function() { "use strict";
        {   // TODO
        }},
        isEmpty: function() { "use strict";
        {   // TODO
        }},
        max: function() { "use strict";
        {   // TODO
        }},
        min: function() { "use strict";
        {   // TODO
        }},
        remove: function() { "use strict";
        {   // TODO
        }},
        resize: function(size) { "use strict";
        {   if(this.size === size) {return}

            var diff      =  size - this.size;
            var newLength = (size - 1 + WORD_SIZE) >>> WORD_LOG;
            var newWords;

            this.size = size;

            if(newLength !== this.words.length)
            {
                newWords = new Uint32Array(newLength);

                for(var i = 0, max = Math.min(newLength, this.words.length); i < max; i++)
                {
                    newWords[i] = this.words[i];
                }

                this.words  = newWords;
            }

            // trim trailing bits
            if(diff < 0) {this.trimTrailingBits()}

            return this
        }},
        /**
         * Sets a number in the set. Will not resize use 'add' in this case
         *
         * @param {number}   index - index/number to add to the set
         * @param {number=1} val_  - optional value to be set. Either 0 or 1
         *
         * @returns {BitSet} this
         */
        set: function(index, val_) { "use strict";
        {   if(index >= this.size) {return this}

            if (val_ === undefined || val_)
            {
                this.words[index >>> WORD_LOG] |=  (1 << index);
            }
            else
            {
                this.words[index >>> WORD_LOG] &= ~(1 << index);
            }

            return this;
        }},
        stringify: function(mode) { "use strict";
        {
            switch(mode)
            {
                case -1 /*binary full*/ : return this.toBinary();
                case  2 /*binary*/      : return this.toBinary().slice(-this.size);
                default /*set*/         : return ''; // TODO
            }

        }},
        toBinary: function() { "use strict";
        {
            var output = '';

            for(var i = this.words.length-1; i >= 0; i--)
            {   // typed arrays will discard any leading zero's when using toString
                // TODO some fancy bitshifting or something
                output += ('0000000000000000000000000000000' + this.words[i].toString(2)).slice(-WORD_SIZE);
            }

            return output
        }},
        trim: function() { "use strict";
        {   // TODO
        }},
        trimTrailingBits: function() { "use strict";
        {
            var wordsLength = this.words.length;
            var diff        = wordsLength*WORD_SIZE - this.size;

            this.words[wordsLength-1] = this.words[wordsLength-1] << diff >>> diff;

            return this
        }},
        union: function(bitset) { "use strict";
        {
            if(bitset.size > this.size) {this.resize(bitset.size)}

            for(var i = 0, max = bitset.words.length; i < max; i++)
            {
                this.words[i] |= bitset.words[i];
            }

            return this
        }},
        unset: function(index) { "use strict";
        {
            return this.set(index, 0);
        }}
    };

    return BitSet
});