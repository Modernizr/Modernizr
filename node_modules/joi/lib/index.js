// Load modules

var Any = require('./any');
var Cast = require('./cast');
var Ref = require('./ref');


// Declare internals

var internals = {
    alternatives: require('./alternatives'),
    array: require('./array'),
    boolean: require('./boolean'),
    binary: require('./binary'),
    date: require('./date'),
    number: require('./number'),
    object: require('./object'),
    string: require('./string')
};


internals.root = function () {

    var any = new Any();

    var root = any.clone();
    root.any = function () {

        return any;
    };

    root.alternatives = root.alt = function () {

        return arguments.length ? internals.alternatives.try.apply(internals.alternatives, arguments) : internals.alternatives;
    };

    root.array = function () {

        return internals.array;
    };

    root.boolean = root.bool = function () {

        return internals.boolean;
    };

    root.binary = function () {

        return internals.binary;
    };

    root.date = function () {

        return internals.date;
    };

    root.func = function () {

        return internals.object._func();
    };

    root.number = function () {

        return internals.number;
    };

    root.object = function () {

        return arguments.length ? internals.object.keys.apply(internals.object, arguments) : internals.object;
    };

    root.string = function () {

        return internals.string;
    };

    root.ref = function () {

        return Ref.create.apply(null, arguments);
    };

    root.isRef = function (ref) {

        return Ref.isRef(ref);
    };

    root.validate = function (value /*, [schema], [options], callback */) {

        var last = arguments[arguments.length - 1];
        var callback = typeof last === 'function' ? last : null;

        var count = arguments.length - (callback ? 1 : 0);
        if (count === 1) {
            return any.validate(value, callback);
        }

        var options = count === 3 ? arguments[2] : {};
        var schema = root.compile(arguments[1]);

        return schema._validateWithOptions(value, options, callback);
    };

    root.describe = function () {

        var schema = arguments.length ? root.compile(arguments[0]) : any;
        return schema.describe();
    };

    root.compile = function (schema) {

        try {
            return Cast.schema(schema);
        }
        catch (err) {
            if (err.hasOwnProperty('path')) {
                err.message += '(' + err.path + ')';
            }
            throw err;
        }
    };

    root.assert = function (value, schema, message) {

        root.attempt(value, schema, message);
    };

    root.attempt = function (value, schema, message) {

        var result = root.validate(value, schema);
        var error = result.error;
        if (error) {
            if (!message) {
                error.message = error.annotate();
                throw error;
            }

            if (!(message instanceof Error)) {
                error.message = message + ' ' + error.annotate();
                throw error;
            }

            throw message;
        }

        return result.value;
    };

    return root;
};


module.exports = internals.root();
