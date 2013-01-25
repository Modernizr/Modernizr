/*
 * grunt-contrib-stylus
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  grunt.registerMultiTask('stylus', 'Compile Stylus files into CSS', function() {
    var path = require('path');

    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      basePath: false,
      flatten: false
    });

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

    var done = this.async();

    var basePath;
    var newFileDest;

    var srcFiles;

    grunt.util.async.forEachSeries(this.files, function(file, next) {
      file.dest = path.normalize(file.dest);
      srcFiles = grunt.file.expandFiles(file.src);

      if (srcFiles.length === 0) {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      }

      if (helpers.isIndividualDest(file.dest)) {
        basePath = helpers.findBasePath(srcFiles, options.basePath);

        grunt.util.async.forEachSeries(srcFiles, function(srcFile, nextFile) {
          newFileDest = helpers.buildIndividualDest(file.dest, srcFile, basePath, options.flatten);

          compileStylus(srcFile, options, function(css, err) {
            if(!err) {
              grunt.file.write(newFileDest, css || '');
              grunt.log.writeln('File ' + newFileDest.cyan + ' created.');

              nextFile(null);
            } else {
              done();
            }
          });
        }, function(err) {
          next();
        });
      } else {
        grunt.util.async.concatSeries(srcFiles, function(srcFile, nextConcat) {
          compileStylus(srcFile, options, function(css, err) {
            if(!err) {
              nextConcat(null, css);
            } else {
              done();
            }
          });
        }, function(err, css) {
          grunt.file.write(file.dest, css.join('\n') || '');
          grunt.log.writeln('File ' + file.dest.cyan + ' created.');

          next();
        });
      }
    }, function() {
      done();
    });
  });

  var compileStylus = function(srcFile, options, callback) {
    options = grunt.util._.extend({filename: srcFile}, options);
    delete options.basePath;
    delete options.flatten;

    var srcCode = grunt.file.read(srcFile);
    var s = require('stylus')(srcCode);

    try {
      s.use(require('nib')());
    } catch (e) {}

    grunt.util._.each(options, function(value, key) {
      s.set(key, value);
    });

    s.render(function(err, css) {
      if (err) {
        grunt.log.error(err);
        grunt.fail.warn('Stylus failed to compile.');

        callback(css, true);
      } else {
        callback(css, null);
      }
    });
  };
};