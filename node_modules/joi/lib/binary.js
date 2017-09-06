// Load modules

var Any = require('./any');
var Errors = require('./errors');
var Hoek = require('hoek');


// Declare internals

var internals = {};


internals.Binary = function () {

    Any.call(this);
    this._type = 'binary';
};

Hoek.inherits(internals.Binary, Any);


internals.Binary.prototype._base = function (value, state, options) {

    var result = {
        value: value
    };

    if (typeof value === 'string' &&
        options.convert) {

        try {
            var converted = new Buffer(value, this._flags.encoding);
            result.value = converted;
        }
        catch (e) { }
    }

    result.errors = Buffer.isBuffer(result.value) ? null : Errors.create('binary.base', null, state, options);
    return result;
};


internals.Binary.prototype.encoding = function (encoding) {

    Hoek.assert(Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

    var obj = this.clone();
    obj._flags.encoding = encoding;
    return obj;
};


internals.Binary.prototype.min = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('min', limit, function (value, state, options) {

        if (value.length >= limit) {
            return null;
        }

        return Errors.create('binary.min', { limit: limit, value: value }, state, options);
    });
};


internals.Binary.prototype.max = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('max', limit, function (value, state, options) {

        if (value.length <= limit) {
            return null;
        }

        return Errors.create('binary.max', { limit: limit, value: value }, state, options);
    });
};


internals.Binary.prototype.length = function (limit) {

    Hoek.assert(Hoek.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

    return this._test('length', limit, function (value, state, options) {

        if (value.length === limit) {
            return null;
        }

        return Errors.create('binary.length', { limit: limit, value: value }, state, options);
    });
};


module.exports = new internals.Binary();
