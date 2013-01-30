/*
 * grunt-contrib-less
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var path = require('path');

  var less = require('less');

  var lessOptions = {
    parse: ['paths', 'optimization', 'filename', 'strictImports', 'dumpLineNumbers'],
    render: ['compress', 'yuicompress']
  };

  grunt.registerMultiTask('less', 'Compile LESS files to CSS', function() {
    var helpers = require('grunt-lib-contrib').init(grunt);

    var options = helpers.options(this, {
      basePath: false,
      flatten: false
    });

    grunt.verbose.writeflags(options, 'Options');

    // TODO: ditch this when grunt v0.4 is released
    this.files = helpers.normalizeMultiTaskFiles(this.data, this.target);

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

          compileLess(srcFile, options, function(css, err) {
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
          compileLess(srcFile, options, function(css, err) {
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

  var formatLessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    return e.filename + ': ' + pos + ' ' + e.message;
  };

  var lessError = function(e) {
    var message = less.formatError ? less.formatError(e) : formatLessError(e);

    grunt.log.error(message);
    grunt.fail.warn('Error compiling LESS.');
  };

  // TODO: ditch when grunt upgrades to underscore 1.3.3
  var pick = function(obj, keys) {
    var result = {};
    keys.forEach(function(key) {
      if (key in obj) { result[key] = obj[key]; }
    });

    return result;
  };

  var compileLess = function(srcFile, options, callback) {
    options = grunt.util._.extend({filename: srcFile}, options);
    options.paths = options.paths || [path.dirname(srcFile)];

    var css;
    var srcCode = grunt.file.read(srcFile);

    var parser = new less.Parser(pick(options, lessOptions.parse));

    parser.parse(srcCode, function(parse_err, tree) {
      if (parse_err) {
        lessError(parse_err);
      }

      try {
        css = tree.toCSS(pick(options, lessOptions.render));
        callback(css, null);
      } catch (e) {
        lessError(e);
        callback(css, true);
      }
    });
  };
};
