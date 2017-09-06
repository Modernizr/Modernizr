// Load modules

var Any = require('./any');
var Cast = require('./cast');
var Errors = require('./errors');
var Hoek = require('hoek');


// Declare internals

var internals = {};


internals.fastSplice = function (arr, i) {

    var il = arr.length;
    var pos = i;

    while (pos < il) {
        arr[pos++] = arr[pos];
    }

    --arr.length;
};


internals.Array = function () {

    Any.call(this);
    this._type = 'array';
    this._inner.items = [];
    this._inner.ordereds = [];
    this._inner.inclusions = [];
    this._inner.exclusions = [];
    this._inner.requireds = [];
    this._flags.sparse = false;
};

Hoek.inherits(internals.Array, Any);


internals.Array.prototype._base = function (value, state, options) {

    var result = {
        value: value
    };

    if (typeof value === 'string' &&
        options.convert) {

        try {
            var converted = JSON.parse(value);
            if (Array.isArray(converted)) {
                result.value = converted;
            }
        }
        catch (e) { }
    }

    var isArray = Array.isArray(result.value);
    var wasArray = isArray;
    if (options.convert && this._flags.single && !isArray) {
        result.value = [result.value];
        isArray = true;
    }

    if (!isArray) {
        result.errors = Errors.create('array.base', null, state, options);
        return result;
    }

    if (this._inner.inclusions.length ||
        this._inner.exclusions.length ||
        !this._flags.sparse) {

        // Clone the array so that we don't modify the original
        if (wasArray) {
            result.value = result.value.slice(0);
        }

        result.errors = internals.checkItems.call(this, result.value, wasArray, state, options);

        if (result.errors && wasArray && options.convert && this._flags.single) {

            // Attempt a 2nd pass by putting the array inside one.
            var previousErrors = result.errors;

            result.value = [result.value];
            result.errors = internals.checkItems.call(this, result.value, wasArray, state, options);

            if (result.errors) {

                // Restore previous errors and value since this didn't validate either.
                result.errors = previousErrors;
                result.value = result.value[0];
            }
        }
    }

    return result;
};


