// Load modules

var Hoek = require('hoek');
var Ref = require('./ref');
var Errors = require('./errors');
var Alternatives = null;                // Delay-loaded to prevent circular dependencies
var Cast = null;


// Declare internals

var internals = {};


internals.defaults = {
    abortEarly: true,
    convert: true,
    allowUnknown: false,
    skipFunctions: false,
    stripUnknown: false,
    language: {},
    presence: 'optional',
    raw: false,
    strip: false,
    noDefaults: false

    // context: null
};


internals.checkOptions = function (options) {

    var optionType = {
        abortEarly: 'boolean',
        convert: 'boolean',
        allowUnknown: 'boolean',
        skipFunctions: 'boolean',
        stripUnknown: 'boolean',
        language: 'object',
        presence: ['string', 'required', 'optional', 'forbidden', 'ignore'],
        raw: 'boolean',
        context: 'object',
        strip: 'boolean',
        noDefaults: 'boolean'
    };

    var keys = Object.keys(options);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
        var key = keys[k];
        var opt = optionType[key];
        var type = opt;
        var values = null;

        if (Array.isArray(opt)) {
            type = opt[0];
            values = opt.slice(1);
        }

        Hoek.assert(type, 'unknown key ' + key);
        Hoek.assert(typeof options[key] === type, key + ' should be of type ' + type);
        if (values) {
            Hoek.assert(values.indexOf(options[key]) >= 0, key + ' should be one of ' + values.join(', '));
        }
    }
};


module.exports = internals.Any = function () {

    Cast = Cast || require('./cast');

    this.isJoi = true;
    this._type = 'any';
    this._settings = null;
    this._valids = new internals.Set();
    this._invalids = new internals.Set();
    this._tests = [];
    this._refs = [];
    this._flags = { /*
        presence: 'optional',                   // optional, required, forbidden, ignore
        allowOnly: false,
        allowUnknown: undefined,
        default: undefined,
        forbidden: false,
        encoding: undefined,
        insensitive: false,
        trim: false,
        case: undefined,                        // upper, lower
        empty: undefined,
        func: false
    */ };

    this._description = null;
    this._unit = null;
    this._notes = [];
    this._tags = [];
    this._examples = [];
    this._meta = [];

    this._inner = {};                           // Hash of arrays of immutable objects
};


internals.Any.prototype.isImmutable = true;     // Prevents Hoek from deep cloning schema objects


internals.Any.prototype.clone = function () {

    var obj = Object.create(Object.getPrototypeOf(this));

    obj.isJoi = true;
    obj._type = this._type;
    obj._settings = internals.concatSettings(this._settings);
    obj._valids = Hoek.clone(this._valids);
    obj._invalids = Hoek.clone(this._invalids);
    obj._tests = this._tests.slice();
    obj._refs = this._refs.slice();
    obj._flags = Hoek.clone(this._flags);

    obj._description = this._description;
    obj._unit = this._unit;
    obj._notes = this._notes.slice();
    obj._tags = this._tags.slice();
    obj._examples = this._examples.slice();
    obj._meta = this._meta.slice();

    obj._inner = {};
    var inners = Object.keys(this._inner);
    for (var i = 0, il = inners.length; i < il; ++i) {
        var key = inners[i];
        obj._inner[key] = this._inner[key] ? this._inner[key].slice() : null;
    }

    return obj;
};


