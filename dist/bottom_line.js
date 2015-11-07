/*!
 * _____________bottom_line.js_____
 * Bottom_line JavaScript Library
 *
 * Copyright 2015, Rogier Geertzema
 * Released under the MIT license
 * ________________________________
 */
!function(bottom_line) {
    var environments = true;
    var requirejs    = typeof(define) === 'function'  && !!define.amd;
    var nodejs       = typeof(module) !== 'undefined' && this === module.exports;

    switch(environments) {
    case requirejs : define(bottom_line);            break;
    case nodejs    : module.exports = bottom_line(); break;
    default        : bottom_line(this)}
}.call(this, function(root_) {
    'use strict';

    var stack = []; // stack holding all wrapped objects accessed from ._
    var index = 0;  // current index in the stack

	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 *
	 * @namespace _
	 */
	var _ = {
        'version': '0.0.5',
        not: {} // object to hold negative functions
    };
    // we can't set the root above since phantomJS 1.9.8 will break as it gets confused with _ defined on the object prototype
    if(root_)
    {
        if(root_.hasOwnProperty('_')) {console.error('_ is already defined on root object'); return}
        else                          {root_._ = _}
    }

    // TODO something to run methods in a different context. Apply will not work since the context will get lost when using other bottom_line functions internally
    // wrap functions for chaining
    function construct(key, _settings_, module)
    {
        var settings = module && _settings_ || {};
        var module   = module || _settings_;
        var obj      = settings.native;

        var wrapper = settings.base? clone(settings.native) : {};

        wrapper.not     = {};
        wrapper.methods = {}; // add methods unwrapped so we can use them with apply

        // create instance and chain object including not wrapper
        var _methods = wrapper._methods = (key === 'obj') ? {not:{}} : Object.create(_.obj._methods, {not:{value:Object.create(_.obj._methods.not)}}); // inherit from object. // stores non-chainable use _methods
        var _chains  = wrapper._chains  = (key === 'obj') ? {not:{}} : Object.create(_.obj._chains,  {not:{value:Object.create(_.obj._chains.not)}});  // inherit from object.  // stores chainable use _methods

        Object.defineProperty(wrapper._methods, 'chain', {get: function() {return        _chains}, enumerable: false, configurable: false});
        Object.defineProperty(wrapper._chains,  'value', {get: function() {
            var elm = stack[--index];
            return elm.valueOf? elm.valueOf() : elm;
        }, enumerable: false, configurable: false});

        if(obj && obj.prototype)
        {
            if(obj.prototype.hasOwnProperty('_'))
            {
                // TODO add a silent log here
            }
            else
            {
                // extend native object with special _ 'bottom_line' access property
                Object.defineProperty(obj.prototype, '_', {
                    enumerable: false, configurable: false,
                    get: function() {
                        stack[index++] = this;
                        return _methods
                    },
                    // we implement a set so it is still possible to use _ as an object property
                    set: function(val) {Object.defineProperty(this, '_', {value: val, enumerable: true,  configurable: true, writable: true})}}
                );
            }
        }

        // by default add wrapper to the bottom_line object
        if(settings.global !== false) {_[key] = wrapper}

        wrapStatics(wrapper,   module.static);
        wrapPrototype(wrapper, module.prototype);

        return wrapper;
    }

    function wrapStatics(wrapper, module)
    {
        if(!module) return;

        extend(wrapper,     {enumerable: false}, module);
        extend(wrapper.not, {enumerable: false, action: function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return !fn.apply(wrapper, arguments)}}}, module);

        if(wrapper !== _.obj && wrapper !== _.fnc) return;
        // add static obj & fnc functions to the global _ object
        extend(_,     {enumerable: false, overwrite: false}, module);
        extend(_.not, {enumerable: false, overwrite: false, action: function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return !fn.apply(wrapper, arguments)}}}, module);
    }

    function wrapPrototype(wrapper, module)
    {
        if(!module) return;

        extend(wrapper._methods,     {enumerable: false, action: function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return   fn.apply(stack[--index], arguments)}}},          module);
        extend(wrapper._methods.not, {enumerable: false, action: function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return  !fn.apply(stack[--index], arguments)}}},          module);
        extend(wrapper._chains,      {enumerable: false, action: function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return   fn.apply(stack[--index], arguments)._.chain}}},  module);
        extend(wrapper._chains.not,  {enumerable: false, action: function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return (!fn.apply(stack[--index], arguments))._.chain}}}, module);

        extend(wrapper.methods, {enumerable: false}, module);
    }

    // simple cloning function
    function clone(obj) {
        var clone = Object.create(Object.getPrototypeOf(obj));

        Object.getOwnPropertyNames(obj).forEach(function(name) {
            Object.defineProperty(clone, name, Object.getOwnPropertyDescriptor(obj, name));
        });

        return clone;
    }

    // TODO maybe add treat as value option instead of isDescriptor
    /**
     * Extends an object with function/properties from a module object
     *
     * @public
     * @static
     * @method _.extend
     *
     * @param   {Object}   obj       - object to be extended
     * @param   {Object=} _options_  - optional settings/default descriptor
     *     @param   {boolean=}  _options_.enumerable      - boolean indicating if all properties should be enumerable. can be overwritten on a config level
     *     @param   {boolean=}  _options_.configurable    - boolean indicating if all properties should be configurable. can be overwritten on a config level
     *     @param   {boolean=}  _options_.writable        - boolean indicating if all properties should be writable. can be overwritten on a config level
     *
     *     @param   {boolean=}  _options_.override=true   - boolean indicating if properties should be overridden
     *     @param   {boolean=}  _options_.overwrite=true  - boolean indicating if properties should be overwritten
     *     @param   {boolean=}  _options_.new=true        - boolean indicating if new properties should be added
     *     @param   {boolean=}  _options_.shim            - overwrites and their actions are false
     *     @param   {boolean=}  _options_.hasOwnPropertyCheck - check if we should do a has own property check
     *     @param   {boolean=}  _options_.safe                - sets overwrites and overrides both to false
     *     @param   {boolean=}  _options_.all=false           - includes non-enumerable properties
     *
     *     @param   {Array|string=} _options_.exclude     - array of properties that will be excluded
     *
     *     @param   {Function=} _options_.onoverwrite=console.warn - function containing the overwrite action
     *     @param   {Function=} _options_.onoverride=console.warn  - function containing the override action
     *     @param   {Function=} _options_.onnew=null               - function containing the new action
     *     @param   {Function=} _options_.action                   - action to apply on all properties
     *
     *     @param   {Object=}   _options_.onoverwritectx=console - context for the overwrite action
     *     @param   {Object=}   _options_.onoverridectx=console  - context for the override action
     *     @param   {Object=}   _options_.onnewctx               - context for the new action
     *     @param   {Object=}   _options_.actionctx            - context for the default action
     *
     * @param   {Object}  module       - object containing functions/properties to extend the object with
     *
     * @return {Object}  obj - the extended object
     */
    // TODO document attributes
    // TODO add deep extend
    // TODO to be able to add custom attributes and their functions i.e. inject
    function extend(obj, _options_, module) {
        var options    = processOptions(module && _options_ || {});
        var module     = module || _options_;
        var protoChain = collectPrototypeChain(module, obj, options);
    
        if(options.overwrite) {protoChain.reverse()} // otherwise lower chain properties would be overwritten by higher ones
    
        protoChain.forEach(function(proto) {
            var properties = options.all
                ? Object.getOwnPropertyNames(proto)
                : Object.keys(proto);
    
            processProperties(properties, options, proto, obj);
        });
    
        return obj;
    }
    
    function collectPrototypeChain(module, obj, options) {
        var protoChain = [];
        var proto      = module;
    
        do {
            protoChain.push(proto);
    
            proto = Object.getPrototypeOf(proto);
        } while(!proto.isPrototypeOf(obj) && !options.hasOwnPropertyCheck);
    
        return protoChain
    }
    
    function processProperties(properties, options, module, obj) {
        properties.forEach(function(prop) {
            if(options.exclude && ~options.exclude.indexOf(prop)) {return} // continue
    
            var descriptor = getDescriptor(module, prop);
            var actionType = obj.hasOwnProperty(prop) ? 'overwrite' :
                             prop in obj              ? 'override'  :
                                                        'new';
    
            copyPropertyConfigs(options, descriptor);
    
            handleAttributes(descriptor);
            finalizeDescriptor(prop, descriptor, actionType);
    
            if(!descriptor[actionType]) {return} // continue
    
            getNames(prop, descriptor).forEach(function(prop, i) {
                Object.defineProperty(obj, prop, descriptor)
            });
        });
    }
    
    /**
     * Performs action based on type, enabled & value.
     *
     * @param {string}  type='override'|'overwrite' - type the action is acting to
     * @param {Object}  descriptor                  - the property descriptor. this also contains the global options
     * @param {string}  prop                        - name of the property
     */
    function action(type, prop, descriptor) {
        var message;
        var action  = descriptor[(type? 'on' + type : 'action')];
        var ctx     = descriptor[(type? 'on' + type : 'action')+'ctx'];
        var enabled = descriptor[type];
    
        if(!action) return; // no action required so return
    
        message = enabled
            ? (type +' on property: '+prop+'.')
            : ('redundant '+type+' defined for property '+prop+'. '+type+'s are set to false in options/descriptor.');
    
        action.call(ctx, message, prop, descriptor)
    }
    /**
     * processes the options, setting defaults etc.
     *
     * @param options
     *
     * @return options
     */
    function processOptions(options) {
        options.new                 = options.new !== false; // default is true
        options.override            = options.safe
            ? false
            : options.override            !== false; // default is true
        options.overwrite           = options.safe
            ? false
            : options.overwrite           !== false; // default is true
        options.hasOwnPropertyCheck = options.hasOwnPropertyCheck !== false; // default is true
        options.onoverwrite     = options.hasOwnProperty('onoverwrite')
            ? options.onoverwrite
            : console.warn;
        options.onoverride      = options.hasOwnProperty('onoverride')
            ? options.onoverride
            : console.warn;
        options.onoverwritectx        = options.onoverwritectx    || console;
        options.onoverridectx         = options.onoverridectx     || console;
    
        if(options.shim) {
            options.overwrite       = false;
            options.onoverwrite = null;
        }
    
        if(typeof(options.exclude) === 'string')
        {
            options.exclude = options.exclude.split(' ');
        }
    
        return options
    }
    /**
     * Processes the attributes and sets the correct value on the descriptor
     *
     * @param {Object} descriptor - the property descriptor
     */
    function handleAttributes(descriptor) {
        if(!descriptor.value || !descriptor.value.hasOwnProperty('attrs')) {return}
        // TODO add attribute check
        var attrs      = descriptor.value.attrs.split(' '); // TODO make corrections for multiple space and add support for comma's
        var attr;
        var negated;
    
        for(var i = 0; i < attrs.length; i++)
        {
            attr    =  attrs[i];
            negated = !attr.indexOf('!');
    
            descriptor[!negated ? attr : attr.slice(1)] = !negated;
        }
    }
    
    /**
     * Will act on the actual descriptor to change some properties to final
     *
     * @param {Object} descriptor - the property descriptor
     */
    function finalizeDescriptor(prop, descriptor, actionType) {
        if(descriptor.clone)                        {if(descriptor.hasOwnProperty('value') && typeof(descriptor.value) !== 'function') {descriptor.value = clone(descriptor.value)}}
        if(descriptor.constant)                     {descriptor.configurable = false; descriptor.writable = false}
    
        // getters & setters don't have a writable option
        if(descriptor.get || descriptor.set) {delete descriptor.writable}
        // perform actions
        action(actionType, prop, descriptor);
        action('', prop, descriptor); // default action
    }
    /**
     * Copies the main & property specific options to the property descriptor
     *
     * @param {Object} options    - the global options object
     * @param {Object} descriptor - the property descriptor
     */
    function copyPropertyConfigs(options, descriptor) {
    
        // copy global options
        for(var opt in options)
        {   if(!options.hasOwnProperty(opt)) {continue}
    
            descriptor[opt] = options[opt];
        }
    
        var propertyConfig = descriptor.value;
        // copy property specific options (if any).
        // Maybe this needs to be a bit more specific
        if(propertyConfig && isDescriptor(descriptor.value))
        {
            for(var cfg in propertyConfig)
            {   if(!propertyConfig.hasOwnProperty(cfg)) {continue}
    
                descriptor[cfg] = propertyConfig[cfg];
            }
        }
    }
    /**
     * Generates an array of names including aliases
     *
     * @param {string} prop       - the property name
     * @param {Object} descriptor - the property descriptor
     *
     * @return {Array} names
     */
    function getNames(prop, descriptor) {
        var aliases = descriptor.aliases;
        var names   = !aliases               ? [] :
                      Array.isArray(aliases) ? aliases :
                                               aliases.split(' '); // TODO better splitting including corrections;
    
        names.unshift(prop);
        return names
    }
    /**
     * Gets the descriptor of a property in prototype chain
     *
     * @param {Object} obj  - the object in the prototype chain
     * @param {string} prop - the name of the property
     *
     * @returns {Object} - the property descriptor
     */
    function getDescriptor(obj, prop) {
        var proto = obj;
    
        do
        {
            if (proto.hasOwnProperty(prop)) {break}
        } while (proto = Object.getPrototypeOf(proto));
    
        return Object.getOwnPropertyDescriptor(proto, prop)
    }
    
    function isDescriptor(value)
    {
        return (value.hasOwnProperty('value') || value.hasOwnProperty('get') || value.hasOwnProperty('set')) && value.isDescriptor !== false
    }
    extend(Function.prototype, {shim: true}, {
        /**
         * Returns the name of a function
         * @public
         * @method Function#name
         * @returns {string} - name of the functino
         */
        name: function()
        {
            return this.toString().match(/^function\s?([^\s(]*)/)[1];
        },
        bind: function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }
    
            var aArgs   = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                    return fToBind.apply(this instanceof fNOP
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
    
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
    
            return fBound;
        }
    });
    
    extend(Math, {shim: true}, {
        /**
         * Decimal log function
         * @public
         * @method Math.log10
         * @param   {number} val - value to get the log10 from
         * @returns {number}     - angle in degrees
         */
        log10: function(val) {
            return Math.log(val)/Math.LN10;
        }
    });
    
    extend(Number, {shim: true}, {
        /**
         * Check for isNaN conform the ES6 specs
         * @public
         * @method Number.isNaN
         * @param   {number} value - value to check is NaN for
         * @returns {boolean}      - boolean indicating if the value is NaN
         */
        isNaN: function(value) {
            return typeof value === "number" && value !== value;
        }
    });
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
        toString: {onoverride: null, value: function(obj) {return obj? obj._.toString() : obj+''}}
    });
    /**
     * Create a wrapper function that can hold multiple callbacks that are executed in sequence.
     * The result of the last added function is returned
     * The returned function will be decorated with with additional functionality. such as add, addOnce, remove, removeAll
     *
     * @method _.fnc.Batcher
     *
     * @param  {...Function=} ___fnc_ - optional multiple functions.
     *
     * @return {Function} - decorated batcher function
     */
    function Batcher(___fnc_) {
    
        // store callbacks & context on the batcher function for easy debugging
        batcher._callbacks = [];
        batcher._ctx       = null;
    
        function batcher() {
            var result;
    
            for(var i = 0, max = batcher._callbacks.length; i < max; i++)
            {
                result = batcher._callbacks[i].apply(batcher._ctx || this, arguments);
            }
    
            return result; // return the result of the last added function
        }
    
        // add any initial functions
        if(___fnc_) add.apply(batcher, arguments);
    
        /**
         * Getter/Setter function for the internal callbacks array
         *
         * @this batcher
         *
         * @param  {Array=} functionArray - an array of functions.
         *
         * @return {Array|Function} - callbacks array or batcher function
         */
        batcher.callbacks = function(functionArray)
        {   if(functionArray === undefined) {return this._callbacks}
    
            this._callbacks = functionArray;
    
            return this
        };
        /**
         * Getter/Setter function for batcher context
         *
         * @this batcher
         *
         * @param {Object=} ctx_ - context for the batcher function
         *
         * @return {Object|Function} - context or batcher function
         */
        batcher.ctx = function(ctx_)
        {   if(ctx_ === undefined) {return this._ctx}
    
            this._ctx = ctx_;
    
            return this
        };
        /**
         * Adds a callback to the callback array
         *
         * @this batcher
         *
         * @param {...Function} ___cb - one or multiple callbacks to add
         *
         * @return {Function} - the batcher function
         */
        batcher.add = add; function add(___cb)
        {
            for(var i = 0, max = arguments.length; i < max; i++)
            {
                this._callbacks.push(arguments[i]);
            }
    
            return this
        }
        /**
         * Adds a callback, that is only executed once, to the callback array
         *
         * @param {...Function} ___cb - the callback function one likes to add
         *
         * @returns {Function} - the batcher function
         */
        batcher.addOnce = function(___cb)
        {
            for(var i = 0, max = arguments.length; i < max; i++)
            {
                !function(cb) {
                    function once() {
                        batcher.remove(once);
                        return cb.apply(this, arguments);
                    }
    
                    batcher.add(once);
                }(arguments[i])
            }
    
            return this
        };
        /**
         * Removes a callbacks from the callback array
         *
         * @this batcher
         *
         * @param {...Function} ___cb - callback functions to remove
         *
         * @return {Function} - the batcher function
         */
        batcher.remove = function(___cb)
        {
            for(var i = 0, max = arguments.length, index; i < max; i++)
            {
                index = this._callbacks.indexOf(arguments[i]);
    
                if (~index) {this._callbacks.splice(index, 1)}
                else        {console.warn('trying to remove a function from batcher that is not registered as a callback')}
            }
    
            return this
        };
        /**
         * Removes all callbacks
         *
         * @this batcher
         *
         * @return {Function} - the batcher function
         */
        batcher.removeAll = function()
        {
            this._callbacks = [];
    
            return this
        };
    
        return batcher
    }
    /**
     * Wrapper to create a new batcher function avoiding the new keyword
     *
     * @returns {Function}
     */
    Batcher.create = function()
    {
        return Batcher.apply(null, arguments);
    };
    construct('obj', {native:Object}, {
        /**
         * @namespace obj
         */
        static: {
            /**
             * Clones an object
             *
             * @public
             * @static
             * @method obj.clone
             *
             * @param   {Object}  obj   - object to be cloned
             *
             * @return  {Object}  clone - the cloned object
             */
            // TODO These should be expanded with frozen, extensible states etc
            clone: function clone(obj) {
                if(_.isPrimitive(obj)) return obj;
                if(_.isArray(obj))     return obj.slice();
    
                var clone = _.create(obj._.proto());
                var names = obj._.names();
    
                names._.each(function(name) {
                    Object.defineProperty(clone, name, obj._.descriptor(name));
                });
    
                return clone;
            },
            /**
             * Clones an object
             *
             * @public
             * @static
             * @method obj.cloneDeep
             *
             * @param   {Object}  obj   - object to be cloned
             *
             * @return  {Object}  clone - the cloned object
             */
            // TODO adaptation for arrays in phantomJS
            cloneDeep: function cloneDeep(obj) {
                if(_.isPrimitive(obj)) return obj;
    
                var clone = _.create(obj._.proto());
                obj._.names()._.each(function (name) {
                    var pd = obj._.descriptor(name);
                    if (pd.value) pd.value = _.cloneDeep(pd.value); // does this clone getters/setters ?
                    Object.defineProperty(clone, name, pd);
                });
                return clone;
            },
            /**
             * creates an object based on a prototype
             *
             * @public
             * @static
             * @method _.create
             *
             * @param  {Object} proto - prototype to base the object on
             *
             * @return {Object}       - new object based on prototype
             */
            create: function(proto) {
                return (proto === Array.prototype) ? [] : Object.create(proto);
            },
            /**
             * See bottom_line.js for documentation details
             */
            extend: extend,
            /**
             * Returns the type of an object. Better suited then the one from js itself
             *
             * @public
             * @static
             * @method obj.typeof
             *
             * @param   {Object} obj - object tot check the type from
             *
             * @return {string} - type of the object
             */
            typeOf: function(obj) {
    
                switch(obj)
                {
                    case null      : return 'null'; // null & undefined should be separate cases since for phantomJS they'll return 'domWindow'
                    case undefined : return 'undefined';
                    default        : return  Object.prototype.toString.call(obj)._.between('[object ', ']')._.decapitalize();
                }
            },
            /**
             * Static version of _.names returns an empty array in case of null or undefined
             *
             * @public
             * @static
             * @method obj.names
             *
             * @param  {Object} obj - object tot check the type from
             *
             * @return {string}     - type of the object
             */
            names: function(obj) {
                return (obj === null || obj === undefined) ? [] : Object.getOwnPropertyNames(obj);
            },
            /**
             * Returns the correct owner/prototype of a property in a prototype chain
             *
             * @public
             * @static
             * @method obj.owner
             *
             * @param {string} prop - property name
             * @param {Object} obj  - start prototype
             *
             * @return {Object|undefined} - the owning prototype
             */
            owner: function(prop, obj)
            {
                var proto = obj;
    
                do
                {
                    if(proto.hasOwnProperty(prop)) {return proto}
                } while(proto = proto._.proto())
            }
        },
        prototype: {
            /**
             * Singular push function to solve problems with differences between objects & arrays
             *
             * @private
             * @method obj#_add
             *
             * @this    {Object}
             *
             * @param  {...any}  val - value to push
             *
             * @return  {Array} this - this for chaining
             */
            _add: function(val, key) {
                this[key] = val;
    
                return this;
            },
            /**
             * Counts the number of occurrences of an element
             *
             * @public
             * @method obj#count
             *
             * @param   {any}   elm  - value to push
             *
             * @return  {number} occurrences - occurrences of the elm int he object
             */
            count: function(elm) {
                var occurrences = 0;
    
                this._.each(function(e) {
                    occurrences += e === elm; // js magic true = 1 false = 0
                });
    
                return occurrences;
            },
            /**
             * Counts the number of occurrences of an element. Based on the match function
             *
             * @public
             * @method obj#countFn
             *
             * @param   {Function}  matchFn     - match function should return a boolean or 0 1
             *
             * @return  {number}    occurrences - occurrences of the elm int he object
             */
            countFn: function(matchFn) {
                var occurrences = 0;
    
                this._.each(function(e) {
                    occurrences += matchFn(e); // js magic true = 1 false = 0
                });
    
                return occurrences;
            },
            /**
             * Shortcut to Object.defineProperty. If no descriptor property is given enumerable, configurable & writable will all be false
             *
             * @public
             * @method obj#define
             *
             * @this   {Object}
             *
             * @param  {string} prop       - the property name
             * @param  {Object} descriptor - descriptor object
             *
             * @return {Object} this        - object for chaining
             */
            define: function(prop, descriptor)
            {
                return Object.defineProperty(this, prop, descriptor)
            },
            /**
             * Defines a constant: enumerable, configurable & writable will all be false
             *
             * @public
             * @method obj#constant
             *
             * @this   {Object}
             *
             * @param  {string} prop  - the constant name
             * @param  {Object} value - the value of the constant.
             *
             * @return {Object} this  - object for chaining
             */
            constant: function(prop, value)
            {
                return Object.defineProperty(this, prop, {value:value, enumerable: true})
            },
            /**
             * Remove elements based on index
             *
             * @public
             * @method obj#del
             *
             * @this       {Object}
             *
             * @param  {...number} ___keys - indices SORTED
             *
             * @return     {Array}   this - mutated array for chaining
             */
            del: function(___keys)
            {
                arguments._.eachRight(function(key) {
                    delete this[key];
                }, this);
    
                return this;
            },
            /**
             * Remove elements based on index
             *
             * @public
             * @method obj#delFn
             *
             * @this   {Array}
             *
             * @param  {function(index, arr, delta)} match - function specifying the indices to delete
             * @param  {Object=}                     ctx_   - optional context for the match function
             *
             * @return {Array}                       this   - mutated array for chaining
             */
            delFn: function(match, ctx_)
            {
                this._.each(function(val, key, obj) {
                    if(match.call(ctx_, key, obj)) {delete this[key]}
                }, this);
    
                return this;
            },
            /**
             * Creates a new array without the specified indices
             *
             * @public
             * @method obj#Del
             *
             * @this       {Array}
             *
             * @param  {...number} ___keys - keys
             *
             * @return     {Array}    this - new array without the specified indices
             */
            Del: function(___keys)
            {
                var args   = arguments;
                var output = _.create(this._.proto());
    
                this._.each(function(val, key) { // eachRight is a little bit faster
                    if(args._.not.has(key)) {output._._add(val, key)}
                }, this);
    
                return output;
            },
            /**
             * Creates a new array without the specified indices
             *
             * @public
             * @method obj#DelFn
             *
             * @this   {Array}
             *
             * @param  {function(index, arr, delta)} match - function specifying the indices to delete
             * @param  {Object=}                     ctx_   - optional context for the match function
             *
             * @return {Array}                       this   - new array without the specified indices
             */
            DelFn: function(match, ctx_)
            {
                var output = _.create(this._.proto());
    
                this._.each(function(val, key, obj, delta) { // eachRight is a little bit faster
                    if(!match.call(ctx_, key, obj, delta)) {output._._add(val, key)}
                }, this);
    
                return output;
            },
            /**
             * Gets the descriptor of a property. Will search through the prototype chain
             *
             * @public
             * @method obj#descriptor
             *
             * @this   {Object}
             *
             * @param  {string}       prop - the property name
             *
             * @return {Object} descriptor - descriptor object
             */
            descriptor: function(prop)
            {
                return Object.getOwnPropertyDescriptor(_.owner(prop, this), prop)
            },
            /**
             * Object iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#each
             *
             * @this  {Object}
             *
             * @param {Function} cb   - callback function to be called for each element
             * @param {Object=}  ctx_ - optional context
             *
             * @return {any|boolean}  - output from the callback function
             */
            each: function(cb, ctx_) {
                if(_.isArguments(this)) return _.arr.methods.each.apply(this, arguments); // handle arguments.
                var output;
    
                for (var key in this) {
                    if (!this.hasOwnProperty(key)) continue;
                    if ((output = cb.call(ctx_, this[key], key, this)) === false) break;
                }
    
                return output;
            },
            /**
             * Object descriptor iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#eachDsc
             *
             * @this  {Object}
             *
             * @param {Function} cb   - callback function to be called for each element
             * @param {Object=}  ctx_ - optional context
             *
             * @return {any|boolean}  - output from the callback function
             */
            eachDsc: function(cb, ctx_) {
                var output;
    
                for (var key in this) {
                    if (!this.hasOwnProperty(key)) continue;
                    if ((output = cb.call(ctx_, this._.descriptor(key), key, this)) === false) break;
                }
    
                return output;
            },
            /**
             * Object iterator without hasOWnProperty check.
             * If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#each$
             * @this  {Object}
             *
             * @param {Function} cb   - callback function to be called for each element
             * @param {Object=}  ctx_ - optional context
             *
             * @return {any|boolean}  - output from the callback function
             */
            each$: function(cb, ctx_) {
                if(_.isArguments(this)) return _.arr.methods.each.apply(this, arguments); // handle arguments.
                var output;
    
                for (var key in this) {
                    if ((output = cb.call(ctx_, this[key], key, this)) === false) break;
                }
    
                return output;
            },
            /**
             * Object descriptor iterator without hasOWnProperty check.
             * If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#eachDsc$
             * @this  {Object}
             *
             * @param {Function} cb   - callback function to be called for each element
             * @param {Object=}  ctx_ - optional context
             *
             * @return {any|boolean}  - output from the callback function
             */
            eachDsc$: function(cb, ctx_) {
                var output;
    
                for (var key in this) {
                    if ((output = cb.call(ctx_, this._.descriptor(key), key, this)) === false) break;
                }
    
                return output;
            },
            /**
             * Inverse iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#eachRight
             *
             * @this  {Object}
             *
             * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
             * @param {function} cb    - callback function to be called for each element
             * @param {Object=}  ctx_  - optional context for the callback function
             *
             * @return {any|boolean}   - output from the callback function
             */
            eachRight: function(step_, cb, ctx_) {
                if(_.isArguments(this)) return _.arr.methods.eachRight.apply(this, arguments); // handle arguments.
    
                return this._.keys()._.eachRight(function(key) {
                    return cb.call(ctx_, this[key], key, this); // loop is broken upon returning false
                }, this);
            },
            /**
             * Inverse iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#eachDscRight
             *
             * @this  {Object}
             *
             * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
             * @param {function} cb    - callback function to be called for each element
             * @param {Object=}  ctx_  - optional context for the callback function
             *
             * @return {any|boolean}   - output from the callback function
             */
            eachDscRight: function(step_, cb, ctx_) {
                return this._.keys()._.eachRight(function(key) {
                    return cb.call(ctx_, this._.descriptor(key), key, this); // loop is broken upon returning false
                }, this);
            },
            /**
             * Inverse iterator without hasOwnProperty check.
             * If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#each$Right
             *
             * @this  {Object}
             *
             * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
             * @param {function} cb    - callback function to be called for each element
             * @param {Object=}  ctx_  - optional context for the callback function
             *
             * @return {any|boolean}   - output from the callback function
             */
            each$Right: function(step_, cb, ctx_) {
                if(_.isArguments(this)) return _.arr.methods.eachRight.apply(this, arguments); // handle arguments.
    
                return this._.names()._.eachRight(function(key) {
                    return cb.call(ctx_, this[key], key, this); // loop is broken upon returning false
                }, this);
            },
            /**
             * Inverse iterator without hasOwnProperty check.
             * If the value false is returned, iteration is canceled. This can be used to stop iteration
             *
             * @public
             * @method obj#eachDsc$Right
             *
             * @this  {Object}
             *
             * @param {number=}  step_ - step for the iteration. Only valid in case this is Arguments
             * @param {function} cb    - callback function to be called for each element
             * @param {Object=}  ctx_  - optional context for the callback function
             *
             * @return {any|boolean}   - output from the callback function
             */
            // FIXME names not correct to use here
            //eachDsc$Right: function(step_, cb, ctx_) {
            //    return this._.names()._.eachRight(function(key) {
            //        return cb.call(ctx_, this._.descriptor(key), key, this); // loop is broken upon returning false
            //    }, this);
            //},
            /**
             * Filters
             *
             * @public
             * @method obj#filter
             *
             * @this   {Object}
             *
             * @param  {Function} cb      - callback function to be called for each element
             * @param  {Object=}  opt_ctx - optional context
             *
             * @return {Array} array containing the filtered values
             */
            filter: function(cb, opt_ctx) {
                var filtered = [];
    
                this._.each(function(elm) {
                    if(cb.call(opt_ctx, elm)) filtered.push(elm);
                });
    
                return filtered;
            },
            /**
             * Finds first element that is picked by the callback function
             *
             * @public
             * @method obj#find
             *
             * @param  {Function} cb   - callback function to be called for each element
             * @param  {Object=}  ctx_ - optional context
             *
             * @return {any} first value that is found
             */
            find: function(cb, ctx_) {
                var found;
    
                this._.each(function(elm) {
                    if(cb.call(ctx_, elm)) return found = elm, false; // break iteration
                });
    
                return found;
            },
            /**
             * Finds first element that is picked by the callback function. Starting from the rioght
             *
             * @public
             * @method obj#findRight
             *
             * @param  {Function} cb   - callback function to be called for each element
             * @param  {Object=}  ctx_ - optional context
             *
             * @return {any} first value that is found
             */
            findRight: function(cb, ctx_) {
                var found;
    
                this._.eachRight(function(elm) {
                    if(cb.call(ctx_, elm)) return found = elm, false; // break iteration
                });
    
                return found;
            },
            /**
             * Checks if a value is contained ia a object
             *
             * @public
             * @method obj#has
             *
             * @param {any} value - value to search for
             *
             * return {boolean} - boolean indicating if the object has the value
             */
            has: {aliases: ['contains'], value: function(value) {
                var has = false;
    
                this._.each(function(val) {
                    if(value === val) return !(has = true);
                });
    
                return has;
            }},
            /**
             * Checks if a value is contained ia a object, matching the callback function
             *
             * @public
             * @method obj#hasFn
             *
             * @param {Function} cb   - callback matching a value
             * @param {Object=}  ctx_ - optional context for the callback function
             *
             * return {boolean} - boolean indicating if the object has the value
             */
            hasFn: {aliases: ['containsFn'], value: function(cb, ctx_) {
                return !!this._.find(cb, ctx_);
            }},
            /**
             * InstanceOf function that doesn't lie and returns true if the instance was created by the actual class or prototype
             *
             * @public
             * @method obj#instanceOf
             *
             * @param {Function|Object} class_prototype - either a function or a prototype depending on the type of inheritance you are using
             *
             * @returns {boolean} - boolean indicating if the instance was created by the actual class or prototype
             */
            instanceOf: function(class_prototype) {
                var cp = class_prototype;
    
                return cp.prototype? this.constructor === cp : Object.getPrototypeOf(this) === cp;
            },
            keyOf: {aliases: ['indexOf'], value: function(value) {
                var key = -1;
    
                this._.each(function(val, k) {
                    if(value === val) return key = k, false;
                });
    
                return key;
            }},
            keyOfFn: {aliases: ['indexOfFn'], value: function(cb, ctx_) {
                var key = -1;
    
                this._.each(function(val, k) {
                    if(cb.call(ctx_, val)) return key = k, false;
                });
    
                return key;
            }},
            /**
             * Returns an array containing the keys of an object (enumerable properties))
             *
             * @public
             * @method obj#keys
             *
             * @this   {Object}
             *
             * @return {Array} keys of the object
             */
            keys: function() {
                return Object.keys(this);
            },
            /**
             * Removes 1st values from an object|array
             *
             * @public
             * @method obj#remove
             *
             * @this   {Object|Array}
             *
             * @param  {...any}       ___values - values to remove
             *
             * @return {Object|Array} this      - mutated array for chaining
             */
            remove: function(___values) {
                var args = arguments;
                var len  = arguments.length;
                var index;
    
                this._.each(function(val, i) {
                    index = args._.indexOf(val);
                    if(~index) {this._.del(i); delete args[index]; return --len > 0}
                }, this);
    
                return this;
            },
            /**
             * Removes 1st value from an object|array based on a match function
             *
             * @public
             * @method obj#removeFn
             *
             * @this   {Array}
             *
             * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
             * @param  {Object=}                          ctx_   - optional context for the match function
             *
             * @return {Array}                            this   - mutated array for chaining
             */
            removeFn: function(match, ctx_) {
                this._.each(function(val, i, arr, delta) {
                    if(match.call(ctx_, val, i, arr, delta)) {this._.del(i); return false}
                }, this);
    
                return this;
            },
            /**
             * Creates new array without the specified 1st values
             * @public
             * @method obj#Remove
             *
             * @this   {Object|Array}
             *
             * @param  {...any} ___values - values to remove
             *
             * @return {Array}  output    - new array without the values
             */
            Remove: function(___values) {
                var output = _.create(this._.proto());
                var args   = arguments;
                var index;
    
                this._.each(function(val, key) {
                    index = args._.indexOf(val);
                    if(~index) {delete args[index]}
                    else       {output._._add(val, key)}
                }, this);
    
                return output;
            },
            /**
             * Creates a new object|array without 1st value based on a match function
             *
             * @public
             * @method obj#RemoveFn
             *
             * @this   {Array}
             *
             * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
             * @param  {Object=}                          ctx_   - optional context for the match function
             *
             * @return {Array}                            output - new array without the value specified
             */
            RemoveFn: function(match, ctx_) {
                var output  =  _.create(this._.proto());
                var matched = false;
    
                this._.each(function(val, key, obj, delta) {
                    if(!matched && match.call(ctx_, val, key, obj, delta)) {matched = true}
                    else                                                   {output._._add(val, key)}
                }, this);
    
                return output;
            },
            /**
             * Removes all specified values from an array
             *
             * @public
             * @method obj#remove$
             *
             * @this       {Array}
             *
             * @param     {...any} ___values - values to remove
             *
             * @return     {Array}     this - mutated array for chaining
             */
            remove$: function(___values) {
                var args = arguments;
    
                this._.each(function(val, key) {
                    if(args._.has(val)) {delete this[key]}
                }, this);
    
                return this;
            },
            /**
             * Removes all values from an array based on a match function
             *
             * @public
             * @method obj#remove$Fn
             *
             * @this   {Array}
             *
             * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match function
             *
             * @return {Array}                             this  - mutated array for chaining
             */
            remove$Fn: function(match, ctx_) {
                this._.each(function(val, key, obj) { // eachRight is a little bit faster
                    if(match.call(ctx_, val, key, obj)) {delete this[key]}
                }, this);
    
                return this;
            },
    
            /**
             * Creates new array without all specified values
             *
             * @public
             * @method obj#Remove$
             *
             * @this       {Array}
             *
             * @param     {...any} ___values - values to remove
             *
             * @return     {Array}    output - new array without the values
             */
            Remove$: function(___values) {
                var output = _.create(this._.proto());
                var args   = arguments;
    
                this._.each(function(val, key) {
                    if(args._.not.has(val)) {output._._add(val, key)}
                }, this);
    
                return output;
            },
            /**
             * Creates a new array without all value specified by the match function
             *
             * @public
             * @method obj#Remove$Fn
             *
             * @this   {Array}
             *
             * @param  {function(val, index, arr, delta)} match - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match function
             *
             * @return {Array}                           output  - new array without the value specified
             */
            Remove$Fn: function(match, ctx_) {
                var output = _.create(this._.proto());
    
                this._.each(function(val, key, obj, delta) {
                    if(!match.call(ctx_, val, key, obj, delta)) {output._._add(val, key)} // key is ignored in case of array
                }, this);
    
                return output;
            },
    
            select: function(___values) {
                var args = arguments;
                return this._.remove$Fn(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
            },
    
            selectFn: function(match, ctx_) {
                var matched = false;
                return this._.remove$Fn(function() {return (match.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
            },
    
            Select: function(___values) {
                var args = arguments;
                return this._.Remove$Fn(function(val) {var index = args._.indexOf(val); if(~index) delete args[index]; return !~index});
            },
    
            SelectFn: function(match, ctx_) {
                var matched = false;
                return this._.Remove$Fn(function() {return (match.apply(this, arguments) && !matched)? !(matched = true) : true}, ctx_);
            },
    
            select$: function(___values) {
                var args = arguments;
                return this._.remove$Fn(function(val) {return !~args._.indexOf(val)});
            },
            select$Fn: function(match, ctx_) {
                return this._.remove$Fn(_.fnc.negate(match), ctx_);
            },
            Select$: function(___values) {
                var args = arguments;
                return this._.Remove$Fn(function(val) {return !~args._.indexOf(val)});
            },
            Select$Fn: {aliases: ['find$'], value: function(match, ctx_) {
                return this._.Remove$Fn(_.fnc.negate(match), ctx_);
            }},
            /**
             * Returns the number of own properties on an object
             *
             * @public
             * @method obj#size
             *
             * @this   {Object}
             *
             * @return {number} the 'length' of the object
             */
            size: {aliases: ['length'], value: function() {
                var len = 0;
    
                this._.each(function() {
                    len++;
                });
    
                return len;
            }},
            /**
             * Returns an array containing the names of an object (includes non-enumerable properties)
             *
             * @public
             * @method obj#names
             *
             * @return {Array} keys of the object
             */
            names: {aliases: ['keys$'], value:function() {
                return Object.getOwnPropertyNames(this);
            }},
            /**
             * Shortcut for hasOwnProperty
             * @public
             * @method obj#owns
             *
             * @return {boolean} boolean indicating ownership
             */
            owns: Object.prototype.hasOwnProperty,
            /**
             * Returns an array containing the keys & values of an object (enumerable properties)
             *
             * @public
             * @method obj#pairs
             *
             * @this   {Object}
             *
             * @return {Array} keys & values of the object in a singular array [key1, val1, key2, val2, ...]]
             */
            pairs: function() {
                var pairs = [];
    
                this._.each(function(val, key) {
                    pairs.push(key, val);
                });
    
                return pairs;
            },
            /**
             * Sets/gets the prototype of an object
             * NOTE setting a prototype using __proto__ is non standard (and SLOOWWW) use at your own risk!
             *
             * @public
             * @method obj#proto
             *
             * @param   {Array}        proto - the prototype to be set
             *
             * @returns {Array|Object} this  - the prototype of the object or the object itself for chaining
             */
            proto: function(proto) {
                if(proto === undefined) return Object.getPrototypeOf(this);
    
                this.__proto__ = proto;
    
                return this;
            },
            /**
             * Better to string version
             *
             * @public
             * @method obj#toString
             *
             * @this    {Object}
             *
             * @returns {string} - string representation of the object
             */
            toString: {onoverride: null, value: function(visited_)
            {
                var output = '';
    
                this._.each(function(obj, key) {
                    var val;
    
                    if(_.isPrimitive(obj))      {val = obj}
                    else
                    {
                        if(!visited_)           {visited_ = [this]}
    
                        if(visited_._.has(obj)) {val = '[[circular ref]]'}
                        else                    {visited_.push(obj); val = obj._.toString(visited_)}
                    }
    
                    // TODO punctuation for strings & proper formatting
                    output += (output? ', ' : '{') + key + ': ' + val
                });
    
                return output + '}';
            }},
            /**
             * Returns an array containing the values of an object (enumerable properties)
             * @public
             *
             * @method obj#values
             *
             * @this   {Object}
             *
             * @return {Array} values of the object
             */
            values: function() {
                var values = [];
    
                this._.each(function(elm) {
                    values.push(elm);
                });
    
                return values;
            }
        }
    });
    construct('arr', {native:Array}, {
        /**
         * @namespace arr
         */
        static: {
            /**
             * Concatenates arrays into a new array
             * @public
             * @static
             * @method arr.concat
             * @param {...Array} ___arrays - arrays to concat
             * @returns  {Array}           - the concatenated array
             */
            concat: function(___arrays) {
                return Array.prototype.concat.apply([], arguments);
            }
        },
        prototype: {
            /**
             * Append one or more arrays to the current array. Takes into account broken arrays
             * @public
             * @method   arr#append
             * @param   {...Array} ___arrays - arrays to be appended
             * @returns    {Array}      this - this appended with the arrays
             */
            append: function(___arrays) {
                var start;
    
                arguments._.each(function(arr) {
                    if(!arr) return; // continue
    
                    start        = this.length; // start position to start appending
                    this.length += arr.length;  // set the length to the length after appending
                    // copy the properties in case defined
    
                    arr._.each(function(val, i, arr) {
                        if(val === undefined && arr._.not.owns(i)) return; // continue. take into account broken arrays
                        this[start+i] = val;
                    }, this);
    
                }, this);
    
                return this;
            },
            /**
             * Append one or more arrays to the current array into a new array
             * @public
             * @method   arr#Append
             * @param   {...Array} ___arrays - arrays to be appended
             * @returns    {Array}           - The new array that is the result of appending
             */
            Append: function(___arrays) {
                return _.clone(this)._.append.apply(null, arguments); // we can use a null context here since it will get the value from the stack
            },
            /**
             * Returns the average of a number based array
             * @public
             * @method   arr#avg
             * @this    {Array<number>}
             * @returns {number} - Average of the numbers in the array
             */
            avg: function() {
                if(!this.length) return;
    
                return this._.sum()/this.length;
            },
            /**
             * Removes al falsey values from an array
             * @public
             * @method  arr#compact
             * @this   {Array}
             * @return {Array} this - mutated array for chaining
             */
            compact: function()
            {
                return this._.remove$Fn(function(val) {return !val});
            },
            /**
             * Removes all falsey values from an array into a new array
             * @public
             * @method  arr#Compact
             * @this   {Array}
             * @return {Array} this - new array instance without falsey values
             */
            Compact: function()
            {
                return this._.Remove$Fn(function(val) {return !val});
            },
            /**
             * Remove elements based on index
             * @public
             * @method arr#del
             * @this       {Array}
             * @param  {...number} ___indices - indices SORTED
             * @return     {Array}       this - mutated array for chaining
             */
            del: {onoverride: undefined, value: function(___indices)
            {
                arguments._.eachRight(function(key) {
                    this.splice(key, 1);
                }, this);
    
                return this;
            }},
            /**
             * Remove elements based on index
             * @public
             * @method  arr#delFn
             * @param  {function(index, arr, delta)} match - function specifying the indices to delete
             * @param  {Object=}                     ctx_   - optional context for the match function
             * @return {Array}                       this   - mutated array for chaining
             */
            delFn: {onoverride: null, value: function(match, ctx_)
            {
                this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                    if(match.call(ctx_, i, arr, delta)) {this.splice(i, 1)}
                }, this);
    
                return this;
            }},
            /**
             * Removes all specified values from an array
             * @public
             * @method  arr#remove$
             * @param  {...any} ___values - values to remove
             * @return {Array}       this - mutated array for chaining
             */
            remove$: {onoverride: null, value: function(___values) {
                var args = arguments;
    
                this._.eachRight(function(val, i) { // eachRight is a little bit faster
                    if(~args._.indexOf(val)) {this.splice(i, 1)}
                }, this);
    
                return this;
            }},
            /**
             * Removes all values from an array based on a match function
             * @public
             * @method  arr#remove$Fn
             * @this   {Array}
             * @param  {function(val, index, arr, delta)} match  - function specifying the value to delete
             * @param  {Object=}                            ctx_ - optional context for the match function
             * @return {Array}                             this  - mutated array for chaining
             */
            remove$Fn: {onoverride: null, value: function(match, ctx_) {
                this._.eachRight(function(val, i, arr, delta) { // eachRight is a little bit faster
                    if(match.call(ctx_, val, i, arr, delta)) {this.splice(i, 1)}
                }, this);
    
                return this;
            }},
    
            /**
             * Difference between the current and other arrays
             * @public
             * @method   arr#diff
             * @param   {...Array} ___arrays - arrays to subtract from this
             * @returns {Array}         this - array mutated by difference
             */
            diff: function(___arrays)
            {
                arguments._.each(function(arr) {
                    return this._.remove.apply(this, arr);
                }, this);
    
                return this
            },
            /**
             * Returns the difference between the current and multiple other arrays in a new array
             * @public
             * @method   arr#Diff
             * @param   {...Array} ___arrays - array to subtract from this
             * @returns {Array}              - new array containing the difference
             */
            Diff: function(___arrays)
            {
                if(arguments.length === 1) {return this._.Remove.apply(this, ___arrays)}
    
                return _.clone(this)._.diff.apply(null, arguments); // we can use a null context here since it will get the value from the stack
            },
            /**
             * Creates a multidimensional array. The dimensions come from the array itself
             * i.e. [3, 6]._.dimit('zero'); Creates a 2D array of 3 by 6 initialized by the value 'zero'
             * @public
             * @method arr#Dimit
             * @this   {Array}
             * @param  {any|Function=} init_ - initial value for the array. Can be either a value or a function specifying the value
             * @return {Array}               - this initialized multi-dimensional array
             */
            dimit: {aliases: ['dimensionalize'], value: function(init_)
            {
                var dimensions    = this;
                var arr           = new Array(dimensions[0]);
                var lastDimension = dimensions.length-1;
    
                // add other dimensions
                addDimension(arr, 0, dimensions);
    
                return arr;
    
                function addDimension(arr, dim, dimensions)
                {
                    for(var i = 0, max = dimensions[dim]; i < max; i++)
                    {
                        arr[i] = (dim === lastDimension)? _.clone(init_) : new Array(dimensions[dim+1]);
    
                        addDimension(arr[i], dim+1, dimensions); // add another dimension
                    }
                }
            }},
            /**
             * Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * each is eachlastic in the sense that one can add and delete elements at the current index
             * @public
             * @method arr#each
             * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb    - callback function to be called for each element
             * @param  {Object=}  ctx_  - optional context for the callback function
             * @return {any|boolean}    - output from the callback function
             */
            each: {onoverride: null, value: function(step_, cb, ctx_) {
                if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}
    
                var from = 0, to = this.length;
                var val, diff, size = to, delta = 0;
                var output;
    
                for(var i = from; i < to; i += step_)
                {
                    if((val = this[i]) === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if((output = cb.call(ctx_, this[i], i, this, delta)) === false) break;
                    if(diff = this.length - size) i += diff, to += diff, size += diff, delta += diff; // correct index after insertion or deletion
                }
    
                return output;
            }},
            /**
             * Inverse Array iterator. If the value false is returned, iteration is canceled. This can be used to stop iteration
             * @public
             * @method arr#eachRight
             * @this   {Array}
             * @param  {number=}  step_ - step for the iteration. In case this is a negative value it will do a reverse iteration
             * @param  {function} cb    - callback function to be called for each element
             * @param  {Object=}  ctx_  - optional context for the callback function
             * @return {any|boolean}    - output from the callback function
             */
            eachRight: {onoverride: null, value: function(step_, cb, ctx_) {
                if(typeof(step_) === 'function') {ctx_ = cb; cb = step_; step_ = 1}
    
                var from = this.length-1, to = -1;
                var output;
    
                for(var i = from; i > to; i -= step_)
                {
                    if(this[i] === undefined && !this.hasOwnProperty(i)) continue; // handle broken arrays. skip indices, we first check for undefined because hasOwnProperty is slow
                    if((output = cb.call(ctx_, this[i], i, this)) === false) break;
                }
    
                return output;
            }},
            /**
             * Get/sets: the first element of an array
             * @public
             * @method arr#first
             * @param  {any=}      val_ - value to set on the first element. if no value is given the first element is returned
             * @return {any|Array}      - first element of the array or the array itself
             */
            first: function(val_) {
                if(val_ === undefined) return this[0];
    
                this[0] = val_;
    
                return this;
            },
            /**
             * Flattens a 2 dimensional array
             * @public
             * @method   arr#flatten
             * @returns {Array} - this for chaining
             */
            // TODO multi dimensional flattening
            flatten: function() {
                this._.each(function(val, i) {
                    if(_.isArray(val)) this.splice.apply(this, val._.insert(1)._.insert(i));
                }, this);
    
                return this
            },
            /**
             * Flattens a 2 dimensional array into a new array
             * @public
             * @method arr#Flatten
             * @returns {Array} - new flattened version of the array
             */
            Flatten: function() {
                return this.concat.apply([], this);
            },
            /**
             * Check is an array contains a certain value
             * @public
             * @method   arr#has
             * @param   {Object}  elm - element to check membership of
             * @returns {boolean}     - boolean indicating if the array contains the element
             */
            has: {aliases: ['contains'], onoverride: null, value: function(elm) {
                return this.indexOf(elm) > -1;
            }},
            /**
             * Inserts an element in a specific location in an array
             * @public
             * @method   arr#insert
             * @this    {Array}
             * @param   {Object}  elm - element to check membership of
             * @param   {number}    i - position to insert the element
             * @return  {Array}       - this for chaining
             */
            insert: function(elm, i) {
                return this.splice(i, 0, elm), this;
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * NOTE assumes the arrays do not contain duplicate values
             * @public
             * @method arr#intersect
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            intersect: function(arr) {
                return this._.select.apply(this, arr);
            },
            /**
             * Calculates the intersection for 2 or more arrays
             * @public
             * @method arr#Intersect
             * @this   {Array}
             * @param  {Array} arr - 2 or more arrays
             * @return {Array}     - this for chaining
             */
            Intersect: function(arr) {
                return this._.Select.apply(this, arr);
            },
            /**
             * Checks if an array intersects an other
             * @public
             * @method arr#intersects
             * @this    {Array}
             * @param   {Array}  arr - array to check intersection with
             * @returns {boolean}    - boolean indicating if the 2 arrays intersect
             */
            intersects: function(arr) {
                var intersects = false;
    
                this._.each(function(val) {
                    if(arr._.has(val)) {return !(intersects = true)}
                });
    
                return intersects;
            },
            /**
             * gets/sets the last element of an array
             * @public
             * @method arr#last
             * @this    {Array}
             * @param   {any}      val_ - Value to be set as the last element. If no value is given the last value is returned
             * @returns {any|Array}     - last element of the array or this for chaiing
             */
            last: function(val_) {
                if(val_ === undefined) return this[this.length-1];
    
                this[this.length-1] = val_;
    
                return this;
            },
            /**
             * Returns the maximum value of an array with numbers
             * @public
             * @method arr#max
             * @this    {Array<number>|Array<any>}
             * @param   {function}   compareFn_ - optional function to determine the the max in case of non-numeric array
             * @returns {number|any}           - maximum number or element in the array
             */
            max: function(compareFn_) {
                if(compareFn_ === undefined) {return Math.max.apply(null, this)}
                else
                {
                    var max = this[0];
    
                    this._.each(function(elm) {
                        if(compareFn_(elm, max) > 0) max = elm;
                    });
    
                    return max;
                }
            },
            /**
             * Returns the minimum value of an array with numbers
             * @public
             * @method arr#min
             * @this    {Array<number>|Array<any>}
             * @param   {Function=} compareFn_ - optional compare function
             * @returns {number|any} - minimum element in the array
             */
            min: function(compareFn_) {
                if(compareFn_ === undefined) {return Math.min.apply(null, this)}
                else
                {
                    var min = this[0];
    
                    this._.each(function(elm) {
                        if(compareFn_(elm, min) < 0) min = elm;
                    });
    
                    return min;
                }
            },
            /**
             * Modifies the members of an array according to a certain function
             * @public
             * @method arr#modify
             * @this    {Array}
             * @param   {Function} modifier  - function that modifies the array members
             * @param   {Object=}       ctx_  - optional context for the modifier function
             * @returns {Array}               - the modified array
             */
            modify: function(modifier, ctx_) {
                this._.each(function(val, i) {
                    this[i] = modifier.call(ctx_, val, i, this);
                }, this);
    
                return this;
            },
            /**
             * Copies and modifies the members of an array according to a certain function
             * @public
             * @method arr#Modify
             * @this    {Array}
             * @param   {Function} modifier - function that modifies the array members
             * @param   {Object=}       ctx_ - optional context for the modifier function
             * @returns {Array}              - the modified array
             */
            Modify: function(modifier, ctx_)
            {
                return _.clone(this)._.modify(modifier, ctx_);
            },
            /**
             * Chainable version of push
             * @public
             * @method arr#push
             * @this    {Array}
             * @param  {...any} ___args - one or more elements to add to an array
             * @return  {Array}    this - this for chaining
             */
            push: function(___args) {
                this.push.apply(this, arguments);
    
                return this;
            },
            /**
             * Singular push function to solve problems with differences between objects & arrays
             * @private
             * @method  arr#_add
             * @param  {any}   val  - value to push
             * @return {Array} this - this for chaining
             */
            _add: {onoverride: null, value: function(val) {
                this.push(val);
    
                return this;
            }},
            /**
             * Returns a random element from the array
             * @public
             * @method arr#random
             * @this   {Array}
             * @return {any} - random element from the array
             */
            random: function() {
                return this[_.int.random(0, this.length - 1)];
            },
            /**
             * Removes one occurrence of of an element from an array
             * @public
             * @method arr#rm
             * @param  {any}   - elm
             * @return {Array} - this for chaining
             */
            rm: function(elm) {
                this.splice(this.indexOf(elm), 1);
                return this;
            },
            /**
             * Shuffles an array
             * @public
             * @method arr#shuffle
             * @return {Array} - this for chaining
             */
            shuffle: function()
            {
                for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                return this;
            },
            /**
             * Retrieves and sets the size of an array
             * @public
             * @method arr#size
             * @this    {Array}
             * @param   {number} size_ - the new size of the array. In case no size is given the size is returned
             * @returns {number|Array} - the length of the array or the array itself
             */
            size: {onoverride: null, value: function(size_) {
                if(size_ === undefined) return this.length;
    
                this.length = size_;
    
                return this;
            }},
            /**
             * Returns the sum of all numbers in a number array
             * @public
             * @method arr#sum
             * @this    {Array<number>}
             * @returns {number} - sum of the  number array
             */
            sum: function() {
                if(!this.length) return 0;
    
                return this.reduce(function(a, b) { return a + b });
            },
            /**
             * Better to string version
             * @public
             * @method arr#toString
             * @this    {Array}
             * @returns {string} - string representation of the array
             */
            toString: {onoverride: null, value: function()
            {
                var output = '[';
    
                for(var i = 0, max = this.length; i < max; i++)
                {
                    output += (i? ', ' : '') + this[i]._.toString();
                }
    
                return output + ']';
            }},
            /**
             * Calculates the union for 2 arrays
             * @public
             * @method arr#unify
             * @this   {Array}
             * @param  {Array} arr  - array to unify
             * @return {Array} this - unified with the other
             */
            unify: function(arr) {
                return this._.append(arr)._.unique();
            },
            /**
             * Calculates the union for 2 arrays into an new array
             * @public
             * @method arr#Unify
             * @this   {Array}
             * @param  {Array} arr - array to unify
             * @return {Array}     - new array containing the unification
             */
            Unify: function(arr) {
                var app = this._.Append(arr);
    
                return app._.unique();
            },
            /**
             * Removes duplicate values in an array
             * @public
             * @method arr#unique
             * @this    {Array}
             * @returns {Array} - new array without duplicates
             */
            unique: function() {
                this._.eachRight(function(val, i) {
                    this._.each(function(duplicate, j) {
                        if(val === duplicate && j < i) return this.splice(i, 1), false;
                        return j < i;
                    }, this)
                }, this);
    
                return this;
            },
            /**
             * Accessor: Returns a new version of the array without duplicates
             * @public
             * @method arr#Unique
             * @this    {Array}
             * @returns {Array} - new array remove duplicates
             */
            Unique: function() {
                var unique = [];
    
                this._.each(function(val) {
                    if(unique._.not.has(val)) unique.push(val);
                }, this);
    
                return unique;
            }
        }
    });
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
    construct('num', {native:Number}, {
        /**
         * @namespace num
         */
        static: {
            /**
             * Checks if an object is a number
             * @public
             * @method   num.isNumber
             * @param   {any} num - object to check the number for
             * @returns {boolean} - indicating if it is a number
             */
            isNumber: function(num) {
                return typeof(num) === 'number' && !isNaN(num); // use the broken isNaN here because iOS doesn't support Number.isNaN
            },
            /**
             * Returns a random numer between the min and max value, or between 0 & 1) if no arguments are given.
             * In case a singular argument is given iy will return the bound between 0 and this value
             * @public
             * @method   num.random
             * @param   {number=} min_max_ - optional lower or upper bound
             * @param   {number=} max_min_ - optional lower or upper bound
             * @returns {number} - random number in between
             */
            random: function(min_max_, max_min_) {
                if(min_max_ === undefined) return Math.random(); // normal random functionality (no arguments)
    
                var diff   = (max_min_ || 0) - min_max_;
                var offset = diff? min_max_: 0; // cover the case in which both arguments have the same value
    
                return Math.random()*diff + offset;
            },
            // TODO left inclusive right inclusive or both
            /**
             * Rebounds a number between 2 values. Handy for number ranges that are continuous
             * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
             * @public
             * @method   num.rebound
             * @param   {number}   num - number value
             * @returns {function}     - function to add the range
             */
            rebound: function(num)
            {
                /**
                 * Rebounds a number between 2 values. For continuous number ranges
                 * @public
                 * @param   {number}  min - minimum value
                 * @param   {number}  max - maximum value
                 * @returns {boolean} - rebounded version of the number that falls between the 2 values
                 */
                return function range(min, max)
                {
                    return min + num % (max - min);
                }
            }
        },
        prototype: {
            /**
             * Gets or sets the sign of a number
             * @public
             * @method   num#sign
             * @returns {number} - sign of the number: -1, 0, 1
             */
            sign: function(sign)
            {
                if(sign === undefined) return this > 0?  1 :
                                              this < 0? -1 :
                                                         0 ;
    
                return sign*Math.abs(this);
            },
            /**
             * Getter: indicator if the the number is even
             * @public
             * @method   num#even
             * @returns {boolean} - indicating if the number is even
             */
            get even()
            {
                return !(this & 1);
            },
            /**
             * Getter: indicator if the the number is odd
             * @public
             * @method   num#odd
             * @returns {boolean} - indicating if the number is odd
             */
            get odd()
            {
                return !!(this & 1);
            },
            /**
             * Getter: parity for a number 0: even and 1: for odd
             * @public
             * @method   num#parity
             * @returns {number} - parity of the number
             */
            get parity()
            {
                return this & 1;
            },
            /**
             * Power of a number
             * @public
             * @method   num#pow
             * @param   {number}  exponent - the exponent
             * @returns {number}           - the powered number
             */
            pow: function(exponent)
            {
                return Math.pow(this, exponent)
            },
            /**
             * Checks if a number is between to values
             * @public
             * @method   num#between
             * @param   {number}  min - minimum value
             * @param   {number}  max - maximum value
             * @returns {boolean}     - boolean indicating if the value lies between the two values
             */
            between: function(min, max)
            {
                return min <= this && this <= max; // this is correct when saying between the endpoints should be included when saying from to the end point "to" is excluded well for mathematicians that is
            },
            /**
             * Bounds a number between 2 values
             * @public
             * @method   num#bound
             * @param   {number}  min - minimum value
             * @param   {number}  max - maximum value
             * @returns {boolean}     - bounded version of the number that falls between the 2 values
             */
            bound: {aliases:['clamp'], value:function(min, max)
            {
                return Math.min(Math.max(this, min), max);
            }},
            /**
             * Rebounds a number between 2 values. Handy for number ranges that are continuous
             * Curried version: for example - __num.rebound(4.6)(-5.8, 7.98)
             * @public
             * @method   num#rebound
             * @param   {number}   num - number value
             * @returns {function}     - function to add the range
             */
            rebound: function(min, max)
            {
                return min + this % (max - min);
            },
            /**
             * Better to string version
             * @public
             * @method   num#toString
             * @returns {string} - string representation of the number
             */
            toString: {onoverride: null, value: function()
            {
                return this.toString()
            }}
        }
    });
    construct('fnc', {native:Function}, {
        /**
         * @namespace fnc
         */
        static: {
            /**
             * Static version of bind. Implements partial in case an argument is undefined
             * @public
             * @static
             * @method fnc.bind
             * @param   {Array=}     _args_ - arguments to prefill
             * @param   {function}    fnc   - function to bind
             * @param   {Object=}     ctx_  - optional context
             * @returns {function}          - bootstrapped version of the function
             */
            bind: function(_args_, fnc, ctx_)
            {
                if(_.isFunction(_args_))        {return _args_.bind(fnc)}
                if(_args_._.not.has(undefined)) {return _args_.unshift(ctx_), fnc.bind.apply(fnc, _args_)}
    
                var blanks  = _args_._.count(undefined);
                var prefils = _args_.length;
    
                return function() {
                    var args = arguments.length;
                    var max  = prefils + args - blanks;
    
                    for(var i = max-1, arg = args-1; i >= 0; i--)
                    {
                        arguments[i] = (_args_[i] !== undefined && i < prefils)? _args_[i] : arguments[arg--];
                    }
    
                    arguments.length = max; // set the new length of arguments
                    return fnc.apply(ctx_, arguments);
                }
            },
            /**
             * Defers some methods so they'll get set to the end of the stack
             * @public
             * @method fnc.defer
             * @param {number} cb   - callback function to call after the delay
             * @param {number} ctx_ - optional context
             */
            defer: function (cb, ctx_) {
                setTimeout(function() {
                    cb.call(ctx_)
                }, 0);
            },
            /**
             * Delays a function by a given number of milliseconds
             * @public
             * @static
             * @method fnc.delay
             * @param {number} ms   - delay in milliseconds
             * @param {number} cb   - callback function to call after the delay
             * @param {number} ctx_ - optional context for the callback
             */
            delay: {aliases: ['callAfter'], value: function (ms, cb, ctx_) {
                setTimeout(function() {
                    cb.call(ctx_)
                }, ms);
            }},
            /**
             * Super simple inheritance function
             * @public
             * @method fnc.inherit
             * @param {function} child  - child
             * @param {function} parent - parent to inherit from
             * @param {string=}   super_ - name for the object name storing the super prototype. default '_super'
             */
            inherit: function(child, parent, super_) {
                child.prototype = Object.create(parent.prototype);
                child.prototype.constructor = child;
                child[super_ || '_super'] = parent.prototype;
            },
            /**
             * returns a negated form of a function
             * @public
             * @method fnc.negate
             * @param  {function} fnc - an array of functions or a single function in case of supplying
             * @return {function} negated form of the function
             */
            negate: function(fnc) {
                return function() { return !fnc.apply(this, arguments)}
            },
            /**
             * repeats a function x times. The repeater value is passed to the function
             * @static
             * @public
             * @method _.repeat
             * @param {number}   times - the number of times the function is to be repeated
             * @param {Function} cb    - callback function to be repeated
             * @param {Object}   ctx_  - optional context for the callback
             */
            repeat: function(times, cb, ctx_)
            {
                for(var i = 0; i < times; i++)
                {
                    cb.call(ctx_, i);
                }
            },
            /**
             * See Batcher.js for documentation details
             */
            Batcher: Batcher
        },
        prototype:
        {
            /**
             * toString wrapper for bottom_line
             * @public
             * @method fnc#toString
             * @returns {string} - string representation of the function
             */
            toString: {onoverride: null, value: function()
            {
                return this.toString();
            }}
        }
    });
    construct('int', {
        /**
         * @namespace int
         */
        static: {
            /**
             * Returns the length of an integer
             * @public
             * @method int.length
             * @param   {number} int - integer to measure the length
             * @returns {number} - length of the integer
             */
            length: function(int) {
                return int? 1+ Math.log10(int)|0 : 1;
            },
            /**
             * Returns the length of an integer
             * @public
             * @method int.length
             * @param   {number}        int           - integer to measure the length
             * @param   {string|number} format_length - format for the lead zero's for example '0000' or a number defining the length
             * @returns {string}                      - string with leading zero's
             */
            leadZeros: function(int, format_length)
            {
                var length = (typeof(format_length) === 'string') ? format_length.length : format_length;
    
                int = (_.int.length(int) > length) ? Math.pow(10, length)-1 : int;
    
                return (int/Math.pow(10, length)).toFixed(length).substr(2);
            },
            /**
             * Returns a random integer between the min and max value
             * @public
             * @method int.random
             * @param   {number} min - integer lower bound
             * @param   {number} max - integer upper bound
             * @returns {number} - random integer in between
             */
            // TODO do all random options as for _.num.random see below
            random: function(min, max) {
                return min + (Math.random() * (max + 1 - min))|0;
            },
            /**
             * Rebounds a number between 2 values. Handy for arrays that are continuous
             * Curried version: for example - _.int.rebound(4)(-5, 7)
             * @public
             * @method int.rebound
             * @param   {number}  int - integer value
             * @returns {function} - function to add the range
             */
            rebound: function(int) {
                /**
                 * Range function return by rebound
                 * @private
                 * @param   {number}  min - minimum value
                 * @param   {number}  max - maximum value
                 * @returns {boolean} - rebounded version of the number that falls between the 2 values
                 */
                return function range(min, max) {
                    var overflow = int % (Math.abs(max - min) + 1);
    
                    return ((overflow < 0)? max+1 : min) + overflow;
                }
            }
        }
    });
    construct('math', {native:Math, base:true}, {
        /**
         * @namespace math
         */
        static: {
            /**
             * Return true based on a certain probability based on a number between 0 & 1;
             * @public
             * @method math.byProb
             * @param   {number}  p - probability to return true
             * @returns {boolean}   - true or false based on the probability
             */
            byProb: function(p) {
                return Math.random() < p;
            },
            /**
             * angle functions based on degrees
             */
            deg: {
                /**
                 * Convert radians to degrees
                 *
                 * @method math.deg.convert
                 * @param {number} radians
                 * @returns {number} degrees
                 */
                convert: function() {
                    var radianToDegreesFactor = 180/Math.PI;
    
                    return function (radians) {
                        return radians*radianToDegreesFactor;
                    };
                }(),
                /**
                 * Calculates the angle between a the y-axis and a line through a point x, y calculated clockwise (slope)
                 * @public
                 * @method math.deg.angle
                 * @param   {number}  x -
                 * @param   {number}  y -
                 * @returns {number} - angle in degrees
                 */
                angle: function(x, y) {
                    return _.math.deg.convert(Math.atan2(x, -y))
                },
                /**
                 * Calculates the angle between a the x-axis and a line through a point x, y calculated counter-clockwise (slope)
                 * @public
                 * @method math.deg.angleSloped
                 * @param   {number}  x -
                 * @param   {number}  y -
                 * @returns {number} - angle in degrees
                 */
                angleSloped: function(x, y) {
                    return 90-_.math.deg.angle(x, y);
                },
                /**
                 * Inverts an angle
                 * @public
                 * @method math.deg.invert
                 * @param   {number} degrees - angle in degrees
                 * @returns {number} - inverted angle
                 */
                invert: function(degrees) {
                    return degrees+180;
                },
                /**
                 * normalizes an angle between 0 & 360 degrees
                 * @public
                 * @static
                 * @method math.deg.normalize
                 * @param   {number} degrees - angle in degrees
                 * @returns {number}         - normalized angle
                 */
                normalize: function(degrees)
                {
                    return (degrees+360)%360
                }
            },
            rad: {
                /**
                 * Convert degrees to radians.
                 *
                 * @method math.rad.convert
                 * @param {number} degrees
                 * @returns {number} radians
                 */
                convert: function() {
                    var degreeToRadiansFactor = Math.PI/180;
    
                    return function (degrees) {
                        return degrees*degreeToRadiansFactor;
                    };
                }()
            },
            /**
             * Return the distance between 2 points in Euclidean space
             * @public
             * @method math.distance
             * @param   {number}  x1 - x position for point1
             * @param   {number}  y1 - y position for point1
             * @param   {number}  x2 - x position for point2
             * @param   {number}  y2 - y position for point2
             * @returns {number} - distance between the 2 points
             */
            distance: function(x1, y1, x2, y2) {
                return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            },
            /**
             * Return the squared distance between 2 points in Euclidean space
             * @public
             * @method math.distanceSquared
             * @param   {number}  x1 - x position for point1
             * @param   {number}  y1 - y position for point1
             * @param   {number}  x2 - x position for point2
             * @param   {number}  y2 - y position for point2
             * @returns {number} - squared distance between the 2 points
             */
            distanceSquared: function(x1, y1, x2, y2) {
                return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            },
            /**
             * Significantly faster version of Math.max if there are more then 2+x elements
             *
             * @method math.max$
             * @return {number} The highest value from those given.
             */
            maxm: function ()
            {
                for (var i = 1, max = 0, len = arguments.length; i < len; i++)
                {
                    if (arguments[max] < arguments[i])
                    {
                        max = i;
                    }
                }
    
                return arguments[max];
            },
    
            /**
             * Significantly faster version of Math.min if there are more then 2+x elements
             *
             * @method math.min$
             * @return {number} The lowest value from those given.
             */
            minm: function () {
    
                for (var i = 1 , min = 0, len = arguments.length; i < len; i++)
                {
                    if (arguments[i] < arguments[min])
                    {
                        min = i;
                    }
                }
    
                return arguments[min];
            }
        }
    });

	return _
});
