var objToString = Object.prototype.toString;
/*
 *  'Global' _methods
 */

extend(_, {
    /**
     * @public
     * @static
     * @method _.inject
     *
     * @param {Object}  obj                - object to be injected on i.e _.arr|_.obj|etc...
     * @param {string}  prop               - name of the property
     * @param {Object} descriptor          - descriptor/settings object on injection. See extend documentation for more options
     *     @param {boolean}  descriptor.value                - value of the property
     *     @param {boolean=} descriptor.static               - optional boolean indicating if the property is static
     */
    inject: function(obj, prop, descriptor) {
        var module = {};

        module[prop] = descriptor;

        if(descriptor.static) {wrapStatics(obj, module)}
        else                  {wrapPrototype(obj, module)}
    },
    isArguments:  function(obj) {return objToString.call(obj) === '[object Arguments]'},
    isArray:      Array.isArray,
    isDescriptor: isDescriptor,
    /**
     * Checks if an object is empty
     * @public
     * @static
     * @method _.isEmpty
     * @param   {Object}  obj - object to check the void
     * @returns {boolean}     - boolean indicating if the object is empty
     */
    isEmpty: function (obj)
    {
        var key;

        for(key in obj) {
            return false;
        }
        return true;
    },
    isFunction:   function(obj) {return typeof(obj) === 'function'},
    isInteger:    function(obj) {return _.typeOf(obj) === 'number' && obj === (obj|0)},
    isNull:       function(obj) {return obj === null},
    isNumber:     function(obj) {return _.typeOf(obj) === 'number'},
    isObject:     function(obj) {return _.typeOf(obj) === 'object'},
    /**
     * Checks if an object is an primitive
     * @public
     * @static
     * @method _.isPrimitive
     * @param   {Object} obj - object to classify
     * @returns {boolean}    - boolean indicating if the object is a primitive
     */
    isPrimitive: function(obj) {
        // maybe just check for valueOF??
        var type = typeof(obj);

        switch(type)
        {
            case 'object'   :
            case 'function' :
                return obj === null;
            default :
                return true
        }
    },
    isString:     function(obj) {return _.typeOf(obj) === 'string'},
    /**
     * Checks is a property is undefined
     * @public
     * @static
     * @method _.isUndefined
     * @param   {Object} prop - property to check
     * @returns {boolean}     - indication of the property definition
     */
    isUndefined: function(prop) {
        return prop === undefined;
    },
    /**
     * Checks is a property is defined
     * @public
     * @static
     * @method _.isDefined
     * @param   {Object} prop - property to check
     * @returns {boolean}     - indication of the property definition
     */
    isDefined: function(prop) {
        return prop !== undefined;
    },
    toArray: function(obj) {
        var type = _.typeOf(obj);

        switch (type)
        {
            case 'arguments' : return Array.prototype.slice.call(obj, 0);
                // the below is nice and all in theory but breaks in Chrome....
                //// make a copy instead of slice to not leak arguments
                //var max  = arguments.length;
                //var args = new Array(max);
                //for(var i = 0; i < max; i++) {
                //    args[i] = arguments[i];
                //}
            case 'object'    : return obj._.values();
            case 'array'     : return obj;
            default          : return [];
        }
    },
    toInteger: function(obj) {
        switch(_.typeOf(obj))
        {
            case 'number' : return obj|0;
            case 'string' : return parseInt(obj);
            default       : return NaN
        }
    },
    toNumber: function(obj) {
        switch(_.typeOf(obj))
        {
            case 'number' : return obj;
            case 'string' : return parseFloat(obj);
            default       : return NaN
        }
    },
    stringify: {onoverride: null, value: function(obj) {return obj? obj._.stringify() : obj+''}}
});