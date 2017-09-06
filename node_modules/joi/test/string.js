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


describe('string', function () {

    it('fails on boolean', function (done) {

        var schema = Joi.string();
        Helper.validate(schema, [
            [true, false],
            [false, false]
        ], done);
    });

    describe('#valid', function () {

        it('should throw error on input not matching type', function (done) {

            expect(function () {

                Joi.string().valid({});
            }).to.throw();
            done();
        });

        it('should not throw on input matching type', function (done) {

            expect(function () {

                Joi.string().valid('joi');
            }).to.not.throw();
            done();
        });

        it('validates case sensitive values', function (done) {

            Helper.validate(Joi.string().valid('a', 'b'), [
                ['a', true],
                ['b', true],
                ['A', false],
                ['B', false]
            ], done);
        });

        it('validates case insensitive values', function (done) {

            Helper.validate(Joi.string().valid('a', 'b').insensitive(), [
                ['a', true],
                ['b', true],
                ['A', true],
                ['B', true],
                [4, false]
            ], done);
        });

        it('validates case insensitive values with non-strings', function (done) {

            Helper.validate(Joi.string().valid('a', 'b', 5).insensitive(), [
                ['a', true],
                ['b', true],
                ['A', true],
                ['B', true],
                [4, false],
                [5, true]
            ], done);
        });
    });

    describe('#invalid', function () {

        it('should throw error on input not matching type', function (done) {

            expect(function () {

                Joi.string().invalid({});
            }).to.throw();
            done();
        });

        it('should not throw on input matching type', function (done) {

            expect(function () {

                Joi.string().invalid('joi');
            }).to.not.throw();
            done();
        });

        it('invalidates case sensitive values', function (done) {

            Helper.validate(Joi.string().invalid('a', 'b'), [
                ['a', false],
                ['b', false],
                ['A', true],
                ['B', true]
            ], done);
        });

        it('invalidates case insensitive values', function (done) {

            Helper.validate(Joi.string().invalid('a', 'b').insensitive(), [
                ['a', false],
                ['b', false],
                ['A', false],
                ['B', false]
            ], done);
        });
    });

    describe('#min', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.string().min('a');
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not an integer', function (done) {

            expect(function () {

                Joi.string().min(1.2);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not a positive integer', function (done) {

            expect(function () {

                Joi.string().min(-1);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('enforces a limit using byte count', function (done) {

            var schema = Joi.string().min(2, 'utf8');
            Helper.validate(schema, [
                ['\u00bd', true],
                ['a', false]
            ], done);
        });

        it('accepts references as min length', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.string().min(Joi.ref('a'), 'utf8') });
            Helper.validate(schema, [
                [{ a: 2, b: '\u00bd' }, true],
                [{ a: 2, b: 'a' }, false],
                [{ a: 2, b: 'a' }, false, null, 'child "b" fails because ["b" length must be at least 2 characters long]']
            ], done);
        });

        it('accepts context references as min length', function (done) {

            var schema = Joi.object({ b: Joi.string().min(Joi.ref('$a'), 'utf8') });
            Helper.validate(schema, [
                [{ b: '\u00bd' }, true, { context: { a: 2 } }],
                [{ b: 'a' }, false, { context: { a: 2 } }],
                [{ b: 'a' }, false, { context: { a: 2 } }, 'child "b" fails because ["b" length must be at least 2 characters long]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.any(), b: Joi.string().min(Joi.ref('a'), 'utf8') });

            Helper.validate(schema, [
                [{ a: 'Hi there', b: '\u00bd' }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ b: Joi.string().min(Joi.ref('$a'), 'utf8') });

            Helper.validate(schema, [
                [{ b: '\u00bd' }, false, { context: { a: 'Hi there' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#max', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.string().max('a');
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not an integer', function (done) {

            expect(function () {

                Joi.string().max(1.2);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not a positive integer', function (done) {

            expect(function () {

                Joi.string().max(-1);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('enforces a limit using byte count', function (done) {

            var schema = Joi.string().max(1, 'utf8');
            Helper.validate(schema, [
                ['\u00bd', false],
                ['a', true]
            ], done);
        });

        it('accepts references as min length', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.string().max(Joi.ref('a'), 'utf8') });
            Helper.validate(schema, [
                [{ a: 2, b: '\u00bd' }, true],
                [{ a: 2, b: 'three' }, false],
                [{ a: 2, b: 'three' }, false, null, 'child "b" fails because ["b" length must be less than or equal to 2 characters long]']
            ], done);
        });

        it('accepts context references as min length', function (done) {

            var schema = Joi.object({ b: Joi.string().max(Joi.ref('$a'), 'utf8') });
            Helper.validate(schema, [
                [{ b: '\u00bd' }, true, { context: { a: 2 } }],
                [{ b: 'three' }, false, { context: { a: 2 } }],
                [{ b: 'three' }, false, { context: { a: 2 } }, 'child "b" fails because ["b" length must be less than or equal to 2 characters long]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.any(), b: Joi.string().max(Joi.ref('a'), 'utf8') });

            Helper.validate(schema, [
                [{ a: 'Hi there', b: '\u00bd' }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ b: Joi.string().max(Joi.ref('$a'), 'utf8') });

            Helper.validate(schema, [
                [{ b: '\u00bd' }, false, { context: { a: 'Hi there' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#creditCard', function () {

        it('should validate credit card', function (done) {

            var t = Joi.string().creditCard();
            t.validate('4111111111111112', function (err, value) {

                expect(err.message).to.equal('"value" must be a credit card');

                Helper.validate(t, [
                    ['378734493671000', true],  // american express
                    ['371449635398431', true],  // american express
                    ['378282246310005', true],  // american express
                    ['341111111111111', true],  // american express
                    ['5610591081018250', true], // australian bank
                    ['5019717010103742', true], // dankort pbs
                    ['38520000023237', true],   // diners club
                    ['30569309025904', true],   // diners club
                    ['6011000990139424', true], // discover
                    ['6011111111111117', true], // discover
                    ['6011601160116611', true], // discover
                    ['3566002020360505', true], // jbc
                    ['3530111333300000', true], // jbc
                    ['5105105105105100', true], // mastercard
                    ['5555555555554444', true], // mastercard
                    ['5431111111111111', true], // mastercard
                    ['6331101999990016', true], // switch/solo paymentech
                    ['4222222222222', true],    // visa
                    ['4012888888881881', true], // visa
                    ['4111111111111111', true], // visa
                    ['4111111111111112', false],
                    [null, false]
                ], done);
            });
        });
    });

    describe('#length', function () {

        it('throws when limit is not a number', function (done) {

            expect(function () {

                Joi.string().length('a');
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not an integer', function (done) {

            expect(function () {

                Joi.string().length(1.2);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('throws when limit is not a positive integer', function (done) {

            expect(function () {

                Joi.string().length(-42);
            }).to.throw('limit must be a positive integer or reference');
            done();
        });

        it('enforces a limit using byte count', function (done) {

            var schema = Joi.string().length(2, 'utf8');
            Helper.validate(schema, [
                ['\u00bd', true],
                ['a', false]
            ], done);
        });

        it('accepts references as length', function (done) {

            var schema = Joi.object({ a: Joi.number(), b: Joi.string().length(Joi.ref('a'), 'utf8') });
            Helper.validate(schema, [
                [{ a: 2, b: '\u00bd' }, true],
                [{ a: 2, b: 'a' }, false],
                [{ a: 2, b: 'a' }, false, null, 'child "b" fails because ["b" length must be 2 characters long]']
            ], done);
        });

        it('accepts context references as length', function (done) {

            var schema = Joi.object({ b: Joi.string().length(Joi.ref('$a'), 'utf8') });
            Helper.validate(schema, [
                [{ b: '\u00bd' }, true, { context: { a: 2 } }],
                [{ b: 'a' }, false, { context: { a: 2 } }],
                [{ b: 'a' }, false, { context: { a: 2 } }, 'child "b" fails because ["b" length must be 2 characters long]']
            ], done);
        });

        it('errors if reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.any(), b: Joi.string().length(Joi.ref('a'), 'utf8') });

            Helper.validate(schema, [
                [{ a: 'Hi there', b: '\u00bd' }, false, null, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });

        it('errors if context reference is not a number', function (done) {

            var schema = Joi.object({ a: Joi.any(), b: Joi.string().length(Joi.ref('$a'), 'utf8') });

            Helper.validate(schema, [
                [{ b: '\u00bd' }, false, { context: { a: 'Hi there' } }, 'child "b" fails because ["b" references "a" which is not a number]']
            ], done);
        });
    });

    describe('#email', function () {

        it('throws when options are not an object', function (done) {

            expect(function () {

                var emailOptions = true;
                Joi.string().email(emailOptions);
            }).to.throw('email options must be an object');
            done();
        });

        it('throws when checkDNS option is enabled', function (done) {

            expect(function () {

                var emailOptions = { checkDNS: true };
                Joi.string().email(emailOptions);
            }).to.throw('checkDNS option is not supported');
            done();
        });

        it('throws when tldWhitelist is not an array or object', function (done) {

            expect(function () {

                var emailOptions = { tldWhitelist: 'domain.tld' };
                Joi.string().email(emailOptions);
            }).to.throw('tldWhitelist must be an array or object');
            done();
        });

        it('throws when minDomainAtoms is not a number', function (done) {

            expect(function () {

                var emailOptions = { minDomainAtoms: '1' };
                Joi.string().email(emailOptions);
            }).to.throw('minDomainAtoms must be a positive integer');
            done();
        });

        it('throws when minDomainAtoms is not an integer', function (done) {

            expect(function () {

                var emailOptions = { minDomainAtoms: 1.2 };
                Joi.string().email(emailOptions);
            }).to.throw('minDomainAtoms must be a positive integer');
            done();
        });

        it('throws when minDomainAtoms is not positive', function (done) {

            expect(function () {

                var emailOptions = { minDomainAtoms: 0 };
                Joi.string().email(emailOptions);
            }).to.throw('minDomainAtoms must be a positive integer');
            done();
        });

        it('does not throw when minDomainAtoms is a positive integer', function (done) {

            expect(function () {

                var emailOptions = { minDomainAtoms: 1 };
                Joi.string().email(emailOptions);
            }).to.not.throw();
            done();
        });

        it('throws when errorLevel is not an integer or boolean', function (done) {

            expect(function () {

                var emailOptions = { errorLevel: 1.2 };
                Joi.string().email(emailOptions);
            }).to.throw('errorLevel must be a non-negative integer or boolean');
            done();
        });

        it('throws when errorLevel is negative', function (done) {

            expect(function () {

                var emailOptions = { errorLevel: -1 };
                Joi.string().email(emailOptions);
            }).to.throw('errorLevel must be a non-negative integer or boolean');
            done();
        });

        it('does not throw when errorLevel is 0', function (done) {

            expect(function () {

                var emailOptions = { errorLevel: 0 };
                Joi.string().email(emailOptions);
            }).to.not.throw();
            done();
        });
    });

    describe('#hostname', function () {

        it('validates hostnames', function (done) {

            var schema = Joi.string().hostname();
            Helper.validate(schema, [
                ['www.example.com', true],
                ['domain.local', true],
                ['3domain.local', true],
                ['hostname', true],
                ['host:name', false],
                ['-', false],
                ['2387628', true],
                ['01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789', false],
                ['::1', true],
                ['0:0:0:0:0:0:0:1', true],
                ['0:?:0:0:0:0:0:1', false]
            ], done);
        });
    });

    describe('#lowercase', function () {

        it('only allows strings that are entirely lowercase', function (done) {

            var schema = Joi.string().lowercase();
            Helper.validateOptions(schema, [
                ['this is all lowercase', true],
                ['5', true],
                ['lower\tcase', true],
                ['Uppercase', false],
                ['MixEd cAsE', false],
                [1, false]
            ], { convert: false }, done);
        });

        it('coerce string to lowercase before validation', function (done) {

            var schema = Joi.string().lowercase();
            schema.validate('UPPER TO LOWER', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal('upper to lower');
                done();
            });
        });

        it('should work in combination with a trim', function (done) {

            var schema = Joi.string().lowercase().trim();
            Helper.validate(schema, [
                [' abc', true],
                [' ABC', true],
                ['ABC', true],
                [1, false]
            ], done);
        });

        it('should work in combination with a replacement', function (done) {

            var schema = Joi.string().lowercase().replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['a\r b\n c', true, null, 'a b c'],
                ['A\t B  C', true, null, 'a b c'],
                ['ABC', true, null, 'abc'],
                [1, false]
            ], done);
        });
    });

    describe('#uppercase', function () {

        it('only allow strings that are entirely uppercase', function (done) {

            var schema = Joi.string().uppercase();
            Helper.validateOptions(schema, [
                ['THIS IS ALL UPPERCASE', true],
                ['5', true],
                ['UPPER\nCASE', true],
                ['lOWERCASE', false],
                ['MixEd cAsE', false],
                [1, false]
            ], { convert: false }, done);
        });

        it('coerce string to uppercase before validation', function (done) {

            var schema = Joi.string().uppercase();
            schema.validate('lower to upper', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal('LOWER TO UPPER');
                done();
            });
        });

        it('works in combination with a forced trim', function (done) {

            var schema = Joi.string().uppercase().trim();
            Helper.validate(schema, [
                [' abc', true],
                [' ABC', true],
                ['ABC', true],
                [1, false]
            ], done);
        });

        it('works in combination with a forced replacement', function (done) {

            var schema = Joi.string().uppercase().replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['a\r b\n c', true, null, 'A B C'],
                ['A\t B  C', true, null, 'A B C'],
                ['ABC', true, null, 'ABC'],
                [1, false]
            ], done);
        });
    });

    describe('#trim', function () {

        it('only allow strings that have no leading or trailing whitespace', function (done) {

            var schema = Joi.string().trim();
            Helper.validateOptions(schema, [
                [' something', false],
                ['something ', false],
                ['something\n', false],
                ['some thing', true],
                ['something', true]
            ], { convert: false }, done);
        });

        it('removes leading and trailing whitespace before validation', function (done) {

            var schema = Joi.string().trim();
            schema.validate(' trim this ', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal('trim this');
                done();
            });
        });

        it('removes leading and trailing whitespace before validation', function (done) {

            var schema = Joi.string().trim().allow('');
            schema.validate('     ', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal('');
                done();
            });
        });

        it('should work in combination with min', function (done) {

            var schema = Joi.string().min(4).trim();
            Helper.validate(schema, [
                [' a ', false],
                ['abc ', false],
                ['abcd ', true]
            ], done);
        });

        it('should work in combination with max', function (done) {

            var schema = Joi.string().max(4).trim();
            Helper.validate(schema, [
                [' abcde ', false],
                ['abc ', true],
                ['abcd ', true]
            ], done);
        });

        it('should work in combination with length', function (done) {

            var schema = Joi.string().length(4).trim();
            Helper.validate(schema, [
                [' ab ', false],
                ['abc ', false],
                ['abcd ', true]
            ], done);
        });

        it('should work in combination with a case change', function (done) {

            var schema = Joi.string().trim().lowercase();
            Helper.validate(schema, [
                [' abc', true],
                [' ABC', true],
                ['ABC', true]
            ], done);
        });
    });

    describe('#replace', function () {

        it('successfully replaces the first occurrence of the expression', function (done) {

            var schema = Joi.string().replace(/\s+/, ''); // no "g" flag
            Helper.validateOptions(schema, [
                ['\tsomething', true, null, 'something'],
                ['something\r', true, null, 'something'],
                ['something  ', true, null, 'something'],
                ['some  thing', true, null, 'something'],
                ['so me thing', true, null, 'some thing'] // first occurrence!
            ], { convert: true }, done);
        });

        it('successfully replaces all occurrences of the expression', function (done) {

            var schema = Joi.string().replace(/\s+/g, ''); // has "g" flag
            Helper.validateOptions(schema, [
                ['\tsomething', true, null, 'something'],
                ['something\r', true, null, 'something'],
                ['something  ', true, null, 'something'],
                ['some  thing', true, null, 'something'],
                ['so me thing', true, null, 'something']
            ], { convert: true }, done);
        });

        it('successfully replaces all occurrences of a string pattern', function (done) {

            var schema = Joi.string().replace('foo', 'X'); // has "g" flag
            Helper.validateOptions(schema, [
                ['foobarfoobazfoo', true, null, 'XbarXbazX']
            ], { convert: true }, done);
        });

        it('successfully replaces multiple times', function (done) {

            var schema = Joi.string().replace(/a/g, 'b').replace(/b/g, 'c');
            schema.validate('a quick brown fox', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal('c quick crown fox');
                done();
            });
        });

        it('should work in combination with trim', function (done) {

            // The string below is the name "Yamada Tarou" separated by a
            // carriage return, a "full width" ideographic space and a newline

            var schema = Joi.string().trim().replace(/\s+/g, ' ');
            schema.validate(' \u5C71\u7530\r\u3000\n\u592A\u90CE ', function (err, value) {

                expect(err).to.not.exist();
                expect(value).to.equal('\u5C71\u7530 \u592A\u90CE');
                done();
            });
        });

        it('should work in combination with min', function (done) {

            var schema = Joi.string().min(4).replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['   a   ', false],
                ['abc    ', true, null, 'abc '],
                ['a\t\rbc', true, null, 'a bc']
            ], done);
        });

        it('should work in combination with max', function (done) {

            var schema = Joi.string().max(5).replace(/ CHANGE ME /g, '-b-');
            Helper.validate(schema, [
                ['a CHANGE ME c', true, null, 'a-b-c'],
                ['a-b-c', true, null, 'a-b-c'] // nothing changes here!
            ], done);
        });

        it('should work in combination with length', function (done) {

            var schema = Joi.string().length(5).replace(/\s+/g, ' ');
            Helper.validate(schema, [
                ['a    bc', false],
                ['a\tb\nc', true, null, 'a b c']
            ], done);
        });

    });

    describe('#regex', function () {

        it('should not include a pattern name by default', function (done) {

            var schema = Joi.string().regex(/[a-z]+/).regex(/[0-9]+/);
            schema.validate('abcd', function (err, value) {

                expect(err.message).to.contain('required pattern');
                done();
            });
        });

        it('should include a pattern name if specified', function (done) {

            var schema = Joi.string().regex(/[a-z]+/, 'letters').regex(/[0-9]+/, 'numbers');
            schema.validate('abcd', function (err, value) {

                expect(err.message).to.contain('numbers pattern');
                done();
            });
        });
    });

    describe('#ip', function () {

        var invalidIPs = [
                ['ASDF', false],
                ['192.0.2.16:80/30', false],
                ['192.0.2.16a', false],
                ['qwerty', false],
                ['127.0.0.1:8000', false],
                ['ftp://www.example.com', false],
                ['Bananas in pajamas are coming down the stairs', false]
            ],
            invalidIPv4s = [
                ['0.0.0.0/33', false],
                ['256.0.0.0/0', false],
                ['255.255.255.256/32', false],
                ['256.0.0.0', false],
                ['255.255.255.256', false]
            ],
            invalidIPv6s = [
                ['2001:db8::7/33', false],
                ['1080:0:0:0:8:800:200C:417G', false]
            ],
            invalidIPvFutures = [
                ['v1.09azAZ-._~!$&\'()*+,;=:/33', false],
                ['v1.09#', false]
            ],
            validIPv4sWithCidr = function (success) {

                return [
                    ['0.0.0.0/32', success],
                    ['255.255.255.255/0', success],
                    ['127.0.0.1/0', success],
                    ['192.168.2.1/0', success],
                    ['0.0.0.3/2', success],
                    ['0.0.0.7/3', success],
                    ['0.0.0.15/4', success],
                    ['0.0.0.31/5', success],
                    ['0.0.0.63/6', success],
                    ['0.0.0.127/7', success],
                    ['01.020.030.100/7', success],
                    ['0.0.0.0/0', success],
                    ['00.00.00.00/0', success],
                    ['000.000.000.000/32', success]
                ];
            },
            validIPv4sWithoutCidr = function (success) {

                return [
                    ['0.0.0.0', success],
                    ['255.255.255.255', success],
                    ['127.0.0.1', success],
                    ['192.168.2.1', success],
                    ['0.0.0.3', success],
                    ['0.0.0.7', success],
                    ['0.0.0.15', success],
                    ['0.0.0.31', success],
                    ['0.0.0.63', success],
                    ['0.0.0.127', success],
                    ['01.020.030.100', success],
                    ['0.0.0.0', success],
                    ['00.00.00.00', success],
                    ['000.000.000.000', success]
                ];
            },
            validIPv6sWithCidr = function (success) {

                return [
                    ['2001:db8::7/32', success],
                    ['a:b:c:d:e::1.2.3.4/13', success],
                    ['FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/0', success],
                    ['FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/32', success],
                    ['1080:0:0:0:8:800:200C:417A/27', success]
                ];
            },
            validIPv6sWithoutCidr = function (success) {

                return [
                    ['2001:db8::7', success],
                    ['a:b:c:d:e::1.2.3.4', success],
                    ['FEDC:BA98:7654:3210:FEDC:BA98:7654:3210', success],
                    ['FEDC:BA98:7654:3210:FEDC:BA98:7654:3210', success],
                    ['1080:0:0:0:8:800:200C:417A', success]
                ];
            },
            validIPvFuturesWithCidr = function (success) {

                return [
                    ['v1.09azAZ-._~!$&\'()*+,;=:/32', success]
                ];
            },
            validIPvFuturesWithoutCidr = function (success) {

                return [
                    ['v1.09azAZ-._~!$&\'()*+,;=:', success]
                ];
            };

        it('should validate all ip addresses with optional CIDR by default', function (done) {

            var schema = Joi.string().ip();
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(true))
                .concat(validIPv4sWithoutCidr(true))
                .concat(validIPv6sWithCidr(true))
                .concat(validIPv6sWithoutCidr(true))
                .concat(validIPvFuturesWithCidr(true))
                .concat(validIPvFuturesWithoutCidr(true))
                .concat(invalidIPs)
                .concat(invalidIPv4s)
                .concat(invalidIPv6s)
                .concat(invalidIPvFutures), done);
        });

        it('should validate all ip addresses with an optional CIDR', function (done) {

            var schema = Joi.string().ip({ cidr: 'optional' });
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(true))
                .concat(validIPv4sWithoutCidr(true))
                .concat(validIPv6sWithCidr(true))
                .concat(validIPv6sWithoutCidr(true))
                .concat(validIPvFuturesWithCidr(true))
                .concat(validIPvFuturesWithoutCidr(true))
                .concat(invalidIPs)
                .concat(invalidIPv4s)
                .concat(invalidIPv6s)
                .concat(invalidIPvFutures), done);
        });

        it('should validate all ip addresses with a required CIDR', function (done) {

            var schema = Joi.string().ip({ cidr: 'required' });
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(true))
                .concat(validIPv4sWithoutCidr(false))
                .concat(validIPv6sWithCidr(true))
                .concat(validIPv6sWithoutCidr(false))
                .concat(validIPvFuturesWithCidr(true))
                .concat(validIPvFuturesWithoutCidr(false))
                .concat(invalidIPs)
                .concat(invalidIPv4s)
                .concat(invalidIPv6s)
                .concat(invalidIPvFutures), done);
        });

        it('should validate all ip addresses with a forbidden CIDR', function (done) {

            var schema = Joi.string().ip({ cidr: 'forbidden' });
            Helper.validate(schema, []
                .concat(validIPv4sWithCidr(false))
                .concat(validIPv4sWithoutCidr(true))
                .concat(validIPv6sWithCidr(false))
                .concat(validIPv6sWithoutCidr(true))
                .concat(validIPvFuturesWithCidr(false))
                .concat(validIPvFuturesWithoutCidr(true))
                .concat(invalidIPs)
                .concat(invalidIPv4s)
                .concat(invalidIPv6s)
                .concat(invalidIPvFutures), done);
        });

        it('throws when options is not an object', function (done) {

            expect(function () {

                Joi.string().ip(42);
            }).to.throw('options must be an object');
            done();
        });

        it('throws when options.cidr is not a string', function (done) {

            expect(function () {

                Joi.string().ip({ cidr: 42 });
            }).to.throw('cidr must be a string');
            done();
        });

        it('throws when options.cidr is not a valid value', function (done) {

            expect(function () {

                Joi.string().ip({ cidr: '42' });
            }).to.throw('cidr must be one of required, optional, forbidden');
            done();
        });

        it('throws when options.version is an empty array', function (done) {

            expect(function () {

                Joi.string().ip({ version: [] });
            }).to.throw('version must have at least 1 version specified');
            done();
        });

        it('throws when options.version is not a string', function (done) {

            expect(function () {

                Joi.string().ip({ version: 42 });
            }).to.throw('version at position 0 must be a string');
            done();
        });

        it('throws when options.version is not a valid value', function (done) {

            expect(function () {

                Joi.string().ip({ version: '42' });
            }).to.throw('version at position 0 must be one of ipv4, ipv6, ipvfuture');
            done();
        });

        it('validates ip with a friendly error message', function (done) {

            var schema = { item: Joi.string().ip() };
            Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                expect(err.message).to.contain('must be a valid ip address');
                done();
            });
        });

        it('validates ip and cidr presence with a friendly error message', function (done) {

            var schema = { item: Joi.string().ip({ cidr: 'required' }) };
            Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                expect(err.message).to.contain('must be a valid ip address with a required CIDR');
                done();
            });
        });

        it('validates custom ip version and cidr presence with a friendly error message', function (done) {

            var schema = { item: Joi.string().ip({ version: 'ipv4', cidr: 'required' }) };
            Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                expect(err.message).to.contain('child "item" fails because ["item" must be a valid ip address of one of the following versions [ipv4] with a required CIDR]');
                done();
            });
        });

        describe('#ip({ version: "ipv4" })', function () {

            it('should validate all ipv4 addresses with a default CIDR strategy', function (done) {

                var schema = Joi.string().ip({ version: 'ipv4' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv4 addresses with an optional CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipv4', cidr: 'optional' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv4 addresses with a required CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipv4', cidr: 'required' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv4 addresses with a forbidden CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipv4', cidr: 'forbidden' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });
        });

        describe('#ip({ version: "ipv6" })', function () {

            it('should validate all ipv6 addresses with a default CIDR strategy', function (done) {

                var schema = Joi.string().ip({ version: 'ipv6' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv6 addresses with an optional CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipv6', cidr: 'optional' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv6 addresses with a required CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipv6', cidr: 'required' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv6 addresses with a forbidden CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipv6', cidr: 'forbidden' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });
        });

        describe('#ip({ version: "ipvfuture" })', function () {

            it('should validate all ipvfuture addresses with a default CIDR strategy', function (done) {

                var schema = Joi.string().ip({ version: 'ipvfuture' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(true))
                    .concat(validIPvFuturesWithoutCidr(true))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipvfuture addresses with an optional CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipvfuture', cidr: 'optional' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(true))
                    .concat(validIPvFuturesWithoutCidr(true))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipvfuture addresses with a required CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipvfuture', cidr: 'required' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(true))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipvfuture addresses with a forbidden CIDR', function (done) {

                var schema = Joi.string().ip({ version: 'ipvfuture', cidr: 'forbidden' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(true))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });
        });

        describe('#ip({ version: [ "ipv4", "ipv6" ] })', function () {

            it('should validate all ipv4 and ipv6 addresses with a default CIDR strategy', function (done) {

                var schema = Joi.string().ip({ version: ['ipv4', 'ipv6'] });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv4 and ipv6 addresses with an optional CIDR', function (done) {

                var schema = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv4 and ipv6 addresses with a required CIDR', function (done) {

                var schema = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'required' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(true))
                    .concat(validIPv4sWithoutCidr(false))
                    .concat(validIPv6sWithCidr(true))
                    .concat(validIPv6sWithoutCidr(false))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });

            it('should validate all ipv4 and ipv6 addresses with a forbidden CIDR', function (done) {

                var schema = Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' });
                Helper.validate(schema, []
                    .concat(validIPv4sWithCidr(false))
                    .concat(validIPv4sWithoutCidr(true))
                    .concat(validIPv6sWithCidr(false))
                    .concat(validIPv6sWithoutCidr(true))
                    .concat(validIPvFuturesWithCidr(false))
                    .concat(validIPvFuturesWithoutCidr(false))
                    .concat(invalidIPs)
                    .concat(invalidIPv4s)
                    .concat(invalidIPv6s)
                    .concat(invalidIPvFutures), done);
            });
        });
    });

    describe('#validate', function () {

        it('should, by default, allow undefined, deny empty string', function (done) {

            Helper.validate(Joi.string(), [
                [undefined, true],
                ['', false]
            ], done);
        });

        it('should, when .required(), deny undefined, deny empty string', function (done) {

            Helper.validate(Joi.string().required(), [
                [undefined, false],
                ['', false]
            ], done);
        });

        it('should, when .required(), print a friend error message for an empty string', function (done) {

            var schema = Joi.string().required();
            Joi.compile(schema).validate('', function (err, value) {

                expect(err.message).to.contain('be empty');
                done();
            });
        });

        it('should, when .required(), validate non-empty strings', function (done) {

            var schema = Joi.string().required();
            Helper.validate(schema, [
                ['test', true],
                ['0', true],
                [null, false]
            ], done);
        });

        it('validates invalid values', function (done) {

            var schema = Joi.string().invalid('a', 'b', 'c');
            Helper.validate(schema, [
                ['x', true],
                ['a', false],
                ['c', false]
            ], done);
        });

        it('should invalidate invalid values', function (done) {

            var schema = Joi.string().valid('a', 'b', 'c');
            Helper.validate(schema, [
                ['x', false],
                ['a', true],
                ['c', true]
            ], done);
        });

        it('validates array arguments correctly', function (done) {

            var schema = Joi.string().valid(['a', 'b', 'c']);
            Helper.validate(schema, [
                ['x', false],
                ['a', true],
                ['c', true]
            ], done);
        });

        it('validates minimum length when min is used', function (done) {

            var schema = Joi.string().min(3);
            Helper.validate(schema, [
                ['test', true],
                ['0', false],
                [null, false]
            ], done);
        });

        it('validates minimum length when min is 0', function (done) {

            var schema = Joi.string().min(0).required();
            Helper.validate(schema, [
                ['0', true],
                [null, false],
                [undefined, false]
            ], done);
        });

        it('should return false with minimum length and a null value passed in', function (done) {

            var schema = Joi.string().min(3);
            Helper.validate(schema, [
                [null, false]
            ], done);
        });

        it('null allowed overrides min length requirement', function (done) {

            var schema = Joi.string().min(3).allow(null);
            Helper.validate(schema, [
                [null, true]
            ], done);
        });

        it('validates maximum length when max is used', function (done) {

            var schema = Joi.string().max(3);
            Helper.validate(schema, [
                ['test', false],
                ['0', true],
                [null, false]
            ], done);
        });

        it('should return true with max and not required when value is undefined', function (done) {

            var schema = Joi.string().max(3);
            Helper.validate(schema, [
                [undefined, true]
            ], done);
        });

        it('validates length requirements', function (done) {

            var schema = Joi.string().length(3);
            Helper.validate(schema, [
                ['test', false],
                ['0', false],
                [null, false],
                ['abc', true]
            ], done);
        });

        it('validates regex', function (done) {

            var schema = Joi.string().regex(/^[0-9][-][a-z]+$/);
            Helper.validate(schema, [
                ['van', false],
                ['0-www', true]
            ], done);
        });

        it('validates regex (ignoring global flag)', function (done) {

            var schema = Joi.string().regex(/a/g);
            Helper.validate(schema, [
                ['ab', true],
                ['ac', true]
            ], done);
        });

        it('validates token', function (done) {

            var schema = Joi.string().token();
            Helper.validate(schema, [
                ['w0rld_of_w4lm4rtl4bs', true],
                ['w0rld of_w4lm4rtl4bs', false],
                ['abcd#f?h1j orly?', false]
            ], done);
        });

        it('validates alphanum', function (done) {

            var schema = Joi.string().alphanum();
            Helper.validate(schema, [
                ['w0rld of w4lm4rtl4bs', false],
                ['w0rldofw4lm4rtl4bs', true],
                ['abcd#f?h1j orly?', false]
            ], done);
        });

        it('validates email', function (done) {

            var schema = Joi.string().email();
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['"joe"@example.com', true],
                ['@iaminvalid.com', false],
                ['joe@[IPv6:2a00:1450:4001:c02::1b]', true],
                ['12345678901234567890123456789012345678901234567890123456789012345@walmartlabs.com', false],
                ['123456789012345678901234567890123456789012345678901234567890@12345678901234567890123456789012345678901234567890123456789.12345678901234567890123456789012345678901234567890123456789.12345678901234567890123456789012345678901234567890123456789.12345.toolong.com', false]
            ], done);
        });

        it('validates email with tldWhitelist as array', function (done) {

            var schema = Joi.string().email({ tldWhitelist: ['com', 'org'] });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@example.org', true],
                ['joe@example.edu', false]
            ], done);
        });

        it('validates email with tldWhitelist as object', function (done) {

            var schema = Joi.string().email({ tldWhitelist: { com: true, org: true } });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@example.org', true],
                ['joe@example.edu', false]
            ], done);
        });

        it('validates email with minDomainAtoms', function (done) {

            var schema = Joi.string().email({ minDomainAtoms: 4 });
            Helper.validate(schema, [
                ['joe@example.com', false],
                ['joe@www.example.com', false],
                ['joe@sub.www.example.com', true]
            ], done);
        });

        it('validates email with errorLevel as boolean', function (done) {

            var schema = Joi.string().email({ errorLevel: false });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@www.example.com', true],
                ['joe@localhost', true],
                ['joe', false]
            ]);

            schema = Joi.string().email({ errorLevel: true });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@www.example.com', true],
                ['joe@localhost', false],
                ['joe', false]
            ], done);
        });

        it('validates email with errorLevel as integer', function (done) {

            var schema = Joi.string().email({ errorLevel: 10 });
            Helper.validate(schema, [
                ['joe@example.com', true],
                ['joe@www.example.com', true],
                ['joe@localhost', true],
                ['joe', false]
            ], done);
        });

        it('validates email with a friendly error message', function (done) {

            var schema = { item: Joi.string().email() };
            Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                expect(err.message).to.contain('must be a valid email');
                done();
            });
        });

        it('should return false for denied value', function (done) {

            var text = Joi.string().invalid('joi');
            text.validate('joi', function (err, value) {

                expect(err).to.exist();
                done();
            });
        });

        it('should return true for allowed value', function (done) {

            var text = Joi.string().allow('hapi');
            text.validate('result', function (err, value) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('validates with one validator (min)', function (done) {

            var text = Joi.string().min(3);
            text.validate('joi', function (err, value) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('validates with two validators (min, required)', function (done) {

            var text = Joi.string().min(3).required();
            text.validate('joi', function (err, value) {

                expect(err).to.not.exist();

                text.validate('', function (err2, value2) {

                    expect(err2).to.exist();
                    done();
                });
            });
        });

        it('validates null with allow(null)', function (done) {

            Helper.validate(Joi.string().allow(null), [
                [null, true]
            ], done);
        });

        it('validates "" (empty string) with allow(\'\')', function (done) {

            Helper.validate(Joi.string().allow(''), [
                ['', true],
                ['', true]
            ], done);
        });

        it('validates combination of required and min', function (done) {

            var rule = Joi.string().required().min(3);
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of required and max', function (done) {

            var rule = Joi.string().required().max(3);
            Helper.validate(rule, [
                ['x', true],
                ['123', true],
                ['1234', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of allow(\'\') and min', function (done) {

            var rule = Joi.string().allow('').min(3);
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', true],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of allow(\'\') and max', function (done) {

            var rule = Joi.string().allow('').max(3);
            Helper.validate(rule, [
                ['x', true],
                ['123', true],
                ['1234', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of null allowed and max', function (done) {

            var rule = Joi.string().allow(null).max(3);
            Helper.validate(rule, [
                ['x', true],
                ['123', true],
                ['1234', false],
                ['', false],
                [null, true]
            ], done);
        });

        it('validates combination of min and max', function (done) {

            var rule = Joi.string().min(2).max(3);
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', false],
                ['12', true],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, and allow(\'\')', function (done) {

            var rule = Joi.string().min(2).max(3).allow('');
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', false],
                ['12', true],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, and required', function (done) {

            var rule = Joi.string().min(2).max(3).required();
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', false],
                ['12', true],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, and regex', function (done) {

            var rule = Joi.string().min(2).max(3).regex(/^a/);
            Helper.validate(rule, [
                ['x', false],
                ['123', false],
                ['1234', false],
                ['12', false],
                ['ab', true],
                ['abc', true],
                ['abcd', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, regex, and allow(\'\')', function (done) {

            var rule = Joi.string().min(2).max(3).regex(/^a/).allow('');
            Helper.validate(rule, [
                ['x', false],
                ['123', false],
                ['1234', false],
                ['12', false],
                ['ab', true],
                ['abc', true],
                ['abcd', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, regex, and required', function (done) {

            var rule = Joi.string().min(2).max(3).regex(/^a/).required();
            Helper.validate(rule, [
                ['x', false],
                ['123', false],
                ['1234', false],
                ['12', false],
                ['ab', true],
                ['abc', true],
                ['abcd', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, and alphanum', function (done) {

            var rule = Joi.string().min(2).max(3).alphanum();
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', false],
                ['12', true],
                ['ab', true],
                ['abc', true],
                ['abcd', false],
                ['*ab', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, alphanum, and allow(\'\')', function (done) {

            var rule = Joi.string().min(2).max(3).alphanum().allow('');
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', false],
                ['12', true],
                ['ab', true],
                ['abc', true],
                ['abcd', false],
                ['*ab', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, alphanum, and required', function (done) {

            var rule = Joi.string().min(2).max(3).alphanum().required();
            Helper.validate(rule, [
                ['x', false],
                ['123', true],
                ['1234', false],
                ['12', true],
                ['ab', true],
                ['abc', true],
                ['abcd', false],
                ['*ab', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, alphanum, and regex', function (done) {

            var rule = Joi.string().min(2).max(3).alphanum().regex(/^a/);
            Helper.validate(rule, [
                ['x', false],
                ['123', false],
                ['1234', false],
                ['12', false],
                ['ab', true],
                ['abc', true],
                ['a2c', true],
                ['abcd', false],
                ['*ab', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, alphanum, required, and regex', function (done) {

            var rule = Joi.string().min(2).max(3).alphanum().required().regex(/^a/);
            Helper.validate(rule, [
                ['x', false],
                ['123', false],
                ['1234', false],
                ['12', false],
                ['ab', true],
                ['abc', true],
                ['a2c', true],
                ['abcd', false],
                ['*ab', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of min, max, alphanum, allow(\'\'), and regex', function (done) {

            var rule = Joi.string().min(2).max(3).alphanum().allow('').regex(/^a/);
            Helper.validate(rule, [
                ['x', false],
                ['123', false],
                ['1234', false],
                ['12', false],
                ['ab', true],
                ['abc', true],
                ['a2c', true],
                ['abcd', false],
                ['*ab', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of email and min', function (done) {

            var rule = Joi.string().email().min(8);
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', true],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, and max', function (done) {

            var rule = Joi.string().email().min(8).max(10);
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, and invalid', function (done) {

            var rule = Joi.string().email().min(8).max(10).invalid('123@x.com');
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, and allow', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('x@x.com');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, allow, and invalid', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, allow, invalid, and allow(\'\')', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com').allow('');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, allow, and allow(\'\')', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('x@x.com').allow('');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, allow, invalid, and regex', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com').regex(/^1/);
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, allow, invalid, regex, and allow(\'\')', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('x@x.com').invalid('123@x.com').regex(/^1/).allow('');
            Helper.validate(rule, [
                ['x@x.com', true],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, and allow(\'\')', function (done) {

            var rule = Joi.string().email().min(8).max(10).allow('');
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', true],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, and regex', function (done) {

            var rule = Joi.string().email().min(8).max(10).regex(/^1234/);
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, regex, and allow(\'\')', function (done) {

            var rule = Joi.string().email().min(8).max(10).regex(/^1234/).allow('');
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of email, min, max, regex, and required', function (done) {

            var rule = Joi.string().email().min(8).max(10).regex(/^1234/).required();
            Helper.validate(rule, [
                ['x@x.com', false],
                ['123@x.com', false],
                ['1234@x.com', true],
                ['12345@x.com', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates uri', function (done) {

            // Handful of tests taken from Node: https://github.com/joyent/node/blob/cfcb1de130867197cbc9c6012b7e84e08e53d032/test/simple/test-url.js
            // Also includes examples from RFC 8936: http://tools.ietf.org/html/rfc3986#page-7
            var schema = Joi.string().uri();

            Helper.validate(schema, [
                ['foo://example.com:8042/over/there?name=ferret#nose', true],
                ['urn:example:animal:ferret:nose', true],
                ['ftp://ftp.is.co.za/rfc/rfc1808.txt', true],
                ['http://www.ietf.org/rfc/rfc2396.txt', true],
                ['ldap://[2001:db8::7]/c=GB?objectClass?one', true],
                ['mailto:John.Doe@example.com', true],
                ['news:comp.infosystems.www.servers.unix', true],
                ['tel:+1-816-555-1212', true],
                ['telnet://192.0.2.16:80/', true],
                ['urn:oasis:names:specification:docbook:dtd:xml:4.1.2', true],
                ['file:///example.txt', true],
                ['http://asdf:qw%20er@localhost:8000?asdf=12345&asda=fc%2F#bacon', true],
                ['http://asdf@localhost:8000', true],
                ['http://[v1.09azAZ-._~!$&\'()*+,;=:]', true],
                ['http://[a:b:c:d:e::1.2.3.4]', true],
                ['coap://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]', true],
                ['http://[1080:0:0:0:8:800:200C:417A]', true],
                ['http://127.0.0.1:8000/foo?bar', true],
                ['http://asdf:qwer@localhost:8000', true],
                ['http://user:pass%3A@localhost:80', true],
                ['http://localhost:123', true],
                ['https://localhost:123', true],
                ['file:///whatever', true],
                ['mailto:asdf@asdf.com', true],
                ['ftp://www.example.com', true],
                ['javascript:alert(\'hello\');', true], // eslint-disable-line no-script-url
                ['xmpp:isaacschlueter@jabber.org', true],
                ['f://some.host/path', true],
                ['http://localhost:18/asdf', true],
                ['http://localhost:42/asdf?qwer=zxcv', true],
                ['HTTP://www.example.com/', true],
                ['HTTP://www.example.com', true],
                ['http://www.ExAmPlE.com/', true],
                ['http://user:pw@www.ExAmPlE.com/', true],
                ['http://USER:PW@www.ExAmPlE.com/', true],
                ['http://user@www.example.com/', true],
                ['http://user%3Apw@www.example.com/', true],
                ['http://x.com/path?that%27s#all,%20folks', true],
                ['HTTP://X.COM/Y', true],
                ['http://www.narwhaljs.org/blog/categories?id=news', true],
                ['http://mt0.google.com/vt/lyrs=m@114&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://user:pass@mt0.google.com/vt/lyrs=m@114???&hl=en&src=api&x=2&y=2&z=3&s=', true],
                ['http://_jabber._tcp.google.com:80/test', true],
                ['http://user:pass@_jabber._tcp.google.com:80/test', true],
                ['http://[fe80::1]/a/b?a=b#abc', true],
                ['http://user:password@[3ffe:2a00:100:7031::1]:8080', true],
                ['coap://[1080:0:0:0:8:800:200C:417A]:61616/', true],
                ['git+http://github.com/joyent/node.git', true],
                ['http://bucket_name.s3.amazonaws.com/image.jpg', true],
                ['dot.test://foo/bar', true],
                ['svn+ssh://foo/bar', true],
                ['dash-test://foo/bar', true],
                ['xmpp:isaacschlueter@jabber.org', true],
                ['http://atpass:foo%40bar@127.0.0.1:8080/path?search=foo#bar', true],
                ['javascript:alert(\'hello\');', true], // eslint-disable-line no-script-url
                ['file://localhost/etc/node/', true],
                ['file:///etc/node/', true],
                ['http://USER:PW@www.ExAmPlE.com/', true],
                ['mailto:local1@domain1?query1', true],
                ['http://example/a/b?c/../d', true],
                ['http://example/x%2Fabc', true],
                ['http://a/b/c/d;p=1/g;x=1/y', true],
                ['http://a/b/c/g#s/../x', true],
                ['http://a/b/c/.foo', true],
                ['http://example.com/b//c//d;p?q#blarg', true],
                ['g:h', true],
                ['http://a/b/c/g', true],
                ['http://a/b/c/g/', true],
                ['http://a/g', true],
                ['http://g', true],
                ['http://a/b/c/d;p?y', true],
                ['http://a/b/c/g?y', true],
                ['http://a/b/c/d;p?q#s', true],
                ['http://a/b/c/g#s', true],
                ['http://a/b/c/g?y#s', true],
                ['http://a/b/c/;x', true],
                ['http://a/b/c/g;x', true],
                ['http://a/b/c/g;x?y#s', true],
                ['http://a/b/c/d;p?q', true],
                ['http://a/b/c/', true],
                ['http://a/b/', true],
                ['http://a/b/g', true],
                ['http://a/', true],
                ['http://a/g', true],
                ['http://a/g', true],
                ['file:/asda', true],
                ['qwerty', false],
                ['invalid uri', false],
                ['1http://google.com', false],
                ['http://testdomain`,.<>/?\'";{}][++\\|~!@#$%^&*().org', false],
                ['', false],
                ['(╯°□°)╯︵ ┻━┻', false],
                ['one/two/three?value=abc&value2=123#david-rules', false],
                ['//username:password@test.example.com/one/two/three?value=abc&value2=123#david-rules', false],
                ['http://a\r" \t\n<\'b:b@c\r\nd/e?f', false]
            ], done);
        });

        it('validates uri with a single scheme provided', function (done) {

            var schema = Joi.string().uri({
                scheme: 'http'
            });

            Helper.validate(schema, [
                ['http://google.com', true],
                ['https://google.com', false],
                ['ftp://google.com', false],
                ['file:/asdf', false],
                ['/path?query=value#hash', false]
            ], done);
        });

        it('validates uri with a single regex scheme provided', function (done) {

            var schema = Joi.string().uri({
                scheme: /https?/
            });

            Helper.validate(schema, [
                ['http://google.com', true],
                ['https://google.com', true],
                ['ftp://google.com', false],
                ['file:/asdf', false],
                ['/path?query=value#hash', false]
            ], done);
        });

        it('validates uri with multiple schemes provided', function (done) {

            var schema = Joi.string().uri({
                scheme: [/https?/, 'ftp', 'file', 'git+http']
            });

            Helper.validate(schema, [
                ['http://google.com', true],
                ['https://google.com', true],
                ['ftp://google.com', true],
                ['file:/asdf', true],
                ['git+http://github.com/hapijs/joi', true],
                ['/path?query=value#hash', false]
            ], done);
        });

        it('validates uri with a friendly error message', function (done) {

            var schema = { item: Joi.string().uri() };

            Joi.compile(schema).validate({ item: 'something invalid' }, function (err, value) {

                expect(err.message).to.contain('must be a valid uri');
                done();
            });
        });

        it('validates uri with a custom scheme with a friendly error message', function (done) {

            var schema = {
                item: Joi.string().uri({
                    scheme: 'http'
                })
            };

            Joi.compile(schema).validate({ item: 'something invalid' }, function (err, value) {

                expect(err.message).to.contain('must be a valid uri with a scheme matching the http pattern');
                done();
            });
        });

        it('validates uri with a custom array of schemes with a friendly error message', function (done) {

            var schema = {
                item: Joi.string().uri({
                    scheme: ['http', /https?/]
                })
            };

            Joi.compile(schema).validate({ item: 'something invalid' }, function (err, value) {

                expect(err.message).to.contain('must be a valid uri with a scheme matching the http|https? pattern');
                done();
            });
        });

        it('validates uri treats scheme as optional', function (done) {

            expect(function () {

                Joi.string().uri({});
            }).to.not.throw();

            done();
        });

        it('validates uri requires uriOptions as an object with a friendly error message', function (done) {

            expect(function () {

                Joi.string().uri('http');
            }).to.throw(Error, 'options must be an object');

            done();
        });

        it('validates uri requires scheme to be a RegExp, String, or Array with a friendly error message', function (done) {

            expect(function () {

                Joi.string().uri({
                    scheme: {}
                });
            }).to.throw(Error, 'scheme must be a RegExp, String, or Array');

            done();
        });

        it('validates uri requires scheme to not be an empty array', function (done) {

            expect(function () {

                Joi.string().uri({
                    scheme: []
                });
            }).to.throw(Error, 'scheme must have at least 1 scheme specified');

            done();
        });

        it('validates uri requires scheme to be an Array of schemes to all be valid schemes with a friendly error message', function (done) {

            expect(function () {

                Joi.string().uri({
                    scheme: [
                        'http',
                        '~!@#$%^&*()_'
                    ]
                });
            }).to.throw(Error, 'scheme at position 1 must be a valid scheme');

            done();
        });

        it('validates uri requires scheme to be an Array of schemes to be strings or RegExp', function (done) {

            expect(function () {

                Joi.string().uri({
                    scheme: [
                        'http',
                        {}
                    ]
                });
            }).to.throw(Error, 'scheme at position 1 must be a RegExp or String');

            done();
        });

        it('validates uri requires scheme to be a valid String scheme with a friendly error message', function (done) {

            expect(function () {

                Joi.string().uri({
                    scheme: '~!@#$%^&*()_'
                });
            }).to.throw(Error, 'scheme at position 0 must be a valid scheme');

            done();
        });

        it('validates isoDate', function (done) {

            Helper.validate(Joi.string().isoDate(), [
                ['2013-06-07T14:21:46.295Z', true],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', true],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', true],
                ['2013-06-07T14:21:46+07:000', false],
                ['2013-06-07T14:21:46-07:00', true],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', true],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', true],
                ['1-1-2013', false],
                ['2013-06-07T14.2334,4', true],
                ['2013-06-07T14,23:34', false],
                ['2013-06-07T24', false],
                ['2013-06-07T24:00', true],
                ['2013-06-07T24:21', false],
                ['2013-06-07 142146.295', true],
                ['2013-06-07 146946.295', false],
                ['2013-06-07 1421,44', true],
                ['2013-W23', true],
                ['2013-W23-1', true],
                ['2013-W2311', false],
                ['2013-W231', true],
                ['2013-M231', false],
                ['2013-W23-1T14:21', true],
                ['2013-W23-1T14:21:', false],
                ['2013-W23-1T14:21:46+07:00', true],
                ['2013-W23-1T14:21:46+07:000', false],
                ['2013-W23-1T14:21:46-07:00', true],
                ['2013-184', true],
                ['2013-1841', false]
            ], done);
        });

        it('validates isoDate with a friendly error message', function (done) {

            var schema = { item: Joi.string().isoDate() };
            Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                expect(err.message).to.contain('must be a valid ISO 8601 date');
                done();
            });
        });

        it('validates combination of isoDate and min', function (done) {

            var rule = Joi.string().isoDate().min(23);
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', true],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', true],
                ['2013-06-07T14:21:46Z', false],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', true],
                ['2013-06-07T14:21:46-07:00', true],
                ['2013-06-07T14:21Z', false],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', false],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min and max', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23);
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', false],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max and invalid', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).invalid('2013-06-07T14:21+07:00');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', false],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max and allow', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, allow and invalid', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21+07:00');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, allow, invalid and allow(\'\')', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21+07:00').allow('');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, allow, invalid and allow(\'\')', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').allow('');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, allow, invalid and regex', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21Z').regex(/Z$/);
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', false],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', false],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, allow, invalid, regex and allow(\'\')', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('2013-06-07T14:21:46.295+07:00').invalid('2013-06-07T14:21Z').regex(/Z$/).allow('');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', true],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', false],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', false],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max and allow(\'\')', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).allow('');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', false],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', true],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', true],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max and regex', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).regex(/Z$/);
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', false],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', false],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, regex and allow(\'\')', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).regex(/Z$/).allow('');
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', false],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', false],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of isoDate, min, max, regex and required', function (done) {

            var rule = Joi.string().isoDate().min(17).max(23).regex(/Z$/).required();
            Helper.validate(rule, [
                ['2013-06-07T14:21:46.295Z', false],
                ['2013-06-07T14:21:46.295Z0', false],
                ['2013-06-07T14:21:46.295+07:00', false],
                ['2013-06-07T14:21:46.295+07:000', false],
                ['2013-06-07T14:21:46.295-07:00', false],
                ['2013-06-07T14:21:46Z', true],
                ['2013-06-07T14:21:46Z0', false],
                ['2013-06-07T14:21:46+07:00', false],
                ['2013-06-07T14:21:46-07:00', false],
                ['2013-06-07T14:21Z', true],
                ['2013-06-07T14:21+07:00', false],
                ['2013-06-07T14:21+07:000', false],
                ['2013-06-07T14:21-07:00', false],
                ['2013-06-07T14:21Z+7:00', false],
                ['2013-06-07', false],
                ['2013-06-07T', false],
                ['2013-06-07T14:21', false],
                ['1-1-2013', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates guid', function (done) {

            Helper.validate(Joi.string().guid(), [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', true],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', true],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false]
            ], done);
        });

        it('validates guid with a friendly error message', function (done) {

            var schema = { item: Joi.string().guid() };
            Joi.compile(schema).validate({ item: 'something' }, function (err, value) {

                expect(err.message).to.contain('must be a valid GUID');
                done();
            });
        });

        it('validates combination of guid and min', function (done) {

            var rule = Joi.string().guid().min(36);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', true],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false],
                ['69593D62-71EA-4548-85E4-04FC71357423', true],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', true],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', false],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', true],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min and max', function (done) {

            var rule = Joi.string().guid().min(32).max(34);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max and invalid', function (done) {

            var rule = Joi.string().guid().min(32).max(34).invalid('b4b2fb69c6244e5eb0698e0c6ec66618');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max and allow', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, allow and invalid', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D').invalid('b4b2fb69c6244e5eb0698e0c6ec66618');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, allow, invalid and allow(\'\')', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D').invalid('b4b2fb69c6244e5eb0698e0c6ec66618').allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, allow and allow(\'\')', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D').allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, allow, invalid and regex', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08').invalid('b4b2fb69c6244e5eb0698e0c6ec66618').regex(/^{7e908/);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, allow, invalid, regex and allow(\'\')', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('{D1A5279D-B27D-4CD4-A05E-EFDD53D08').invalid('b4b2fb69c6244e5eb0698e0c6ec66618').regex(/^{7e908/).allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08', true],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max and allow(\'\')', function (done) {

            var rule = Joi.string().guid().min(32).max(34).allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', true],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', true],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', true],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max and regex', function (done) {

            var rule = Joi.string().guid().min(32).max(34).regex(/^{7e9081/i);
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, regex and allow(\'\')', function (done) {

            var rule = Joi.string().guid().min(32).max(34).regex(/^{7e9081/i).allow('');
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', true],
                [null, false]
            ], done);
        });

        it('validates combination of guid, min, max, regex and required', function (done) {

            var rule = Joi.string().guid().min(32).max(34).regex(/^{7e9081/i).required();
            Helper.validate(rule, [
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['{B59511BD6A5F4DF09ECF562A108D8A2E}', false],
                ['69593D62-71EA-4548-85E4-04FC71357423', false],
                ['677E2553DD4D43B09DA77414DB1EB8EA', false],
                ['{5ba3bba3-729a-4717-88c1-b7c4b7ba80db}', false],
                ['{7e9081b59a6d4cc1a8c347f69fb4198d}', true],
                ['0c74f13f-fa83-4c48-9b33-68921dd72463', false],
                ['b4b2fb69c6244e5eb0698e0c6ec66618', false],
                ['{283B67B2-430F-4E6F-97E6-19041992-C1B0}', false],
                ['{D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D', false],
                ['D1A5279D-B27D-4CD4-A05E-EFDD53D08E8D}', false],
                ['', false],
                [null, false]
            ], done);
        });

        it('validates an hexadecimal string', function (done) {

            var rule = Joi.string().hex();
            Helper.validate(rule, [
                ['123456789abcdef', true],
                ['123456789AbCdEf', true],
                ['123afg', false, null, '"value" must only contain hexadecimal characters']
            ], done);
        });
    });
});
