/*
 * grunt-lib-contrib
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tyler Kellen, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    test_vars: {
      source: 'source/'
    },

    test_task: {
      options: {
        param: 'task',
        param2: 'task',
        template: '<%= test_vars.source %>',
        data: {
          template: ['<%= test_vars.source %>']
        }
      },
      target: {
        options: {
          param: 'target'
        }
      }
    },

    lint: {
      all: ['grunt.js', 'lib/*.js', '<config:test.tasks>']
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

    // Unit tests.
    test: {
      tasks: ['test/*_test.js']
    }
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};