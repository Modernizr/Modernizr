if (typeof define !== 'function') {
  var projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
  var filesRoot = projectRoot;
  if (process.env.APP_DIR_FOR_CODE_COVERAGE) {
    filesRoot = filesRoot + process.env.APP_DIR_FOR_CODE_COVERAGE;
  }
  var requirejs = require('requirejs');
  var expect = require('expect.js');
} else {
  var projectRoot = '..';
  var filesRoot = '..';
}
var cleanup;
var req;


describe('build-hash', function() {
  var buildHash;

  before(function(done) {

    req = requirejs.config({
      context: Math.random().toString().slice(2),
      paths: {
        lib: filesRoot + '/lib',
        lodash: projectRoot + '/node_modules/lodash/index',
        metadata: projectRoot + '/test/mocks/lib/metadata',
        cleanup: projectRoot + '/test/cleanup'
      }
    });

    req(['lib/build-hash', 'cleanup'], function(_buildHash, _cleanup) {
      buildHash = _buildHash;
      cleanup = _cleanup;
      done();
    });
  });

  it('builds a hash from a feature-detect', function() {
    var hash = buildHash({
      'feature-detects': ['css/boxsizing']
    });
    expect(hash).to.be('#-boxsizing-dontmin');
  });

  it('properly formats detects with multiple properties', function() {
    var hash = buildHash({
      'feature-detects': ['dom/createElement-attrs']
    });
    expect(hash).to.be('#-createelementattrs_createelement_attrs-dontmin');
  });

  it('adds options to the hash', function() {
    var hash = buildHash({
      options: ['mq']
    });
    expect(hash).to.be('#-mq-dontmin');
  });

  it('adds classPrefix when setClasses is true as well', function() {
    var hash = buildHash({
      classPrefix: 'TEST_PREFIX',
      options: ['setClasses']
    });
    expect(hash).to.be('#-cssclasses-dontmin-cssclassprefix:TEST_PREFIX');
  });

  it('strips `html5` from the shiv options', function() {
    var hash = buildHash({
      options: ['html5shiv']
    });
    expect(hash).to.be('#-shiv-dontmin');
  });

  it('removes the dontmin option when minify is true', function() {
    var hash = buildHash({
      minify: true
    });
    expect(hash).to.be('#-');
  });

  after(function() {
    cleanup();
  });

});
