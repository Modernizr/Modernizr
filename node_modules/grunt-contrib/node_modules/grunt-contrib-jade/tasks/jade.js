/*
 * grunt-contrib-jade
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('jade', 'Compile Jade templates into HTML.', function() {
    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      data: {}
    });

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var srcFiles;
    var taskOutput;

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);

      taskOutput = [];

      srcFiles.forEach(function(srcFile) {
        taskOutput.push(compileJade(srcFile, options, options.data));
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join('\n'));
        grunt.log.writeln('File ' + file.dest.cyan + ' created.');
      }
    });
  });

  var compileJade = function(srcFile, options, data) {
    options = grunt.util._.extend({filename: srcFile}, options);
    delete options.data;

    var srcCode = grunt.file.read(srcFile);

    try {
      return require('jade').compile(srcCode, options)(data);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('Jade failed to compile.');
    }
  };
};