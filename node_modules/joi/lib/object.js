// Load modules

var Hoek = require('hoek');
var Topo = require('topo');
var Any = require('./any');
var Cast = require('./cast');
var Errors = require('./errors');


// Declare internals

var internals = {};


internals.Object = function () {

    Any.call(this);
    this._type = 'object';
    this._inner.children = null;
    this._inner.renames = [];
    this._inner.dependencies = [];
    this._inner.patterns = [];
};

Hoek.inherits(internals.Object, Any);


internals.Object.prototype._base = function (value, state, options) {

    var item, key, localState, result;
    var target = value;
    var errors = [];
    var finish = function () {

        return {
            value: target,
            errors: errors.length ? errors : null
        };
    };

    if (typeof value === 'string' &&
        options.convert) {

        try {
            value = JSON.parse(value);
        }
        catch (parseErr) { }
    }

    var type = this._flags.func ? 'function' : 'object';
    if (!value ||
        typeof value !== type ||
        Array.isArray(value)) {

        errors.push(Errors.create(type + '.base', null, state, options));
        return finish();
    }

    // Skip if there are no other rules to test

    if (!this._inner.renames.length &&
        !this._inner.dependencies.length &&
        !this._inner.children &&                    // null allows any keys
        !this._inner.patterns.length) {

        target = value;
        return finish();
    }

    // Ensure target is a local copy (parsed) or shallow copy

    if (target === value) {
        if (type === 'object') {
            target = Object.create(Object.getPrototypeOf(value));
        }
        else {
            target = function () {

                return value.apply(this, arguments);
            };

            target.prototype = Hoek.clone(value.prototype);
        }

        var valueKeys = Object.keys(value);
        for (var t = 0, tl = valueKeys.length; t < tl; ++t) {
            target[valueKeys[t]] = value[valueKeys[t]];
        }
    }
    else {
        target = value;
    }

    // Rename keys

    var renamed = {};
    for (var r = 0, rl = this._inner.renames.length; r < rl; ++r) {
        item = this._inner.renames[r];

        if (item.options.ignoreUndefined && target[item.from] === undefined) {
            continue;
        }

        if (!item.options.multiple &&
            renamed[item.to]) {

            errors.push(Errors.create('object.rename.multiple', { from: item.from, to: item.to }, state, options));
            if (options.abortEarly) {
                return finish();
            }
        }

        if (Object.prototype.hasOwnProperty.call(target, item.to) &&
            !item.options.override &&
            !renamed[item.to]) {

            errors.push(Errors.create('object.rename.override', { from: item.from, to: item.to }, state, options));
            if (options.abortEarly) {
                return finish();
            }
        }

        if (target[item.from] === undefined) {
            delete target[item.to];
        }
        else {
            target[item.to] = target[item.from];
        }

        renamed[item.to] = true;

        if (!item.options.alias) {
            delete target[item.from];
        }
    }

    // Validate schema

    if (!this._inner.children &&            // null allows any keys
        !this._inner.patterns.length &&
        !this._inner.dependencies.length) {

        return finish();
    }

    var unprocessed = Hoek.mapToObject(Object.keys(target));

    if (this._inner.children) {
        for (var i = 0, il = this._inner.children.length; i < il; ++i) {
            var child = this._inner.children[i];
            key = child.key;
            item = target[key];

            delete unprocessed[key];

            localState = { key: key, path: (state.path || '') + (state.path && key ? '.' : '') + key, parent: target, reference: state.reference };
            result = child.schema._validate(item, localState, options);
            if (result.errors) {
                errors.push(Errors.create('object.child', { key: key, reason: result.errors }, localState, options));

                if (options.abortEarly) {
                    return finish();
                }
            }

            if (child.schema._flags.strip || (result.value === undefined && result.value !== item)) {
                delete target[key];
            }
            else if (result.value !== undefined) {
                target[key] = result.value;
            }
        }
    }

    // Unknown keys

    var unprocessedKeys = Object.keys(unprocessed);
    if (unprocessedKeys.length &&
        this._inner.patterns.length) {

        for (i = 0, il = unprocessedKeys.length; i < il; ++i) {
            key = unprocessedKeys[i];

            for (var p = 0, pl = this._inner.patterns.length; p < pl; ++p) {
                var pattern = this._inner.patterns[p];

                if (pattern.regex.test(key)) {
                    delete unprocessed[key];

                    item = target[key];
                    localState = { key: key, path: (state.path ? state.path + '.' : '') + key, parent: target, reference: state.reference };
                    result = pattern.rule._validate(item, localState, options);
                    if (result.errors) {
                        errors.push(Errors.create('object.child', { key: key, reason: result.errors }, localState, options));

                        if (options.abortEarly) {
                            return finish();
                        }
                    }

                    if (result.value !== undefined) {
                        target[key] = result.value;
                    }
                }
            }
        }

        unprocessedKeys = Object.keys(unprocessed);
    }

    if ((this._inner.children || this._inner.patterns.length) && unprocessedKeys.length) {
        if (options.stripUnknown ||
            options.skipFunctions) {

            for (var k = 0, kl = unprocessedKeys.length; k < kl; ++k) {
                key = unprocessedKeys[k];

                if (options.stripUnknown) {
                    delete target[key];
                    delete unprocessed[key];
                }
                else if (typeof target[key] === 'function') {
                    delete unprocessed[key];
                }
            }

            unprocessedKeys = Object.keys(unprocessed);
        }

        if (unprocessedKeys.length &&
            (this._flags.allowUnknown !== undefined ? !this._flags.allowUnknown : !options.allowUnknown)) {

            for (var e = 0, el = unprocessedKeys.length; e < el; ++e) {
                errors.push(Errors.create('object.allowUnknown', null, { key: unprocessedKeys[e], path: state.path + (state.path ? '.' : '') + unprocessedKeys[e] }, options));
            }
        }
    }

    // Validate dependencies

    for (var d = 0, dl = this._inner.dependencies.length; d < dl; ++d) {
        var dep = this._inner.dependencies[d];
        var err = internals[dep.type](dep.key !== null && value[dep.key], dep.peers, target, { key: dep.key, path: (state.path || '') + (dep.key ? '.' + dep.key : '') }, options);
        if (err) {
            errors.push(err);
            if (options.abortEarly) {
                return finish();
            }
        }
    }

    return finish();
};