internals.Any.prototype.concat = function (schema) {

    Hoek.assert(schema && schema.isJoi, 'Invalid schema object');
    Hoek.assert(this._type === 'any' || schema._type === 'any' || schema._type === this._type, 'Cannot merge type', this._type, 'with another type:', schema._type);

    var obj = this.clone();

    if (this._type === 'any' && schema._type !== 'any') {

        // Reset values as if we were "this"
        var tmpObj = schema.clone();
        var keysToRestore = ['_settings', '_valids', '_invalids', '_tests', '_refs', '_flags', '_description', '_unit',
            '_notes', '_tags', '_examples', '_meta', '_inner'];

        for (var j = 0, jl = keysToRestore.length; j < jl; ++j) {
            tmpObj[keysToRestore[j]] = obj[keysToRestore[j]];
        }

        obj = tmpObj;
    }

    obj._settings = obj._settings ? internals.concatSettings(obj._settings, schema._settings) : schema._settings;
    obj._valids.merge(schema._valids, schema._invalids);
    obj._invalids.merge(schema._invalids, schema._valids);
    obj._tests = obj._tests.concat(schema._tests);
    obj._refs = obj._refs.concat(schema._refs);
    Hoek.merge(obj._flags, schema._flags);

    obj._description = schema._description || obj._description;
    obj._unit = schema._unit || obj._unit;
    obj._notes = obj._notes.concat(schema._notes);
    obj._tags = obj._tags.concat(schema._tags);
    obj._examples = obj._examples.concat(schema._examples);
    obj._meta = obj._meta.concat(schema._meta);

    var inners = Object.keys(schema._inner);
    var isObject = obj._type === 'object';
    for (var i = 0, il = inners.length; i < il; ++i) {
        var key = inners[i];
        var source = schema._inner[key];
        if (source) {
            var target = obj._inner[key];
            if (target) {
                if (isObject && key === 'children') {
                    var keys = {};

                    for (var k = 0, kl = target.length; k < kl; ++k) {
                        keys[target[k].key] = k;
                    }

                    for (k = 0, kl = source.length; k < kl; ++k) {
                        var sourceKey = source[k].key;
                        if (keys[sourceKey] >= 0) {
                            target[keys[sourceKey]] = {
                                key: sourceKey,
                                schema: target[keys[sourceKey]].schema.concat(source[k].schema)
                            };
                        }
                        else {
                            target.push(source[k]);
                        }
                    }
                }
                else {
                    obj._inner[key] = obj._inner[key].concat(source);
                }
            }
            else {
                obj._inner[key] = source.slice();
            }
        }
    }

    return obj;
};


internals.Any.prototype._test = function (name, arg, func) {

    Hoek.assert(!this._flags.allowOnly, 'Cannot define rules when valid values specified');

    var obj = this.clone();
    obj._tests.push({ func: func, name: name, arg: arg });
    return obj;
};


internals.Any.prototype.options = function (options) {

    Hoek.assert(!options.context, 'Cannot override context');
    internals.checkOptions(options);

    var obj = this.clone();
    obj._settings = internals.concatSettings(obj._settings, options);
    return obj;
};


internals.Any.prototype.strict = function (isStrict) {

    var obj = this.clone();
    obj._settings = obj._settings || {};
    obj._settings.convert = isStrict === undefined ? false : !isStrict;
    return obj;
};


internals.Any.prototype.raw = function (isRaw) {

    var obj = this.clone();
    obj._settings = obj._settings || {};
    obj._settings.raw = isRaw === undefined ? true : isRaw;
    return obj;
};


internals.Any.prototype._allow = function () {

    var values = Hoek.flatten(Array.prototype.slice.call(arguments));
    for (var i = 0, il = values.length; i < il; ++i) {
        var value = values[i];

        Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
        this._invalids.remove(value);
        this._valids.add(value, this._refs);
    }
};


internals.Any.prototype.allow = function () {

    var obj = this.clone();
    obj._allow.apply(obj, arguments);
    return obj;
};


internals.Any.prototype.valid = internals.Any.prototype.only = internals.Any.prototype.equal = function () {

    Hoek.assert(!this._tests.length, 'Cannot set valid values when rules specified');

    var obj = this.allow.apply(this, arguments);
    obj._flags.allowOnly = true;
    return obj;
};


internals.Any.prototype.invalid = internals.Any.prototype.disallow = internals.Any.prototype.not = function (value) {

    var obj = this.clone();
    var values = Hoek.flatten(Array.prototype.slice.call(arguments));
    for (var i = 0, il = values.length; i < il; ++i) {
        value = values[i];

        Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
        obj._valids.remove(value);
        obj._invalids.add(value, this._refs);
    }

    return obj;
};


internals.Any.prototype.required = internals.Any.prototype.exist = function () {

    var obj = this.clone();
    obj._flags.presence = 'required';
    return obj;
};


internals.Any.prototype.optional = function () {

    var obj = this.clone();
    obj._flags.presence = 'optional';
    return obj;
};


internals.Any.prototype.forbidden = function () {

    var obj = this.clone();
    obj._flags.presence = 'forbidden';
    return obj;
};


