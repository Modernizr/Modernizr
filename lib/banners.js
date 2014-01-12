/* jshint node: true */
'use strict';

// Return a Modernizr file banner.
// Usage:
//   require('banners')(type);
// Arguments:
//   type (String, required): either 'compact' or 'full'.

module.exports = function banners(type) {
  var _ = require('underscore');
  var pkg = require('../package.json');

  if (type === 'compact') {
    return '/*! ' + pkg.name + ' ' + pkg.version + ' (Custom Build) | ' + pkg.license  + ' */';
  }
  else if (type === 'full') {
    return '/*!\n' +
      ' * ' + pkg.name + ' v' + pkg.version + '\n' +
      ' * modernizr.com\n' +
      ' *\n' +
      ' * Copyright (c) ' + _.pluck(pkg.contributors, 'name').join(', ') + '\n' +
      ' * ' + pkg.license + ' License\n */\n' +
      '\n' +
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
      ' */\n';
  }
  else {
    throw 'banners() must be passed "compact" or "full" as an argument.';
  }
};