internals.Object.prototype._func = function () {

    var obj = this.clone();
    obj._flags.func = true;
    return obj;
};


internals.Object.prototype.keys = function (schema) {

    Hoek.assert(schema === null || schema === undefined || typeof schema === 'object', 'Object schema must be a valid object');
    Hoek.assert(!schema || !schema.isJoi, 'Object schema cannot be a joi schema');

    var obj = this.clone();

    if (!schema) {
        obj._inner.children = null;
        return obj;
    }

    var children = Object.keys(schema);

    if (!children.length) {
        obj._inner.children = [];
        return obj;
    }

    var topo = new Topo();
    var child;
    if (obj._inner.children) {
        for (var i = 0, il = obj._inner.children.length; i < il; ++i) {
            child = obj._inner.children[i];

            // Only add the key if we are not going to replace it later
            if (children.indexOf(child.key) === -1) {
                topo.add(child, { after: child._refs, group: child.key });
            }
        }
    }

    for (var c = 0, cl = children.length; c < cl; ++c) {
        var key = children[c];
        child = schema[key];
        try {
            var cast = Cast.schema(child);
            topo.add({ key: key, schema: cast }, { after: cast._refs, group: key });
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.path = key + '.' + castErr.path;
            }
            else {
                castErr.path = key;
            }
            throw castErr;
        }
    }

    obj._inner.children = topo.nodes;

    return obj;
};


internals.Object.prototype.unknown = function (allow) {

    var obj = this.clone();
    obj._flags.allowUnknown = (allow !== false);
    return obj;
};


internals.Object.prototype.length = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('length', limit, function (value, state, options) {

        if (Object.keys(value).length === limit) {
            return null;
        }

        return Errors.create('object.length', { limit: limit }, state, options);
    });
};


internals.Object.prototype.min = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('min', limit, function (value, state, options) {

        if (Object.keys(value).length >= limit) {
            return null;
        }

        return Errors.create('object.min', { limit: limit }, state, options);
    });
};


internals.Object.prototype.max = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('max', limit, function (value, state, options) {

        if (Object.keys(value).length <= limit) {
            return null;
        }

        return Errors.create('object.max', { limit: limit }, state, options);
    });
};


