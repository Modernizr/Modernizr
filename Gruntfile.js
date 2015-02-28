/*global module */

var browsers = require('./test/browser/sauce-browsers.json');

module.exports = function( grunt ) {
  'use strict';

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  var browserTests = grunt.file.expand([
    'test/universal/**/*.js',
    'test/browser/**/*.js',
    '!test/browser/setup.js',
    '!test/browser/integration/*.js'
  ]);

  grunt.initConfig({
    env: {
      nodeTests: [
        'test/universal/**/*.js',
        'test/node/**/*.js'
      ],
      browserTests: browserTests,
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: 'test/coverage/instrument',
        urls: [
          'http://localhost:9999/test/unit.html',
          'http://localhost:9999/test/index.html'
        ]
      }
    },
    generate: {
      dest: './dist/modernizr-build.js'
    },
    copy: {
      'gh-pages': {
        files: [
          {
            expand: true,
            src: [
              './**/*',
              '!./test/coverage/**',
              '!./node_modules/*grunt-*/**',
              '!./node_modules/**/node_modules/**'
            ],
            dest: 'gh-pages'
          }
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
        'lib/*.js',
        'feature-detects/**/*.js'
      ],
      tests: {
        options: {
          jshintrc: true
        },
        files: {
          src: [
            '<%= env.nodeTests%>',
            '<%= env.browserTests %>',
            'test/browser/setup.js',
            'test/browser/integration/*.js'
          ]
        }
      }
    },
    clean: {
      dist: [
        'dist',
        'test/coverage',
        'test/*.html',
        'gh-pages'
      ]
    },
    jade: {
      compile: {
        options: {
          data: {
            unitTests: browserTests,
            integrationTests: grunt.file.expand(['test/browser/integration/*.js'])
          }
        },
        files: {
          'test/unit.html': 'test/browser/unit.jade',
          'test/iframe.html': 'test/browser/iframe.jade',
          'test/index.html': 'test/browser/integration.jade'
        }
      }
    },
    connect: {
      server: {
        options: {
          middleware: function(connect, options) {
            return [
              function(req, res, next) {
                // catchall middleware used in testing
                var ua = req.headers['user-agent'];

                // record code coverage results from browsers
                if (req.url == '/coverage/client' && req.method == 'POST') {
                  var name = encodeURI(ua.replace(/\//g, '-'));
                  var body = '';

                  req.on('data', function(data) {
                    body = body + data;
                  });

                  req.on('end', function() {
                    grunt.file.write('test/coverage/reports/' + name + '.json', body);
                    res.end();
                  });

                  return;
                }

                // redirect requests form the `require`d components to their instrumented versions
                if (req.url.match(/^\/(src|lib)\//)) {
                  req.url = '/test/coverage/instrument' + req.url;
                }

                next();
              },
              connect.static(options.base)
            ];
          },
          base: '',
          port: 9999
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls:  '<%= env.coverage.urls %>',
          testname: process.env.CI_BUILD_NUMBER || 'Modernizr Test',
          browsers: browsers,
          maxRetries: 2
        }
      }
    },
    mocha: {
      test: {
        options: {
          urls: '<%= env.coverage.urls %>'
        },
      },
    },
    // `mocha` runs browser tests, `mochaTest` runs node tests
    mochaTest: {
      test: {
        options: {
          reporter: 'dot'
        },
        src: ['<%= env.nodeTests%>']
      }
    },
    instrument: {
      files: [
        'src/**/*.js',
        'lib/**/*.js'
      ],
      options: {
        basePath: 'test/coverage/instrument/'
      }
    },
    storeCoverage: {
      options: {
        dir: 'test/coverage/reports'
      }
    },
    makeReport: {
      src: 'test/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'test/coverage/reports',
        print: 'detail'
      }
    }

  });

  grunt.registerMultiTask('generate', 'Create a version of Modernizr from Grunt', function() {
    var done = this.async();
    var config = require('./lib/config-all');
    var modernizr = require('./lib/cli');
    var dest = this.data;

    modernizr.build(config, function(output) {
      grunt.file.write(dest, output);
      done();
    });
  });

  grunt.registerTask('browserTests', ['connect', 'mocha']);

  grunt.registerTask('nodeTests', ['mochaTest']);

  // Testing tasks
  grunt.registerTask('test', ['clean', 'jshint', 'jade', 'instrument', 'env:coverage', 'nodeTests', 'generate', 'storeCoverage', 'browserTests', 'makeReport']);

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
