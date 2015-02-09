// this file configures require.js based on enviroment
'use strict';

var inBrowser = typeof define == 'function' && typeof define.amd == 'object';
if (!inBrowser) {
  // Defines a module that works in Node and AMD.
  // http://git.io/bHfJ
  var define = function (name, factory) {
    module.exports = factory(require, exports, module);
  };
}

var requireConfig = {
  optimize: 'none',
  optimizeCss: 'none',
  useStrict: true,
  include: ['modernizr-init'],
  fileExclusionRegExp: /^(.git|node_modules|modulizr|media|test)$/,
  wrap: {
    start: '\n;(function(window, document, undefined){',
    end: '})(window, document);'
  },
  onBuildWrite: function (id, path, contents) {
    if (this.optimize === 'uglify2') {
      // strip out documentation comments
      contents = contents.replace(/\/\*\![\s\S]*\!\*\//m, '');
    }

    if ((/define\(.*?\{/).test(contents)) {
      // remove AMD ceremony for use without require.js or almond.js
      contents = contents.replace(/define\(.*?\{/, '');

      contents = contents.replace(/\}\);\s*?$/,'');

      if ( !contents.match(/Modernizr\.add(Async)?Test\(/) ) {
        // remove last return statement and trailing })
        contents = contents.replace(/return.*[^return]*$/,'');
      }
    } else if ((/require\([^\{]*?\{/).test(contents)) {
      contents = contents.replace(/require[^\{]+\{/, '');
      contents = contents.replace(/\}\);\s*$/,'');
    }

    return contents;
  }
};

function build(generate, generateBanner) {
  return function build(config, cb) {
    cb = cb || function noop(){};
    var banner = generateBanner('full');

    requireConfig.rawText = {
      'modernizr-init': generate(config)
    };

    if (config.minify) {
      banner = generateBanner('compact');
      requireConfig.optimize = 'uglify2';
      requireConfig.uglify2 = {
        mangle: {
          except: ['Modernizr']
        },
        beautify: {
          ascii_only: true
        }
      };
    }

    requireConfig.out = function (output) {
      output = banner + output;

      // Remove `define('modernizr-init' ...)` and `define('modernizr-build' ...)`
      output = output.replace(/define\("modernizr-(init|build)", function\(\)\{\}\);/g, '');

      // Hack the prefix into place. Anything is way too big for something so small.
      if ( config && config.classPrefix ) {
        output = output.replace('classPrefix : \'\',', 'classPrefix : \'' + config.classPrefix.replace(/"/g, '\\"') + '\',');
      }

      cb(output);

    };

    requirejs.optimize(requireConfig);
  };
}

if (inBrowser) {
  requireConfig.baseUrl = '/scripts/modernizr-git/src';
  requireConfig.paths = {
    text: '/i/js/requirejs-plugins/lib/text',
    json: '/i/js/requirejs-plugins/src/json',
    lodash: '/i/js/lodash/lodash.min',
    test: '/scripts/modernizr-git/feature-detects'
  };

  requirejs.define('package', [ 'json!/i/js/modernizr-git/package.json' ], function(pkg) {return pkg;});
} else {
  var requirejs = require('requirejs');
  var pkg = require('../package.json');

  requirejs.define('package', function() {return pkg;});

  requireConfig.baseUrl = __dirname + '/../src';
  requireConfig.paths = {
    test: __dirname + '/../feature-detects'
  };
}

requirejs.config(requireConfig);


if (inBrowser) {
  define('build', ['generate', 'generate-banner'], build);
} else {
  var generateBanner = requirejs(__dirname + '/../src/generate-banner.js');
  var generate = requirejs(__dirname + '/../src/generate.js');
  var _build = build;
  module.exports = function build() {
    return _build(generate, generateBanner).apply(undefined, arguments);
  };
}
