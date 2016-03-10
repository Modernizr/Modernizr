var Lab = require('lab');
var Code = require('code');
var IsEmail = require('..');
var Tests = require('./tests.json');

var internals = {
    defaultThreshold: 16
};

// Test shortcuts
var isEmail = IsEmail;
var lab = exports.lab = Lab.script();
var before = lab.before;
var after = lab.after;
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

// Diagnoses
var diag = isEmail.diagnoses;

// Expectations
var expectations = Tests.map(function mapper (value) {

    value[1] = diag[value[1]];
    return value;
});

// Null characters aren't supported in JSON
expectations.push(['test@[\0', diag.errExpectingDTEXT]);
expectations.push(['(\0)test@example.com', diag.errExpectingCTEXT]);

var tldExpectations = [
    ['shouldbe@invalid', diag.errUnknownTLD],
    ['shouldbe@example.com', diag.valid]
];

describe('isEmail', function () {

    it('should check options.tldWhitelist', function (done) {

        expect(isEmail('person@top', {
            tldWhitelist: 'top',
            checkDNS: false
        })).to.equal(true);

        expect(isEmail('person@top', {
            tldWhitelist: ['com'],
            checkDNS: false
        })).to.equal(false);

        expect(function () {

            isEmail('', {
                tldWhitelist: 77
            });
        }).to.throw(/tldWhitelist/);
        done();
    });

    it('should check options.minDomainAtoms', function (done) {

        expect(function () {

            isEmail('person@top', {
                minDomainAtoms: -1
            });
        }).to.throw(/minDomainAtoms/);

        expect(function () {

            isEmail('person@top', {
                minDomainAtoms: 1.5
            });
        }).to.throw(/minDomainAtoms/);
        done();
    });

    it('should use options.errorLevel', function (done) {

        expect(isEmail('person@123', {
            errorLevel: diag.rfc5321TLDNumeric + 1
        })).to.equal(0);

        expect(isEmail('person@123', {
            errorLevel: diag.rfc5321TLDNumeric
        })).to.equal(diag.rfc5321TLDNumeric);
        done();
    });

    it('should ensure callback provided with checkDNS', function (done) {

        expect(function () {

            isEmail('person@top', {
                checkDNS: true
            });
        }).to.throw(/(?=.*\bcheckDNS\b)(?=.*\bcallback\b)/);
        done();
    });

    it('should handle omitted options', function (done) {

        expect(isEmail(expectations[0][0])).to.equal(expectations[0][1] < internals.defaultThreshold);
        done();
    });

    it('should handle omitted options with callback', function (done) {

        isEmail(expectations[0][0], function (res) {

            expect(res).to.equal(expectations[0][1] < internals.defaultThreshold);
            done();
        });
    });

    expectations.forEach(function (obj, i) {

        var email = obj[0], result = obj[1];
        it('should handle test ' + (i + 1), function (done) {

            isEmail(email, {
                errorLevel: 0,
                checkDNS: true
            }, function (res) {

                expect(res).to.equal(result);
                done();
            });
        });
    });

    tldExpectations.forEach(function (obj, i) {

        var email = obj[0];
        var result = obj[1];

        it('should handle tld test ' + (i + 1), function (done) {

            expect(isEmail(email, {
                errorLevel: 0,
                tldWhitelist: {
                    com: true
                }
            })).to.equal(result);

            expect(isEmail(email, {
                errorLevel: 0,
                tldWhitelist: ['com']
            })).to.equal(result);

            done();
        });
    });

    it('should handle domain atom test 1', function (done) {

        expect(isEmail('shouldbe@invalid', {
            errorLevel: 0,
            minDomainAtoms: 2
        })).to.equal(diag.errDomainTooShort);

        done();
    });

    it('should handle domain atom test 2', function (done) {

        expect(isEmail('valid@example.com', {
            errorLevel: 0,
            minDomainAtoms: 2
        })).to.equal(diag.valid);

        done();
    });
});
