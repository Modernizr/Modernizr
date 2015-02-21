if (typeof define !== 'function') {
  var projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
  var filesRoot = projectRoot;
  if (process.env.APP_DIR_FOR_CODE_COVERAGE) {
    filesRoot = filesRoot + process.env.APP_DIR_FOR_CODE_COVERAGE;
  }
  var requirejs = require('requirejs');
  var pkg = require(projectRoot + '/package');
  var expect = require('expect.js');
  var domain = 'modernizr.com';
  var def = function() {
    return requirejs.define.apply(this, arguments);
  };
} else {
  var domain = location.host;
  var projectRoot = '..';
  var filesRoot = '..';
  var pkg = {};
  var def = function() {
    return define.apply(this, arguments);
  };
}
var generateBanner;
var cleanup;

describe('generate-banner', function() {

  before(function(done) {
    requirejs.config({
      paths: {
        'lib': projectRoot + '/test/mocks/lib',
        'generateBanner': filesRoot + '/lib/generate-banner',
        'cleanup': projectRoot + '/test/cleanup'
      }
    });

    def('package', [], function() {return pkg;});

    requirejs(['generateBanner', 'package', 'cleanup'], function(_generateBanner, _pkg, _cleanup) {
      generateBanner = _generateBanner;
      cleanup = _cleanup;
      pkg = _pkg;
      done();
    });
  });

  it('should produce a compact banner when requested', function() {
    var banner = generateBanner('compact');
    var test = '/*! ' + pkg.name + ' ' + pkg.version + ' (Custom Build) | ' + pkg.license  + ' *';
    expect(banner).to.contain(test);
  });

  it('should produce a full banner when requested', function() {
    var banner = generateBanner('full');
    var test = 'Modernizr tests which native CSS3 and HTML5 features are available';
    expect(banner).to.contain(test);
  });

  it('should include a build url', function() {
    var banner = generateBanner();
    var test = ' * http://' + domain + '/download/#--dontmin';
    expect(banner).to.contain(test);
  });

  it('should only accept "full" and "compact" as type arguments', function() {
    expect(function(){generateBanner('sup');}).to.throwError('banners() must be passed "compact" or "full" as an argument.');
  });

  after(function() {
    cleanup();
  });
});
