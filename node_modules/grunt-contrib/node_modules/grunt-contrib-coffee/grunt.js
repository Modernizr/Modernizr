/*
 * grunt-contrib-coffee
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Eric Woroshow, contributors
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
    coffee: {
      options: {
        bare: true
      },
      compile: {
        files: {
          'tmp/coffee.js': ['test/fixtures/coffee1.coffee'],
          'tmp/concat.js': ['test/fixtures/coffee1.coffee', 'test/fixtures/coffee2.coffee'],
          'tmp/individual/*.js': ['test/fixtures/coffee1.coffee', 'test/fixtures/coffee2.coffee', 'test/fixtures/level2/coffee3.coffee']
        }
      },
      flatten: {
        files: {
          'tmp/individual_flatten/*.js': ['test/fixtures/coffee1.coffee', 'test/fixtures/coffee2.coffee', 'test/fixtures/level2/coffee3.coffee']
        },
        options: {
          flatten: true
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
  grunt.registerTask('test', 'clean coffee nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};