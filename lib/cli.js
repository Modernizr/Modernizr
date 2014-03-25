/* jshint node: true */
'use strict';

require('grunt');

module.exports = {
  build: require('./build'),
  metadata: require('./generate-meta')
};
