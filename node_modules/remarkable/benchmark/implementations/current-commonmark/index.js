'use strict'

var Remarkable = require('../../../');
var md = new Remarkable('commonmark');

exports.run = function(data) {
  return md.render(data);
}
