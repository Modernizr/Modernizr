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


describe('object', function () {

    it('converts a json string to an object', function (done) {

        Joi.object().validate('{"hi":true}', function (err, value) {

            expect(err).to.not.exist();
            expect(value.hi).to.equal(true);
            done();
        });
    });

    it('errors on non-object string', function (done) {

        Joi.object().validate('a string', function (err, value) {

            expect(err).to.exist();
            expect(value).to.equal('a string');
            done();
        });
    });

    it('validates an object', function (done) {

        var schema = Joi.object().required();
        Helper.validate(schema, [
            [{}, true],
            [{ hi: true }, true],
            ['', false]
        ], done);
    });

    it('return object reference when no rules specified', function (done) {

        var schema = Joi.object({
            a: Joi.object()
        });

        var item = { x: 5 };
        schema.validate({ a: item }, function (err, value) {

            expect(value.a).to.equal(item);
            done();
        });
    });

    it('retains ignored values', function (done) {

        var schema = Joi.object();
        schema.validate({ a: 5 }, function (err, value) {

            expect(value.a).to.equal(5);
            done();
        });
    });

    it('retains skipped values', function (done) {

        var schema = Joi.object({ b: 5 }).unknown(true);
        schema.validate({ b: '5', a: 5 }, function (err, value) {

            expect(value.a).to.equal(5);
            expect(value.b).to.equal(5);
            done();
        });
    });

    it('allows any key when schema is undefined', function (done) {

        Joi.object().validate({ a: 4 }, function (err, value) {

            expect(err).to.not.exist();

            Joi.object(undefined).validate({ a: 4 }, function (err2, value2) {

                expect(err2).to.not.exist();
                done();
            });
        });
    });

    it('allows any key when schema is null', function (done) {

        Joi.object(null).validate({ a: 4 }, function (err, value) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('throws on invalid object schema', function (done) {

        expect(function () {

            Joi.object(4);
        }).to.throw('Object schema must be a valid object');
        done();
    });

    it('throws on joi object schema', function (done) {

        expect(function () {

            Joi.object(Joi.object());
        }).to.throw('Object schema cannot be a joi schema');
        done();
    });

    it('skips conversion when value is undefined', function (done) {

        Joi.object({ a: Joi.object() }).validate(undefined, function (err, value) {

            expect(err).to.not.exist();
            expect(value).to.not.exist();
            done();
        });
    });

    it('errors on array', function (done) {

        Joi.object().validate([1, 2, 3], function (err, value) {

            expect(err).to.exist();
            done();
        });
    });

    it('should prevent extra keys from existing by default', function (done) {

        var schema = Joi.object({ item: Joi.string().required() }).required();
        Helper.validate(schema, [
            [{ item: 'something' }, true],
            [{ item: 'something', item2: 'something else' }, false],
            ['', false]
        ], done);
    });

    it('should validate count when min is set', function (done) {

        var schema = Joi.object().min(3);
        Helper.validate(schema, [
            [{ item: 'something' }, false],
            [{ item: 'something', item2: 'something else' }, false],
            [{ item: 'something', item2: 'something else', item3: 'something something else' }, true],
            ['', false]
        ], done);
    });

    it('should validate count when max is set', function (done) {

        var schema = Joi.object().max(2);
        Helper.validate(schema, [
            [{ item: 'something' }, true],
            [{ item: 'something', item2: 'something else' }, true],
            [{ item: 'something', item2: 'something else', item3: 'something something else' }, false],
            ['', false]
        ], done);
    });

    it('should validate count when min and max is set', function (done) {

        var schema = Joi.object().max(3).min(2);
        Helper.validate(schema, [
            [{ item: 'something' }, false],
            [{ item: 'something', item2: 'something else' }, true],
            [{ item: 'something', item2: 'something else', item3: 'something something else' }, true],
            [{ item: 'something', item2: 'something else', item3: 'something something else', item4: 'item4' }, false],
            ['', false]
        ], done);
    });

    it('should validate count when length is set', function (done) {

        var schema = Joi.object().length(2);
        Helper.validate(schema, [
            [{ item: 'something' }, false],
            [{ item: 'something', item2: 'something else' }, true],
            [{ item: 'something', item2: 'something else', item3: 'something something else' }, false],
            ['', false]
        ], done);
    });

    it('should validate constructor when type is set', function (done) {

        var schema = Joi.object().type(RegExp);
        Helper.validate(schema, [
            [{ item: 'something' }, false],
            ['', false],
            [new Date(), false],
            [/abcd/, true],
            [new RegExp(), true]
        ], done);
    });

    it('should traverse an object and validate all properties in the top level', function (done) {

        var schema = Joi.object({
            num: Joi.number()
        });

        Helper.validate(schema, [
            [{ num: 1 }, true],
            [{ num: [1, 2, 3] }, false]
        ], done);
    });

    it('should traverse an object and child objects and validate all properties', function (done) {

        var schema = Joi.object({
            num: Joi.number(),
            obj: Joi.object({
                item: Joi.string()
            })
        });

        Helper.validate(schema, [
            [{ num: 1 }, true],
            [{ num: [1, 2, 3] }, false],
            [{ num: 1, obj: { item: 'something' } }, true],
            [{ num: 1, obj: { item: 123 } }, false]
        ], done);
    });

    it('should traverse an object several levels', function (done) {

        var schema = Joi.object({
            obj: Joi.object({
                obj: Joi.object({
                    obj: Joi.object({
                        item: Joi.boolean()
                    })
                })
            })
        });

        Helper.validate(schema, [
            [{ num: 1 }, false],
            [{ obj: {} }, true],
            [{ obj: { obj: {} } }, true],
            [{ obj: { obj: { obj: {} } } }, true],
            [{ obj: { obj: { obj: { item: true } } } }, true],
            [{ obj: { obj: { obj: { item: 10 } } } }, false]
        ], done);
    });

    it('should traverse an object several levels with required levels', function (done) {

        var schema = Joi.object({
            obj: Joi.object({
                obj: Joi.object({
                    obj: Joi.object({
                        item: Joi.boolean()
                    })
                }).required()
            })
        });

        Helper.validate(schema, [
            [null, false],
            [undefined, true],
            [{}, true],
            [{ obj: {} }, false],
            [{ obj: { obj: {} } }, true],
            [{ obj: { obj: { obj: {} } } }, true],
            [{ obj: { obj: { obj: { item: true } } } }, true],
            [{ obj: { obj: { obj: { item: 10 } } } }, false]
        ], done);
    });

    it('should traverse an object several levels with required levels (without Joi.obj())', function (done) {

        var schema = {
            obj: {
                obj: {
                    obj: {
                        item: Joi.boolean().required()
                    }
                }
            }
        };

        Helper.validate(schema, [
            [null, false],
            [undefined, true],
            [{}, true],
            [{ obj: {} }, true],
            [{ obj: { obj: {} } }, true],
            [{ obj: { obj: { obj: {} } } }, false],
            [{ obj: { obj: { obj: { item: true } } } }, true],
            [{ obj: { obj: { obj: { item: 10 } } } }, false]
        ], done);
    });

    it('errors on unknown keys when functions allows', function (done) {

        var schema = Joi.object({ a: Joi.number() }).options({ skipFunctions: true });
        var obj = { a: 5, b: 'value' };
        schema.validate(obj, function (err, value) {

            expect(err).to.exist();
            done();
        });
    });

    it('validates both valid() and with()', function (done) {

        var schema = Joi.object({
            first: Joi.valid('value'),
            second: Joi.any()
        }).with('first', 'second');

        Helper.validate(schema, [
            [{ first: 'value' }, false]
        ], done);
    });

    it('validates referenced arrays in valid()', function (done) {

        var schema = Joi.object({
            foo: Joi.valid(Joi.ref('$x'))
        });

        Helper.validate(schema, [
            [{ foo: 'bar' }, true, { context: { x: 'bar' } }],
            [{ foo: 'bar' }, true, { context: { x: ['baz', 'bar'] } }],
            [{ foo: 'bar' }, false, { context: { x: 'baz' } }],
            [{ foo: 'bar' }, false, { context: { x: ['baz', 'qux'] } }],
            [{ foo: 'bar' }, false]
        ], done);
    });

    it('errors on unknown nested keys with the correct path', function (done) {

        var schema = Joi.object({ a: Joi.object().keys({}) });
        var obj = { a: { b: 'value' } };
        schema.validate(obj, function (err, value) {

            expect(err).to.exist();
            expect(err.details[0].path).to.equal('a.b');
            done();
        });
    });

    it('errors on unknown nested keys with the correct path at the root level', function (done) {

        var schema = Joi.object({ a: Joi.object().keys({}) });
        var obj = { c: 'hello' };
        schema.validate(obj, function (err, value) {

            expect(err).to.exist();
            expect(err.details[0].path).to.equal('c');
            done();
        });
    });

    it('should work on prototype-less objects', function (done) {

        var input = Object.create(null);
        var schema = Joi.object().keys({
            a: Joi.number()
        });

        input.a = 1337;

        Joi.validate(input, schema, function (err) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('should be able to use rename safely with a fake hasOwnProperty', function (done) {

        var input = { a: 1, hasOwnProperty: 'foo' };
        var schema = Joi.object().rename('b', 'a');

        Joi.validate(input, schema, function (err) {

            expect(err.message).to.equal('"value" cannot rename child "b" because override is disabled and target "a" exists');
            done();
        });
    });

    it('should be able to use object.with() safely with a fake hasOwnProperty', function (done) {

        var input = { a: 1, hasOwnProperty: 'foo' };
        var schema = Joi.object({ a: 1 }).with('a', 'b');

        Joi.validate(input, schema, function (err) {

            expect(err.message).to.equal('"hasOwnProperty" is not allowed. "a" missing required peer "b"');
            done();
        });
    });

    describe('#keys', function () {

        it('allows any key', function (done) {

            var a = Joi.object({ a: 4 });
            var b = a.keys();
            a.validate({ b: 3 }, function (err, value) {

                expect(err).to.exist();
                b.validate({ b: 3 }, function (err2, value2) {

                    expect(err2).to.not.exist();
                    done();
                });
            });
        });

        it('forbids all keys', function (done) {

            var a = Joi.object();
            var b = a.keys({});
            a.validate({ b: 3 }, function (err, value) {

                expect(err).to.not.exist();
                b.validate({ b: 3 }, function (err2, value2) {

                    expect(err2).to.exist();
                    done();
                });
            });
        });

        it('adds to existing keys', function (done) {

            var a = Joi.object({ a: 1 });
            var b = a.keys({ b: 2 });
            a.validate({ a: 1, b: 2 }, function (err, value) {

                expect(err).to.exist();
                b.validate({ a: 1, b: 2 }, function (err2, value2) {

                    expect(err2).to.not.exist();
                    done();
                });
            });
        });

        it('overrides existing keys', function (done) {

            var a = Joi.object({ a: 1 });
            var b = a.keys({ a: Joi.string() });

            Helper.validate(a, [
                [{ a: 1 }, true, null, { a: 1 }],
                [{ a: '1' }, true, null, { a: 1 }],
                [{ a: '2' }, false, null, 'child "a" fails because ["a" must be one of [1]]']
            ], function () {

                Helper.validate(b, [
                    [{ a: 1 }, false, null, 'child "a" fails because ["a" must be a string]'],
                    [{ a: '1' }, true, null, { a: '1' }]
                ], done);
            });
        });

        it('strips keys flagged with strip', function (done) {

            var schema = Joi.object({
                a: Joi.string().strip(),
                b: Joi.string()
            });
            schema.validate({ a: 'test', b: 'test' }, function (err, value) {

                expect(err).to.not.exist();
                expect(value.a).to.not.exist();
                expect(value.b).to.equal('test');
                done();
            });
        });

        it('does not alter the original object when stripping keys', function (done) {

            var schema = Joi.object({
                a: Joi.string().strip(),
                b: Joi.string()
            });

            var valid = {
                a: 'test',
                b: 'test'
            };

            schema.validate(valid, function (err, value) {

                expect(err).to.not.exist();
                expect(value.a).to.not.exist();
                expect(valid.a).to.equal('test');
                expect(value.b).to.equal('test');
                expect(valid.b).to.equal('test');
                done();
            });
        });

        it('should strip from an alternative', function (done) {

            var schema = Joi.object({
                a: [Joi.boolean().strip()]
            });

            var valid = {
                a: true
            };

            schema.validate(valid, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal({});
                done();
            });
        });
    });

    describe('#unknown', function () {

        it('allows local unknown without applying to children', function (done) {

            var schema = Joi.object({
                a: {
                    b: Joi.number()
                }
            }).unknown();

            Helper.validate(schema, [
                [{ a: { b: 5 } }, true],
                [{ a: { b: 'x' } }, false],
                [{ a: { b: 5 }, c: 'ignore' }, true],
                [{ a: { b: 5, c: 'ignore' } }, false]
            ], done);
        });

        it('forbids local unknown without applying to children', function (done) {

            var schema = Joi.object({
                a: Joi.object({
                    b: Joi.number()
                }).unknown()
            }).options({ allowUnknown: false });

            Helper.validate(schema, [
                [{ a: { b: 5 } }, true],
                [{ a: { b: 'x' } }, false],
                [{ a: { b: 5 }, c: 'ignore' }, false],
                [{ a: { b: 5, c: 'ignore' } }, true]
            ], done);
        });
    });

    describe('#rename', function () {

        it('allows renaming multiple times with multiple enabled', function (done) {

            var schema = Joi.object({
                test: Joi.string()
            }).rename('test1', 'test').rename('test2', 'test', { multiple: true });

            Joi.compile(schema).validate({ test1: 'a', test2: 'b' }, function (err, value) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('errors renaming multiple times with multiple disabled', function (done) {

            var schema = Joi.object({
                test: Joi.string()
            }).rename('test1', 'test').rename('test2', 'test');

            Joi.compile(schema).validate({ test1: 'a', test2: 'b' }, function (err, value) {

                expect(err.message).to.equal('"value" cannot rename child "test2" because multiple renames are disabled and another key was already renamed to "test"');
                done();
            });
        });

        it('errors multiple times when abortEarly is false', function (done) {

            Joi.object().rename('a', 'b').rename('c', 'b').rename('d', 'b').options({ abortEarly: false }).validate({ a: 1, c: 1, d: 1 }, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" cannot rename child "c" because multiple renames are disabled and another key was already renamed to "b". "value" cannot rename child "d" because multiple renames are disabled and another key was already renamed to "b"');
                done();
            });
        });

        it('aliases a key', function (done) {

            var schema = Joi.object({
                a: Joi.number(),
                b: Joi.number()
            }).rename('a', 'b', { alias: true });

            var obj = { a: 10 };

            Joi.compile(schema).validate(obj, function (err, value) {

                expect(err).to.not.exist();
                expect(value.a).to.equal(10);
                expect(value.b).to.equal(10);
                done();
            });
        });

        it('with override disabled should not allow overwriting existing value', function (done) {

            var schema = Joi.object({
                test1: Joi.string()
            }).rename('test', 'test1');

            schema.validate({ test: 'b', test1: 'a' }, function (err, value) {

                expect(err.message).to.equal('"value" cannot rename child "test" because override is disabled and target "test1" exists');
                done();
            });
        });

        it('with override enabled should allow overwriting existing value', function (done) {

            var schema = Joi.object({
                test1: Joi.string()
            }).rename('test', 'test1', { override: true });

            schema.validate({ test: 'b', test1: 'a' }, function (err, value) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('renames when data is nested in an array via items', function (done) {

            var schema = {
                arr: Joi.array().items(Joi.object({
                    one: Joi.string(),
                    two: Joi.string()
                }).rename('uno', 'one').rename('dos', 'two'))
            };

            var data = { arr: [{ uno: '1', dos: '2' }] };
            Joi.object(schema).validate(data, function (err, value) {

                expect(err).to.not.exist();
                expect(value.arr[0].one).to.equal('1');
                expect(value.arr[0].two).to.equal('2');
                done();
            });
        });

        it('applies rename and validation in the correct order regardless of key order', function (done) {

            var schema1 = Joi.object({
                a: Joi.number()
            }).rename('b', 'a');

            var input1 = { b: '5' };

            schema1.validate(input1, function (err1, value1) {

                expect(err1).to.not.exist();
                expect(value1.b).to.not.exist();
                expect(value1.a).to.equal(5);

                var schema2 = Joi.object({ a: Joi.number(), b: Joi.any() }).rename('b', 'a');
                var input2 = { b: '5' };

                schema2.validate(input2, function (err2, value2) {

                    expect(err2).to.not.exist();
                    expect(value2.b).to.not.exist();
                    expect(value2.a).to.equal(5);

                    done();
                });
            });
        });

        it('sets the default value after key is renamed', function (done) {

            var schema = Joi.object({
                foo2: Joi.string().default('test')
            }).rename('foo', 'foo2');

            var input = {};

            Joi.validate(input, schema, function (err, value) {

                expect(err).to.not.exist();
                expect(value.foo2).to.equal('test');

                done();
            });
        });

        it('should be able to rename keys that are empty strings', function (done) {

            var schema = Joi.object().rename('', 'notEmpty');
            var input = {
                '': 'something'
            };

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value['']).to.not.exist();
                expect(value.notEmpty).to.equal('something');
                done();
            });
        });

        it('should not create new keys when they key in question does not exist', function (done) {

            var schema = Joi.object().rename('b', '_b');

            var input = {
                a: 'something'
            };

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(Object.keys(value)).to.include('a');
                expect(value.a).to.equal('something');
                done();
            });
        });

        it('should remove a key with override if from does not exist', function (done) {

            var schema = Joi.object().rename('b', 'a', { override: true });

            var input = {
                a: 'something'
            };

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal({});
                done();
            });
        });

        it('should ignore a key with ignoredUndefined if from does not exist', function (done){

            var schema = Joi.object().rename('b', 'a', { ignoreUndefined: true });

            var input = {
                a: 'something'
            };

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal({ a: 'something' });
                done();
            });
        });

        it('shouldn\'t delete a key with override and ignoredUndefined if from does not exist', function (done){

            var schema = Joi.object().rename('b', 'a', { ignoreUndefined: true, override: true });

            var input = {
                a: 'something'
            };

            schema.validate(input, function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.deep.equal({ a: 'something' });
                done();
            });
        });
    });

    describe('#describe', function () {

        it('return empty description when no schema defined', function (done) {

            var schema = Joi.object();
            var desc = schema.describe();
            expect(desc).to.deep.equal({
                type: 'object'
            });
            done();
        });

        it('respects the shallow parameter', function (done) {

            var schema = Joi.object({
                name: Joi.string(),
                child: Joi.object({
                    name: Joi.string()
                })
            });

            expect(Object.keys(schema.describe(true))).to.not.include('children');
            expect(Object.keys(schema.describe())).to.include('children');

            done();
        });

        it('describes patterns', function (done) {

            var schema = Joi.object({
                a: Joi.string()
            }).pattern(/\w\d/i, Joi.boolean());

            expect(schema.describe()).to.deep.equal({
                type: 'object',
                children: {
                    a: {
                        type: 'string',
                        invalids: ['']
                    }
                },
                patterns: [
                    {
                        regex: '/\\w\\d/i',
                        rule: {
                            type: 'boolean'
                        }
                    }
                ]
            });

            done();
        });
    });

    describe('#length', function () {

        it('throws when length is not a number', function (done) {

            expect(function () {

                Joi.object().length('a');
            }).to.throw('limit must be a positive integer');
            done();
        });
    });

    describe('#min', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.object().min('a');
            }).to.throw('limit must be a positive integer');
            done();
        });
    });

    describe('#max', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.object().max('a');
            }).to.throw('limit must be a positive integer');
            done();
        });
    });

    describe('#pattern', function () {

        it('shows path to errors in schema', function (done) {

            expect(function () {

                Joi.object().pattern(/.*/, {
                    a: {
                        b: {
                            c: {
                                d: undefined
                            }
                        }
                    }
                });
            }).to.throw(Error, 'Invalid schema content: (a.b.c.d)');

            expect(function () {

                Joi.object().pattern(/.*/, function () {

                });
            }).to.throw(Error, 'Invalid schema content: ');

            done();
        });

        it('validates unknown keys using a pattern', function (done) {

            var schema = Joi.object({
                a: Joi.number()
            }).pattern(/\d+/, Joi.boolean()).pattern(/\w\w+/, 'x');

            Joi.validate({ bb: 'y', 5: 'x' }, schema, { abortEarly: false }, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('child "5" fails because ["5" must be a boolean]. child "bb" fails because ["bb" must be one of [x]]');

                Helper.validate(schema, [
                    [{ a: 5 }, true],
                    [{ a: 'x' }, false],
                    [{ b: 'x' }, false],
                    [{ bb: 'x' }, true],
                    [{ 5: 'x' }, false],
                    [{ 5: false }, true],
                    [{ 5: undefined }, true]
                ], done);
            });
        });

        it('validates unknown keys using a pattern (nested)', function (done) {

            var schema = {
                x: Joi.object({
                    a: Joi.number()
                }).pattern(/\d+/, Joi.boolean()).pattern(/\w\w+/, 'x')
            };

            Joi.validate({ x: { bb: 'y', 5: 'x' } }, schema, { abortEarly: false }, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('child "x" fails because [child "5" fails because ["5" must be a boolean], child "bb" fails because ["bb" must be one of [x]]]');
                done();
            });
        });

        it('errors when using a pattern on empty schema with unknown(false) and pattern mismatch', function (done) {

            var schema = Joi.object().pattern(/\d/, Joi.number()).unknown(false);

            Joi.validate({ a: 5 }, schema, { abortEarly: false }, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"a" is not allowed');
                done();
            });
        });

        it('removes global flag from patterns', function (done) {

            var schema = Joi.object().pattern(/a/g, Joi.number());

            Joi.validate({ a1: 5, a2: 6 }, schema, function (err, value) {

                expect(err).to.not.exist();
                done();
            });
        });
    });

    describe('#with', function () {

        it('should throw an error when a parameter is not a string', function (done) {

            try {
                Joi.object().with({});
                var error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);

            try {
                Joi.object().with(123);
                error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);
            done();
        });

        it('should validate correctly when key is an empty string', function (done) {

            var schema = Joi.object().with('', 'b');
            Helper.validate(schema, [
                [{ c: 'hi', d: 'there' }, true]
            ]);
            done();
        });
    });

    describe('#without', function () {

        it('should throw an error when a parameter is not a string', function (done) {

            try {
                Joi.object().without({});
                var error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);

            try {
                Joi.object().without(123);
                error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);


            done();
        });

        it('should validate correctly when key is an empty string', function (done) {

            var schema = Joi.object().without('', 'b');
            Helper.validate(schema, [
                [{ a: 'hi', b: 'there' }, true]
            ]);
            done();
        });
    });

    describe('#xor', function () {

        it('should throw an error when a parameter is not a string', function (done) {

            try {
                Joi.object().xor({});
                var error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);

            try {
                Joi.object().xor(123);
                error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);
            done();
        });
    });

    describe('#or', function () {

        it('should throw an error when a parameter is not a string', function (done) {

            try {
                Joi.object().or({});
                var error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);

            try {
                Joi.object().or(123);
                error = false;
            }
            catch (e) {
                error = true;
            }
            expect(error).to.equal(true);
            done();
        });

        it('errors multiple levels deep', function (done) {

            Joi.object({
                a: {
                    b: Joi.object().or('x', 'y')
                }
            }).validate({ a: { b: { c: 1 } } }, function (err, value) {

                expect(err).to.exist();
                expect(err.details[0].path).to.equal('a.b');
                expect(err.message).to.equal('child "a" fails because [child "b" fails because ["value" must contain at least one of [x, y]]]');
                done();
            });
        });
    });

    describe('#assert', function () {

        it('shows path to errors in schema', function (done) {

            expect(function () {

                Joi.object().assert('a.b', {
                    a: {
                        b: {
                            c: {
                                d: undefined
                            }
                        }
                    }
                });
            }).to.throw(Error, 'Invalid schema content: (a.b.c.d)');
            done();
        });

        it('shows errors in schema', function (done) {

            expect(function () {

                Joi.object().assert('a.b', undefined);
            }).to.throw(Error, 'Invalid schema content: ');
            done();
        });

        it('validates upwards reference', function (done) {

            var schema = Joi.object({
                a: {
                    b: Joi.string(),
                    c: Joi.number()
                },
                d: {
                    e: Joi.any()
                }
            }).assert(Joi.ref('d/e', { separator: '/' }), Joi.ref('a.c'), 'equal to a.c');

            schema.validate({ a: { b: 'x', c: 5 }, d: { e: 6 } }, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"d.e" validation failed because "d.e" failed to equal to a.c');

                Helper.validate(schema, [
                    [{ a: { b: 'x', c: 5 }, d: { e: 5 } }, true]
                ], done);
            });
        });

        it('validates upwards reference with implicit context', function (done) {

            var schema = Joi.object({
                a: {
                    b: Joi.string(),
                    c: Joi.number()
                },
                d: {
                    e: Joi.any()
                }
            }).assert('d.e', Joi.ref('a.c'), 'equal to a.c');

            schema.validate({ a: { b: 'x', c: 5 }, d: { e: 6 } }, function (err, value) {

                expect(err).to.exist();
                expect(err.message).to.equal('"d.e" validation failed because "d.e" failed to equal to a.c');

                Helper.validate(schema, [
                    [{ a: { b: 'x', c: 5 }, d: { e: 5 } }, true]
                ], done);
            });
        });

        it('throws when context is at root level', function (done) {

            expect(function () {

                Joi.object({
                    a: {
                        b: Joi.string(),
                        c: Joi.number()
                    },
                    d: {
                        e: Joi.any()
                    }
                }).assert('a', Joi.ref('d.e'), 'equal to d.e');
            }).to.throw('Cannot use assertions for root level references - use direct key rules instead');
            done();
        });

        it('allows root level context ref', function (done) {

            expect(function () {

                Joi.object({
                    a: {
                        b: Joi.string(),
                        c: Joi.number()
                    },
                    d: {
                        e: Joi.any()
                    }
                }).assert('$a', Joi.ref('d.e'), 'equal to d.e');
            }).to.not.throw();
            done();
        });

        it('provides a default message for failed assertions', function (done) {

            var schema = Joi.object({
                a: {
                    b: Joi.string(),
                    c: Joi.number()
                },
                d: {
                    e: Joi.any()
                }
            }).assert('d.e', Joi.boolean());

            schema.validate({
                d: {
                    e: []
                }
            }, function (err) {

                expect(err).to.exist();
                expect(err.message).to.equal('"d.e" validation failed because "d.e" failed to pass the assertion test');
                done();
            });
        });
    });

    describe('#type', function () {

        it('uses constructor name for default type name', function (done) {

            var Foo = function Foo () {};

            var schema = Joi.object().type(Foo);
            schema.validate({}, function (err) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" must be an instance of "Foo"');
                done();
            });
        });

        it('uses custom type name if supplied', function (done) {

            var Foo = function () {};

            var schema = Joi.object().type(Foo, 'Bar');
            schema.validate({}, function (err) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" must be an instance of "Bar"');
                done();
            });
        });

        it('overrides constructor name with custom name', function (done) {

            var Foo = function Foo () {};

            var schema = Joi.object().type(Foo, 'Bar');
            schema.validate({}, function (err) {

                expect(err).to.exist();
                expect(err.message).to.equal('"value" must be an instance of "Bar"');
                done();
            });
        });

        it('throws when constructor is not a function', function (done) {

            expect(function () {

                Joi.object().type('');
            }).to.throw('type must be a constructor function');
            done();
        });

        it('uses the constructor name in the schema description', function (done) {

            var description = Joi.object().type(RegExp).describe();

            expect(description.rules).to.deep.include({ name: 'type', arg: 'RegExp' });
            done();
        });
    });
});
