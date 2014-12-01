2 types of arguments values or a function. for simplicity only offer multiple arguments or a function and no array input. An array input can be simulated by using .apply
Also it would rule out more dimensional arrays...

In theory rm could be simulated with an cut function without a to target. However deleting in reverse order is faster in case we do a a removeAll.
Because the number of items that need to be arranged in the back gets smaller.

hmmmzz maybe I can't even do functions as arrays can hold funtions as well. We need to do something smart here... maybe arrays as input is not such a bad idea after all

add not functionality will solve stuffs!!

_rm: function(all, invert, $value, opt_ctx)            this._._edit(all, invert, function(val, i) {this.splice(i, 1);}, false, this, $value, opt_ctx);
_cp:  function(all, invert, target, $value, opt_ctx)   this._._edit(all, invert, function(val) {this.push(val);}, false, target, $value, opt_ctx);
_cut: function(all, invert, target, $value, opt_ctx)   this._._edit(all, invert, function(val, i, _this) {this.push(val); _this.splice(i, 1)}, false, target, $value, opt_ctx);

_edit: function(all, invert, onmatch, reverse, target, $value, opt_ctx)

copy: function(to, $value, opt_ctx) this._._cp(false, false, to, $value, opt_ctx);
cut:  function(to, $value, opt_ctx) this._._cut(false, false, to, $value, opt_ctx);

select:  this._._rm(false, true, $value, opt_ctx);
$select: this._._cp(false, false, [], $value, opt_ctx);

without:  this._._rm(false, false, $value, opt_ctx);
$without: this._._cp(false, true, [], $value, opt_ctx);

