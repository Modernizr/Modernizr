// Load modules

var Lab = require('lab');
var Code = require('code');
var Joi = require('..');
var Helper = require('./helper');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('alternatives', function () {

    it('fails when no alternatives are provided', function (done) {

        Joi.alternatives().validate('a', function (err, value) {

            expect(err).to.exist();
            expect(err.message).to.equal('"value" not matching any of the allowed alternatives');
            done();
        });
    });

    it('allows undefined when no alternatives are provided', function (done) {

        Joi.alternatives().validate(undefined, function (err, value) {

            expect(err).to.not.exist();
            done();
        });
    });

    it('applies modifiers when higher priority converts', function (done) {

        var schema = Joi.object({
            a: [
                Joi.number(),
                Joi.string()
            ]
        });

        schema.validate({ a: '5' }, function (err, value) {

            expect(err).to.not.exist();
            expect(value.a).to.equal(5);
            done();
        });
    });

    it('applies modifiers when lower priority valid is a match', function (done) {

        var schema = Joi.object({
            a: [
                Joi.number(),
                Joi.valid('5')
            ]
        });

        schema.validate({ a: '5' }, function (err, value) {

            expect(err).to.not.exist();
            expect(value.a).to.equal(5);
            done();
        });
    });

    it('does not apply modifier if alternative fails', function (done) {

        var schema = Joi.object({
            a: [
                Joi.object({ c: Joi.any(), d: Joi.number() }).rename('b', 'c'),
                { b: Joi.any(), d: Joi.string() }
            ]
        });

        var input = { a: { b: 'any', d: 'string' } };
        schema.validate(input, function (err, value) {

            expect(err).to.not.exist();
            expect(value.a.b).to.equal('any');
            done();
        });
    });

    describe('#try', function () {

        it('throws when missing alternatives', function (done) {

            expect(function () {

                Joi.alternatives().try();
            }).to.throw('Cannot add other alternatives without at least one schema');
            done();
        });
    });

    describe('#when', function () {

        it('throws on invalid ref (not string)', function (done) {

            expect(function () {

                Joi.alternatives().when(5, { is: 6, then: Joi.number() });
            }).to.throw('Invalid reference: 5');
            done();
        });

        it('validates conditional alternatives', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 5, then: 'x', otherwise: 'y' })
                                     .try('z'),
                b: Joi.any()
            };

            Helper.validate(schema, [
                [{ a: 'x', b: 5 }, true],
                [{ a: 'x', b: 6 }, false],
                [{ a: 'y', b: 5 }, false],
                [{ a: 'y', b: 6 }, true],
                [{ a: 'z', b: 5 }, true],
                [{ a: 'z', b: 6 }, true]
            ], done);
        });

        it('validates conditional alternatives (empty key)', function (done) {

            var schema = {
                a: Joi.alternatives().when('', { is: 5, then: 'x', otherwise: 'y' })
                                     .try('z'),
                '': Joi.any()
            };

            Helper.validate(schema, [
                [{ a: 'x', '': 5 }, true],
                [{ a: 'x', '': 6 }, false],
                [{ a: 'y', '': 5 }, false],
                [{ a: 'y', '': 6 }, true],
                [{ a: 'z', '': 5 }, true],
                [{ a: 'z', '': 6 }, true]
            ], done);
        });

        it('validates only then', function (done) {

            var schema = {
                a: Joi.alternatives().when(Joi.ref('b'), { is: 5, then: 'x' })
                                     .try('z'),
                b: Joi.any()
            };

            Helper.validate(schema, [
                [{ a: 'x', b: 5 }, true],
                [{ a: 'x', b: 6 }, false],
                [{ a: 'y', b: 5 }, false],
                [{ a: 'y', b: 6 }, false],
                [{ a: 'z', b: 5 }, true],
                [{ a: 'z', b: 6 }, true]
            ], done);
        });

        it('validates only otherwise', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 5, otherwise: 'y' })
                                     .try('z'),
                b: Joi.any()
            };

            Helper.validate(schema, [
                [{ a: 'x', b: 5 }, false],
                [{ a: 'x', b: 6 }, false],
                [{ a: 'y', b: 5 }, false],
                [{ a: 'y', b: 6 }, true],
                [{ a: 'z', b: 5 }, true],
                [{ a: 'z', b: 6 }, true]
            ], done);
        });

        it('validates when is is null', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: null, then: 'x', otherwise: Joi.number() }),
                b: Joi.any()
            };

            Helper.validate(schema, [
                [{ a: 1 }, true],
                [{ a: 'y' }, false],
                [{ a: 'x', b: null }, true],
                [{ a: 'y', b: null }, false],
                [{ a: 1, b: null }, false]
            ], done);
        });

        it('validates when is has ref', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: Joi.ref('c'), then: 'x' }),
                b: Joi.any(),
                c: Joi.number()
            };

            Helper.validate(schema, [
                [{ a: 'x', b: 5, c: '5' }, true],
                [{ a: 'x', b: 5, c: '1' }, false],
                [{ a: 'x', b: '5', c: '5' }, false],
                [{ a: 'y', b: 5, c: 5 }, false],
                [{ a: 'y' }, false]
            ], done);
        });

        it('validates when then has ref', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 5, then: Joi.ref('c') }),
                b: Joi.any(),
                c: Joi.number()
            };

            Helper.validate(schema, [
                [{ a: 'x', b: 5, c: '1' }, false],
                [{ a: 1, b: 5, c: '1' }, true],
                [{ a: '1', b: 5, c: '1' }, false]
            ], done);
        });

        it('validates when otherwise has ref', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 6, otherwise: Joi.ref('c') }),
                b: Joi.any(),
                c: Joi.number()
            };

            Helper.validate(schema, [
                [{ a: 'x', b: 5, c: '1' }, false],
                [{ a: 1, b: 5, c: '1' }, true],
                [{ a: '1', b: 5, c: '1' }, false]
            ], done);
        });

        it('validates when empty value', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: true, then: Joi.required() }),
                b: Joi.boolean().default(false)
            };

            Helper.validate(schema, [
                [{ b: false }, true],
                [{ b: true }, true]           // true because required() only applies to the one alternative
            ], done);
        });

        it('validates when missing value', function (done) {

            var schema = Joi.object({
                a: Joi.alternatives().when('b', { is: 5, then: Joi.optional(), otherwise: Joi.required() }).required(),
                b: Joi.number()
            });

            Helper.validate(schema, [
                [{ a: 1 }, true],
                [{}, false],
                [{ b: 1 }, false],
                [{ a: 1, b: 1 }, true],
                [{ a: 1, b: 5 }, true],
                [{ b: 5 }, false]
            ], done);
        });
    });

    describe('#describe', function () {

        it('describes when', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 5, then: 'x', otherwise: 'y' })
                                     .try('z'),
                b: Joi.any()
            };

            var outcome = {
                type: 'object',
                children: {
                    b: {
                        type: 'any'
                    },
                    a: {
                        type: 'alternatives',
                        alternatives: [
                            {
                                ref: 'ref:b',
                                is: {
                                    type: 'number',
                                    flags: {
                                        allowOnly: true,
                                        presence: 'required'
                                    },
                                    valids: [5],
                                    invalids: [Infinity, -Infinity]
                                },
                                then: {
                                    type: 'string',
                                    flags: {
                                        allowOnly: true
                                    },
                                    valids: ['x'],
                                    invalids: ['']
                                },
                                otherwise: {
                                    type: 'string',
                                    flags: {
                                        allowOnly: true
                                    },
                                    valids: ['y'],
                                    invalids: ['']
                                }
                            },
                            {
                                type: 'string',
                                flags: {
                                    allowOnly: true
                                },
                                valids: ['z'],
                                invalids: ['']
                            }
                        ]
                    }
                }
            };

            expect(Joi.describe(schema)).to.deep.equal(outcome);
            done();
        });

        it('describes when (only then)', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 5, then: 'x' })
                                     .try('z'),
                b: Joi.any()
            };

            var outcome = {
                type: 'object',
                children: {
                    b: {
                        type: 'any'
                    },
                    a: {
                        type: 'alternatives',
                        alternatives: [
                            {
                                ref: 'ref:b',
                                is: {
                                    type: 'number',
                                    flags: {
                                        allowOnly: true,
                                        presence: 'required'
                                    },
                                    valids: [5],
                                    invalids: [Infinity, -Infinity]
                                },
                                then: {
                                    type: 'string',
                                    flags: {
                                        allowOnly: true
                                    },
                                    valids: ['x'],
                                    invalids: ['']
                                }
                            },
                            {
                                type: 'string',
                                flags: {
                                    allowOnly: true
                                },
                                valids: ['z'],
                                invalids: ['']
                            }
                        ]
                    }
                }
            };

            expect(Joi.describe(schema)).to.deep.equal(outcome);
            done();
        });

        it('describes when (only otherwise)', function (done) {

            var schema = {
                a: Joi.alternatives().when('b', { is: 5, otherwise: 'y' })
                                     .try('z'),
                b: Joi.any()
            };

            var outcome = {
                type: 'object',
                children: {
                    b: {
                        type: 'any'
                    },
                    a: {
                        type: 'alternatives',
                        alternatives: [
                            {
                                ref: 'ref:b',
                                is: {
                                    type: 'number',
                                    flags: {
                                        allowOnly: true,
                                        presence: 'required'
                                    },
                                    valids: [5],
                                    invalids: [Infinity, -Infinity]
                                },
                                otherwise: {
                                    type: 'string',
                                    flags: {
                                        allowOnly: true
                                    },
                                    valids: ['y'],
                                    invalids: ['']
                                }
                            },
                            {
                                type: 'string',
                                flags: {
                                    allowOnly: true
                                },
                                valids: ['z'],
                                invalids: ['']
                            }
                        ]
                    }
                }
            };

            expect(Joi.describe(schema)).to.deep.equal(outcome);
            done();
        });

        it('describes inherited fields (from any)', function (done) {

            var schema = Joi.alternatives()
                .try('a')
                .description('d')
                .example('a')
                .meta('b')
                .meta('c')
                .notes('f')
                .tags('g');

            var outcome = {
                type: 'alternatives',
                description: 'd',
                notes: ['f'],
                tags: ['g'],
                meta: ['b', 'c'],
                examples: ['a'],
                alternatives: [{
                    type: 'string',
                    flags: {
                        allowOnly: true
                    },
                    valids: ['a'],
                    invalids: ['']
                }]
            };

            expect(Joi.describe(schema)).to.deep.equal(outcome);
            done();
        });
    });
});