internals.Object.prototype.pattern = function (pattern, schema) {

    Hoek.assert(pattern instanceof RegExp, 'Invalid regular expression');
    Hoek.assert(schema !== undefined, 'Invalid rule');

    pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined);         // Future version should break this and forbid unsupported regex flags

    try {
        schema = Cast.schema(schema);
    }
    catch (castErr) {
        if (castErr.hasOwnProperty('path')) {
            castErr.message += '(' + castErr.path + ')';
        }

        throw castErr;
    }


    var obj = this.clone();
    obj._inner.patterns.push({ regex: pattern, rule: schema });
    return obj;
};


internals.Object.prototype.with = function (key, peers) {

    return this._dependency('with', key, peers);
};


internals.Object.prototype.without = function (key, peers) {

    return this._dependency('without', key, peers);
};


internals.Object.prototype.xor = function () {

    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
    return this._dependency('xor', null, peers);
};


internals.Object.prototype.or = function () {

    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
    return this._dependency('or', null, peers);
};


internals.Object.prototype.and = function () {

    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
    return this._dependency('and', null, peers);
};


internals.Object.prototype.nand = function () {

    var peers = Hoek.flatten(Array.prototype.slice.call(arguments));
    return this._dependency('nand', null, peers);
};


internals.Object.prototype.requiredKeys = function (children) {

    children = Hoek.flatten(Array.prototype.slice.call(arguments));
    return this.applyFunctionToChildren(children, 'required');
};


internals.Object.prototype.optionalKeys = function (children) {

    children = Hoek.flatten(Array.prototype.slice.call(arguments));
    return this.applyFunctionToChildren(children, 'optional');
};


internals.renameDefaults = {
    alias: false,                   // Keep old value in place
    multiple: false,                // Allow renaming multiple keys into the same target
    override: false                 // Overrides an existing key
};


internals.Object.prototype.rename = function (from, to, options) {

    Hoek.assert(typeof from === 'string', 'Rename missing the from argument');
    Hoek.assert(typeof to === 'string', 'Rename missing the to argument');
    Hoek.assert(to !== from, 'Cannot rename key to same name:', from);

    for (var i = 0, il = this._inner.renames.length; i < il; ++i) {
        Hoek.assert(this._inner.renames[i].from !== from, 'Cannot rename the same key multiple times');
    }

    var obj = this.clone();

    obj._inner.renames.push({
        from: from,
        to: to,
        options: Hoek.applyToDefaults(internals.renameDefaults, options || {})
    });

    return obj;
};


internals.groupChildren = function (children) {

    children.sort();

    var grouped = {};

    for (var c = 0, lc = children.length; c < lc; c++) {
        var child = children[c];
        Hoek.assert(typeof child === 'string', 'children must be strings');
        var group = child.split('.')[0];
        var childGroup = grouped[group] = (grouped[group] || []);
        childGroup.push(child.substring(group.length + 1));
    }

    return grouped;
};


internals.Object.prototype.applyFunctionToChildren = function (children, fn, args, root) {

    children = [].concat(children);
    Hoek.assert(children.length > 0, 'expected at least one children');

    var groupedChildren = internals.groupChildren(children);
    var obj;

    if ('' in groupedChildren) {
        obj = this[fn].apply(this, args);
        delete groupedChildren[''];
    }
    else {
        obj = this.clone();
    }

    if (obj._inner.children) {
        root = root ? (root + '.') : '';

        for (var i = 0, il = obj._inner.children.length; i < il; ++i) {
            var child = obj._inner.children[i];
            var group = groupedChildren[child.key];

            if (group) {
                obj._inner.children[i] = {
                    key: child.key,
                    _refs: child._refs,
                    schema: child.schema.applyFunctionToChildren(group, fn, args, root + child.key)
                };

                delete groupedChildren[child.key];
            }
        }
    }

    var remaining = Object.keys(groupedChildren);
    Hoek.assert(remaining.length === 0, 'unknown key(s)', remaining.join(', '));

    return obj;
};


internals.Object.prototype._dependency = function (type, key, peers) {

    peers = [].concat(peers);
    for (var i = 0, li = peers.length; i < li; i++) {
        Hoek.assert(typeof peers[i] === 'string', type, 'peers must be a string or array of strings');
    }

    var obj = this.clone();
    obj._inner.dependencies.push({ type: type, key: key, peers: peers });
    return obj;
};


