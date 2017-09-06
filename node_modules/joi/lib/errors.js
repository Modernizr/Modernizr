// Load modules

var Hoek = require('hoek');
var Language = require('./language');


// Declare internals

var internals = {};

internals.stringify = function (value, wrapArrays) {

    var type = typeof value;

    if (value === null) {
        return 'null';
    }

    if (type === 'string') {
        return value;
    }

    if (value instanceof internals.Err || type === 'function') {
        return value.toString();
    }

    if (type === 'object') {
        if (Array.isArray(value)) {
            var partial = '';

            for (var i = 0, il = value.length; i < il; ++i) {
                partial += (partial.length ? ', ' : '') + internals.stringify(value[i], wrapArrays);
            }

            return wrapArrays ? '[' + partial + ']' : partial;
        }

        return value.toString();
    }

    return JSON.stringify(value);
};

internals.Err = function (type, context, state, options) {

    this.type = type;
    this.context = context || {};
    this.context.key = state.key;
    this.path = state.path;
    this.options = options;
};


internals.Err.prototype.toString = function () {

    var self = this;

    var localized = this.options.language;

    if (localized.label) {
        this.context.key = localized.label;
    }
    else if (this.context.key === '' || this.context.key === null) {
        this.context.key = localized.root || Language.errors.root;
    }

    var format = Hoek.reach(localized, this.type) || Hoek.reach(Language.errors, this.type);
    var hasKey = /\{\{\!?key\}\}/.test(format);
    var skipKey = format.length > 2 && format[0] === '!' && format[1] === '!';

    if (skipKey) {
        format = format.slice(2);
    }

    if (!hasKey && !skipKey) {
        format = (Hoek.reach(localized, 'key') || Hoek.reach(Language.errors, 'key')) + format;
    }

    var wrapArrays = Hoek.reach(localized, 'messages.wrapArrays');
    if (typeof wrapArrays !== 'boolean') {
        wrapArrays = Language.errors.messages.wrapArrays;
    }

    var message = format.replace(/\{\{(\!?)([^}]+)\}\}/g, function ($0, isSecure, name) {

        var value = Hoek.reach(self.context, name);
        var normalized = internals.stringify(value, wrapArrays);
        return (isSecure ? Hoek.escapeHtml(normalized) : normalized);
    });

    return message;
};


exports.create = function (type, context, state, options) {

    return new internals.Err(type, context, state, options);
};


exports.process = function (errors, object) {

    if (!errors || !errors.length) {
        return null;
    }

    // Construct error

    var message = '';
    var details = [];

    var processErrors = function (localErrors, parent) {

        for (var i = 0, il = localErrors.length; i < il; ++i) {
            var item = localErrors[i];

            var detail = {
                message: item.toString(),
                path: internals.getPath(item),
                type: item.type,
                context: item.context
            };

            if (!parent) {
                message += (message ? '. ' : '') + detail.message;
            }

            // Do not push intermediate errors, we're only interested in leafs
            if (item.context.reason && item.context.reason.length) {
                processErrors(item.context.reason, item.path);
            }
            else {
                details.push(detail);
            }
        }
    };

    processErrors(errors);

    var error = new Error(message);
    error.name = 'ValidationError';
    error.details = details;
    error._object = object;
    error.annotate = internals.annotate;
    return error;
};


internals.getPath = function (item) {

    var recursePath = function (it) {

        var reachedItem = Hoek.reach(it, 'context.reason.0');
        if (reachedItem && reachedItem.context) {
            return recursePath(reachedItem);
        }

        return it.path;
    };

    return recursePath(item) || item.context.key;
};


// Inspired by json-stringify-safe
internals.safeStringify = function (obj, spaces) {

    return JSON.stringify(obj, internals.serializer(), spaces);
};

internals.serializer = function () {

    var cycleReplacer = function (key, value) {

        if (stack[0] === value) {
            return '[Circular ~]';
        }

        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
    };

    var keys = [], stack = [];

    return function (key, value) {

        if (stack.length > 0) {
            var thisPos = stack.indexOf(this);
            if (~thisPos) {
                stack.length = thisPos + 1;
                keys.length = thisPos + 1;
                keys[thisPos] = key;
            }
            else {
                stack.push(this);
                keys.push(key);
            }

            if (~stack.indexOf(value)) {
                value = cycleReplacer.call(this, key, value);
            }
        }
        else {
            stack.push(value);
        }

        if (Array.isArray(value) && value.placeholders) {
            var placeholders = value.placeholders;
            var arrWithPlaceholders = [];
            for (var i = 0, il = value.length; i < il; ++i) {
                if (placeholders[i]) {
                    arrWithPlaceholders.push(placeholders[i]);
                }
                arrWithPlaceholders.push(value[i]);
            }

            value = arrWithPlaceholders;
        }

        return value;
    };
};


internals.annotate = function () {

    var obj = Hoek.clone(this._object || {});

    var lookup = {};
    var el = this.details.length;
    for (var e = el - 1; e >= 0; --e) {        // Reverse order to process deepest child first
        var pos = el - e;
        var error = this.details[e];
        var path = error.path.split('.');
        var ref = obj;
        for (var i = 0, il = path.length; i < il && ref; ++i) {
            var seg = path[i];
            if (i + 1 < il) {
                ref = ref[seg];
            }
            else {
                var value = ref[seg];
                if (Array.isArray(ref)) {
                    var arrayLabel = '_$idx$_' + (e + 1) + '_$end$_';
                    if (!ref.placeholders) {
                        ref.placeholders = {};
                    }

                    if (ref.placeholders[seg]) {
                        ref.placeholders[seg] = ref.placeholders[seg].replace('_$end$_', ', ' + (e + 1) + '_$end$_');
                    }
                    else {
                        ref.placeholders[seg] = arrayLabel;
                    }
                } else {
                    if (value !== undefined) {
                        delete ref[seg];
                        var objectLabel = seg + '_$key$_' + pos + '_$end$_';
                        ref[objectLabel] = value;
                        lookup[error.path] = objectLabel;
                    }
                    else if (lookup[error.path]) {
                        var replacement = lookup[error.path];
                        var appended = replacement.replace('_$end$_', ', ' + pos + '_$end$_');
                        ref[appended] = ref[replacement];
                        lookup[error.path] = appended;
                        delete ref[replacement];
                    }
                    else {
                        ref['_$miss$_' + seg + '|' + pos + '_$end$_'] = '__missing__';
                    }
                }
            }
        }
    }

    var message = internals.safeStringify(obj, 2)
        .replace(/_\$key\$_([, \d]+)_\$end\$_\"/g, function ($0, $1) {

            return '" \u001b[31m[' + $1 + ']\u001b[0m';
        }).replace(/\"_\$miss\$_([^\|]+)\|(\d+)_\$end\$_\"\: \"__missing__\"/g, function ($0, $1, $2) {

            return '\u001b[41m"' + $1 + '"\u001b[0m\u001b[31m [' + $2 + ']: -- missing --\u001b[0m';
        }).replace(/\s*\"_\$idx\$_([, \d]+)_\$end\$_\",?\n(.*)/g, function ($0, $1, $2) {

            return '\n' + $2 + ' \u001b[31m[' + $1 + ']\u001b[0m';
        });

    message += '\n\u001b[31m';

    for (e = 0; e < el; ++e) {
        message += '\n[' + (e + 1) + '] ' + this.details[e].message;
    }

    message += '\u001b[0m';

    return message;
};
