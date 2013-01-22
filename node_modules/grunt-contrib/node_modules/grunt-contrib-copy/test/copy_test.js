var grunt = require('grunt');
var fs = require('fs');

exports.copy = {
  test: function(test) {
    'use strict';

    test.expect(2);

    var actual = fs.readdirSync('tmp/copy_test_files').sort();
    var expected = fs.readdirSync('test/expected/copy_test_files').sort();
    test.deepEqual(expected, actual, 'should copy several files');

    actual = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
    expected = fs.readdirSync('test/expected/copy_test_v0.1.0').sort();
    test.deepEqual(expected, actual, 'should copy several folders and files (with template support)');

    test.done();
  },
  flatten: function(test) {
    'use strict';

    test.expect(1);

    var actual = fs.readdirSync('tmp/copy_test_flatten').sort();
    var expected = fs.readdirSync('test/expected/copy_test_flatten').sort();
    test.deepEqual(expected, actual, 'should create a flat structure');

    test.done();
  },
  minimatch: function(test) {
    'use strict';

    test.expect(1);

    var actual = fs.readdirSync('tmp/copy_minimatch').sort();
    var expected = fs.readdirSync('test/expected/copy_minimatch').sort();
    test.deepEqual(expected, actual, 'should allow for minimatch dot option');

    test.done();
  },
  single: function(test) {
    'use strict';

    test.expect(1);

    var actual = grunt.file.read('tmp/single.js');
    var expected = grunt.file.read('test/expected/single.js');
    test.equal(expected, actual, 'should allow for single file copy');

    test.done();
  }
};