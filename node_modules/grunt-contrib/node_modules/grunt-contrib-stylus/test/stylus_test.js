var grunt = require('grunt');
var fs = require('fs');

exports.stylus = {
  compile: function(test) {
    'use strict';

    test.expect(3);

    var actual = grunt.file.read('tmp/stylus.css');
    var expected = grunt.file.read('test/expected/stylus.css');
    test.equal(expected, actual, 'should compile stylus to css, handling includes and compression');

    actual = grunt.file.read('tmp/concat.css');
    expected = grunt.file.read('test/expected/concat.css');
    test.equal(expected, actual, 'should concat output when passed an array');

    actual = fs.readdirSync('tmp/individual').sort();
    expected = fs.readdirSync('test/expected/individual').sort();
    test.deepEqual(expected, actual, 'should individually compile files');

    test.done();
  },
  flatten: function(test) {
    'use strict';

    test.expect(1);

    var actual = fs.readdirSync('tmp/individual_flatten').sort();
    var expected = fs.readdirSync('test/expected/individual_flatten').sort();
    test.deepEqual(expected, actual, 'should individually compile files (to flat structure)');

    test.done();
  }
};