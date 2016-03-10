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


describe('array', function () {

    it('converts a string to an array', function (done) {

        Joi.array().validate('[1,2,3]', function (err, value) {

            expect(err).to.not.exist();
            expect(value.length).to.equal(3);
            done();
        });
    });

    it('errors on non-array string', function (done) {

        Joi.array().validate('{ "something": false }', function (err, value) {

            expect(err).to.exist();
            expect(err.message).to.equal('"value" must be an array');
            done();
        });
    });

    it('errors on number', function (done) {

        Joi.array().validate(3, function (err, value) {

            expect(err).to.exist();
            expect(value).to.equal(3);
            done();
        });
    });

    it('converts a non-array string with number type', function (done) {

        Joi.array().validate('3', function (err, value) {

            expect(err).to.exist();
            expect(value).to.equal('3');
            done();
        });
    });

    it('errors on a non-array string', function (done) {

        Joi.array().validate('asdf', function (err, value) {

            expect(err).to.exist();
            expect(value).to.equal('asdf');
            done();
        });
    });

    describe('#items', function () {

        it('converts members', function (done) {

            var schema = Joi.array().items(Joi.number());
            var input = ['1', '2', '3'];
            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal([1, 2, 3]);
                done();
            });
        });

        it('shows path to errors in array items', function (done) {

            expect(function () {

                Joi.array().items({
                    a: {
                        b: {
                            c: {
                                d: undefined
                            }
                        }
                    }
                });
            }).to.throw(Error, 'Invalid schema content: (0.a.b.c.d)');

            expect(function () {

                Joi.array().items({ foo: 'bar' }, undefined);
            }).to.throw(Error, 'Invalid schema content: (1)');

            done();
        });

        it('allows zero size', function (done) {

            var schema = Joi.object({
                test: Joi.array().items(Joi.object({
                    foo: Joi.string().required()
                }))
            });
            var input = { test: [] };

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('returns the first error when only one inclusion', function (done) {

            var schema = Joi.object({
                test: Joi.array().items(Joi.object({
                    foo: Joi.string().required()
                }))
            });
            var input = { test: [{ foo: 'a' }, { bar: 2 }] };

            schema.validate(input, function (err, value) {

                expect(err.message).to.equal('child "test" fails because ["test" at position 1 fails because [child "foo" fails because ["foo" is required]]]');
                done();
            });
        });

        it('validates multiple types added in two calls', function (done) {

            var schema = Joi.array()
                .items(Joi.number())
                .items(Joi.string());

            Helper.validate(schema, [
                [[1, 2, 3], true],
                [[50, 100, 1000], true],
                [[1, 'a', 5, 10], true],
                [['joi', 'everydaylowprices', 5000], true]
            ], done);
        });

        it('validates multiple types with stripUnknown', function (done) {

            var schema = Joi.array().items(Joi.number(), Joi.string()).options({ stripUnknown: true });

            Helper.validate(schema, [
                [[1, 2, 'a'], true, null, [1, 2, 'a']],
                [[1, { foo: 'bar' }, 'a', 2], true, null, [1, 'a', 2]]
            ], done);
        });

        it('allows forbidden to restrict values', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').forbidden(), Joi.string());
            var input = ['one', 'two', 'three', 'four'];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 3 contains an excluded value');
                done();
            });
        });

        it('validates that a required value exists', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').required(), Joi.string());
            var input = ['one', 'two', 'three'];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" does not contain 1 required value(s)');
                done();
            });
        });

        it('validates that a required value exists with abortEarly = false', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').required(), Joi.string()).options({ abortEarly: false });
            var input = ['one', 'two', 'three'];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" does not contain 1 required value(s)');
                done();
            });
        });

        it('does not re-run required tests that have already been matched', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').required(), Joi.string());
            var input = ['one', 'two', 'three', 'four', 'four', 'four'];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(input);
                done();
            });
        });

        it('does not re-run required tests that have already failed', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').required(), Joi.boolean().required(), Joi.number());
            var input = ['one', 'two', 'three', 'four', 'four', 'four'];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 0 does not match any of the allowed types');
                done();
            });
        });

        it('can require duplicates of the same schema and fail', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').required(), Joi.string().valid('four').required(), Joi.string());
            var input = ['one', 'two', 'three', 'four'];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" does not contain 1 required value(s)');
                done();
            });
        });

        it('can require duplicates of the same schema and pass', function (done) {

            var schema = Joi.array().items(Joi.string().valid('four').required(), Joi.string().valid('four').required(), Joi.string());
            var input = ['one', 'two', 'three', 'four', 'four'];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(input);
                done();
            });
        });

        it('continues to validate after a required match', function (done) {

            var schema = Joi.array().items(Joi.string().required(), Joi.boolean());
            var input = [true, 'one', false, 'two'];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(input);
                done();
            });
        });

        it('can use a label on a required parameter', function (done) {

            var schema = Joi.array().items(Joi.string().required().label('required string'), Joi.boolean());
            var input = [true, false];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" does not contain [required string]');
                done();
            });
        });

        it('can use a label on one required parameter, and no label on another', function (done) {

            var schema = Joi.array().items(Joi.string().required().label('required string'), Joi.string().required(), Joi.boolean());
            var input = [true, false];

            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" does not contain [required string] and 1 other required value(s)');
                done();
            });
        });

        it('can strip matching items', function (done) {

            var schema = Joi.array().items(Joi.string(), Joi.any().strip());
            schema.validate(['one', 'two', 3, 4], function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['one', 'two']);
                done();
            });
        });
    });

    describe('#min', function () {

        it('validates array size', function (done) {

            var schema = Joi.array().min(2);
            Helper.validate(schema, [
                [[1, 2], true],
                [[1], false]
            ], done);
        });

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.array().min('a');
            }).to.throw('limit must be a positive integer');
            done();
        });

        it('throws when limit is not an integer', function (done) {

            expect(function () {

                Joi.array().min(1.2);
            }).to.throw('limit must be a positive integer');
            done();
        });
    });

    describe('#max', function () {

        it('validates array size', function (done) {

            var schema = Joi.array().max(1);
            Helper.validate(schema, [
                [[1, 2], false],
                [[1], true]
            ], done);
        });

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.array().max('a');
            }).to.throw('limit must be a positive integer');
            done();
        });

        it('throws when limit is not an integer', function (done) {

            expect(function () {

                Joi.array().max(1.2);
            }).to.throw('limit must be a positive integer');
            done();
        });
    });

    describe('#length', function () {

        it('validates array size', function (done) {

            var schema = Joi.array().length(2);
            Helper.validate(schema, [
                [[1, 2], true],
                [[1], false]
            ], done);
        });

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.array().length('a');
            }).to.throw('limit must be a positive integer');
            done();
        });

        it('throws when limit is not an integer', function (done) {

            expect(function () {

                Joi.array().length(1.2);
            }).to.throw('limit must be a positive integer');
            done();
        });
    });

    describe('#validate', function () {

        it('should, by default, allow undefined, allow empty array', function (done) {

            Helper.validate(Joi.array(), [
                [undefined, true],
                [[], true]
            ], done);
        });

        it('should, when .required(), deny undefined', function (done) {

            Helper.validate(Joi.array().required(), [
                [undefined, false]
            ], done);
        });

        it('allows empty arrays', function (done) {

            Helper.validate(Joi.array(), [
                [undefined, true],
                [[], true]
            ], done);
        });

        it('excludes values when items are forbidden', function (done) {

            Helper.validate(Joi.array().items(Joi.string().forbidden()), [
                [['2', '1'], false],
                [['1'], false],
                [[2], true]
            ], done);
        });

        it('allows types to be forbidden', function (done) {

            var schema = Joi.array().items(Joi.number().forbidden());

            var n = [1, 2, 'hippo'];
            schema.validate(n, function (err, value) {

                expect(err).to.exist();

                var m = ['x', 'y', 'z'];
                schema.validate(m, function (err2, value2) {

                    expect(err2).to.not.exist();
                    done();
                });
            });
        });

        it('validates array of Numbers', function (done) {

            Helper.validate(Joi.array().items(Joi.number()), [
                [[1, 2, 3], true],
                [[50, 100, 1000], true],
                [['a', 1, 2], false],
                [['1', '2', 4], true]
            ], done);
        });

        it('validates array of mixed Numbers & Strings', function (done) {

            Helper.validate(Joi.array().items(Joi.number(), Joi.string()), [
                [[1, 2, 3], true],
                [[50, 100, 1000], true],
                [[1, 'a', 5, 10], true],
                [['joi', 'everydaylowprices', 5000], true]
            ], done);
        });

        it('validates array of objects with schema', function (done) {

            Helper.validate(Joi.array().items(Joi.object({ h1: Joi.number().required() })), [
                [[{ h1: 1 }, { h1: 2 }, { h1: 3 }], true],
                [[{ h2: 1, h3: 'somestring' }, { h1: 2 }, { h1: 3 }], false],
                [[1, 2, [1]], false]
            ], done);
        });

        it('errors on array of unallowed mixed types (Array)', function (done) {

            Helper.validate(Joi.array().items(Joi.number()), [
                [[1, 2, 3], true],
                [[1, 2, [1]], false]
            ], done);
        });

        it('errors on invalid number rule using includes', function (done) {

            var schema = Joi.object({
                arr: Joi.array().items(Joi.number().integer())
            });

            var input = { arr: [1, 2, 2.1] };
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('child "arr" fails because ["arr" at position 2 fails because ["2" must be an integer]]');
                done();
            });
        });

        it('validates an array within an object', function (done) {

            var schema = Joi.object({
                array: Joi.array().items(Joi.string().min(5), Joi.number().min(3))
            }).options({ convert: false });

            Helper.validate(schema, [
                [{ array: ['12345'] }, true],
                [{ array: ['1'] }, false],
                [{ array: [3] }, true],
                [{ array: ['12345', 3] }, true]
            ], done);
        });

        it('should not change original value', function (done) {

            var schema = Joi.array().items(Joi.number()).unique();
            var input = ['1', '2'];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal([1, 2]);
                expect(input).to.deep.equal(['1', '2']);
                done();
            });
        });

        it('should have multiple errors if abort early is false', function (done) {

            var schema = Joi.array().items(Joi.number(), Joi.object()).items(Joi.boolean().forbidden());
            var input = [1, undefined, true, 'a'];

            Joi.validate(input, schema, { abortEarly: false }, function (err, value) {

                expect(err).to.exist();
                expect(err).to.have.length(4);
                expect(err.details).to.deep.equal([{
                    message: '"value" must not be a sparse array',
                    path: '1',
                    type: 'array.sparse',
                    context: {
                        key: 'value'
                    }
                }, {
                    message: '"value" at position 2 contains an excluded value',
                    path: '2',
                    type: 'array.excludes',
                    context: {
                        pos: 2,
                        key: 'value',
                        value: true
                    }
                }, {
                    message: '"value" at position 3 does not match any of the allowed types',
                    path: '3',
                    type: 'array.includes',
                    context: {
                        pos: 3,
                        key: 'value',
                        value: 'a'
                    }
                }]);
                done();
            });
        });
    });

    describe('#describe', function () {

        it('returns an empty description when no rules are applied', function (done) {

            var schema = Joi.array();
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: false }
            });
            done();
        });

        it('returns an updated description when sparse rule is applied', function (done) {

            var schema = Joi.array().sparse();
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: true }
            });
            done();
        });

        it('returns an items array only if items are specified', function (done) {

            var schema = Joi.array().items().max(5);
            var desc = schema.describe();
            expect(desc.items).to.not.exist();
            done();
        });

        it('returns a recursively defined array of items when specified', function (done) {

            var schema = Joi.array()
                .items(Joi.number(), Joi.string())
                .items(Joi.boolean().forbidden())
                .ordered(Joi.number(), Joi.string())
                .ordered(Joi.string().required());
            var desc = schema.describe();
            expect(desc.items).to.have.length(3);
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: false },
                orderedItems: [{ type: 'number', invalids: [Infinity, -Infinity] }, { type: 'string', invalids: [''] }, { type: 'string', invalids: [''], flags: { presence: 'required' } }],
                items: [{ type: 'number', invalids: [Infinity, -Infinity] }, { type: 'string', invalids: [''] }, { type: 'boolean', flags: { presence: 'forbidden' } }]
            });

            done();
        });
    });

    describe('#unique', function () {

        it('errors if duplicate numbers, strings, objects, binaries, functions, dates and booleans', function (done) {

            var buffer = new Buffer('hello world');
            var func = function () {};
            var now = new Date();
            var schema = Joi.array().sparse().unique();

            Helper.validate(schema, [
                [[2, 2], false],
                [[02, 2], false], // eslint-disable-line no-octal
                [[0x2, 2], false],
                [['duplicate', 'duplicate'], false],
                [[{ a: 'b' }, { a: 'b' }], false],
                [[buffer, buffer], false],
                [[func, func], false],
                [[now, now], false],
                [[true, true], false],
                [[undefined, undefined], false]
            ], done);
        });

        it('ignores duplicates if they are of different types', function (done) {

            var schema = Joi.array().unique();

            Helper.validate(schema, [
                [[2, '2'], true]
            ], done);
        });

        it('validates without duplicates', function (done) {

            var buffer = new Buffer('hello world');
            var buffer2 = new Buffer('Hello world');
            var func = function () {};
            var func2 = function () {};
            var now = new Date();
            var now2 = new Date(+now + 100);
            var schema = Joi.array().unique();

            Helper.validate(schema, [
                [[1, 2], true],
                [['s1', 's2'], true],
                [[{ a: 'b' }, { a: 'c' }], true],
                [[buffer, buffer2], true],
                [[func, func2], true],
                [[now, now2], true],
                [[true, false], true]
            ], done);
        });
    });

    describe('#sparse', function () {

        it('errors on undefined value', function (done) {

            var schema = Joi.array().items(Joi.number());

            Helper.validate(schema, [
                [[undefined], false],
                [[2, undefined], false]
            ], done);
        });

        it('validates on undefined value with sparse', function (done) {

            var schema = Joi.array().items(Joi.number()).sparse();

            Helper.validate(schema, [
                [[undefined], true],
                [[2, undefined], true]
            ], done);
        });

        it('switches the sparse flag', function (done) {

            var schema = Joi.array().sparse();
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: true }
            });
            done();
        });

        it('switches the sparse flag with explicit value', function (done) {

            var schema = Joi.array().sparse(true);
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: true }
            });
            done();
        });

        it('switches the sparse flag back', function (done) {

            var schema = Joi.array().sparse().sparse(false);
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: false }
            });
            done();
        });
    });

    describe('#single', function () {

        it('should allow a single element', function (done) {

            var schema = Joi.array().items(Joi.number()).items(Joi.boolean().forbidden()).single();

            Helper.validate(schema, [
                [[1, 2, 3], true],
                [1, true],
                [['a'], false, null, '"value" at position 0 fails because ["0" must be a number]'],
                ['a', false, null, 'single value of "value" fails because ["0" must be a number]'],
                [true, false, null, 'single value of "value" contains an excluded value']
            ], done);
        });

        it('should allow a single element with multiple types', function (done) {

            var schema = Joi.array().items(Joi.number(), Joi.string()).single();

            Helper.validate(schema, [
                [[1, 2, 3], true],
                [1, true],
                [[1, 'a'], true],
                ['a', true],
                [true, false, null, 'single value of "value" does not match any of the allowed types']
            ], done);
        });

        it('should allow nested arrays', function (done) {

            var schema = Joi.array().items(Joi.array().items(Joi.number())).single();

            Helper.validate(schema, [
                [[[1], [2], [3]], true],
                [[1, 2, 3], true],
                [[['a']], false, null, '"value" at position 0 fails because ["0" at position 0 fails because ["0" must be a number]]'],
                [['a'], false, null, '"value" at position 0 fails because ["0" must be an array]'],
                ['a', false, null, 'single value of "value" fails because ["0" must be an array]'],
                [1, false, null, 'single value of "value" fails because ["0" must be an array]'],
                [true, false, null, 'single value of "value" fails because ["0" must be an array]']
            ], done);
        });

        it('should allow nested arrays with multiple types', function (done) {

            var schema = Joi.array().items(Joi.array().items(Joi.number(), Joi.boolean())).single();

            Helper.validate(schema, [
                [[[1, true]], true],
                [[1, true], true],
                [[[1, 'a']], false, null, '"value" at position 0 fails because ["0" at position 1 does not match any of the allowed types]'],
                [[1, 'a'], false, null, '"value" at position 0 fails because ["0" must be an array]']
            ], done);
        });

        it('switches the single flag with explicit value', function (done) {

            var schema = Joi.array().single(true);
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: false, single: true }
            });
            done();
        });

        it('switches the single flag back', function (done) {

            var schema = Joi.array().single().single(false);
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'array',
                flags: { sparse: false, single: false }
            });
            done();
        });
    });

    describe('#options', function () {

        it('respects stripUnknown', function (done) {

            var schema = Joi.array().items(Joi.string()).options({ stripUnknown: true });
            schema.validate(['one', 'two', 3, 4, true, false], function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['one', 'two']);
                done();
            });
        });
    });

    describe('#ordered', function () {

        it('shows path to errors in array ordered items', function (done) {

            expect(function () {

                Joi.array().ordered({
                    a: {
                        b: {
                            c: {
                                d: undefined
                            }
                        }
                    }
                });
            }).to.throw(Error, 'Invalid schema content: (0.a.b.c.d)');

            expect(function () {

                Joi.array().ordered({ foo: 'bar' }, undefined);
            }).to.throw(Error, 'Invalid schema content: (1)');

            done();
        });

        it('validates input against items in order', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().required()]);
            var input = ['s1', 2];
            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', 2]);
                done();
            });
        });

        it('validates input with optional item', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().required(), Joi.number()]);
            var input = ['s1', 2, 3];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', 2, 3]);
                done();
            });
        });

        it('validates input without optional item', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().required(), Joi.number()]);
            var input = ['s1', 2];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', 2]);
                done();
            });
        });

        it('validates input without optional item', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().required(), Joi.number()]).sparse(true);
            var input = ['s1', 2, undefined];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', 2, undefined]);
                done();
            });
        });

        it('validates input without optional item in a sparse array', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number(), Joi.number().required()]).sparse(true);
            var input = ['s1', undefined, 3];

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', undefined, 3]);
                done();
            });
        });

        it('validates when input matches ordered items and matches regular items', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().required()]).items(Joi.number());
            var input = ['s1', 2, 3, 4, 5];
            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', 2, 3, 4, 5]);
                done();
            });
        });

        it('errors when input does not match ordered items', function (done) {

            var schema = Joi.array().ordered([Joi.number().required(), Joi.string().required()]);
            var input = ['s1', 2];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 0 fails because ["0" must be a number]');
                done();
            });
        });

        it('errors when input has more items than ordered items', function (done) {

            var schema = Joi.array().ordered([Joi.number().required(), Joi.string().required()]);
            var input = [1, 's2', 3];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 2 fails because array must contain at most 2 items');
                done();
            });
        });

        it('errors when input has more items than ordered items with abortEarly = false', function (done) {

            var schema = Joi.array().ordered([Joi.string(), Joi.number()]).options({ abortEarly: false });
            var input = [1, 2, 3, 4, 5];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 0 fails because ["0" must be a string]. "value" at position 2 fails because array must contain at most 2 items. "value" at position 3 fails because array must contain at most 2 items. "value" at position 4 fails because array must contain at most 2 items');
                expect(err.details).to.have.length(4);
                done();
            });
        });

        it('errors when input has less items than ordered items', function (done) {

            var schema = Joi.array().ordered([Joi.number().required(), Joi.string().required()]);
            var input = [1];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" does not contain 1 required value(s)');
                done();
            });
        });

        it('errors when input matches ordered items but not matches regular items', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().required()]).items(Joi.number()).options({ abortEarly: false });
            var input = ['s1', 2, 3, 4, 's5'];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 4 fails because ["4" must be a number]');
                done();
            });
        });

        it('errors when input does not match ordered items but matches regular items', function (done) {

            var schema = Joi.array().ordered([Joi.string(), Joi.number()]).items(Joi.number()).options({ abortEarly: false });
            var input = [1, 2, 3, 4, 5];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 0 fails because ["0" must be a string]');
                done();
            });
        });

        it('errors when input does not match ordered items not matches regular items', function (done) {

            var schema = Joi.array().ordered([Joi.string(), Joi.number()]).items(Joi.string()).options({ abortEarly: false });
            var input = [1, 2, 3, 4, 5];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 0 fails because ["0" must be a string]. "value" at position 2 fails because ["2" must be a string]. "value" at position 3 fails because ["3" must be a string]. "value" at position 4 fails because ["4" must be a string]');
                expect(err.details).to.have.length(4);
                done();
            });
        });

        it('errors but continues when abortEarly is set to false', function (done) {

            var schema = Joi.array().ordered([Joi.number().required(), Joi.string().required()]).options({ abortEarly: false });
            var input = ['s1', 2];
            schema.validate(input, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" at position 0 fails because ["0" must be a number]. "value" at position 1 fails because ["1" must be a string]');
                expect(err.details).to.have.length(2);
                done();
            });
        });

        it('strips item', function (done) {

            var schema = Joi.array().ordered([Joi.string().required(), Joi.number().strip(), Joi.number().required()]);
            var input = ['s1', 2, 3];
            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal(['s1', 3]);
                done();
            });
        });

        it('strips multiple items', function (done) {

            var schema = Joi.array().ordered([Joi.string().strip(), Joi.number(), Joi.number().strip()]);
            var input = ['s1', 2, 3];
            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal([2]);
                done();
            });
        });
    });
});
