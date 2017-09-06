// Load modules

var Lab = require('lab');
var Code = require('code');
var Joi = require('../lib');
var Helper = require('./helper');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('boolean', function () {

    it('converts a string to a boolean', function (done) {

        Joi.boolean().validate('true', function (err, value) {

            expect(err).to.not.exist();
            expect(value).to.equal(true);
            done();
        });
    });

    it('errors on a number', function (done) {

        Joi.boolean().validate(1, function (err, value) {

            expect(err).to.exist();
            expect(value).to.equal(1);
            done();
        });
    });

    describe('#validate', function () {

        it('converts string values and validates', function (done) {

            var rule = Joi.boolean();
            Helper.validate(rule, [
                ['1234', false],
                [false, true],
                [true, true],
                [null, false],
                ['on', true],
                ['off', true],
                ['true', true],
                ['false', true],
                ['yes', true],
                ['no', true]
            ], done);
        });

        it('should handle work with required', function (done) {

            var rule = Joi.boolean().required();
            Helper.validate(rule, [
                ['1234', false],
                ['true', true],
                [false, true],
                [true, true],
                [null, false]
            ], done);
        });

        it('should handle work with allow', function (done) {

            var rule = Joi.boolean().allow(false);
            Helper.validate(rule, [
                ['1234', false],
                [false, true],
                [null, false]
            ], done);
        });

        it('should handle work with invalid', function (done) {

            var rule = Joi.boolean().invalid(false);
            Helper.validate(rule, [
                ['1234', false],
                [false, false],
                [true, true],
                [null, false]
            ], done);
        });

        it('should handle work with invalid and null allowed', function (done) {

            var rule = Joi.boolean().invalid(false).allow(null);
            Helper.validate(rule, [
                ['1234', false],
                [false, false],
                [true, true],
                [null, true]
            ], done);
        });

        it('should handle work with allow and invalid', function (done) {

            var rule = Joi.boolean().invalid(true).allow(false);
            Helper.validate(rule, [
                ['1234', false],
                [false, true],
                [true, false],
                [null, false]
            ], done);
        });

        it('should handle work with allow, invalid, and null allowed', function (done) {

            var rule = Joi.boolean().invalid(true).allow(false).allow(null);
            Helper.validate(rule, [
                ['1234', false],
                [false, true],
                [true, false],
                [null, true]
            ], done);
        });
    });
});
