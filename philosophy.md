

_rm: function(all, invert, $value, opt_ctx)            this._._edit(all, invert, function(val, i) {this.splice(i, 1);}, false, this, $value, opt_ctx);
_cp:  function(all, invert, target, $value, opt_ctx)   this._._edit(all, invert, function(val) {this.push(val);}, false, target, $value, opt_ctx);
_cut: function(all, invert, target, $value, opt_ctx)   this._._edit(all, invert, function(val, i, _this) {this.push(val); _this.splice(i, 1)}, false, target, $value, opt_ctx);

_edit: function(all, invert, onmatch, reverse, target, $value, opt_ctx)

copy: function(to, $value, opt_ctx) this._._cp(false, false, to, $value, opt_ctx);
cut: function(to, $value, opt_ctx)  this._._cut(false, false, to, $value, opt_ctx);