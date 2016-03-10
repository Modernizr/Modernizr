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


describe('date', function () {

    it('fails on boolean', function (done) {

        var schema = Joi.date();
        Helper.validate(schema, [
            [true, false],
            [false, false]
        ], done);
    });

    it('matches specific date', function (done) {

        var now = Date.now();
        Joi.date().valid(new Date(now)).validate(new Date(now), function (err, value) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('errors on invalid input and convert disabled', function (done) {

        Joi.date().options({ convert: false }).validate('1-1-2013 UTC', function (err, value) {

            expect(err).to.exist();
            expect(err.message).to.equal('"value" must be a number of milliseconds or valid date string');
            done();
        });
    });

    it('validates date', function (done) {

        Joi.date().validate(new Date(), function (err, value) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('validates millisecond date as a string', function (done) {

        var now = new Date();
        var mili = now.getTime();

        Joi.date().validate(mili.toString(), function (err, value) {

            expect(err).to.not.exist();
            expect(value).to.deep.equal(now);
            done();
        });
    });

    describe('#validate', function () {

        describe('min', function () {

            it('validates min', function (done) {

                Helper.validate(Joi.date().min('1-1-2000 UTC'), [
                    ['1-1-2001 UTC', true],
                    ['1-1-2000 UTC', true],
                    [0, false],
                    ['0', false],
                    ['-1', false],
                    ['1-1-1999 UTC', false]
                ], done);
            });

            it('accepts "now" as the min date', function (done) {

                var future = new Date(Date.now() + 1000000);

                Joi.date().min('now').validate(future, function (err, value) {

                    expect(err).to.not.exist();
                    expect(value).to.deep.equal(future);
                    done();
                });
            });

            it('errors if .min("now") is used with a past date', function (done) {

                var past = new Date(Date.now() - 1000000);

                Joi.date().min('now').validate(past, function (err, value) {

                    expect(err).to.exist();
                    done();
                });
            });

            it('accepts references as min date', function (done) {

                var schema = Joi.object({ a: Joi.date(), b: Joi.date().min(Joi.ref('a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ a: now, b: now }, true],
                    [{ a: now, b: now + 1e3 }, true],
                    [{ a: now, b: now - 1e3 }, false]
                ], done);
            });

            it('accepts context references as min date', function (done) {

                var schema = Joi.object({ b: Joi.date().min(Joi.ref('$a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ b: now }, true, { context: { a: now } }],
                    [{ b: now + 1e3 }, true, { context: { a: now } }],
                    [{ b: now - 1e3 }, false, { context: { a: now } }]
                ], done);
            });

            it('errors if reference is not a date', function (done) {

                var schema = Joi.object({ a: Joi.string(), b: Joi.date().min(Joi.ref('a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ a: 'abc', b: now }, false, null, 'child "b" fails because ["b" references "a" which is not a date]'],
                    [{ a: '123', b: now }, true],
                    [{ a: (now + 1e3).toString(), b: now }, false, null, /^child "b" fails because \["b" must be larger than or equal to/]
                ], done);
            });

            it('errors if context reference is not a date', function (done) {

                var schema = Joi.object({ b: Joi.date().min(Joi.ref('$a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ b: now }, false, { context: { a: 'abc' } }, 'child "b" fails because ["b" references "a" which is not a date]'],
                    [{ b: now }, false, { context: { a: (now + 1e3).toString() } }, /^child "b" fails because \["b" must be larger than or equal to/]
                ], done);
            });
        });

        describe('max', function () {

            it('validates max', function (done) {

                Helper.validate(Joi.date().max('1-1-1970 UTC'), [
                    ['1-1-1971 UTC', false],
                    ['1-1-1970 UTC', true],
                    [0, true],
                    [1, false],
                    ['0', true],
                    ['-1', true],
                    ['1-1-2014 UTC', false]
                ], done);
            });

            it('accepts "now" as the max date', function (done) {

                var past = new Date(Date.now() - 1000000);

                Joi.date().max('now').validate(past, function (err, value) {

                    expect(err).to.not.exist();
                    expect(value).to.deep.equal(past);
                    done();
                });
            });

            it('errors if .max("now") is used with a future date', function (done) {

                var future = new Date(Date.now() + 1000000);

                Joi.date().max('now').validate(future, function (err, value) {

                    expect(err).to.exist();
                    done();
                });
            });

            it('accepts references as max date', function (done) {

                var schema = Joi.object({ a: Joi.date(), b: Joi.date().max(Joi.ref('a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ a: now, b: now }, true],
                    [{ a: now, b: now + 1e3 }, false],
                    [{ a: now, b: now - 1e3 }, true]
                ], done);
            });

            it('accepts references as max date', function (done) {

                var schema = Joi.object({ b: Joi.date().max(Joi.ref('$a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ b: now }, true, { context: { a: now } }],
                    [{ b: now + 1e3 }, false, { context: { a: now } }],
                    [{ b: now - 1e3 }, true, { context: { a: now } }]
                ], done);
            });

            it('errors if reference is not a date', function (done) {

                var schema = Joi.object({ a: Joi.string(), b: Joi.date().max(Joi.ref('a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ a: 'abc', b: new Date() }, false, null, 'child "b" fails because ["b" references "a" which is not a date]'],
                    [{ a: '100000000000000', b: now }, true],
                    [{ a: (now - 1e3).toString(), b: now }, false, null, /^child "b" fails because \["b" must be less than or equal to/]
                ], done);
            });

            it('errors if context reference is not a date', function (done) {

                var schema = Joi.object({ b: Joi.date().max(Joi.ref('$a')) });
                var now = Date.now();

                Helper.validate(schema, [
                    [{ b: now }, false, { context: { a: 'abc' } }, 'child "b" fails because ["b" references "a" which is not a date]'],
                    [{ b: now }, true, { context: { a: '100000000000000' } }],
                    [{ b: now }, false, { context: { a: (now - 1e3).toString() } }, /^child "b" fails because \["b" must be less than or equal to/]
                ], done);
            });
        });

        it('validates only valid dates', function (done) {

            Helper.validate(Joi.date(), [
                ['1-1-2013 UTC', true],
                ['not a valid date', false],
                [new Date('not a valid date'), false]
            ], done);
        });

        describe('#iso', function () {

            it('validates isoDate', function (done) {

                Helper.validate(Joi.date().iso(), [
                    ['2013-06-07T14:21:46.295Z', true],
                    ['2013-06-07T14:21:46.295Z0', false],
                    ['2013-06-07T14:21:46.295+07:00', true],
                    ['2013-06-07T14:21:46.295+07:000', false],
                    ['2013-06-07T14:21:46.295-07:00', true],
                    ['2013-06-07T14:21:46Z', true],
                    ['2013-06-07T14:21:46Z0', false],
                    ['2013-06-07T14:21:46+07:00', true],
                    ['2013-06-07T14:21:46-07:00', true],
                    ['2013-06-07T14:21Z', true],
                    ['2013-06-07T14:21+07:00', true],
                    ['2013-06-07T14:21+07:000', false],
                    ['2013-06-07T14:21-07:00', true],
                    ['2013-06-07T14:21Z+7:00', false],
                    ['2013-06-07', true],
                    ['2013-06-07T', false],
                    ['2013-06-07T14:21', true],
                    ['1-1-2013', false]
                ], done);
            });

            it('validates isoDate with a friendly error message', function (done) {

                var schema = { item: Joi.date().iso() };
                Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                    expect(err.message).to.contain('must be a valid ISO 8601 date');
                    done();
                });
            });

            it('validates isoDate after clone', function (done) {

                var schema = { item: Joi.date().iso().clone() };
                Joi.compile(schema).validate({ item: '2013-06-07T14:21:46.295Z' }, function (err, value) {

                    expect(err).to.not.exist();
                    done();
                });
            });
        });

        describe('#format', function () {

            it('validates custom format', function (done) {

                Helper.validate(Joi.date().format('DD#YYYY$MM'), [
                    ['07#2013$06', true],
                    ['2013-06-07', false]
                ], done);
            });

            it('validates several custom formats', function (done) {

                Helper.validate(Joi.date().format(['DD#YYYY$MM', 'YY|DD|MM']), [
                    ['13|07|06', true],
                    ['2013-06-07', false]
                ], done);
            });

            it('fails with bad formats', function (done) {

                expect(function () {

                    Joi.date().format(true);
                }).to.throw('Invalid format.');

                expect(function () {

                    Joi.date().format(['YYYYMMDD', true]);
                }).to.throw('Invalid format.');
                done();
            });
        });
    });
});
