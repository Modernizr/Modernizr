/*jshint node: true */

// TODO: Gruntfile is temporarily broken, must run as node package.
// TODO: Re-impliment Grunt for testing, fix tests

module.exports = function( grunt ) {
  'use strict';

  var browsers = grunt.file.readJSON('test/sauce-browsers.json');

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
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
        boss: true,
        browser: true,
        curly: false,
        devel: true,
        eqeqeq: false,
        eqnull: true,
        expr: true,
        evil: true,
        immed: false,
        laxcomma: true,
        newcap: false,
        noarg: true,
        quotmark: 'single',
        smarttabs: true,
        sub: true,
        trailing: true,
        undef: true,
        unused: true,
        globals: {
          Modernizr: true,
          DocumentTouch: true,
          TEST: true,
          SVGFEColorMatrixElement: true,
          Blob: true,
          define: true,
          require: true
        },
        ignores: [
          'src/load.js'
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
      dist: ['dist'],
      postbuild: [
        'build',
        'tmp'
      ]
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

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'build', 'qunit', 'nodeunit']);

  // Sauce labs CI task
  grunt.registerTask('sauce', ['connect','saucelabs-qunit']);

  // Travis CI task.
  grunt.registerTask('travis', ['test']);

  // Build
  grunt.registerTask('build', [
    'clean:dist',
    'clean:postbuild'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
