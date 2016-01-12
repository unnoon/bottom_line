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
        'version': '0.0.7',
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

        // action function that negates a function
        var action = function(m, p, dsc) {var fn = dsc.value; if(fn instanceof Function) dsc.value = function () {return !fn.apply(wrapper, arguments)}};

        extend(wrapper,     {enumerable: false}, module);
        extend(wrapper.not, {enumerable: false, action: action}, module);

        if(wrapper !== _.obj && wrapper !== _.fnc) return;
        // add static obj & fnc functions to the global _ object
        extend(_,     {enumerable: false, overwrite: false}, module);
        extend(_.not, {enumerable: false, overwrite: false, action: action}, module);
    }

    function wrapPrototype(wrapper, module)
    {
        if(!module) return;

        var action               = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return   fn.apply(stack[--index], arguments)}}}(method, dsc[method])}};
        var actionNegated        = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return  !fn.apply(stack[--index], arguments)}}}(method, dsc[method])}};
        var actionChained        = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return   fn.apply(stack[--index], arguments)._.chain}}} (method, dsc[method])}};
        var actionChainedNegated = function(m, p, dsc) {var methods = ['value', 'get', 'set'], i = 0, method; while(method = methods[i++]) {!function(method, fn) {if(fn instanceof Function) {dsc[method] = function () {return (!fn.apply(stack[--index], arguments))._.chain}}}(method, dsc[method])}};

        extend(wrapper._methods,     {enumerable: false, action: action}, module);
        extend(wrapper._methods.not, {enumerable: false, action: actionNegated}, module);
        extend(wrapper._chains,      {enumerable: false, action: actionChained},  module);
        extend(wrapper._chains.not,  {enumerable: false, action: actionChainedNegated}, module);

        extend(wrapper.methods, {enumerable: false}, module);
    }

    // simple cloning function
    function clone(obj) {
        var type        = typeof(obj);
        var isPrimitive = (obj === null || (type !== 'object' && type !== 'function'));
        var isObject    = !isPrimitive;
        var clone;

        switch(true)
        {
            case isPrimitive :
                clone = obj; break;
            case Array.isArray(obj) :
                clone = obj.slice(); break;
            case isObject :
                clone = Object.create(Object.getPrototypeOf(obj));

                Object.getOwnPropertyNames(obj).forEach(function(name) {
                    Object.defineProperty(clone, name, Object.getOwnPropertyDescriptor(obj, name));
                }); break;
        }

        if(isObject)
        {
            if(!Object.isExtensible(obj)) {Object.preventExtensions(clone)}
            if(Object.isSealed(obj))      {Object.seal(clone)}
            if(Object.isFrozen(obj))      {Object.freeze(clone)}
        }

        return clone;
    }

    /* @include extend.js */
    /* @include shims.js */
    /* @include global.js */
    /* @include Batcher.js */
    /* @include obj.js  */
    /* @include arr.js  */
    /* @include str.js  */
    /* @include num.js  */
    /* @include fnc.js  */
    /* @include int.js  */
    /* @include math.js */

	return _
});
