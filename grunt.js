/*global module */
module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*!\n' +
        ' * <%= pkg.name %> v<%= pkg.version %>\n' +
        ' * modernizr.com\n *\n' +
        ' * Copyright (c) <%= pkg.author %>\n' +
        ' * <%= pkg.license %> License\n */',
      microbanner: '/*! <%= pkg.name %> <%= pkg.version %> (Custom Build) | <%= pkg.license %> */'
    },
    qunit: {
      files: ['test/index.html']
    },
    stripdefine: {
      build: {
        src: ['dist/modernizr-build.js']
      }
    },
    lint: {
      files: [
        'grunt.js',
        'src/*.js',
        'feature-detects/*.js'
      ]
    },
    min: {
      dist: {
        src: [
          '<banner:meta.microbanner>',
          'dist/modernizr-build.js'
        ],
        dest: 'dist/modernizr-build.min.js'
      }
    },
    uglify : {
      mangle: {
        except: ['Modernizr']
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
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
        smarttabs: true,
        sub: true,
        undef: true
      },
      globals: {
        Modernizr: true,
        DocumentTouch: true,
        TEST: true,
        SVGFEColorMatrixElement : true,
        Blob: true,
        define: true,
        require: true
      }
    },
    clean: {
      build: ['build', 'dist'],
      postbuild: ['build']
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
          optimize: "none",
          optimizeCss: "none",
          paths: {
            "test" : "../feature-detects",
            "modernizr-init" : "../tmp/modernizr-init"
          },
          modules : [{
            "name" : "modernizr-build",
            "include" : ["modernizr-init"],
            "create" : true
          }],
          fileExclusionRegExp: /^(.git|node_modules|modulizr|media|test)$/,
          wrap: {
            start: ";(function(window, document, undefined){",
            end: "})(this, document);"
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
            }
          });

          // Strip define fn
          grunt.registerMultiTask('stripdefine', "Strip define call from dist file", function() {
            var mod = grunt.file.read( this.file.src[0] ).replace('define("modernizr-init",[], function(){});', '');
            grunt.file.write( 'dist/modernizr-build.js', mod );
          });

          // Travis CI task.
          grunt.registerTask('travis', 'qunit');

          // Build
          grunt.loadNpmTasks('grunt-contrib');
          grunt.registerTask('build', 'clean requirejs copy clean:postbuild stripdefine min');
          grunt.registerTask('default', 'build');
        };
