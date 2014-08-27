define(['underscore'], function( _ ) {
  return function(size, pkg) {
    var templateString;
    if (size == 'compact') {
      templateString = '/*! <%= pkg.name %> <%= pkg.version %> Custom Build | <%= pkg.license %> */';
    } else {
      templateString = '/*!\n' +
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
      ' */';
    }

    return _.template(templateString)({pkg: pkg});
  };
});
