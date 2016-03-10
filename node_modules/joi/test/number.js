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


describe('number', function () {

    it('fails on boolean', function (done) {

        var schema = Joi.number();
        Helper.validate(schema, [
            [true, false],
            [false, false]
        ], done);
    });

    describe('#validate', function () {

        it('should, by default, allow undefined', function (done) {

            Helper.validate(Joi.number(), [
                [undefined, true]
            ], done);
        });

        it('should, when .required(), deny undefined', function (done) {

            Helper.validate(Joi.number().required(), [
                [undefined, false]
            ], done);
        });

        it('should return false for denied value', function (done) {

            var text = Joi.number().invalid(50);
            text.validate(50, function (err, value) {

                expect(err).to.exist();
                done();
            });
        });

        it('should validate integer', function (done) {

            var t = Joi.number().integer();
            Helper.validate(t, [
                [100, true],
                [0, true],
                [null, false],
                [1.02, false],
                [0.01, false]
            ], done);
        });

        it('should return false for Infinity', function (done) {

            var t = Joi.number();
            Helper.validate(t, [
                [Infinity, false],
                [-Infinity, false]
            ], done);
        });

        it('should return true for allowed Infinity', function (done) {

            var t = Joi.number().allow(Infinity, -Infinity);
            Helper.validate(t, [
                [Infinity, true],
                [-Infinity, true]
            ], done);
        });

        it('can accept string numbers', function (done) {

            var t = Joi.number();
            Helper.validate(t, [
                ['1', true],
                ['100', true],
                ['1e3', true],
                ['1 some text', false],
                ['\t\r', false],
                [' ', false],
                [' 2', true],
                ['\t\r43', true],
                ['43 ', true],
                ['', false]
            ], done);
        });

        it('required validates correctly', function (done) {

            var t = Joi.number().required();
            Helper.validate(t, [
                [NaN, false],
                ['100', true]
            ], done);
        });

        it('converts an object string to a number', function (done) {

            var config = { a: Joi.number() };
            var obj = { a: '123' };

            Joi.compile(config).validate(obj, function (err, value) {

                expect(err).to.not.exist();
                expect(value.a).to.equal(123);
                done();
            });
        });

        it('converts a string to a number', function (done) {

            Joi.number().validate('1', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal(1);
                done();
            });
        });

        it('errors on null', function (done) {

            Joi.number().validate(null, function (err, value) {

                expect(err).to.exist();
                expect(value).to.equal(null);
                done();
            });
        });

        it('should handle combination of min and max', function (done) {

            var rule = Joi.number().min(8).max(10);
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, true],
                [9, true],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, and null allowed', function (done) {

            var rule = Joi.number().min(8).max(10).allow(null);
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, true],
                [9, true],
                [null, true]
            ], done);
        });

        it('should handle combination of min and positive', function (done) {

            var rule = Joi.number().min(-3).positive();
            Helper.validate(rule, [
                [1, true],
                [-2, false],
                [8, true],
                [null, false]
            ], done);
        });

        it('should handle combination of max and positive', function (done) {

            var rule = Joi.number().max(5).positive();
            Helper.validate(rule, [
                [4, true],
                [-2, false],
                [8, false],
                [null, false]
            ], done);
        });

        it('should handle combination of min and negative', function (done) {

            var rule = Joi.number().min(-3).negative();
            Helper.validate(rule, [
                [4, false],
                [-2, true],
                [-4, false],
                [null, false]
            ], done);
        });

        it('should handle combination of negative and positive', function (done) {

            var rule = Joi.number().negative().positive();
            Helper.validate(rule, [
                [4, false],
                [-2, false],
                [0, false],
                [null, false]
            ], done);
        });

        it('should handle combination of negative and allow', function (done) {

            var rule = Joi.number().negative().allow(1);
            Helper.validate(rule, [
                [1, true],
                [-10, true],
                [8, false],
                [0, false],
                [null, false]
            ], done);
        });

        it('should handle combination of positive and allow', function (done) {

            var rule = Joi.number().positive().allow(-1);
            Helper.validate(rule, [
                [1, true],
                [-1, true],
                [8, true],
                [-10, false],
                [null, false]
            ], done);
        });

        it('should handle combination of positive, allow, and null allowed', function (done) {

            var rule = Joi.number().positive().allow(-1).allow(null);
            Helper.validate(rule, [
                [1, true],
                [-1, true],
                [8, true],
                [-10, false],
                [null, true]
            ], done);
        });

        it('should handle combination of negative, allow, and null allowed', function (done) {

            var rule = Joi.number().negative().allow(1).allow(null);
            Helper.validate(rule, [
                [1, true],
                [-10, true],
                [8, false],
                [0, false],
                [null, true]
            ], done);
        });

        it('should handle combination of positive, allow, null allowed, and invalid', function (done) {

            var rule = Joi.number().positive().allow(-1).allow(null).invalid(1);
            Helper.validate(rule, [
                [1, false],
                [-1, true],
                [8, true],
                [-10, false],
                [null, true]
            ], done);
        });

        it('should handle combination of negative, allow, null allowed, and invalid', function (done) {

            var rule = Joi.number().negative().allow(1).allow(null).invalid(-5);
            Helper.validate(rule, [
                [1, true],
                [-10, true],
                [-5, false],
                [8, false],
                [0, false],
                [null, true]
            ], done);
        });

        it('should handle combination of min, max, and allow', function (done) {

            var rule = Joi.number().min(8).max(10).allow(1);
            Helper.validate(rule, [
                [1, true],
                [11, false],
                [8, true],
                [9, true],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, allow, and null allowed', function (done) {

            var rule = Joi.number().min(8).max(10).allow(1).allow(null);
            Helper.validate(rule, [
                [1, true],
                [11, false],
                [8, true],
                [9, true],
                [null, true]
            ], done);
        });

        it('should handle combination of min, max, allow, and invalid', function (done) {

            var rule = Joi.number().min(8).max(10).allow(1).invalid(9);
            Helper.validate(rule, [
                [1, true],
                [11, false],
                [8, true],
                [9, false],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, allow, invalid, and null allowed', function (done) {

            var rule = Joi.number().min(8).max(10).allow(1).invalid(9).allow(null);
            Helper.validate(rule, [
                [1, true],
                [11, false],
                [8, true],
                [9, false],
                [null, true]
            ], done);
        });

        it('should handle combination of min, max, and integer', function (done) {

            var rule = Joi.number().min(8).max(10).integer();
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, true],
                [9, true],
                [9.1, false],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, integer, and allow', function (done) {

            var rule = Joi.number().min(8).max(10).integer().allow(9.1);
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, true],
                [9, true],
                [9.1, true],
                [9.2, false],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, integer, allow, and invalid', function (done) {

            var rule = Joi.number().min(8).max(10).integer().allow(9.1).invalid(8);
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, false],
                [9, true],
                [9.1, true],
                [9.2, false],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, integer, allow, invalid, and null allowed', function (done) {

            var rule = Joi.number().min(8).max(10).integer().allow(9.1).invalid(8).allow(null);
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, false],
                [9, true],
                [9.1, true],
                [9.2, false],
                [null, true]
            ], done);
        });

        it('should handle limiting the number of decimal places', function (done) {

            var rule = Joi.number().precision(1).options({ convert: false });
            Helper.validate(rule, [
                [1, true],
                [9.1, true],
                [9.21, false],
                [9.9999, false],
                [9.999e99, true],
                [9.9e-99, false],
                [9.9e3, true],
                [null, false]
            ], done);
        });

        it('should handle combination of min, max, integer, allow, invalid, null allowed and precision', function (done) {

            var rule = Joi.number().min(8).max(10).integer().allow(9.1).invalid(8).allow(null).precision(1).options({ convert: false });
            Helper.validate(rule, [
                [1, false],
                [11, false],
                [8, false],
                [9, true],
                [9.1, true],
                [9.11, false],
                [9.2, false],
                [9.22, false],
                [null, true]
            ], done);
        });

        it('should handle combination of greater and less', function (done) {

            var rule = Joi.number().greater(5).less(10);
            Helper.validate(rule, [
                [0, false],
                [11, false],
                [5, false],
                [10, false],
                [8, true],
                [5.01, true],
                [9.99, true],
                [null, false]
            ], done);
        });

        it('should handle combination of greater, less, and integer', function (done) {

            var rule = Joi.number().integer().greater(5).less(10);
            Helper.validate(rule, [
                [0, false],
                [11, false],
                [5, false],
                [10, false],
                [6, true],
                [9, true],
                [5.01, false],
                [9.99, false]
            ], done);
        });

        it('should handle combination of greater, less, and null allowed', function (done) {

            var rule = Joi.number().greater(5).less(10).allow(null);
            Helper.validate(rule, [
                [0, false],
                [11, false],
                [5, false],
                [10, false],
                [8, true],
                [5.01, true],
                [9.99, true],
                [null, true]
            ], done);
        });

        it('should handle combination of greater, less, invalid, and allow', function (done) {

            var rule = Joi.number().greater(5).less(10).invalid(6).allow(-3);
            Helper.validate(rule, [
                [0, false],
                [11, false],
                [5, false],
                [10, false],
                [6, false],
                [8, true],
                [5.01, true],
                [9.99, true],
                [-3, true],
                [null, false]
            ], done);
        });
    });

    it('should instantiate separate copies on invocation', function (done) {

        var result1 = Joi.number().min(5);
        var result2 = Joi.number().max(5);

        expect(Object.keys(result1)).to.not.equal(Object.keys(result2));
        done();
    });

    it('should show resulting object with #valueOf', function (done) {

        var result = Joi.number().min(5);
        expect(result.valueOf()).to.exist();
        done();
    });

    describe('error message', function () {

        it('should display correctly for int type', function (done) {

            var t = Joi.number().integer();
            Joi.compile(t).validate('1.1', function (err, value) {

                expect(err.message).to.contain('integer');
                done();
            });
        });
    });

    describe('#min', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.number().min('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('supports 64bit numbers', function (done) {

            var schema = Joi.number().min(1394035612500);
            var input = 1394035612552;

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal(input);
                done();
            });
        });

        it('accepts references as min value', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.number().min(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 42, b: 1337 }, true],
                [{ a: 1337, b: 42 }, false],
                [{ a: '1337', b: 42 }, false, null, 'child "b" fails because ["b" must be larger than or equal to 1337]'],
                [{ a: 2.4, b: 4.2 }, true],
                [{ a: 4.2, b: 4.20000001 }, true],
                [{ a: 4.20000001, b: 4.2 }, false],
                [{ a: 4.2, b: 2.4 }, false, null, 'child "b" fails because ["b" must be larger than or equal to 4.2]']
            ], done);
        });

        it('accepts context references as min value', function (done) {

            var schema = Joi.object({ b: Joi.number().min(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 1337 }, true, { context: { a: 42 } }],
                [{ b: 42 }, false, { context: { a: 1337 } }],
                [{ b: 4.2 }, true, { context: { a: 2.4 } }],
                [{ b: 4.20000001 }, true, { context: { a: 4.2 } }],
                [{ b: 4.2 }, false, { context: { a: 4.20000001 } }],
                [{ b: 2.4 }, false, { context: { a: 4.2 } }, 'child "b" fails because ["b" must be larger than or equal to 4.2]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.string(), b: Joi.number().min(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ b: Joi.number().min(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#max', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.number().max('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('accepts references as max value', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.number().max(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 1337, b: 42 }, true],
                [{ a: 42, b: 1337 }, false],
                [{ a: '42', b: 1337 }, false, null, 'child "b" fails because ["b" must be less than or equal to 42]'],
                [{ a: 4.2, b: 2.4 }, true],
                [{ a: 4.2, b: 4.20000001 }, false],
                [{ a: 4.20000001, b: 4.2 }, true],
                [{ a: 2.4, b: 4.2 }, false, null, 'child "b" fails because ["b" must be less than or equal to 2.4]']
            ], done);
        });

        it('accepts context references as max value', function (done) {

            var schema = Joi.object({ b: Joi.number().max(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, true, { context: { a: 1337 } }],
                [{ b: 1337 }, false, { context: { a: 42 } }],
                [{ b: 2.4 }, true, { context: { a: 4.2 } }],
                [{ b: 4.20000001 }, false, { context: { a: 4.2 } }],
                [{ b: 4.2 }, true, { context: { a: 4.20000001 } }],
                [{ b: 4.2 }, false, { context: { a: 2.4 } }, 'child "b" fails because ["b" must be less than or equal to 2.4]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.string(), b: Joi.number().max(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ b: Joi.number().max(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#less', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.number().less('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('accepts references as less value', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.number().less(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 1337, b: 42 }, true],
                [{ a: 42, b: 1337 }, false],
                [{ a: '42', b: 1337 }, false, null, 'child "b" fails because ["b" must be less than 42]'],
                [{ a: 4.2, b: 2.4 }, true],
                [{ a: 4.2, b: 4.20000001 }, false],
                [{ a: 4.20000001, b: 4.2 }, true],
                [{ a: 2.4, b: 4.2 }, false, null, 'child "b" fails because ["b" must be less than 2.4]']
            ], done);
        });

        it('accepts context references as less value', function (done) {

            var schema = Joi.object({ b: Joi.number().less(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, true, { context: { a: 1337 } }],
                [{ b: 1337 }, false, { context: { a: 42 } }],
                [{ b: 2.4 }, true, { context: { a: 4.2 } }],
                [{ b: 4.20000001 }, false, { context: { a: 4.2 } }],
                [{ b: 4.2 }, true, { context: { a: 4.20000001 } }],
                [{ b: 4.2 }, false, { context: { a: 2.4 } }, 'child "b" fails because ["b" must be less than 2.4]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.string(), b: Joi.number().less(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.string(), b: Joi.number().less(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#greater', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.number().greater('a');
            }).to.throw('limit must be a number or reference');
            done();
        });

        it('accepts references as greater value', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.number().greater(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 42, b: 1337 }, true],
                [{ a: 1337, b: 42 }, false],
                [{ a: '1337', b: 42 }, false, null, 'child "b" fails because ["b" must be greater than 1337]'],
                [{ a: 2.4, b: 4.2 }, true],
                [{ a: 4.2, b: 4.20000001 }, true],
                [{ a: 4.20000001, b: 4.2 }, false],
                [{ a: 4.2, b: 2.4 }, false, null, 'child "b" fails because ["b" must be greater than 4.2]']
            ], done);
        });

        it('accepts context references as greater value', function (done) {

            var schema = Joi.object({ b: Joi.number().greater(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 1337 }, true, { context: { a: 42 } }],
                [{ b: 42 }, false, { context: { a: 1337 } }],
                [{ b: 4.2 }, true, { context: { a: 2.4 } }],
                [{ b: 4.20000001 }, true, { context: { a: 4.2 } }],
                [{ b: 4.2 }, false, { context: { a: 4.20000001 } }],
                [{ b: 2.4 }, false, { context: { a: 4.2 } }, 'child "b" fails because ["b" must be greater than 4.2]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.string(), b: Joi.number().greater(Joi.ref('a')) });

            Helper.validate(schema, [
                [{ a: 'abc', b: 42 }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ b: Joi.number().greater(Joi.ref('$a')) });

            Helper.validate(schema, [
                [{ b: 42 }, false, { context: { a: 'abc' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#precision', function () {

        it('converts numbers', function (done) {

            var rule = Joi.number().precision(4);
            Helper.validate(rule, [
                [1.5, true, null, 1.5],
                [0.12345, true, null, 0.1235],
                [123456, true, null, 123456],
                [123456.123456, true, null, 123456.1235],
                ['123456.123456', true, null, 123456.1235],
                ['abc', false],
                [NaN, false]
            ], done);
        });
    });

    describe('#describe', function () {

        it('should describe a minimum of 0', function (done) {

            var schema = Joi.number().min(0);
            expect(schema.describe()).to.deep.equal({
                type: 'number',
                invalids: [Infinity, -Infinity],
                rules: [
                    {
                        name: 'min',
                        arg: 0
                    }
                ]
            });
            done();
        });
    });

    describe('#multiple', function () {

        it('throws when multiple is not a number', function (done) {

            expect(function () {

                Joi.number().multiple('a');
            }).to.throw('multiple must be an integer');
            done();
        });

        it('throws when multiple is 0', function (done) {

            expect(function () {

                Joi.number().multiple(0);
            }).to.throw('multiple must be greater than 0');
            done();
        });

        it('should handle multiples correctly', function (done) {

            var rule = Joi.number().multiple(3);
            Helper.validate(rule, [
                [0, true], // 0 is a multiple of every integer
                [3, true],
                [4, false],
                [9, true],
                ['a', false],
                [9.1, false],
                [8.9, false]
            ], done);
        });
    });
});
