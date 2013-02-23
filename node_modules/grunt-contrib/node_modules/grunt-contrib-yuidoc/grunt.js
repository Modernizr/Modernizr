/*
 * grunt-contrib-yuidoc
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 George Pantazis, contributors
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
    yuidoc: {
      compileA: {
        'name': 'Grunt Test',
        'description': 'Grunt Test Description',
        'version': '1.2.1',
        'url': 'http://test.com/',
        options: {
          paths: 'test/fixtures/app/',
          outdir: 'tmp/yuidoca/'
        }
      },

      compileB: {
        'name': 'Grunt Test',
        'description': 'Grunt Test Description',
        'version': '1.2.1',
        'url': 'http://test.com/',
        options: {
          paths: [
            'test/fixtures/app/',
            'test/fixtures/otherapp/'
          ],
          outdir: 'tmp/yuidocb/'
        }
      },

      compileC: {
        'name': "Grunt Test <%= 'Title' %>",
        'description': 'Description Text for <%= pkg.name %>',
        'version': '<%= pkg.version %>',
        'url': 'http://test.com/',
        options: {
          paths: 'test/fixtures/app/',
          outdir: 'tmp/yuidocc/'
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
  grunt.registerTask('test', 'clean yuidoc nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};
