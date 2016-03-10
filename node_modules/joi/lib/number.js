// Load modules

var Any = require('./any');
var Ref = require('./ref');
var Errors = require('./errors');
var Hoek = require('hoek');


// Declare internals

var internals = {};


internals.Number = function () {

    Any.call(this);
    this._type = 'number';
    this._invalids.add(Infinity);
    this._invalids.add(-Infinity);
};

Hoek.inherits(internals.Number, Any);

internals.compare = function (type, compare) {

    return function (limit) {

        var isRef = Ref.isRef(limit);
        var isNumber = typeof limit === 'number' && !isNaN(limit);

        Hoek.assert(isNumber || isRef, 'limit must be a number or reference');

        return this._test(type, limit, function (value, state, options) {

            var compareTo;
            if (isRef) {
                compareTo = limit(state.parent, options);

                if (!(typeof compareTo === 'number' && !isNaN(compareTo))) {
                    return Errors.create('number.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (compare(value, compareTo)) {
                return null;
            }

            return Errors.create('number.' + type, { limit: compareTo, value: value }, state, options);
        });
    };
};


internals.Number.prototype._base = function (value, state, options) {

    var result = {
        errors: null,
        value: value
    };

    if (typeof value === 'string' &&
        options.convert) {

        var number = parseFloat(value);
        result.value = (isNaN(number) || !isFinite(value)) ? NaN : number;
    }

    var isNumber = typeof result.value === 'number' && !isNaN(result.value);

    if (options.convert && 'precision' in this._flags && isNumber) {

        // This is conceptually equivalent to using toFixed but it should be much faster
        var precision = Math.pow(10, this._flags.precision);
        result.value = Math.round(result.value * precision) / precision;
    }

    result.errors = isNumber ? null : Errors.create('number.base', null, state, options);
    return result;
};


internals.Number.prototype.min = internals.compare('min', function (value, limit) {

    return value >= limit;
});


internals.Number.prototype.max = internals.compare('max', function (value, limit) {

    return value <= limit;
});


internals.Number.prototype.greater = internals.compare('greater', function (value, limit) {

    return value > limit;
});


internals.Number.prototype.less = internals.compare('less', function (value, limit) {

    return value < limit;
});


internals.Number.prototype.multiple = function (base) {

    Hoek.assert(Hoek.isInteger(base), 'multiple must be an integer');
    Hoek.assert(base > 0, 'multiple must be greater than 0');

    return this._test('multiple', base, function (value, state, options) {

        if (value % base === 0) {
            return null;
        }

        return Errors.create('number.multiple', { multiple: base, value: value }, state, options);
    });
};


internals.Number.prototype.integer = function () {

    return this._test('integer', undefined, function (value, state, options) {

        return Hoek.isInteger(value) ? null : Errors.create('number.integer', { value: value }, state, options);
    });
};


internals.Number.prototype.negative = function () {

    return this._test('negative', undefined, function (value, state, options) {

        if (value < 0) {
            return null;
        }

        return Errors.create('number.negative', { value: value }, state, options);
    });
};


internals.Number.prototype.positive = function () {

    return this._test('positive', undefined, function (value, state, options) {

        if (value > 0) {
            return null;
        }

        return Errors.create('number.positive', { value: value }, state, options);
    });
};


internals.precisionRx = /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/;


internals.Number.prototype.precision = function (limit) {

    Hoek.assert(Hoek.isInteger(limit), 'limit must be an integer');
    Hoek.assert(!('precision' in this._flags), 'precision already set');

    var obj = this._test('precision', limit, function (value, state, options){

        var places = value.toString().match(internals.precisionRx);
        var decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
        if (decimals <= limit) {
            return null;
        }

        return Errors.create('number.precision', { limit: limit, value: value }, state, options);
    });

    obj._flags.precision = limit;
    return obj;
};


module.exports = new internals.Number();
