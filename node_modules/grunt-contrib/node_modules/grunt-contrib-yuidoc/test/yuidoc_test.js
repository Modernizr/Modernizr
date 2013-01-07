var grunt = require('grunt');

// TODO: ditch this when grunt v0.4 is released
var fs = require('fs');
var path = require('path');
grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;

exports['yuidoc'] = {
  main: function(test) {
    'use strict';

    var expect, result, data;
    test.expect(6);

    expect = true;
    result = grunt.file.exists('tmp/yuidoca/data.json');
    test.equal(result, expect, 'If provided with a string path, Should generate JSON from source code');

    expect = true;
    result = grunt.file.exists('tmp/yuidoca/index.html');
    test.equal(result, expect, 'If provided with a string path, Should create template files for viewing data.json');

    expect = true;
    result = grunt.file.exists('tmp/yuidocb/data.json');
    test.equal(result, expect, 'If provided with an array of paths, should generate JSON from source code');

    expect = true;
    result = grunt.file.exists('tmp/yuidocb/index.html');
    test.equal(result, expect, 'If provided with an array of paths, should create template files for viewing data.json');

    expect = 'Grunt Test Title';
    data = grunt.file.readJSON('tmp/yuidocc/data.json');
    result = data.project.name;
    test.equal(result, expect, 'Project properties (name, description, version etc.) should be processed as templates.');

    var pkg = grunt.file.readJSON('package.json');
    expect = 'Description Text for ' + pkg.name;
    data = grunt.file.readJSON('tmp/yuidocc/data.json');
    result = data.project.description;
    test.equal(result, expect, 'Project properties (name, description, version etc.) should be processed as templates.');

    test.done();
  }
};
