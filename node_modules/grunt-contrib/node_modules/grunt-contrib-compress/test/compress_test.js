var grunt = require('grunt');
var fs = require('fs');

var getSize = function(filename) {
  'use strict';

  try {
    return fs.statSync(filename).size;
  } catch (e) {
    return 0;
  }
};

exports.compress = {
  main: function(test) {
    'use strict';

    test.expect(11);

    // Zip
    var actual = getSize('tmp/compress_test_files.zip');
    var expected = getSize('test/expected/compress_test_files.zip');
    test.equal(expected, actual, 'should compress files into zip');

    actual = getSize('tmp/compress_test_v0.1.0.zip');
    expected = getSize('test/expected/compress_test_v0.1.0.zip');
    test.equal(expected, actual, 'should compress folders and their files into zip (with template support)');

    actual = getSize('tmp/compress_test_files_template.zip');
    expected = getSize('test/expected/compress_test_files_template.zip');
    test.equal(expected, actual, 'should compress files and folders into zip (grunt template in source)');

    // Tar
    actual = getSize('tmp/compress_test_files.tar');
    expected = getSize('test/expected/compress_test_files.tar');
    test.equal(expected, actual, 'should add files into tar');

    actual = getSize('tmp/compress_test_v0.1.0.tar');
    expected = getSize('test/expected/compress_test_v0.1.0.tar');
    test.equal(expected, actual, 'should add folders and their files into tar (with template support)');

    actual = getSize('tmp/compress_test_files_template.tar');
    expected = getSize('test/expected/compress_test_files_template.tar');
    test.equal(expected, actual, 'should add files and folders into tar (grunt template in source)');

    // Tar (gzip)
    actual = getSize('tmp/compress_test_files.tgz') >= 200;
    expected = true;
    test.equal(expected, actual, 'should compress files into tar');

    actual = getSize('tmp/compress_test_v0.1.0.tgz') >= 350;
    expected = true;
    test.equal(expected, actual, 'should compress folders and their files into tgz (with template support)');

    actual = getSize('tmp/compress_test_files_template.tgz') >= 200;
    expected = true;
    test.equal(expected, actual, 'should compress files and folders into tgz (grunt template in source)');

    // gzip
    actual = getSize('tmp/compress_test_file.gz');
    expected = getSize('test/expected/compress_test_file.gz');
    test.equal(expected, actual, 'should gzip file');

    actual = getSize('tmp/compress_test_file2.gz');
    expected = getSize('test/expected/compress_test_file2.gz');
    test.equal(expected, actual, 'should gzip another file (multiple dest:source pairs)');

    test.done();
  },
  flatten: function(test) {
    'use strict';

    test.expect(3);

    var actual = getSize('tmp/compress_test_flatten.zip');
    var expected = getSize('test/expected/compress_test_flatten.zip');
    test.equal(expected, actual, 'should create a flat internal structure');

    actual = getSize('tmp/compress_test_flatten.tar');
    expected = getSize('test/expected/compress_test_flatten.tar');
    test.equal(expected, actual, 'should create a flat internal structure');

    actual = getSize('tmp/compress_test_flatten.tgz') >= 320;
    expected = true;
    test.equal(expected, actual, 'should create a flat internal structure');

    test.done();
  },
  rootdir: function(test) {
    'use strict';

    test.expect(3);

    var actual = getSize('tmp/compress_test_rootdir.zip');
    var expected = getSize('test/expected/compress_test_rootdir.zip');
    test.equal(expected, actual, 'should compress folders and their files into zip (with a root dir)');

    actual = getSize('tmp/compress_test_rootdir.tar');
    expected = getSize('test/expected/compress_test_rootdir.tar');
    test.equal(expected, actual, 'should compress folders and their files into tar (with a custom root dir)');

    actual = getSize('tmp/compress_test_rootdir.tgz') >= 200;
    expected = true;
    test.equal(expected, actual, 'should compress folders and their files into tgz (with a custom root dir)');

    test.done();
  }
};