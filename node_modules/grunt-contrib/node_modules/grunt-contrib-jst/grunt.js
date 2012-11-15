/*
 * grunt-contrib-jst
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Tim Branyen, contributors
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
    jst: {
      compile: {
        files: {
          "tmp/jst.js": ["test/fixtures/template.html"]
        }
      },
      uglyfile: {
        files: {
          "tmp/uglyfile.js": ["test/fixtures/*bad-filename*"]
        }
      },
      ns_nested: {
        options: {
          namespace: "MyApp.JST.Main"
        },
        files: {
          "tmp/ns_nested.js": ["test/fixtures/template.html"]
        }
      },
      ns_nested_this: {
        options: {
          namespace: "this.MyApp.JST.Main"
        },
        files: {
          "tmp/ns_nested_this.js": ["test/fixtures/template.html"]
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
  grunt.registerTask('test', 'clean jst nodeunit');

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};