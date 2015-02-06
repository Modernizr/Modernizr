// Defines a module that works in Node and AMD.
// https://github.com/umdjs/umd/blob/master/nodeAdapter.js

if (typeof module === 'object' && typeof define !== 'function') {
  var define = function (factory) {
    module.exports = factory(require, exports, module);
  };
}

define(function(require) {

  var generateInit = require('./generate-init');
  var requirejs = require('requirejs');

  // Usage:
  // require('modernizr').build(config, callback, errback);
  //
  // Where:
  // options - A object of config options (see ./lib/config-all.json)
  // callback - A callback function once build completes, code is passed as the first argument
  // errback - A callback function on error occurs, error is passed as the first argument

  return function build(options, callback, errback) {
    'use strict';

    options = options || {};
    var init = generateInit(options);

    var config = {
      rawText: {
        'modernizr-init': init
      },
      name: 'modernizr-init',
      baseUrl: 'src/',
      optimize: 'none',
      optimizeCss: 'none',
      paths: {
        test: '../feature-detects'
      },
      out: callback,
      // So we do not need to remove `define('modernizr-init' ...)` and `define('modernizr-build' ...)`
      skipModuleInsertion: true,
      useStrict: true,
      wrap: {
        start: ';(function(window, document, undefined){',
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
    };

    requirejs.optimize(config, null, errback);
  };
});
