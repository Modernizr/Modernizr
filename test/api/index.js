/* jshint node: true */
"use strict";

exports.core = function (test) {
  test.expect(2);

  var modernizr = require("../../lib/cli");
  test.ok(modernizr, "modernizr should be truthy");

  var keys = Object.keys(modernizr);
  test.ok(keys.length, "it should export at least one method");

  test.done();
};
