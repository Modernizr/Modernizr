/*
 * grunt-contrib-less
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'tasks/*.js', '<config:nodeunit.tasks>']
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      test: ['tmp']
    },

    // Configuration to be run (and then tested).
    less: {
      compile: {
        options: {
          paths: ['test/fixtures/include']
        },
        files: {
          'tmp/less.css': ['test/fixtures/style.less'],
          'tmp/concat.css': ['test/fixtures/style.less', 'test/fixtures/style2.less'],
          'tmp/individual/*.css': ['test/fixtures/style*.less', 'test/fixtures/level2/*.less']
        }
      },
      compress: {
        options: {
          paths: ['test/fixtures/include'],
          compress: true
        },
        files: {
          'tmp/compress.css': ['test/fixtures/style.less']
        }
      },
      flatten: {
        files: {
          'tmp/individual_flatten/*.css': ['test/fixtures/style*.less', 'test/fixtures/level2/*.less']
        },
        options: {
          flatten: true,
          paths: ['test/fixtures/include']
        },
      },
      nopaths: {
        files: {
          'tmp/nopaths.css': ['test/fixtures/nopaths.less'],
        }
      },
      yuicompress: {
        options: {
          paths: ['test/fixtures/include'],
          yuicompress: true
        },
        files: {
          'tmp/yuicompress.css': ['test/fixtures/style.less']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tasks: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // The clean plugin helps in testing.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.renameTask('test', 'nodeunit');
  grunt.registerTask('test', 'clean less nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};
