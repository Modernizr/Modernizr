/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    test_vars: {
      name: 'grunt-contrib-copy',
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

    // Configuration to be run (and then tested).
    copy: {
      test: {
        files: {
          'tmp/copy_test_files/': ['test/fixtures/*'],
          'tmp/copy_test_v<%= test_vars.version %>/': ['test/fixtures/**']
        }
      },

      flatten: {
        options: {
          flatten: true
        },
        files: {
          'tmp/copy_test_flatten/': ['test/fixtures/**']
        }
      },

      minimatch: {
        options: {
          minimatch: {
            dot: true
          }
        },
        files: {
          'tmp/copy_minimatch/': ['test/fixtures/*']
        }
      },

      single: {
        files: {
          'tmp/single.js': ['test/fixtures/test.js']
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

  // Whenever the 'test' task is run, first clean the 'tmp' dir, then run this
  // plugin's task(s), then test the result.
  grunt.renameTask('test', 'nodeunit');
  grunt.registerTask('test', 'clean copy nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};