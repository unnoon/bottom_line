Object.defineProperty(window, '_', {value: function() {}});

var stack = [];
var index = 0;
var _methods = {};


    Object.defineProperty(Object.prototype, '_', {
        enumerable: false, configurable: false,
        get: function() {stack[index++] = this; return _methods},
        set: function(val) {Object.defineProperty(this, '_', {value: val, enumerable: true,  configurable: true, writable: true})}}); // we implement a set so it is still possible to use _ as an object property

var obj = {};

obj._ = 666;

//Object.defineProperty(obj, '_', {value: function() {}});
//Object.defineProperty(obj, '_', {get: function() {}, set: function() {}});

//Object.defineProperty(window, '_', {get: function() {}, set: function() {}});