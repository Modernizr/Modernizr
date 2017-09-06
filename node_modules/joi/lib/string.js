// Load modules

var Net = require('net');
var Hoek = require('hoek');
var Isemail = require('isemail');
var Any = require('./any');
var Ref = require('./ref');
var JoiDate = require('./date');
var Errors = require('./errors');
var Uri = require('./string/uri');
var Ip = require('./string/ip');

// Declare internals

var internals = {
    uriRegex: Uri.createUriRegex(),
    ipRegex: Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], 'optional')
};

internals.String = function () {

    Any.call(this);
    this._type = 'string';
    this._invalids.add('');
};

Hoek.inherits(internals.String, Any);

internals.compare = function (type, compare) {

    return function (limit, encoding) {

        var isRef = Ref.isRef(limit);

        Hoek.assert((Hoek.isInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');
        Hoek.assert(!encoding || Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

        return this._test(type, limit, function (value, state, options) {

            var compareTo;
            if (isRef) {
                compareTo = limit(state.parent, options);

                if (!Hoek.isInteger(compareTo)) {
                    return Errors.create('string.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (compare(value, compareTo, encoding)) {
                return null;
            }

            return Errors.create('string.' + type, { limit: compareTo, value: value, encoding: encoding }, state, options);
        });
    };
};

internals.String.prototype._base = function (value, state, options) {

    if (typeof value === 'string' &&
        options.convert) {

        if (this._flags.case) {
            value = (this._flags.case === 'upper' ? value.toLocaleUpperCase() : value.toLocaleLowerCase());
        }

        if (this._flags.trim) {
            value = value.trim();
        }

        if (this._inner.replacements) {

            for (var r = 0, rl = this._inner.replacements.length; r < rl; ++r) {
                var replacement = this._inner.replacements[r];
                value = value.replace(replacement.pattern, replacement.replacement);
            }
        }
    }

    return {
        value: value,
        errors: (typeof value === 'string') ? null : Errors.create('string.base', { value: value }, state, options)
    };
};


internals.String.prototype.insensitive = function () {

    var obj = this.clone();
    obj._flags.insensitive = true;
    return obj;
};


internals.String.prototype.min = internals.compare('min', function (value, limit, encoding) {

    var length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length >= limit;
});


internals.String.prototype.max = internals.compare('max', function (value, limit, encoding) {

    var length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length <= limit;
});


internals.String.prototype.creditCard = function () {

    return this._test('creditCard', undefined, function (value, state, options) {

        var i = value.length;
        var sum = 0;
        var mul = 1;
        var char;

        while (i--) {
            char = value.charAt(i) * mul;
            sum += char - (char > 9) * 9;
            mul ^= 3;
        }

        var check = (sum % 10 === 0) && (sum > 0);
        return check ? null : Errors.create('string.creditCard', { value: value }, state, options);
    });
};

internals.String.prototype.length = internals.compare('length', function (value, limit, encoding) {

    var length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length === limit;
});


internals.String.prototype.regex = function (pattern, name) {

    Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');

    pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined);         // Future version should break this and forbid unsupported regex flags

    return this._test('regex', pattern, function (value, state, options) {

        if (pattern.test(value)) {
            return null;
        }

        return Errors.create((name ? 'string.regex.name' : 'string.regex.base'), { name: name, pattern: pattern, value: value }, state, options);
    });
};


internals.String.prototype.alphanum = function () {

    return this._test('alphanum', undefined, function (value, state, options) {

        if (/^[a-zA-Z0-9]+$/.test(value)) {
            return null;
        }

        return Errors.create('string.alphanum', { value: value }, state, options);
    });
};


internals.String.prototype.token = function () {

    return this._test('token', undefined, function (value, state, options) {

        if (/^\w+$/.test(value)) {
            return null;
        }

        return Errors.create('string.token', { value: value }, state, options);
    });
};


internals.String.prototype.email = function (isEmailOptions) {

    if (isEmailOptions) {
        Hoek.assert(typeof isEmailOptions === 'object', 'email options must be an object');
        Hoek.assert(typeof isEmailOptions.checkDNS === 'undefined', 'checkDNS option is not supported');
        Hoek.assert(typeof isEmailOptions.tldWhitelist === 'undefined' ||
            typeof isEmailOptions.tldWhitelist === 'object', 'tldWhitelist must be an array or object');
        Hoek.assert(typeof isEmailOptions.minDomainAtoms === 'undefined' ||
            Hoek.isInteger(isEmailOptions.minDomainAtoms) && isEmailOptions.minDomainAtoms > 0,
            'minDomainAtoms must be a positive integer');
        Hoek.assert(typeof isEmailOptions.errorLevel === 'undefined' || typeof isEmailOptions.errorLevel === 'boolean' ||
            (Hoek.isInteger(isEmailOptions.errorLevel) && isEmailOptions.errorLevel >= 0),
            'errorLevel must be a non-negative integer or boolean');
    }

    return this._test('email', isEmailOptions, function (value, state, options) {

        try {
            var result = Isemail(value, isEmailOptions);
            if (result === true || result === 0) {
                return null;
            }
        }
        catch (e) {}

        return Errors.create('string.email', { value: value }, state, options);
    });
};


internals.String.prototype.ip = function (ipOptions) {

    var regex = internals.ipRegex;
    ipOptions = ipOptions || {};
    Hoek.assert(typeof ipOptions === 'object', 'options must be an object');

    if (ipOptions.cidr) {
        Hoek.assert(typeof ipOptions.cidr === 'string', 'cidr must be a string');
        ipOptions.cidr = ipOptions.cidr.toLowerCase();

        Hoek.assert(ipOptions.cidr in Ip.cidrs, 'cidr must be one of ' + Object.keys(Ip.cidrs).join(', '));

        // If we only received a `cidr` setting, create a regex for it. But we don't need to create one if `cidr` is "optional" since that is the default
        if (!ipOptions.version && ipOptions.cidr !== 'optional') {
            regex = Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], ipOptions.cidr);
        }
    }
    else {

        // Set our default cidr strategy
        ipOptions.cidr = 'optional';
    }

    if (ipOptions.version) {
        if (!Array.isArray(ipOptions.version)) {
            ipOptions.version = [ipOptions.version];
        }

        Hoek.assert(ipOptions.version.length >= 1, 'version must have at least 1 version specified');

        var versions = [];
        for (var i = 0, il = ipOptions.version.length; i < il; ++i) {
            var version = ipOptions.version[i];
            Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
            version = version.toLowerCase();
            Hoek.assert(Ip.versions[version], 'version at position ' + i + ' must be one of ' + Object.keys(Ip.versions).join(', '));
            versions.push(version);
        }

        // Make sure we have a set of versions
        versions = Hoek.unique(versions);

        regex = Ip.createIpRegex(versions, ipOptions.cidr);
    }

    return this._test('ip', ipOptions, function (value, state, options) {

        if (regex.test(value)) {
            return null;
        }

        if (versions) {
            return Errors.create('string.ipVersion', { value: value, cidr: ipOptions.cidr, version: versions }, state, options);
        }

        return Errors.create('string.ip', { value: value, cidr: ipOptions.cidr }, state, options);
    });
};


internals.String.prototype.uri = function (uriOptions) {

    var customScheme = '',
        regex = internals.uriRegex;

    if (uriOptions) {
        Hoek.assert(typeof uriOptions === 'object', 'options must be an object');

        if (uriOptions.scheme) {
            Hoek.assert(uriOptions.scheme instanceof RegExp || typeof uriOptions.scheme === 'string' || Array.isArray(uriOptions.scheme), 'scheme must be a RegExp, String, or Array');

            if (!Array.isArray(uriOptions.scheme)) {
                uriOptions.scheme = [uriOptions.scheme];
            }

            Hoek.assert(uriOptions.scheme.length >= 1, 'scheme must have at least 1 scheme specified');

            // Flatten the array into a string to be used to match the schemes.
            for (var i = 0, il = uriOptions.scheme.length; i < il; ++i) {
                var scheme = uriOptions.scheme[i];
                Hoek.assert(scheme instanceof RegExp || typeof scheme === 'string', 'scheme at position ' + i + ' must be a RegExp or String');

                // Add OR separators if a value already exists
                customScheme += customScheme ? '|' : '';

                // If someone wants to match HTTP or HTTPS for example then we need to support both RegExp and String so we don't escape their pattern unknowingly.
                if (scheme instanceof RegExp) {
                    customScheme += scheme.source;
                }
                else {
                    Hoek.assert(/[a-zA-Z][a-zA-Z0-9+-\.]*/.test(scheme), 'scheme at position ' + i + ' must be a valid scheme');
                    customScheme += Hoek.escapeRegex(scheme);
                }
            }
        }
    }

    if (customScheme) {
        regex = Uri.createUriRegex(customScheme);
    }

    return this._test('uri', uriOptions, function (value, state, options) {

        if (regex.test(value)) {
            return null;
        }

        if (customScheme) {
            return Errors.create('string.uriCustomScheme', { scheme: customScheme, value: value }, state, options);
        }

        return Errors.create('string.uri', { value: value }, state, options);
    });
};


internals.String.prototype.isoDate = function () {

    return this._test('isoDate', undefined, function (value, state, options) {

        if (JoiDate._isIsoDate(value)) {
            return null;
        }

        return Errors.create('string.isoDate', { value: value }, state, options);
    });
};


internals.String.prototype.guid = function () {

    var regex = /^[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}$/i;
    var regex2 = /^\{[A-F0-9]{8}(?:-?[A-F0-9]{4}){3}-?[A-F0-9]{12}\}$/i;

    return this._test('guid', undefined, function (value, state, options) {

        if (regex.test(value) || regex2.test(value)) {
            return null;
        }

        return Errors.create('string.guid', { value: value }, state, options);
    });
};


internals.String.prototype.hex = function () {

    var regex = /^[a-f0-9]+$/i;

    return this._test('hex', regex, function (value, state, options) {

        if (regex.test(value)) {
            return null;
        }

        return Errors.create('string.hex', { value: value }, state, options);
    });
};


internals.String.prototype.hostname = function () {

    var regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

    return this._test('hostname', undefined, function (value, state, options) {

        if ((value.length <= 255 && regex.test(value)) ||
            Net.isIPv6(value)) {

            return null;
        }

        return Errors.create('string.hostname', { value: value }, state, options);
    });
};


internals.String.prototype.lowercase = function () {

    var obj = this._test('lowercase', undefined, function (value, state, options) {

        if (options.convert ||
            value === value.toLocaleLowerCase()) {

            return null;
        }

        return Errors.create('string.lowercase', { value: value }, state, options);
    });

    obj._flags.case = 'lower';
    return obj;
};


internals.String.prototype.uppercase = function () {

    var obj = this._test('uppercase', undefined, function (value, state, options) {

        if (options.convert ||
            value === value.toLocaleUpperCase()) {

            return null;
        }

        return Errors.create('string.uppercase', { value: value }, state, options);
    });

    obj._flags.case = 'upper';
    return obj;
};


internals.String.prototype.trim = function () {

    var obj = this._test('trim', undefined, function (value, state, options) {

        if (options.convert ||
            value === value.trim()) {

            return null;
        }

        return Errors.create('string.trim', { value: value }, state, options);
    });

    obj._flags.trim = true;
    return obj;
};


internals.String.prototype.replace = function (pattern, replacement) {

    if (typeof pattern === 'string') {
        pattern = new RegExp(Hoek.escapeRegex(pattern), 'g');
    }

    Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
    Hoek.assert(typeof replacement === 'string', 'replacement must be a String');

    // This can not be considere a test like trim, we can't "reject"
    // anything from this rule, so just clone the current object
    var obj = this.clone();

    if (!obj._inner.replacements) {
        obj._inner.replacements = [];
    }

    obj._inner.replacements.push({
        pattern: pattern,
        replacement: replacement
    });

    return obj;
};

module.exports = new internals.String();
