(function (tree) {

tree.Selector = function (elements) {
    this.elements = elements;
};
tree.Selector.prototype.match = function (other) {
    var len  = this.elements.length,
        olen = other.elements.length,
        max  = Math.min(len, olen);

    if (len < olen) {
        return false;
    } else {
        for (var i = 0; i < max; i++) {
            if (this.elements[i].value !== other.elements[i].value) {
                return false;
            }
        }
    }
    return true;
};
tree.Selector.prototype.eval = function (env) {
    return new(tree.Selector)(this.elements.map(function (e) {
        return e.eval(env);
    }));
};
tree.Selector.prototype.toCSS = function (env) {
    if (this._css) { return this._css }
    
    if (this.elements[0].combinator.value === "") {
        this._css = ' ';
    } else {
        this._css = '';
    }
    
    this._css += this.elements.map(function (e) {
        if (typeof(e) === 'string') {
            return ' ' + e.trim();
        } else {
            return e.toCSS(env);
        }
    }).join('');
    
    return this._css;
};

})(require('../tree'));
