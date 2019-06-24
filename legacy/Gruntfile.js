var browsers = require('../test/browser/sauce-browsers.json');
var serveStatic = require('serve-static');

module.exports = function(grunt) {
  'use strict';

  // load grunt dependencies
  require('load-grunt-tasks')(grunt);

  var browserTests = grunt.file.expand([
    'test/universal/**/*.js',
    'test/browser/**/*.js',
    '!test/browser/setup.js',
    '!test/browser/integration/*.js'
  ]);

  var integrationTests = grunt.file.expand([
    'test/browser/integration/*.js'
  ]);

  var nodeTests = grunt.file.expand([
    'test/universal/**/*.js',
    'test/node/**/*.js'
  ]);

  grunt.initConfig({
    env: {
      browserTests: browserTests,
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: 'test/coverage/instrument',
        urls: [
          'http://localhost:9999/test/unit.html',
          'http://localhost:9999/test/index.html'
        ]
      },
      integrationTests: integrationTests,
      nodeTests: nodeTests
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
              './README.md',
              './dist/**',
              './lib/**',
              './node_modules/expect.js/**',
              './node_modules/jquery/**',
              './node_modules/json3/**',
              './node_modules/lodash/**',
              './node_modules/mocha/**',
              './node_modules/requirejs/**',
              './node_modules/sinon/**',
              './node_modules/ua-parser-js/**',
              './src/**',
              './test/**',
              '!./test/coverage/**'
            ],
            dest: 'gh-pages'
          }
        ]
      }
    },
    eslint: {
      target: [
        '<%= env.nodeTests %>',
        '<%= env.browserTests %>',
        '<%= env.integrationTests %>',
        'test/browser/setup.js',
        'Gruntfile.js',
        'src/*.js',
        'lib/*.js',
        'test/**/*.js',
        'feature-detects/**/*.js',
        '!src/html5shiv.js',
        '!src/html5printshiv.js',
        '!test/coverage/**/*.js'
      ]
    },
    clean: {
      dist: [
        'dist',
        'test/coverage',
        'test/*.html',
        'gh-pages'
      ]
    },
    pug: {
      compile: {
        options: {
          data: {
            unitTests: browserTests,
            integrationTests: integrationTests
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
      browser: {
        options: {
          port: 9090,
          keepalive: true
        }
      },
      server: {
        options: {
          middleware: function() {
            return [
              function(req, res, next) {
                // catchall middleware used in testing
                var ua = req.headers['user-agent'];

                // record code coverage results from browsers
                if (req.url === '/coverage/client' && req.method === 'POST') {
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
              serveStatic(__dirname)
            ];
          },
          port: 9999
        }
      }
    },
    'saucelabs-custom': {
      all: {
        options: {
          urls:  '<%= env.coverage.urls %>',
          testname: process.env.CI_BUILD_NUMBER || 'Modernizr Test',
          browsers: browsers,
          maxRetries: 3
        }
      }
    },
    mocha: {
      test: {
        options: {
          urls: '<%= env.coverage.urls %>',
          log: true
        }
      }
    },
    // `mocha` runs browser tests, `mochaTest` runs node tests
    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          timeout: 5000
        },
        src: ['<%= env.nodeTests %>']
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
    },
    coveralls: {
      all: {
        src: 'test/coverage/reports/lcov.info',
        options: {
          force: true
        }
      }
    }
  });

  grunt.registerMultiTask('generate', 'Create a version of Modernizr from Grunt', function() {
    var done = this.async();
    var config = require('../lib/config-all');
    var modernizr = require('../lib/cli');
    var dest = this.data;

    modernizr.build(config, function(output) {
      grunt.file.write(dest, output);
      done();
    });
  });

  grunt.registerTask('nodeTests', ['mochaTest']);

  grunt.registerTask('browserTests', ['connect:server', 'mocha']);

  grunt.registerTask('browserResults', ['test', 'connect:browser']);

  /**
   * Performs the code coverage tasks provided by Istanbul
   */
  grunt.registerTask('coverage', ['env:coverage', 'instrument', 'mochaTest', 'storeCoverage', 'makeReport']);

  /**
   * Default task for creating a modernizr build using lib/config-all.json
   */
  grunt.registerTask('default', ['clean', 'eslint', 'generate']);

  /**
   * Build gh-pages
   */
  grunt.registerTask('gh-pages', ['clean', 'pug', 'generate', 'copy:gh-pages']);

  /**
   * Different tasks depending where the tests are run
   */
  var tests = ['clean', 'eslint', 'pug', 'instrument', 'env:coverage', 'nodeTests'];

  if (process.env.APPVEYOR) {
    grunt.registerTask('test', tests);
  } else if (process.env.BROWSER_COVERAGE !== 'true') {
    grunt.registerTask('test', tests.concat(['generate', 'browserTests']));
  } else {
    grunt.registerTask('test', tests.concat(['generate', 'storeCoverage', 'browserTests', 'saucelabs-custom', 'makeReport', 'coveralls']));
  }
};
