// this file configures require.js based on environment
'use strict';

var inBrowser = typeof define === 'function' && typeof define.amd === 'object';

var _extend = function(a, b) {
  for (var prop in b) {
    var supplied = b[prop];
    if (Object.prototype.toString.call(supplied) === '[object Object]') {
      a[prop] = a[prop] || {};
      _extend(a[prop], supplied);
    } else {
      a[prop] = b[prop];
    }
  }
};

var baseRequireConfig = {
  optimize: 'none',
  generateSourceMaps: false,
  optimizeCss: 'none',
  useStrict: true,
  include: ['modernizr-init'],
  fileExclusionRegExp: /^(.git|node_modules|modulizr|media|test)$/,
  wrap: {
    start: '\n;(function(scriptGlobalObject, window, document, undefined){',
    end: '})(window, window, document);'
  },
  onBuildWrite: function(id, path, contents) {
    if (this.optimize === 'uglify') {
      // strip out documentation comments
      contents = contents.replace(/\/\*\![\s\S]*\!\*\//m, '');
    }

    if ((/define\(.*?\{/).test(contents)) {
      // remove AMD ceremony for use without require.js or almond.js
      contents = contents.replace(/define\(.*?\{/, '');

      contents = contents.replace(/\}\);\s*?$/, '');

      if (!contents.match(/Modernizr\.add(Async)?Test\(/)) {
      // remove last return statement and trailing })
        contents = contents.replace(/return.*[^return]*$/, '');
      }
    } else if ((/require\([^\{]*?\{/).test(contents)) {
      contents = contents.replace(/require[^\{]+\{/, '');
      contents = contents.replace(/\}\);\s*$/, '');
    }

    contents = contents.replace(/return addTest;/, '');

    return contents;
  }
};

function build(generate, generateBanner, pkg) {
  return function build(config, cb) {
    var requireConfig = {};
    var banner;
    config = config || {};
    cb = cb || function noop() {};

    _extend(requireConfig, baseRequireConfig);

    requireConfig.rawText = {
      'modernizr-init': generate(config)
    };

    if (config.minify) {
      banner = generateBanner('compact', config);
      requireConfig.optimize = 'uglify';
      requireConfig.uglify = {
        mangle: {
          except: ['Modernizr']
        },
        beautify: {
          ascii_only: true
        }
      };
    } else {
      banner = generateBanner('full', config);
      requireConfig.optimize = 'none';
    }

    if(config.scriptGlobalName) {
      requireConfig.wrap.end = '})(' + config.scriptGlobalName + ', window, document);';
    }

    requireConfig.out = function(output) {
      output = banner + output;

      // Remove `define('modernizr-init' ...)` and `define('modernizr-build' ...)`
      output = output.replace(/(,\s*)?define\("modernizr-(init|build)",\s*function\(\)\{\};?\)/g, '');
      output = output.replace(/__VERSION__/g, pkg.version);

      // Hack the prefix into place. Anything is way too big for something so small.
      if (config && config.classPrefix) {
        output = output.replace(/(classPrefix'?:\s?)['"]{2}(,)/, '$1\'' + config.classPrefix.replace(/'/g, '\\\'') + '\'$2');
      }
      ['enableClasses', 'enableJSClass', 'usePrefixes'].forEach(function(configName) {
        if (config && typeof config[configName] === 'boolean') {
          output = output.replace(new RegExp('(' + configName + '\\\'?\\s?:\\s?)(true|false)([,\\n])'), '$1' + Boolean(config[configName]) + '$3');
        }
      });

      cb(output);
    };

    requirejs.optimize(requireConfig);
  };
}

if (inBrowser) {
  var suppliedConfig = self._modernizrConfig;
  var metadataUrl = 'i/js/metadata.json';
  var packageUrl = 'i/js/modernizr-git/package.json';
  baseRequireConfig.baseUrl = '/i/js/modernizr-git/src';
  baseRequireConfig.paths = {
    text: '/i/js/requirejs-plugins/lib/text',
    lib: '/i/js/modernizr-git/lib',
    json: '/i/js/requirejs-plugins/src/json',
    lodash: '/i/js/lodash',
    test: '/i/js/modernizr-git/feature-detects'
  };

  if (suppliedConfig) {
    metadataUrl = suppliedConfig.metadataUrl || metadataUrl;
    packageUrl = suppliedConfig.packageUrl || packageUrl;
    _extend(baseRequireConfig, suppliedConfig);
  }

  if (self._modernizrMetadata) {
    requirejs.define('metadata', [], function() {return self._modernizrMetadata;});
  } else {
    requirejs.define('metadata', ['json!' + metadataUrl], function(pkg) {return pkg;});
  }
  requirejs.define('package', ['json!' + packageUrl], function(pkg) {return pkg;});
} else {
  var requirejs = require('requirejs');
  var metadata = require('./metadata')();
  var pkgj = require('../package.json');

  requirejs.define('metadata', [], function() {return metadata;});
  requirejs.define('package', function() {return pkgj;});

  baseRequireConfig.baseUrl = __dirname + '/../src';
  baseRequireConfig.paths = {
    lodash: require.resolve('lodash'),
    test: __dirname + '/../feature-detects',
    lib: __dirname
  };
}

requirejs.config(baseRequireConfig);

if (inBrowser) {
  define('build', ['generate', 'lib/generate-banner', 'package'], build);
} else {
  var generateBanner = requirejs(__dirname + '/generate-banner.js');
  var generate = requirejs('generate');
  var pakg = requirejs('package');
  var _build = build;
  module.exports = function build() {
    return _build(generate, generateBanner, pakg).apply(undefined, arguments);
  };
}