internals.checkItems = function (items, wasArray, state, options) {

    var errors = [];
    var errored;

    var requireds = this._inner.requireds.slice();
    var ordereds = this._inner.ordereds.slice();
    var inclusions = this._inner.inclusions.concat(requireds);

    for (var v = 0, vl = items.length; v < vl; ++v) {
        errored = false;
        var item = items[v];
        var isValid = false;
        var localState = { key: v, path: (state.path ? state.path + '.' : '') + v, parent: items, reference: state.reference };
        var res;

        // Sparse

        if (!this._flags.sparse && item === undefined) {
            errors.push(Errors.create('array.sparse', null, { key: state.key, path: localState.path }, options));

            if (options.abortEarly) {
                return errors;
            }

            continue;
        }

        // Exclusions

        for (var i = 0, il = this._inner.exclusions.length; i < il; ++i) {
            res = this._inner.exclusions[i]._validate(item, localState, {});                // Not passing options to use defaults

            if (!res.errors) {
                errors.push(Errors.create(wasArray ? 'array.excludes' : 'array.excludesSingle', { pos: v, value: item }, { key: state.key, path: localState.path }, options));
                errored = true;

                if (options.abortEarly) {
                    return errors;
                }

                break;
            }
        }

        if (errored) {
            continue;
        }

        // Ordered
        if (this._inner.ordereds.length) {
            if (ordereds.length > 0) {
                var ordered = ordereds.shift();
                res = ordered._validate(item, localState, options);
                if (!res.errors) {
                    if (ordered._flags.strip) {
                        internals.fastSplice(items, v);
                        --v;
                        --vl;
                    }
                    else {
                        items[v] = res.value;
                    }
                }
                else {
                    errors.push(Errors.create('array.ordered', { pos: v, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
                    if (options.abortEarly) {
                        return errors;
                    }
                }
                continue;
            }
            else if (!this._inner.items.length) {
                errors.push(Errors.create('array.orderedLength', { pos: v, limit: this._inner.ordereds.length }, { key: state.key, path: localState.path }, options));
                if (options.abortEarly) {
                    return errors;
                }
                continue;
            }
        }

        // Requireds

        var requiredChecks = [];
        for (i = 0, il = requireds.length; i < il; ++i) {
            res = requiredChecks[i] = requireds[i]._validate(item, localState, options);
            if (!res.errors) {
                items[v] = res.value;
                isValid = true;
                internals.fastSplice(requireds, i);
                --i;
                --il;
                break;
            }
        }

        if (isValid) {
            continue;
        }

        // Inclusions

        for (i = 0, il = inclusions.length; i < il; ++i) {
            var inclusion = inclusions[i];

            // Avoid re-running requireds that already didn't match in the previous loop
            var previousCheck = requireds.indexOf(inclusion);
            if (previousCheck !== -1) {
                res = requiredChecks[previousCheck];
            }
            else {
                res = inclusion._validate(item, localState, options);

                if (!res.errors) {
                    if (inclusion._flags.strip) {
                        internals.fastSplice(items, v);
                        --v;
                        --vl;
                    }
                    else {
                        items[v] = res.value;
                    }
                    isValid = true;
                    break;
                }
            }

            // Return the actual error if only one inclusion defined
            if (il === 1) {
                if (options.stripUnknown) {
                    internals.fastSplice(items, v);
                    --v;
                    --vl;
                    isValid = true;
                    break;
                }

                errors.push(Errors.create(wasArray ? 'array.includesOne' : 'array.includesOneSingle', { pos: v, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
                errored = true;

                if (options.abortEarly) {
                    return errors;
                }

                break;
            }
        }

        if (errored) {
            continue;
        }

        if (this._inner.inclusions.length && !isValid) {
            if (options.stripUnknown) {
                internals.fastSplice(items, v);
                --v;
                --vl;
                continue;
            }

            errors.push(Errors.create(wasArray ? 'array.includes' : 'array.includesSingle', { pos: v, value: item }, { key: state.key, path: localState.path }, options));

            if (options.abortEarly) {
                return errors;
            }
        }
    }

    if (requireds.length) {
        internals.fillMissedErrors(errors, requireds, state, options);
    }

    if (ordereds.length) {
        internals.fillOrderedErrors(errors, ordereds, state, options);
    }

    return errors.length ? errors : null;
};

internals.fillMissedErrors = function (errors, requireds, state, options) {

    var knownMisses = [];
    var unknownMisses = 0;
    for (var i = 0, il = requireds.length; i < il; ++i) {
        var label = Hoek.reach(requireds[i], '_settings.language.label');
        if (label) {
            knownMisses.push(label);
        }
        else {
            ++unknownMisses;
        }
    }

    if (knownMisses.length) {
        if (unknownMisses) {
            errors.push(Errors.create('array.includesRequiredBoth', { knownMisses: knownMisses, unknownMisses: unknownMisses }, { key: state.key, path: state.patk }, options));
        }
        else {
            errors.push(Errors.create('array.includesRequiredKnowns', { knownMisses: knownMisses }, { key: state.key, path: state.path }, options));
        }
    }
    else {
        errors.push(Errors.create('array.includesRequiredUnknowns', { unknownMisses: unknownMisses }, { key: state.key, path: state.path }, options));
    }
};

internals.fillOrderedErrors = function (errors, ordereds, state, options) {

    var requiredOrdereds = [];

    for (var i = 0, il = ordereds.length; i < il; ++i) {
        var presence = Hoek.reach(ordereds[i], '_flags.presence');
        if (presence === 'required') {
            requiredOrdereds.push(ordereds[i]);
        }
    }

    if (requiredOrdereds.length) {
        internals.fillMissedErrors(errors, requiredOrdereds, state, options);
    }
};

internals.Array.prototype.describe = function () {

    var description = Any.prototype.describe.call(this);

    if (this._inner.ordereds.length) {
        description.orderedItems = [];

        for (var o = 0, ol = this._inner.ordereds.length; o < ol; ++o) {
            description.orderedItems.push(this._inner.ordereds[o].describe());
        }
    }

    if (this._inner.items.length) {
        description.items = [];

        for (var i = 0, il = this._inner.items.length; i < il; ++i) {
            description.items.push(this._inner.items[i].describe());
        }
    }

    return description;
};


internals.Array.prototype.items = function () {

    var obj = this.clone();

    Hoek.flatten(Array.prototype.slice.call(arguments)).forEach(function (type, index) {

        try {
            type = Cast.schema(type);
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.path = index + '.' + castErr.path;
            }
            else {
                castErr.path = index;
            }
            castErr.message += '(' + castErr.path + ')';
            throw castErr;
        }

        obj._inner.items.push(type);

        if (type._flags.presence === 'required') {
            obj._inner.requireds.push(type);
        }
        else if (type._flags.presence === 'forbidden') {
            obj._inner.exclusions.push(type.optional());
        }
        else {
            obj._inner.inclusions.push(type);
        }
    });

    return obj;
};


internals.Array.prototype.ordered = function () {

    var obj = this.clone();

    Hoek.flatten(Array.prototype.slice.call(arguments)).forEach(function (type, index) {

        try {
            type = Cast.schema(type);
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.path = index + '.' + castErr.path;
            }
            else {
                castErr.path = index;
            }
            castErr.message += '(' + castErr.path + ')';
            throw castErr;
        }
        obj._inner.ordereds.push(type);
    });

    return obj;
};


internals.Array.prototype.min = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('min', limit, function (value, state, options) {

        if (value.length >= limit) {
            return null;
        }

        return Errors.create('array.min', { limit: limit, value: value }, state, options);
    });
};


internals.Array.prototype.max = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('max', limit, function (value, state, options) {

        if (value.length <= limit) {
            return null;
        }

        return Errors.create('array.max', { limit: limit, value: value }, state, options);
    });
};


internals.Array.prototype.length = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('length', limit, function (value, state, options) {

        if (value.length === limit) {
            return null;
        }

        return Errors.create('array.length', { limit: limit, value: value }, state, options);
    });
};


internals.Array.prototype.unique = function () {

    return this._test('unique', undefined, function (value, state, options) {

        var found = {
            string: {},
            number: {},
            undefined: {},
            boolean: {},
            object: [],
            function: []
        };

        for (var i = 0, il = value.length; i < il; ++i) {
            var item = value[i];
            var type = typeof item;
            var records = found[type];

            // All available types are supported, so it's not possible to reach 100% coverage without ignoring this line.
            // I still want to keep the test for future js versions with new types (eg. Symbol).
            if (/* $lab:coverage:off$ */ records /* $lab:coverage:on$ */) {
                if (Array.isArray(records)) {
                    for (var r = 0, rl = records.length; r < rl; ++r) {
                        if (Hoek.deepEqual(records[r], item)) {
                            return Errors.create('array.unique', { pos: i, value: item }, state, options);
                        }
                    }

                    records.push(item);
                }
                else {
                    if (records[item]) {
                        return Errors.create('array.unique', { pos: i, value: item }, state, options);
                    }

                    records[item] = true;
                }
            }
        }
    });
};


internals.Array.prototype.sparse = function (enabled) {

    var obj = this.clone();
    obj._flags.sparse = enabled === undefined ? true : !!enabled;
    return obj;
};


internals.Array.prototype.single = function (enabled) {

    var obj = this.clone();
    obj._flags.single = enabled === undefined ? true : !!enabled;
    return obj;
};


module.exports = new internals.Array();
