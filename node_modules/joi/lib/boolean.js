// Load modules

var Any = require('./any');
var Errors = require('./errors');
var Hoek = require('hoek');


// Declare internals

var internals = {};


internals.Boolean = function () {

    Any.call(this);
    this._type = 'boolean';
};

Hoek.inherits(internals.Boolean, Any);


internals.Boolean.prototype._base = function (value, state, options) {

    var result = {
        value: value
    };

    if (typeof value === 'string' &&
        options.convert) {

        var lower = value.toLowerCase();
        result.value = (lower === 'true' || lower === 'yes' || lower === 'on' ? true
                                                                              : (lower === 'false' || lower === 'no' || lower === 'off' ? false : value));
    }

    result.errors = (typeof result.value === 'boolean') ? null : Errors.create('boolean.base', null, state, options);
    return result;
};


module.exports = new internals.Boolean();
