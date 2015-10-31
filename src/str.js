construct('str', {native:String}, {
    /**
     * @namespace str
     */
    prototype: {
        /**
         * Returns the rest of the string after a certain substring (1st occurrence)
         * @public
         * @method str#after
         * @param   {string} ___substrings - 1 or multiple substring to be checked in sequence
         * @returns {string}               - new string containing the string after the given substring
         */
        after: function(___substrings) {
            var output = this.valueOf();
            var index;

            arguments._.each(function(substring) {
                index  = output.indexOf(substring);
                output = (~index)? output.slice(index + substring.length) : output;
            });

            return output;
        },
        /**
         * Returns the rest of the string after a certain substring (last occurrence)
         * @public
         * @method str#afterLast
         * @param   {string} ___substrings - 1 or multiple substring to be checked in sequence
         * @returns {string}               - new string containing the string after the given substring
         */
        afterLast: function(___substrings) {
            var output = this.valueOf();
            var index;

            arguments._.each(function(substring) {
                index  = output.lastIndexOf(substring);
                output = (~index)? output.slice(index + substring.length) : output;
            });

            return output;
        },
        /**
         * Returns the rest of the string before a certain substring (1st occurrence)
         * @public
         * @method str#before
         * @param   {string} ___substrings - 1 or multiple substring to be checked in sequence
         * @returns {string}         - new string containing the string before the given substring
         */
        before: function(___substrings) {
            var output = this.valueOf();
            var index;

            arguments._.each(function(substring) {
                index  = output.indexOf(substring);
                output = (~index)? output.slice(0, index): output;
            });

            return output;
        },
        /**
         * Returns the rest of the string before a certain substring (last occurrence)
         * @public
         * @method str#beforeLast
         * @param   {string} ___substrings - 1 or multiple substring to be checked in sequence
         * @returns {string}               - new string containing the string before the given substring
         */
        beforeLast: function(___substrings) {
            var output = this.valueOf();
            var index;

            arguments._.each(function(substring) {
                index  = output.lastIndexOf(substring);
                output = (~index)? output.slice(0, index): output;
            });

            return output;
        },
        /**
         * Returns the string between a prefix && post substring
         * @public
         * @method str#between
         * @param   {string} pre_substr  - substring to identify the return string
         * @param   {string} post_substr - substring to identify the return string
         * @returns {string}             - new string containing the string before the given substring
         */
        // TODO handle non existence of pre or post substr
        between: function(pre_substr, post_substr) {
            return this._.after(pre_substr)._.before(post_substr);
        },
        /**
         * Returns the last string between a prefix && post substring
         * @public
         * @method str#between
         * @param   {string} pre_substr  - substring to identify the return string
         * @param   {string} post_substr - substring to identify the return string
         * @returns {string}             - new string containing the string before the given substring
         */
        betweenLast: function(pre_substr, post_substr) {
            return this._.beforeLast(post_substr)._.afterLast(pre_substr);
        },
        /**
         * Capitalize the first character of a string
         * @public
         * @method str#capitalize
         * @returns {string} - the capitalized string
         */
        capitalize: function() {
            return this[0]? this[0].toUpperCase() + this.slice(1): this.valueOf();
        },
        /**
         * Decapitalize the first character of a string
         * @public
         * @method str#decapitalize
         * @returns {string} - the decapitalized string
         */
        decapitalize: function() {
            return this[0]? this[0].toLowerCase() + this.slice(1): this.valueOf();
        },
        /**
         * Checks if the string ends with a certain substr
         * @public
         * @method str#endsWith
         * @param   {string}  substr - substring to check for
         * @returns {boolean}        - boolean indicating if the string ends with the given substring
         */
        endsWith: function(substr) {
            return this.slice(-substr.length) === substr;
        },
        /**
         * Checks if the string contains a certain substring
         * @public
         * @method str#has
         * @param   {string}  substr - substring to check for
         * @returns {boolean}        - boolean indicating if the string contains the substring
         */
        has: {onoverride: null, value: function(substr) {
            return !!~this.indexOf(substr);
        }},
        /**
         * Inserts a substring in a string
         * @public
         * @method str#insert
         * @param   {string}  substr - substring to insert
         * @param   {number}  i      - index to insert the substring (can be a negative value as well)
         * @returns {string}         - new string with the substring inserted
         */
        insert: function(substr, i) {
            return this._.splice(i, 0, substr);
        },
        /**
         * Checks if a string is all lowercase
         * @public
         * @method str#isLowerCase
         * @returns {boolean} - Boolean indicating if the string is lowercase
         */
        isLowerCase: function() {
            return this == this.toLowerCase();
        },
        /**
         * Checks if a string is all uppercase
         * @public
         * @method str#isUpperCase
         * @returns {boolean} - Boolean indicating if the string is uppercase
         */
        isUpperCase: function() {
            return this == this.toUpperCase();
        },
        /**
         * getter: the last character of a string
         * @public
         * @method str#last
         * @returns {string} - the last character of the string
         */
        get last() {
            return this[this.length-1];
        },
        /**
         * Splice for string. NOTE string are immutable so this function will return a NEW string
         * @public
         * @method str#splice
         * @param   {number}  i       - index to start (can be a negative value as well)
         * @param   {string}  howMany - number of characters to apply
         * @param   {string}  substr  - substring to insert
         * @returns {string}          - NEW string with deleted or inserted characters
         */
        splice: function(i, howMany, substr) {
            return this.slice(0,i) + substr + this.slice(i + __math.abs(howMany));
        },
        /**
         * Checks if the string starts with a certain substr
         * @public
         * @method str#startsWith
         * @param   {string}  substr - substring to check for
         * @returns {boolean}        - boolean indicating if the string starts with the given substring
         */
        startsWith: function(substr) {
            return !this.indexOf(substr);
        },
        /**
         * Better to string version
         * @public
         * @method str#toString
         * @this    {string}
         * @returns {string} - string representation of the object
         */
        toString: {onoverride: null, value: function()
        {
            return this.toString();
        }}
    }
});