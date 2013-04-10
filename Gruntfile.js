/*jshint node: true */
/*global module */
module.exports = function( grunt ) {
  'use strict';

  var modConfig = grunt.file.readJSON('lib/config-all.json');

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
        ' * Modernizr has an optional (*not included*) conditional resource loader called\n' +
        ' * `Modernizr.load()`, based on [Yepnope.js](http://yepnopejs.com). You can get a\n' +
        ' * build that includes `Modernizr.load()`, as well as choosing which feature tests\n' +
        ' * to include on the [Download page](http://www.modernizr.com/download/).\n' +
        ' */'
    },
    meta: {

    },
    qunit: {
      files: ['test/index.html']
    },
    stripdefine: {
      build: [
        'dist/modernizr-build.js'
      ]
    },
    generateinit : {
      build: {
        src: ['tmp/modernizr-init.js']
      }
    },
    uglify : {
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
        src: [
          'dist/modernizr-build.js'
        ],
        dest: 'dist/modernizr-build.min.js'
      }
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: 'jshint',
      tests: {
        files: '<%= jshint.tests.files.src %>',
        tasks: ['jshint:tests', 'qunit']
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
        smarttabs: true,
        sub: true,
        undef: true,
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
      files: [
        'Gruntfile.js',
        'src/*.js',
        'feature-detects/*.js'
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
      build: ['build', 'dist', 'tmp'],
      postbuild: ['build', 'tmp']
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
            start: '<%= banner.full %>' + "\n;(function(window, document, undefined){",
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
  // Load required contrib packages
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Strip define fn
  grunt.registerMultiTask('stripdefine', "Strip define call from dist file", function() {
    this.filesSrc.forEach(function(filepath) {
      var mod = grunt.file.read(filepath).replace('define("modernizr-init", function(){});', '');

      // Hack the prefix into place. Anything is way to big for something so small.
      if ( modConfig && modConfig.classPrefix ) {
        mod = mod.replace("classPrefix : '',", "classPrefix : '" + modConfig.classPrefix.replace(/"/g, '\\"') + "',");
      }
      grunt.file.write( 'dist/modernizr-build.js', mod );
    });
  });

  grunt.registerMultiTask('generateinit', "Generate Init file", function() {
    var requirejs = require('requirejs');
    requirejs.config({
      appDir : __dirname + '/src/',
      baseUrl : __dirname + '/src/'
    });
    var generateInit = requirejs('generate');
    grunt.file.write('tmp/modernizr-init.js', generateInit(modConfig));
  });
  // Testing tasks
  grunt.registerTask('test', ['jshint', 'qunit']);

  // Travis CI task.
  grunt.registerTask('travis', 'test');

  // Build
  grunt.registerTask('build', ['clean', 'generateinit', 'requirejs', 'copy', 'clean:postbuild', 'stripdefine', 'uglify', 'jshint']);
  grunt.registerTask('default', 'build');
};