internals.Any.prototype.strip = function () {

    var obj = this.clone();
    obj._flags.strip = true;
    return obj;
};


internals.Any.prototype.applyFunctionToChildren = function (children, fn, args, root) {

    children = [].concat(children);

    if (children.length !== 1 || children[0] !== '') {
        root = root ? (root + '.') : '';

        var extraChildren = (children[0] === '' ? children.slice(1) : children).map(function (child) {

            return root + child;
        });

        throw new Error('unknown key(s) ' + extraChildren.join(', '));
    }

    return this[fn].apply(this, args);
};


internals.Any.prototype.default = function (value, description) {

    if (typeof value === 'function' &&
        !Ref.isRef(value)) {

        if (!value.description &&
            description) {

            value.description = description;
        }

        if (!this._flags.func) {
            Hoek.assert(typeof value.description === 'string' && value.description.length > 0, 'description must be provided when default value is a function');
        }
    }

    var obj = this.clone();
    obj._flags.default = value;
    Ref.push(obj._refs, value);
    return obj;
};


internals.Any.prototype.empty = function (schema) {

    var obj;
    if (schema === undefined) {
        obj = this.clone();
        obj._flags.empty = undefined;
    }
    else {
        schema = Cast.schema(schema);

        obj = this.clone();
        obj._flags.empty = schema;
    }

    return obj;
};


internals.Any.prototype.when = function (ref, options) {

    Hoek.assert(options && typeof options === 'object', 'Invalid options');
    Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');

    var then = options.then ? this.concat(Cast.schema(options.then)) : this;
    var otherwise = options.otherwise ? this.concat(Cast.schema(options.otherwise)) : this;

    Alternatives = Alternatives || require('./alternatives');
    var obj = Alternatives.when(ref, { is: options.is, then: then, otherwise: otherwise });
    obj._flags.presence = 'ignore';
    return obj;
};


internals.Any.prototype.description = function (desc) {

    Hoek.assert(desc && typeof desc === 'string', 'Description must be a non-empty string');

    var obj = this.clone();
    obj._description = desc;
    return obj;
};


internals.Any.prototype.notes = function (notes) {

    Hoek.assert(notes && (typeof notes === 'string' || Array.isArray(notes)), 'Notes must be a non-empty string or array');

    var obj = this.clone();
    obj._notes = obj._notes.concat(notes);
    return obj;
};


internals.Any.prototype.tags = function (tags) {

    Hoek.assert(tags && (typeof tags === 'string' || Array.isArray(tags)), 'Tags must be a non-empty string or array');

    var obj = this.clone();
    obj._tags = obj._tags.concat(tags);
    return obj;
};

internals.Any.prototype.meta = function (meta) {

    Hoek.assert(meta !== undefined, 'Meta cannot be undefined');

    var obj = this.clone();
    obj._meta = obj._meta.concat(meta);
    return obj;
};


internals.Any.prototype.example = function (value) {

    Hoek.assert(arguments.length, 'Missing example');
    var result = this._validate(value, null, internals.defaults);
    Hoek.assert(!result.errors, 'Bad example:', result.errors && Errors.process(result.errors, value));

    var obj = this.clone();
    obj._examples = obj._examples.concat(value);
    return obj;
};


internals.Any.prototype.unit = function (name) {

    Hoek.assert(name && typeof name === 'string', 'Unit name must be a non-empty string');

    var obj = this.clone();
    obj._unit = name;
    return obj;
};


internals._try = function (fn, arg) {

    var err;
    var result;

    try {
        result = fn.call(null, arg);
    } catch (e) {
        err = e;
    }

    return {
        value: result,
        error: err
    };
};


