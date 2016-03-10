var vows = require('vows'),
    path = require('path'),
    assert = require('assert'),
    parse = require('../lib'),
    yuiFile = path.join(__dirname, 'info/parts.info');

var tests = {
    'Should be loaded': {
        topic: function() {
            return parse;
        },
        'should be a function': function(topic) {
            assert.isFunction(topic);
        }
    },
    'Catch bad file passing': {
        topic: function() {
            parse('foobar', this.callback);
        },
        'should return an error': function(err, data) {
            assert.isUndefined(data);
            assert.isString(err);
        }
    },
    'Parse as a string': {
        topic: function() {
            parse('TN:TestName\nSF:foobar.js\nend_of_record\n', this.callback);
        },
        'should parse': function(err, data) {
            assert.isArray(data);
            assert.equal('TestName', data[0].title);
            assert.equal('foobar.js', data[0].file);
        }
    },
    'parse the file': {
        topic: function() {
            parse(yuiFile, this.callback);
        },
        'should return an array': function(err, data) {
            assert.isNull(err);
            assert.isArray(data);
        },
        'should contain 3 keys': function(err, data) {
            assert.equal(data.length, 3);
        },
        'first key should have 5 properties': function(err, data) {
            var keys = Object.keys(data[0]);
            assert.deepEqual(keys.sort(), [ 'branches', 'file', 'functions', 'lines', 'title' ])
        },
        'verify test titles': function(err, data) {
            assert.equal(data[0].title, 'Test #1');
            assert.equal(data[1].title, 'Test #2');
            assert.equal(data[2].title, 'Test #3');
        },
        'verify test files': function(err, data) {
            assert.equal(data[0].file, 'anim-base/anim-base-coverage.js');
            assert.equal(data[1].file, 'anim-easing/anim-easing-coverage.js');
            assert.equal(data[2].file, 'javascript/common.js');
        },
        'verify number of functions': function(err, data) {
            assert.equal(data[0].functions.found, 29);
            assert.equal(data[0].functions.hit, 23);
            assert.equal(data[1].functions.found, 17);
            assert.equal(data[1].functions.hit, 17);
            assert.equal(data[2].functions.found, 2);
            assert.equal(data[2].functions.hit, 2);
        },
        'verify number of branches': function(err, data) {
            assert.equal(data[1].branches.found, 23);
            assert.equal(data[1].branches.hit, 22);
            assert.equal(data[1].branches.found, data[1].branches.details.length);
            assert.equal(data[1].branches.details[data[1].branches.details.length - 1].taken, 0);
            assert.equal(data[2].branches.found, 0);
            assert.equal(data[2].branches.hit, 0);
            assert.deepEqual(data[2].branches.details, []);
        },
        'verify function details': function(err, data) {
            assert.equal(data[0].functions.details.length, 29);
            assert.equal(data[1].functions.details.length, 17);
            assert.equal(data[2].functions.details.length, 2);
            assert.deepEqual(data[0].functions.details[0], { name: '(anonymous 1)', line: 7, hit: 6 });
            assert.deepEqual(data[0].functions.details[11], { name: '_start', line: 475, hit: 231 });

            assert.deepEqual(data[0].functions.details[27], { name: 'stop', line: 466, hit: 9 });
            assert.deepEqual(data[0].functions.details[28], { name: 'stop', line: 389, hit: 0 });

            assert.deepEqual(data[1].functions.details[4], { name: 'bounceBoth', line: 345, hit: 36 });

            assert.deepEqual(data[2].functions.details[1], { name: 'javascript', line: 3, hit: 2 });

        },
        'verify number of lines': function(err, data) {
            assert.equal(data[0].lines.found, 181);
            assert.equal(data[0].lines.hit, 143);
            assert.equal(data[1].lines.found, 76);
            assert.equal(data[1].lines.hit, 70);
        },
        'verify line details': function(err, data) {
            assert.equal(data[0].lines.details.length, 181);
            assert.equal(data[1].lines.details.length, 76);
            assert.equal(data[2].lines.details.length, 6);
            assert.deepEqual(data[0].lines.details[0], { line: 7, hit: 6 });
            assert.deepEqual(data[0].lines.details[10], { line: 91, hit: 6 });

            assert.deepEqual(data[1].lines.details[20], { line: 157, hit: 32 });
            assert.deepEqual(data[1].lines.details[64], { line: 313, hit: 51 });

            assert.deepEqual(data[2].lines.details[2], { line: 3, hit: 19 });
        },

    }
};

vows.describe('Test Loading and Bindings').addBatch(tests)['export'](module);

