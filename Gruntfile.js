// TODO: Gruntfile is temporarily broken, must run as node package.
// TODO: Re-impliment Grunt for testing, fix tests

module.exports = function( grunt ) {
  'use strict';

  var browsers = grunt.file.readJSON('test/sauce-browsers.json');

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        boss: true,
        browser: true,
        devel: true,
        eqeqeq: false,
        eqnull: true,
        expr: true,
        immed: false,
        noarg: true,
        quotmark: 'single',
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
          // Vendor files
          'src/load.js'
        ]
      },
      source: {
        files: {
          src: [
            'src/*.js',
            'feature-detects/**/*.js'
          ]
        }
      },
      builder: {
        options: {
          node: true
        },
        files: {
          src: [
            'lib/*.js',
            'Gruntfile.js'
          ]
        }
      },
      testsource: {
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
      testbuilder: {
        options: {
          node: true
        },
        files: {
          src: ['test/api/*.js']
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
    qunit: {
      files: ['test/index.html']
    },
    nodeunit: {
      files: ['test/api/*.js']
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
  grunt.registerTask('build', ['clean:dist']);

  // Default
  grunt.registerTask('default', ['jshint', 'build']);
};
