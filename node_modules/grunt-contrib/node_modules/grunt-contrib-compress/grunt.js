/*
 * grunt-contrib-compress
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Chris Talkington, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    test_vars: {
      name: 'grunt-contrib-compress',
      version: '0.1.0'
    },

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

    files: {
      compress_test: 'test/fixtures/folder_one'
    },

    // Configuration to be run (and then tested).
    compress: {
      main: {
        files: {
          'tmp/compress_test_files.zip': ['test/fixtures/*'],
          'tmp/compress_test_v<%= test_vars.version %>.zip': ['test/fixtures/**'],
          'tmp/compress_test_files_template.zip': ['<%= files.compress_test %>/**'],

          'tmp/compress_test_files.tar': ['test/fixtures/*'],
          'tmp/compress_test_v<%= test_vars.version %>.tar': ['test/fixtures/**'],
          'tmp/compress_test_files_template.tar': ['<%= files.compress_test %>/**'],

          'tmp/compress_test_files.tgz': ['test/fixtures/*'],
          'tmp/compress_test_v<%= test_vars.version %>.tgz': ['test/fixtures/**'],
          'tmp/compress_test_files_template.tgz': ['<%= files.compress_test %>/**'],

          'tmp/compress_test_file.gz': ['test/fixtures/test.js'],
          'tmp/compress_test_file2.gz': ['test/fixtures/folder_one/one.js']
        }
      },

      flatten: {
        options: {
          flatten: true
        },
        files: {
          'tmp/compress_test_flatten.zip': ['test/fixtures/**'],
          'tmp/compress_test_flatten.tar': ['test/fixtures/**'],
          'tmp/compress_test_flatten.tgz': ['test/fixtures/**']
        }
      },

      rootdir: {
        options: {
          rootDir: 'abc123'
        },
        files: {
          'tmp/compress_test_rootdir.zip': ['test/fixtures/**'],
          'tmp/compress_test_rootdir.tar': ['test/fixtures/**'],
          'tmp/compress_test_rootdir.tgz': ['test/fixtures/**']
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
  grunt.registerTask('test', 'clean compress nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};