internals.Any.prototype._validate = function (value, state, options, reference) {

    var self = this;
    var originalValue = value;

    // Setup state and settings

    state = state || { key: '', path: '', parent: null, reference: reference };

    if (this._settings) {
        options = internals.concatSettings(options, this._settings);
    }

    var errors = [];
    var finish = function () {

        var finalValue;

        if (!self._flags.strip) {
            if (value !== undefined) {
                finalValue = options.raw ? originalValue : value;
            }
            else if (options.noDefaults) {
                finalValue = originalValue;
            }
            else if (Ref.isRef(self._flags.default)) {
                finalValue = self._flags.default(state.parent, options);
            }
            else if (typeof self._flags.default === 'function' &&
                    !(self._flags.func && !self._flags.default.description)) {

                var arg;

                if (state.parent !== null &&
                    self._flags.default.length > 0) {

                    arg = Hoek.clone(state.parent);
                }

                var defaultValue = internals._try(self._flags.default, arg);
                finalValue = defaultValue.value;
                if (defaultValue.error) {
                    errors.push(Errors.create('any.default', defaultValue.error, state, options));
                }
            }
            else {
                finalValue = self._flags.default;
            }
        }

        return {
            value: finalValue,
            errors: errors.length ? errors : null
        };
    };

    // Check presence requirements

    var presence = this._flags.presence || options.presence;
    if (presence === 'optional') {
        if (value === undefined) {
            var isDeepDefault = this._flags.hasOwnProperty('default') && this._flags.default === undefined;
            if (isDeepDefault && this._type === 'object') {
                value = {};
            }
            else {
                return finish();
            }
        }
    }
    else if (presence === 'required' &&
            value === undefined) {

        errors.push(Errors.create('any.required', null, state, options));
        return finish();
    }
    else if (presence === 'forbidden') {
        if (value === undefined) {
            return finish();
        }

        errors.push(Errors.create('any.unknown', null, state, options));
        return finish();
    }

    if (this._flags.empty && !this._flags.empty._validate(value, null, internals.defaults).errors) {
        value = undefined;
        return finish();
    }

    // Check allowed and denied values using the original value

    if (this._valids.has(value, state, options, this._flags.insensitive)) {
        return finish();
    }

    if (this._invalids.has(value, state, options, this._flags.insensitive)) {
        errors.push(Errors.create(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
        if (options.abortEarly ||
            value === undefined) {          // No reason to keep validating missing value

            return finish();
        }
    }

    // Convert value and validate type

    if (this._base) {
        var base = this._base.call(this, value, state, options);
        if (base.errors) {
            value = base.value;
            errors = errors.concat(base.errors);
            return finish();                            // Base error always aborts early
        }

        if (base.value !== value) {
            value = base.value;

            // Check allowed and denied values using the converted value

            if (this._valids.has(value, state, options, this._flags.insensitive)) {
                return finish();
            }

            if (this._invalids.has(value, state, options, this._flags.insensitive)) {
                errors.push(Errors.create('any.invalid', null, state, options));
                if (options.abortEarly) {
                    return finish();
                }
            }
        }
    }

    // Required values did not match

    if (this._flags.allowOnly) {
        errors.push(Errors.create('any.allowOnly', { valids: this._valids.values({ stripUndefined: true }) }, state, options));
        if (options.abortEarly) {
            return finish();
        }
    }

    // Helper.validate tests

    for (var i = 0, il = this._tests.length; i < il; ++i) {
        var test = this._tests[i];
        var err = test.func.call(this, value, state, options);
        if (err) {
            errors.push(err);
            if (options.abortEarly) {
                return finish();
            }
        }
    }

    return finish();
};


internals.Any.prototype._validateWithOptions = function (value, options, callback) {

    if (options) {
        internals.checkOptions(options);
    }

    var settings = internals.concatSettings(internals.defaults, options);
    var result = this._validate(value, null, settings);
    var errors = Errors.process(result.errors, value);

    if (callback) {
        return callback(errors, result.value);
    }

    return { error: errors, value: result.value };
};


internals.Any.prototype.validate = function (value, callback) {

    var result = this._validate(value, null, internals.defaults);
    var errors = Errors.process(result.errors, value);

    if (callback) {
        return callback(errors, result.value);
    }

    return { error: errors, value: result.value };
};


internals.Any.prototype.describe = function () {

    var description = {
        type: this._type
    };

    var flags = Object.keys(this._flags);
    if (flags.length) {
        if (this._flags.empty) {
            description.flags = {};
            for (var f = 0, fl = flags.length; f < fl; ++f) {
                var flag = flags[f];
                description.flags[flag] = flag === 'empty' ? this._flags[flag].describe() : this._flags[flag];
            }
        }
        else {
            description.flags = this._flags;
        }
    }

    if (this._description) {
        description.description = this._description;
    }

    if (this._notes.length) {
        description.notes = this._notes;
    }

    if (this._tags.length) {
        description.tags = this._tags;
    }

    if (this._meta.length) {
        description.meta = this._meta;
    }

    if (this._examples.length) {
        description.examples = this._examples;
    }

    if (this._unit) {
        description.unit = this._unit;
    }

    var valids = this._valids.values();
    if (valids.length) {
        description.valids = valids;
    }

    var invalids = this._invalids.values();
    if (invalids.length) {
        description.invalids = invalids;
    }

    description.rules = [];

    for (var i = 0, il = this._tests.length; i < il; ++i) {
        var validator = this._tests[i];
        var item = { name: validator.name };
        if (validator.arg !== void 0) {
            item.arg = validator.arg;
        }
        description.rules.push(item);
    }

    if (!description.rules.length) {
        delete description.rules;
    }

    var label = Hoek.reach(this._settings, 'language.label');
    if (label) {
        description.label = label;
    }

    return description;
};

internals.Any.prototype.label = function (name) {

    Hoek.assert(name && typeof name === 'string', 'Label name must be a non-empty string');

    var obj = this.clone();
    var options = { language: { label: name } };

    // If language.label is set, it should override this label
    obj._settings = internals.concatSettings(options, obj._settings);
    return obj;
};


// Set

internals.Set = function () {

    this._set = [];
};


internals.Set.prototype.add = function (value, refs) {

    Hoek.assert(value === null || value === undefined || value instanceof Date || Buffer.isBuffer(value) || Ref.isRef(value) || (typeof value !== 'function' && typeof value !== 'object'), 'Value cannot be an object or function');

    if (typeof value !== 'function' &&
        this.has(value, null, null, false)) {

        return;
    }

    Ref.push(refs, value);
    this._set.push(value);
};


internals.Set.prototype.merge = function (add, remove) {

    for (var i = 0, il = add._set.length; i < il; ++i) {
        this.add(add._set[i]);
    }

    for (i = 0, il = remove._set.length; i < il; ++i) {
        this.remove(remove._set[i]);
    }
};


internals.Set.prototype.remove = function (value) {

    this._set = this._set.filter(function (item) {

        return value !== item;
    });
};


internals.Set.prototype.has = function (value, state, options, insensitive) {

    for (var i = 0, il = this._set.length; i < il; ++i) {
        var items = this._set[i];

        if (Ref.isRef(items)) {
            items = items(state.reference || state.parent, options);
        }

        if (!Array.isArray(items)) {
            items = [items];
        }

        for (var j = 0, jl = items.length; j < jl; ++j) {
            var item = items[j];
            if (typeof value !== typeof item) {
                continue;
            }

            if (value === item ||
                (value instanceof Date && item instanceof Date && value.getTime() === item.getTime()) ||
                (insensitive && typeof value === 'string' && value.toLowerCase() === item.toLowerCase()) ||
                (Buffer.isBuffer(value) && Buffer.isBuffer(item) && value.length === item.length && value.toString('binary') === item.toString('binary'))) {

                return true;
            }
        }
    }

    return false;
};


internals.Set.prototype.values = function (options) {

    if (options && options.stripUndefined) {
        var values = [];

        for (var i = 0, il = this._set.length; i < il; ++i) {
            var item = this._set[i];
            if (item !== undefined) {
                values.push(item);
            }
        }

        return values;
    }

    return this._set.slice();
};


internals.concatSettings = function (target, source) {

    // Used to avoid cloning context

    if (!target &&
        !source) {

        return null;
    }

    var key, obj = {};

    if (target) {
        var tKeys = Object.keys(target);
        for (var i = 0, il = tKeys.length; i < il; ++i) {
            key = tKeys[i];
            obj[key] = target[key];
        }
    }

    if (source) {
        var sKeys = Object.keys(source);
        for (var j = 0, jl = sKeys.length; j < jl; ++j) {
            key = sKeys[j];
            if (key !== 'language' ||
                !obj.hasOwnProperty(key)) {

                obj[key] = source[key];
            }
            else {
                obj[key] = Hoek.applyToDefaults(obj[key], source[key]);
            }
        }
    }

    return obj;
};
