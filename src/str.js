
/**
 * String
 */
constructWrapper(String, 'str', {
    /**
     * @namespace str
     * @memberOf module:_
     */
    /**
     * @class String
     */
    prototype: {
        /**
         * Returns the rest of the string after a certain substring (1st occurrence)
         * @public
         * @method String#after
         * @param   {string} substr - substring to identify the return string
         * @returns {string}        - new string containing the string after the given substring
         */
        after: function(substr) {
            var index = this.indexOf(substr);
            return (index > -1)? this.slice(index + substr.length) : '';
        },
        /**
         * Returns the rest of the string after a certain substring (last occurrence)
         * @public
         * @method String#afterLast
         * @param   {string} substr - substring to identify the return string
         * @returns {string}         - new string containing the string after the given substring
         */
        afterLast: function(substr) {
            var index = this.lastIndexOf(substr);
            return (index > -1)? this.slice(index + substr.length) : '';
        },
        /**
         * Returns the rest of the string before a certain substring (1st occurrence)
         * @public
         * @method String#before
         * @param   {string} substr - substring to identify the return string
         * @returns {string}         - new string containing the string before the given substring
         */
        before: function(substr) {
            var index = this.indexOf(substr);
            return (index > -1)? this.slice(0, index) : '';
        },
        /**
         * Returns the rest of the string before a certain substring (last occurrence)
         * @public
         * @method String#beforeLast
         * @param   {string} substr - substring to identify the return string
         * @returns {string}         - new string containing the string before the given substring
         */
        beforeLast: function(substr) {
            var index = this.lastIndexOf(substr);
            return (index > -1)? this.slice(0, index) : '';
        },
        /**
         * Returns the string between a prefix && post substring
         * @public
         * @method String#between
         * @param   {string} pre_substr  - substring to identify the return string
         * @param   {string} post_substr - substring to identify the return string
         * @returns {string}             - new string containing the string before the given substring
         */
        between: function(pre_substr, post_substr) {
            return this.bl.after(pre_substr).bl.before(post_substr);
        },
        /**
         * Capitalize the first character of a string
         * @public
         * @method String#capitalize
         * @returns {string} - the capitalized string
         */
        capitalize: function() {
            return this[0]? this[0].toUpperCase() + this.slice(1): this;
        },
        /**
         * Decapitalize the first character of a string
         * @public
         * @method String#decapitalize
         * @returns {string} - the decapitalized string
         */
        decapitalize: function() {
            return this[0]? this[0].toLowerCase() + this.slice(1): this;
        },
        /**
         * Checks if the string ends with a certain substr
         * @public
         * @method String#endsWith
         * @param   {string}  substr - substring to check for
         * @returns {boolean}        - boolean indicating if the string ends with the given substring
         */
        endsWith: function(substr) {
            return this.slice(-substr.length) === substr;
        },
        /**
         * Checks if the string contains a certain substring
         * @public
         * @method String#has
         * @param   {string}  substr - substring to check for
         * @returns {boolean}        - boolean indicating if the string contains the substring
         */
        has: function(substr) {
            return this.indexOf(substr) > -1;
        },
        /**
         * Inserts a substring in a string
         * @public
         * @method String#insert
         * @param   {string}  substr - substring to insert
         * @param   {number}  i      - index to insert the substring (can be a negative value as well)
         * @returns {string}         - new string with the substring inserted
         */
        insert: function(substr, i) {
            return this.bl.splice(i, 0, substr);
        },
        /**
         * Checks if a string is all lowercase
         * @public
         * @method String#isLowerCase
         * @returns {boolean} - Boolean indicating if the string is lowercase
         */
        isLowerCase: function() {
            return this == this.toLowerCase();
        },
        /**
         * Checks if a string is all uppercase
         * @public
         * @method String#isUpperCase
         * @returns {boolean} - Boolean indicating if the string is uppercase
         */
        isUpperCase: function() {
            return this == this.toUpperCase();
        },
        /**
         * getter: the last character of a string
         * @public
         * @method String#last
         * @returns {string} - the last character of the string
         */
        get last() {
            return this[this.length-1];
        },
        /**
         * Splice for string. NOTE string are immutable so this function will return a NEW string
         * @public
         * @method String#splice
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
         * @method String#startsWith
         * @param   {string}  substr - substring to check for
         * @returns {boolean}        - boolean indicating if the string starts with the given substring
         */
        startsWith: function(substr) {
            return this.indexOf(substr) === 0;
        },
        /**
         * Better to string version
         * @public
         * @method String#toString
         * @this    {string}
         * @returns {string} - string representation of the object
         */
        toString: function()
        {
            return this;
        }
    }
});