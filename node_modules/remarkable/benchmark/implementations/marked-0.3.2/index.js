'use strict'

var marked = new require('marked');

exports.run = function(data) {
  return marked(data);
}