internals.with = function (value, peers, parent, state, options) {

    if (value === undefined) {
        return null;
    }

    for (var i = 0, il = peers.length; i < il; ++i) {
        var peer = peers[i];
        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
            parent[peer] === undefined) {

            return Errors.create('object.with', { peer: peer }, state, options);
        }
    }

    return null;
};


internals.without = function (value, peers, parent, state, options) {

    if (value === undefined) {
        return null;
    }

    for (var i = 0, il = peers.length; i < il; ++i) {
        var peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            return Errors.create('object.without', { peer: peer }, state, options);
        }
    }

    return null;
};


internals.xor = function (value, peers, parent, state, options) {

    var present = [];
    for (var i = 0, il = peers.length; i < il; ++i) {
        var peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            present.push(peer);
        }
    }

    if (present.length === 1) {
        return null;
    }

    if (present.length === 0) {
        return Errors.create('object.missing', { peers: peers }, state, options);
    }

    return Errors.create('object.xor', { peers: peers }, state, options);
};


internals.or = function (value, peers, parent, state, options) {

    for (var i = 0, il = peers.length; i < il; ++i) {
        var peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {
            return null;
        }
    }

    return Errors.create('object.missing', { peers: peers }, state, options);
};


internals.and = function (value, peers, parent, state, options) {

    var missing = [];
    var present = [];
    var count = peers.length;
    for (var i = 0; i < count; ++i) {
        var peer = peers[i];
        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
            parent[peer] === undefined) {

            missing.push(peer);
        }
        else {
            present.push(peer);
        }
    }

    var aon = (missing.length === count || present.length === count);
    return !aon ? Errors.create('object.and', { present: present, missing: missing }, state, options) : null;
};


internals.nand = function (value, peers, parent, state, options) {

    var present = [];
    for (var i = 0, il = peers.length; i < il; ++i) {
        var peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            present.push(peer);
        }
    }

    var values = Hoek.clone(peers);
    var main = values.splice(0, 1)[0];
    var allPresent = (present.length === peers.length);
    return allPresent ? Errors.create('object.nand', { main: main, peers: values }, state, options) : null;
};


internals.Object.prototype.describe = function (shallow) {

    var description = Any.prototype.describe.call(this);

    if (this._inner.children &&
        !shallow) {

        description.children = {};
        for (var i = 0, il = this._inner.children.length; i < il; ++i) {
            var child = this._inner.children[i];
            description.children[child.key] = child.schema.describe();
        }
    }

    if (this._inner.dependencies.length) {
        description.dependencies = Hoek.clone(this._inner.dependencies);
    }

    if (this._inner.patterns.length) {
        description.patterns = [];

        for (var p = 0, pl = this._inner.patterns.length; p < pl; ++p) {
            var pattern = this._inner.patterns[p];
            description.patterns.push({ regex: pattern.regex.toString(), rule: pattern.rule.describe() });
        }
    }

    return description;
};


internals.Object.prototype.assert = function (ref, schema, message) {

    ref = Cast.ref(ref);
    Hoek.assert(ref.isContext || ref.depth > 1, 'Cannot use assertions for root level references - use direct key rules instead');
    message = message || 'pass the assertion test';

    var cast;
    try {
        cast = Cast.schema(schema);
    }
    catch (castErr) {
        if (castErr.hasOwnProperty('path')) {
            castErr.message += '(' + castErr.path + ')';
        }

        throw castErr;
    }

    var key = ref.path[ref.path.length - 1];
    var path = ref.path.join('.');

    return this._test('assert', { cast: cast, ref: ref }, function (value, state, options) {

        var result = cast._validate(ref(value), null, options, value);
        if (!result.errors) {
            return null;
        }

        var localState = Hoek.merge({}, state);
        localState.key = key;
        localState.path = path;
        return Errors.create('object.assert', { ref: localState.path, message: message }, localState, options);
    });
};


internals.Object.prototype.type = function (constructor, name) {

    Hoek.assert(typeof constructor === 'function', 'type must be a constructor function');
    name = name || constructor.name;

    return this._test('type', name, function (value, state, options) {

        if (value instanceof constructor) {
            return null;
        }

        return Errors.create('object.type', { type: name }, state, options);
    });
};


module.exports = new internals.Object();
