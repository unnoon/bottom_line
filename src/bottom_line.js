/*!
 * _____________bottom_line.js_____
 * Bottom_line JavaScript Library
 *
 * Copyright 2016, Rogier Geertzema
 * Released under the MIT license
 * ________________________________
 */
!function(root, bottom_line) {
    var environments = true; switch(environments) {
    /*requirejs*/ case typeof(define) === 'function' && root.define === define && !!define.amd : define(bottom_line);            break;
    /*nodejs*/    case typeof(module) === 'object'   && root === module.exports                : module.exports = bottom_line(); break;
    /*root*/      case !root._                                                                 : root._ = bottom_line();         break; default : console.error("'_' is already defined on root object")}
}(this, function bottom_line() {
    'use strict';

    var stack = []; // stack holding all wrapped objects accessed from ._

	/**
	 * bottom_line: base module. This will hold all type objects: obj, arr, num, str, fnc, math
	 *
	 * @namespace _
	 */
	var _ = {
        'info': {
            'name': 'bottom_line',
            'version': '0.0.10',
            'description': 'JS Toolbelt'
        }
    };

    /**
     * Constructs a wrapper object
     *
     * @param {string}   key       - the key/name of the wrapper object that is used to attach it to the root _ object
     * @param {Object=} _settings_ - optional settings object
     *     @param   {Object=}  _settings_.native               - the native object that is extended on the prototype
     *     @param   {boolean=} _settings_.cloneAsWrapper=false - boolean indicating if the native object should be cloned and used as the wrapper object
     *     @param   {Object= } _settings_.wrapper              - pre-specified object to be used as wrapper
     * @param {Object}   module   - module object containing methods to be added to the wrapper object
     *
     * @returns {Object} - the constructed wrapper object
     */
    function construct(key, _settings_, module)
    {
        var settings = module && _settings_ || {};
        var module   = module || _settings_;
        var obj      = settings.native;

        var wrapper = settings.cloneAsWrapper? clone(settings.native) : settings.wrapper || {};

        wrapper.not     = {};
        wrapper.methods = {}; // add methods unwrapped so we can use them with apply

        // create instance and chain object including not wrapper
        var _methods = (key === 'obj' || key === '_') ? Object.create(Object.prototype, {not:{value: {}}}) : Object.create(_.obj._methods, {not:{value:Object.create(_.obj._methods.not)}}); // inherit from object. // stores non-chainable use _methods
        var _chains  = (key === 'obj' || key === '_') ? Object.create(Object.prototype, {not:{value: {}}}) : Object.create(_.obj._chains,  {not:{value:Object.create(_.obj._chains.not)}});  // inherit from object.  // stores chainable use _methods

        Object.defineProperty(wrapper, '_methods', {value: _methods});
        Object.defineProperty(wrapper, '_chains',  {value: _chains});
        Object.defineProperty(wrapper._methods, 'chain', {get: function() {return _chains}});
        Object.defineProperty(wrapper._chains,  'value', {get: function() {var elm = stack.pop(); return elm.valueOf? elm.valueOf() : elm}});

        if(obj && obj.prototype)
        {   if(obj.prototype.hasOwnProperty('_')) {console.error("'_' is already defined on native prototype for "+key)}
            else
            {
                // extend native object with special _ 'bottom_line' access property
                Object.defineProperty(obj.prototype, '_', {
                    enumerable: false, configurable: false,
                    get: function() {stack.push(this); return _methods},
                    // we implement a set so it is still possible to use _ as an object property
                    set: function(val) {Object.defineProperty(this, '_', {value: val, enumerable: true,  configurable: true, writable: true})}}
                );
            }
        }

        // by default add wrapper to the bottom_line object
        if(key !== '_') {_[key] = wrapper}

        wrapStatics(wrapper,   module.static);
        wrapPrototype(wrapper, module.prototype);

        return wrapper;
    }

    function wrapStatics(wrapper, module)
    {
        if(!module) return;

        // action function that negates a function
        var action = function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return !fn.apply(wrapper, arguments)}};

        extend(wrapper,     {},               module);
        extend(wrapper.not, {action: action}, module);

        if(wrapper !== _.obj && wrapper !== _.fnc) return;
        // add static obj & fnc functions to the global _ object
        extend(_,     {overwrite: false},                 module);
        extend(_.not, {overwrite: false, action: action}, module);
    }

    function wrapPrototype(wrapper, module)
    {
        if(!module) return;

        var action               = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return   fn.apply(stack.pop(), arguments)}}}(method, dsc[method])}};
        var actionNegated        = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return  !fn.apply(stack.pop(), arguments)}}}(method, dsc[method])}};
        var actionChained        = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return   fn.apply(stack.pop(), arguments)._.chain}}} (method, dsc[method])}};
        var actionChainedNegated = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return (!fn.apply(stack.pop(), arguments))._.chain}}}(method, dsc[method])}};

        extend(wrapper._methods,     {enumerable: false, action: action}, module);
        extend(wrapper._methods.not, {enumerable: false, action: actionNegated}, module);
        extend(wrapper._chains,      {enumerable: false, action: actionChained},  module);
        extend(wrapper._chains.not,  {enumerable: false, action: actionChainedNegated}, module);

        extend(wrapper.methods, {enumerable: false}, module);
    }

    /**
     * cloning function
     *
     * @param {string=} _mode_='shallow' - 'shallow|deep' can be omitted completely
     * @param {Object}   obj             - object to be cloned
     * @param {Array=}   visited_        - array of visited objects to check for circular references
     * @param {Array=}   clones_         - array of respective clones to fill circular references
     *
     * @returns {Object} - clone of the object
     */
    function clone(_mode_, obj, visited_, clones_) {
        var mode = obj && _mode_ || 'shallow';
        var obj  = obj || _mode_;

        if(isPrimitive(obj)) {return obj}
        if(visited_ && ~visited_.indexOf(obj)) {return clones_[visited_.indexOf(obj)]}

        var cln = Array.isArray(obj)
            ? [] // otherwise chrome dev tools does not understand it is an array
            : Object.create(Object.getPrototypeOf(obj));

        visited_ = visited_ || [];
        clones_  = clones_  || [];

        visited_.push(obj);
        clones_.push(cln);

        Object.getOwnPropertyNames(obj).forEach(function(name) {
            var dsc = Object.getOwnPropertyDescriptor(obj, name);
            dsc.value = dsc.hasOwnProperty('value') && mode === 'deep'
                ? dsc.value = clone(mode, dsc.value, visited_, clones_)
                : dsc.value;

            Object.defineProperty(cln, name, dsc);
        });

        if(!Object.isExtensible(obj)) {Object.preventExtensions(cln)}
        if(Object.isSealed(obj))      {Object.seal(cln)}
        if(Object.isFrozen(obj))      {Object.freeze(cln)}

        return cln;
    }

    clone.deep = clone.bind(null, 'deep');

    function isPrimitive(obj)
    {
        var type = typeof(obj);
        return (obj === null || (type !== 'object' && type !== 'function'));
    }

    /* @include extend.js */
    /* @include shims.js */
    /* @include Batcher.js */
    /* @include global.js */
    /* @include obj.js  */
    /* @include arr.js  */
    /* @include str.js  */
    /* @include num.js  */
    /* @include fnc.js  */
    /* @include int.js  */
    /* @include math.js */

    !function includeLibs(_)
    {
        /* @include BitSet.js */
    }.call(_, _);

	return _
});
