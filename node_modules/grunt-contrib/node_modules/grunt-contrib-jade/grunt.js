/*
 * grunt-contrib-jade
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
    jade: {
      compile: {
        files: {
          'tmp/jade.html': ['test/fixtures/jade.jade'],
          'tmp/jade2.html': ['test/fixtures/jade2.jade'],
          'tmp/jadeInclude.html': ['test/fixtures/jadeInclude.jade'],
          'tmp/jadeTemplate.html': ['test/fixtures/jadeTemplate.jade']
        },
        options: {
          data: {
            test: true,
            year: '<%= grunt.template.today("yyyy") %>'
          }
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
  grunt.registerTask('test', 'clean jade nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};