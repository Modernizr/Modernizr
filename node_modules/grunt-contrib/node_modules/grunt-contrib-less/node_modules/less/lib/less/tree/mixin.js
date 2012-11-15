(function (tree) {

tree.mixin = {};
tree.mixin.Call = function (elements, args, index, filename, important) {
    this.selector = new(tree.Selector)(elements);
    this.arguments = args;
    this.index = index;
    this.filename = filename;
    this.important = important;
};
tree.mixin.Call.prototype = {
    eval: function (env) {
        var mixins, args, rules = [], match = false;

        for (var i = 0; i < env.frames.length; i++) {
            if ((mixins = env.frames[i].find(this.selector)).length > 0) {
                args = this.arguments && this.arguments.map(function (a) {
                    return { name: a.name, value: a.value.eval(env) };
                });
                for (var m = 0; m < mixins.length; m++) {
                    if (mixins[m].match(args, env)) {
                        try {
                            Array.prototype.push.apply(
                                  rules, mixins[m].eval(env, this.arguments, this.important).rules);
                            match = true;
                        } catch (e) {
                            throw { message: e.message, index: this.index, filename: this.filename, stack: e.stack };
                        }
                    }
                }
                if (match) {
                    return rules;
                } else {
                    throw { type:    'Runtime',
                            message: 'No matching definition was found for `' +
                                      this.selector.toCSS().trim() + '('      +
                                      this.arguments.map(function (a) {
                                          return a.toCSS();
                                      }).join(', ') + ")`",
                            index:   this.index, filename: this.filename };
                }
            }
        }
        throw { type: 'Name',
                message: this.selector.toCSS().trim() + " is undefined",
                index: this.index, filename: this.filename };
    }
};

tree.mixin.Definition = function (name, params, rules, condition, variadic) {
    this.name = name;
    this.selectors = [new(tree.Selector)([new(tree.Element)(null, name)])];
    this.params = params;
    this.condition = condition;
    this.variadic = variadic;
    this.arity = params.length;
    this.rules = rules;
    this._lookups = {};
    this.required = params.reduce(function (count, p) {
        if (!p.name || (p.name && !p.value)) { return count + 1 }
        else                                 { return count }
    }, 0);
    this.parent = tree.Ruleset.prototype;
    this.frames = [];
};
tree.mixin.Definition.prototype = {
    toCSS:     function ()     { return "" },
    variable:  function (name) { return this.parent.variable.call(this, name) },
    variables: function ()     { return this.parent.variables.call(this) },
    find:      function ()     { return this.parent.find.apply(this, arguments) },
    rulesets:  function ()     { return this.parent.rulesets.apply(this) },

    evalParams: function (env, args) {
        var frame = new(tree.Ruleset)(null, []), varargs, arg;

        for (var i = 0, val, name; i < this.params.length; i++) {
            arg = args && args[i]

            if (arg && arg.name) {
                frame.rules.unshift(new(tree.Rule)(arg.name, arg.value.eval(env)));
                args.splice(i, 1);
                i--;
                continue;
            }
			
            if (name = this.params[i].name) {
                if (this.params[i].variadic && args) {
                    varargs = [];
                    for (var j = i; j < args.length; j++) {
                        varargs.push(args[j].value.eval(env));
                    }
                    frame.rules.unshift(new(tree.Rule)(name, new(tree.Expression)(varargs).eval(env)));
                } else if (val = (arg && arg.value) || this.params[i].value) {
                    frame.rules.unshift(new(tree.Rule)(name, val.eval(env)));
                } else {
                    throw { type: 'Runtime', message: "wrong number of arguments for " + this.name +
                            ' (' + args.length + ' for ' + this.arity + ')' };
                }
            }
        }
        return frame;
    },
    eval: function (env, args, important) {
        var frame = this.evalParams(env, args), context, _arguments = [], rules, start;

        for (var i = 0; i < Math.max(this.params.length, args && args.length); i++) {
            _arguments.push((args[i] && args[i].value) || this.params[i].value);
        }
        frame.rules.unshift(new(tree.Rule)('@arguments', new(tree.Expression)(_arguments).eval(env)));

        rules = important ?
            this.rules.map(function (r) {
                return new(tree.Rule)(r.name, r.value, '!important', r.index);
            }) : this.rules.slice(0);

        return new(tree.Ruleset)(null, rules).eval({
            frames: [this, frame].concat(this.frames, env.frames)
        });
    },
    match: function (args, env) {
        var argsLength = (args && args.length) || 0, len, frame;

        if (! this.variadic) {
            if (argsLength < this.required)                               { return false }
            if (argsLength > this.params.length)                          { return false }
            if ((this.required > 0) && (argsLength > this.params.length)) { return false }
        }

        if (this.condition && !this.condition.eval({
            frames: [this.evalParams(env, args)].concat(env.frames)
        }))                                                           { return false }

        len = Math.min(argsLength, this.arity);

        for (var i = 0; i < len; i++) {
            if (!this.params[i].name) {
                if (args[i].value.eval(env).toCSS() != this.params[i].value.eval(env).toCSS()) {
                    return false;
                }
            }
        }
        return true;
    }
};

})(require('../tree'));
