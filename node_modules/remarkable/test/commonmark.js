'use strict';

require('mocha');
var path = require('path');
var utils = require('./utils');
var Remarked = require('../');

describe('CommonMark', function () {
  var md = new Remarked('commonmark');
  utils.addTests(path.join(__dirname, 'fixtures/commonmark/good.txt'), md);
});
