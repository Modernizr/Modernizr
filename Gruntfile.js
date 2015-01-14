/*jshint node: true */
/*global module */
module.exports = function( grunt ) {
  'use strict';

  var modConfig = grunt.file.readJSON('lib/config-all.json');
  var browsers = grunt.file.readJSON('lib/sauce-browsers.json');

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: {
      compact: '/*! <%= pkg.name %> <%= pkg.version %> (Custom Build) | <%= pkg.license %> */',
      full: '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %>\n' +
        ' * modernizr.com\n *\n' +
        ' * Copyright (c) <%= _.pluck(pkg.contributors, "name").join(", ") %>\n' +
        ' * <%= pkg.license %> License\n */' +
        ' \n' +
        '/*\n' +
        ' * Modernizr tests which native CSS3 and HTML5 features are available in the\n' +
        ' * current UA and makes the results available to you in two ways: as properties on\n' +
        ' * a global `Modernizr` object, and as classes on the `<html>` element. This\n' +
        ' * information allows you to progressively enhance your pages with a granular level\n' +
        ' * of control over the experience.\n' +
        ' *\n' +
        ' */\n'
    },
    'modernizr-metadata': {
      dist: {
        dest: 'dist/metadata.json'
      }
    },
    qunit: {
      files: ['test/index.html']
    },
    nodeunit: {
      files: ['test/api/*.js']
    },
    'modernizr-build': {
      options: {
        banner: '<%= banner.full %>'
      },
      dist: {
        dest: 'dist/modernizr-build.js'
      }
    },
    uglify: {
      options: {
        stripbanners: true,
        banner: '<%= banner.compact %>',
        mangle: {
          except: ['Modernizr']
        },
        beautify: {
          ascii_only: true
        }
      },
      dist: {
        src: ['dist/modernizr-build.js'],
        dest: 'dist/modernizr-build.min.js'
      }
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

  grunt.registerMultiTask('modernizr-build', 'Generate Modernizr Build', function() {
    var done = this.async();
    var dest = this.files[0].dest;
    var options = this.options({
      banner: ''
    });
    var banner = grunt.template.process(options.banner);

    var build = require('./lib/').build;

    build(modConfig, function(content) {
      grunt.file.write(dest, banner + content);
      done();
    }, function(err) {
      grunt.fail.warn(err);
    });

  });

  grunt.registerMultiTask('modernizr-metadata', 'Generate Modernizr metadata', function() {
    var dest = this.files[0].dest;
    var metadata = require('./lib/').metadata;
    grunt.file.write(dest, JSON.stringify(metadata, null, '  '));
  });

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'build', 'qunit', 'nodeunit']);

  // Sauce labs CI task
  grunt.registerTask('sauce', ['connect','saucelabs-qunit']);

  // Travis CI task.
  grunt.registerTask('travis', ['test']);

  // Build
  grunt.registerTask('build', [
    'clean',
    'modernizr-build',
    'uglify'
  ]);

  grunt.registerTask('meta', [
    'modernizr-metadata'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
