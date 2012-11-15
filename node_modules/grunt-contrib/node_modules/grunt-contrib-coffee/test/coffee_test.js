var grunt = require('grunt');
var fs = require('fs');

exports.coffee = {
  compile: function(test) {
    'use strict';

    test.expect(3);

    var actual = grunt.file.read('tmp/coffee.js');
    var expected = grunt.file.read('test/expected/coffee.js');
    test.equal(expected, actual, 'should compile coffeescript to javascript');

    actual = grunt.file.read('tmp/concat.js');
    expected = grunt.file.read('test/expected/concat.js');
    test.equal(expected, actual, 'should compile multiple coffeescript files to a single javascript file');

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