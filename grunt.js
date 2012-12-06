var requirejs = require('requirejs');
requirejs.config({
  appDir : __dirname + '/src/',
  baseUrl : __dirname + '/src/'
});

var generateInit = requirejs('generate');

var license = '/*!\n' +
 ' * Modernizr v3.0.0pre\n' +
 ' * modernizr.com\n' +
 ' *\n' +
 ' * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton\n' +
 ' * MIT License\n' +
 '*/\n' +
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
 ' *\n' +
 ' *\n' +
 ' * Authors        Faruk Ates, Paul Irish, Alex Sexton\n' +
 ' * Contributors   Ryan Seddon, Ben Alman\n' +
 ' */';

/*global module */
module.exports = function( grunt ) {
  'use strict';

  var modConfig = JSON.parse(grunt.file.read('config-all.json'));

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
    generateinit : {
      build: {
        src: ['tmp/modernizr-init.js']
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
            start: license + "\n;(function(window, document, undefined){",
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

    // Hack the prefix into place. Anything is way to big for something so small.
    if ( modConfig && modConfig.classPrefix ) {
      mod = mod.replace("classPrefix : '',", "classPrefix : '" + modConfig.classPrefix.replace(/"/g, '\\"') + "',");
    }
    grunt.file.write( 'dist/modernizr-build.js', mod );
  });

  grunt.registerMultiTask('generateinit', "Generate Init file", function() {
    grunt.file.write('tmp/modernizr-init.js', generateInit(modConfig));
  });

  // Travis CI task.
  grunt.registerTask('travis', 'qunit');

  // Build
  grunt.loadNpmTasks('grunt-contrib');
  grunt.registerTask('build', 'clean generateinit requirejs copy clean:postbuild stripdefine min');
  grunt.registerTask('default', 'build');
};
