/* jshint node: true */
"use strict";

var grunt = require("grunt");

module.exports = {
  build: require("./build"),
  metadata: require("./generate-meta")
};
