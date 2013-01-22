var grunt = require('grunt');

exports['mincss'] = {
  main: function(test) {
    'use strict';

    test.expect(1);

    var expect = 'body{margin:0;font-size:18px}a{color:#00f}h1{font-size:48px;font-weight:700}';
    var result = grunt.file.read('tmp/style.css');
    test.equal(expect, result, 'should concat and minify an array of css files in order using clean-css');

    test.done();
  }
};