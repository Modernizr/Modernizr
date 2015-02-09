/*jshint node: true */
/*global module */
module.exports = function( grunt ) {
  'use strict';

  var browsers = grunt.file.readJSON('lib/sauce-browsers.json');

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    generate: {
      dest: './dist/modernizr-build.js'
    },
    qunit: {
      files: ['test/index.html']
    },
    nodeunit: {
      files: ['test/api/*.js']
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: 'jshint',
      tests: {
        files: '<%= jshint.tests.files.src %>',
        tasks: [
          'jshint:tests',
          'qunit'
        ]
      }
    },
    jshint: {
      options: {
        jshintrc: true,
        ignores: [
          'src/html5printshiv.js',
          'src/html5shiv.js'
        ]
      },
      files: [
        'Gruntfile.js',
        'src/*.js',
        'feature-detects/**/*.js'
      ],
      tests: {
        options: {
          jquery: true,
          globals: {
            Modernizr: true,
            TEST: true,
            QUnit: true
          }
        },
        files: {
          src: ['test/js/*.js']
        }
      },
      lib: {
        options: {
          node: true
        },
        files: {
          src: ['lib/*.js']
        }
      }
    },
    clean: {
      dist: ['dist']
    },
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },
    'saucelabs-qunit': {
      all: {
        options: {
          urls: ['http://127.0.0.1:9999/test/basic.html'],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 2,
          browsers: browsers,
          testname: 'qunit tests',
          tags: [
            'master',
            '<%= pkg.version %>'
          ]
        }
      }
    }
  });

  grunt.registerMultiTask('generate', 'Create a version of Modernizr from Grunt', function() {
    var config = require('./lib/config-all');
    var modernizr = require('./lib/cli');
    var dest = this.data;

    modernizr.build(config, function(output) {
      grunt.file.write(dest, output);
    });
  });

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'build', 'qunit', 'nodeunit', 'clean']);

  // Sauce labs CI task
  grunt.registerTask('sauce', ['connect','saucelabs-qunit']);

  // Travis CI task.
  grunt.registerTask('travis', ['test']);

  // Build
  grunt.registerTask('build', [
    'clean',
    'generate'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
