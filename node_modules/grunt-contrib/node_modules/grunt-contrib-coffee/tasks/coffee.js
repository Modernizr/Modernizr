/*
 * grunt-contrib-coffee
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('coffee', 'Compile CoffeeScript files into JavaScript', function() {
    var path = require('path');

    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      bare: false,
      basePath: false,
      flatten: false
    });

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var basePath;
    var newFileDest;

    var srcFiles;
    var srcCompiled;
    var taskOutput;

    this.files.forEach(function(file) {
      file.dest = path.normalize(file.dest);
      srcFiles = grunt.file.expandFiles(file.src);

      if (srcFiles.length === 0) {
        grunt.log.writeln('Unable to compile; no valid source files were found.');
        return;
      }

      taskOutput = [];

      srcFiles.forEach(function(srcFile) {
        srcCompiled = compileCoffee(srcFile, options);

        if (helpers.isIndividualDest(file.dest)) {
          basePath = helpers.findBasePath(srcFiles, options.basePath);
          newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath, options.flatten);

          grunt.file.write(newFileDest, srcCompiled || '');
          grunt.log.writeln('File ' + newFileDest.cyan + ' created.');
        } else {
          taskOutput.push(srcCompiled);
        }
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join('\n') || '');
        grunt.log.writeln('File ' + file.dest.cyan + ' created.');
      }
    });
  });

  var compileCoffee = function(srcFile, options) {
    options = grunt.util._.extend({filename: srcFile}, options);
    delete options.basePath;
    delete options.flatten;

    var srcCode = grunt.file.read(srcFile);

    try {
      return require('coffee-script').compile(srcCode, options);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('CoffeeScript failed to compile.');
    }
  };
};
