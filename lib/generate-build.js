'use strict';

// Generates a custom Modernizr build.
// Arguments:
//  config (Object, required): A Modernizr configuration object. See
//    lib/config-all.json for an example.
//  options (Object):
//    min (Boolean): Minify the output code. Defaults to false.
//    verbose (Boolean): Output success messages. Defaults to false.
//    callback (Function): Function to run when code building is complete. An
//      `output` argument containing a string of the built code is available.

module.exports = function build(config, options) {
  var path = require('path');
  var uglifyjs = require('uglify-js');
  var requirejs = require('requirejs');
  var generateInit = require('./generate-init');
  var output;

  // Default options
  options = options || {};
  options.verbose = options.verbose || false;

  var banner = options.min ? require('./banners')('compact') : require('./banners')('full');

  // Configuration for the Require.js optimizer
  var rjsConfig = {
    baseUrl: path.join(__dirname, '../src'),
    rawText: {
      'modernizr-init': generateInit(config)
    },
    paths: {
      'test': path.join(__dirname, '../feature-detects'),
    },
    name: 'modernizr-init',
    wrap: {
      start: ';(function(window, document, undefined){',
      end: '})(this, document);'
    },
    optimize: 'none',
    onBuildWrite: function (id, path, contents) {
      // Remove AMD ceremony for use without require.js or almond.js
      if ((/define\(.*?\{/).test(contents)) {
        contents = contents.replace(/define\(.*?\{/, '');
        contents = contents.replace(/\}\);\s*?$/,'');
        if (!contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/)) {
          contents = contents.replace(/return.*[^return]*$/,'');
        }
      }
      else if ((/require\([^\{]*?\{/).test(contents)) {
        contents = contents.replace(/require[^\{]+\{/, '');
        contents = contents.replace(/\}\);\s*$/,'');
      }
      return contents;
    },
    out: function (text) {
      output =  text;
    },
  };

  // Build and process the Modernizr script
  requirejs.optimize(rjsConfig, function () {

    // Remove `define('modernizr-init' ...)`
    output = output.replace('define("modernizr-init", function(){});', '', 'g');

    // Hack the prefix into place. Anything is way too big for something so
    // small.
    if (config.classPrefix) {
      output = output.replace('classPrefix: \'\',', 'classPrefix: \'' + config.classPrefix.replace(/"/g, '\\"') + '\',');
    }

    // Uglify
    if (options.min) {
      output = uglifyjs.minify(output, {
        fromString: true,
        mangle: {
          except: 'Modernizr'
        }
      }).code;
    }

    // Add banner
    output = banner + output;

    // Invoke callback
    if (typeof options.callback === 'function') {
      options.callback(output);
    }
  }, function(err) {
    console.log(err);
  });
};
