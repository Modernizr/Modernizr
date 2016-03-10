// Load modules

var Code = require('code');
var Joi = require('../');


// Declare internals

var internals = {};


// Test shortcuts

var expect = Code.expect;


exports.validate = function (schema, config, callback) {

    return exports.validateOptions(schema, config, null, callback);
};


exports.validateOptions = function (schema, config, options, callback) {

    var compiled = Joi.compile(schema);
    for (var i = 0, il = config.length; i < il; ++i) {

        var item = config[i];
        var result = Joi.validate(item[0], compiled, item[2] || options);

        var err = result.error;
        var value = result.value;

        if (err !== null && item[1]) {
            console.log(err);
        }

        if (err === null && !item[1]) {
            console.log(item[0]);
        }

        expect(err === null).to.equal(item[1]);

        if (item.length >= 4) {
            var comparator = item[3];
            if (item[1]) {
                expect(value).to.deep.equal(comparator);
            }
            else {
                if (comparator instanceof RegExp) {
                    expect(err.message).to.match(comparator);
                }
                else {
                    expect(err.message).to.deep.equal(comparator);
                }
            }
        }
    }

    if (callback) {
        callback();
    }
};
