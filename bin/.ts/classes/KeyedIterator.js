"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Rogier on 05/05/2017.
 */
var identity = require("../lang/identity");
/**
 * Property descriptor with handy extra utilities.
 */
var KeyedIterator = /** @class */ (function () {
    function KeyedIterator(collection) {
        if (collection instanceof KeyedIterator) {
            return collection;
        }
        if (collection[Symbol.iterator] && collection.entries) {
            this.it = collection.entries();
        }
        else {
            this.it = (function () {
                var it, i, yields, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            it = (collection[Symbol.iterator] || identity.iterator).call(collection);
                            i = 0;
                            yields = it.next();
                            _a = true;
                            switch (_a) {
                                case !!collection[Symbol.iterator]: return [3 /*break*/, 1];
                            }
                            return [3 /*break*/, 5];
                        case 1:
                            if (!!yields.done) return [3 /*break*/, 4];
                            return [4 /*yield*/, [i, yields.value]];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            yields = it.next(), i++;
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 9];
                        case 5:
                            if (!!yields.done) return [3 /*break*/, 8];
                            return [4 /*yield*/, yields.value];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7:
                            yields = it.next();
                            return [3 /*break*/, 5];
                        case 8: return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            })();
        }
    }
    KeyedIterator.create = function (collection) {
        return new KeyedIterator(collection);
    };
    KeyedIterator.prototype.next = function () {
        return this.it.next();
    };
    KeyedIterator.prototype.return = function () {
        return this.it.return();
    };
    KeyedIterator.prototype.throw = function () {
        return this.it.throw();
    };
    KeyedIterator.prototype[Symbol.iterator] = function () {
        return this;
    };
    return KeyedIterator;
}());
exports.default = KeyedIterator;
