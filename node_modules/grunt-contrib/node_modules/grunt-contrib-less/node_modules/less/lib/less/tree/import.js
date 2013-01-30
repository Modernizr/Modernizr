(function (tree) {
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
tree.Import = function (path, imports, features, once, index) {
    var that = this;

    this.once = once;
    this.index = index;
    this._path = path;
    this.features = features && new(tree.Value)(features);

    // The '.less' extension is optional
    if (path instanceof tree.Quoted) {
        this.path = /\.(le?|c)ss(\?.*)?$/.test(path.value) ? path.value : path.value + '.less';
    } else {
        this.path = path.value.value || path.value;
    }

    this.css = /css(\?.*)?$/.test(this.path);

    // Only pre-compile .less files
    if (! this.css) {
        imports.push(this.path, function (e, root, imported) {
            if (e) { e.index = index }
            if (imported && that.once) that.skip = imported;
            that.root = root || new(tree.Ruleset)([], []);
        });
    }
};

//
// The actual import node doesn't return anything, when converted to CSS.
// The reason is that it's used at the evaluation stage, so that the rules
// it imports can be treated like any other rules.
//
// In `eval`, we make sure all Import nodes get evaluated, recursively, so
// we end up with a flat structure, which can easily be imported in the parent
// ruleset.
//
tree.Import.prototype = {
    toCSS: function (env) {
        var features = this.features ? ' ' + this.features.toCSS(env) : '';

        if (this.css) {
            return "@import " + this._path.toCSS() + features + ';\n';
        } else {
            return "";
        }
    },
    eval: function (env) {
        var ruleset, features = this.features && this.features.eval(env);

        if (this.skip) return [];

        if (this.css) {
            return this;
        } else {
            ruleset = new(tree.Ruleset)([], this.root.rules.slice(0));

            for (var i = 0; i < ruleset.rules.length; i++) {
                if (ruleset.rules[i] instanceof tree.Import) {
                    Array.prototype
                         .splice
                         .apply(ruleset.rules,
                                [i, 1].concat(ruleset.rules[i].eval(env)));
                }
            }
            return this.features ? new(tree.Media)(ruleset.rules, this.features.value) : ruleset.rules;
        }
    }
};

})(require('../tree'));
