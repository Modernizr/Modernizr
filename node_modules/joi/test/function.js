// Load modules

var Code = require('code');
var Lab = require('lab');
var Joi = require('../lib');
var Helper = require('./helper');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('func', function () {

    it('validates a function', function (done) {

        Helper.validate(Joi.func().required(), [
            [function () { }, true],
            ['', false]
        ], done);
    });

    it('validates a function with keys', function (done) {

        var a = function () { };
        a.a = 'abc';

        var b = function () { };
        b.a = 123;

        Helper.validate(Joi.func().keys({ a: Joi.string().required() }).required(), [
            [function () { }, false],
            [a, true],
            [b, false],
            ['', false]
        ], done);
    });

    it('keeps validated value as a function', function (done) {

        var schema = Joi.func().keys({ a: Joi.number() });

        var b = 'abc';
        var value = function () {

            return b;
        };

        value.a = '123';

        schema.validate(value, function (err, validated) {

            expect(validated).to.be.a.function();
            expect(validated()).to.equal('abc');
            expect(validated).to.not.equal(value);
            done();
        });
    });

    it('retains validated value prototype', function (done) {

        var schema = Joi.func().keys({ a: Joi.number() });

        var value = function () {

            this.x = 'o';
        };

        value.prototype.get = function () {

            return this.x;
        };

        schema.validate(value, function (err, validated) {

            expect(validated).to.be.a.function();
            var p = new validated();
            expect(p.get()).to.equal('o');
            expect(validated).to.not.equal(value);
            done();
        });
    });

    it('keeps validated value as a function (no clone)', function (done) {

        var schema = Joi.func();

        var b = 'abc';
        var value = function () {

            return b;
        };

        value.a = '123';

        schema.validate(value, function (err, validated) {

            expect(validated).to.be.a.function();
            expect(validated()).to.equal('abc');
            expect(validated).to.equal(value);
            done();
        });
    });
});
