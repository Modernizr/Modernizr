/*jshint node: true */
/*global module */

var requirejs = require('requirejs');
requirejs.config({
  appDir: __dirname + '/shared/',
  baseUrl: __dirname + '/shared/'
});
var banner = requirejs('banner');

module.exports = function( grunt ) {
  'use strict';

  var modConfig = grunt.file.readJSON('lib/config-all.json');
  var browsers = grunt.file.readJSON('lib/sauce-browsers.json');

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    banner: {
      full: banner('full', pkg),
      compact: banner('compact', pkg)
    },
    meta: {
    },
    qunit: {
      files: ['test/index.html']
    },
    nodeunit: {
      files: ['test/api/*.js']
    },
    stripdefine: {
      build: ['dist/modernizr-build.js']
    },
    generateinit: {
      build: {
        src: ['tmp/modernizr-init.js']
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
      dist: ['dist'],
      postbuild: [
        'build',
        'tmp'
      ]
    },
    copy: {
      build: {
        files: {
          'dist/modernizr-build.js': 'build/src/modernizr-build.js'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          dir: 'build',
          appDir: '.',
          baseUrl: 'src',
          optimize: 'none',
          optimizeCss: 'none',
          useStrict: true,
          paths: {
            'test': '../feature-detects',
            'modernizr-init': '../tmp/modernizr-init'
          },
          modules: [{
            'name': 'modernizr-build',
            'include': ['modernizr-init'],
            'create': true
          }],
          fileExclusionRegExp: /^(.git|node_modules|modulizr|media|test)$/,
          wrap: {
            start: '<%= banner.full %>' + '\n;(function(window, document, undefined){',
            end: '})(this, document);'
          },
          onBuildWrite: function (id, path, contents) {
            if ((/define\(.*?\{/).test(contents)) {
              //Remove AMD ceremony for use without require.js or almond.js
              contents = contents.replace(/define\(.*?\{/, '');

              contents = contents.replace(/\}\);\s*?$/,'');

              if ( !contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/) ) {
                //remove last return statement and trailing })
                contents = contents.replace(/return.*[^return]*$/,'');
              }
            }
            else if ((/require\([^\{]*?\{/).test(contents)) {
              contents = contents.replace(/require[^\{]+\{/, '');
              contents = contents.replace(/\}\);\s*$/,'');
            }

            return contents;
          }
        }
      }
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

  // Strip define fn
  grunt.registerMultiTask('stripdefine', 'Strip define call from dist file', function() {
    this.filesSrc.forEach(function(filepath) {
      // Remove `define('modernizr-init' ...)` and `define('modernizr-build' ...)`
      var mod = grunt.file.read(filepath).replace(/define\("modernizr-(init|build)", function\(\)\{\}\);/g, '');

      // Hack the prefix into place. Anything is way too big for something so small.
      if ( modConfig && modConfig.classPrefix ) {
        mod = mod.replace('classPrefix : \'\',', 'classPrefix : \'' + modConfig.classPrefix.replace(/"/g, '\\"') + '\',');
      }
      grunt.file.write(filepath, mod);
    });
  });

  grunt.registerMultiTask('generateinit', 'Generate Init file', function() {
    var generateInit = requirejs('generate');
    grunt.file.write('tmp/modernizr-init.js', generateInit(modConfig));
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
    'generateinit',
    'requirejs',
    'copy',
    'clean:postbuild',
    'stripdefine',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
