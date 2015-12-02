var ModernizrProto = require('../src/ModernizrProto');
var Modernizr = require('../src/Modernizr');
var testRunner = require('../src/testRunner');
var setClasses = require('../src/setClasses');
var classes = require('../src/classes');
var addTest = require('../src/addTest');

module.exports = Modernizr;

var hasRun = false;
ModernizrProto.init = function(options) {
  if (hasRun) return;
  hasRun = true;

  options = options || {};

  if (options.classPrefix);
    Modernizr._config.classPrefix = options.classPrefix;

  testRunner();

  ModernizrProto.addTest = addTest;
  delete ModernizrProto.addAsyncTest;

  if (options.setClasses !== false)
    setClasses(classes);

  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  return Modernizr;
};
