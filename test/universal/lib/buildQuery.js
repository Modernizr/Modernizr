var buildQuery
var expect = expect || undefined
var metadata

if (typeof self === 'undefined') {
  var root = require('find-parent-dir').sync(__dirname, 'package.json');
  buildQuery = require(root + 'lib/buildQuery').default;
  metadata = require(root + 'lib/metadata').default();
  expect = require('chai').expect;
} else {
  buildQuery = makeIIFE({file: "./lib/buildQuery.js", func: 'buildQuery'})
  eval(buildQuery)
  var _metadata = $.get({
    url: '../lib/metadataStatic.js',
    async: false
  }).responseText;
  eval(_metadata)
}

describe('cli/buildQuery', function() {

  it('renames html5shiv and html5printshiv to shiv and printshiv', function() {
    var shiv_query = buildQuery({'options': ['html5shiv']}, metadata)
    expect(shiv_query).to.contain('shiv')
    var print_query = buildQuery({'options': ['html5printshiv']}, metadata)
    expect(print_query).to.contain('printshiv')
  });

  it('includes custom global variables', function() {
    var query = buildQuery({'globalVar': 'Ploop'}, metadata)
    expect(query).to.contain('global=Ploop')
  });

  it('removes custom tests from the build query', function() {
    var query = buildQuery({
      'feature-detects': ['css/boxsizing', 'custom/test/path'],
      globalVar: false
    }, metadata);
    expect(query).to.be.equal('?boxsizing-dontmin');
  });

  it('removes the dontmin option when minify is true', function() {
    var query = buildQuery({
      minify: true,
      globalVar: false
    }, metadata);
    expect(query).to.be.equal('?');
  });

  it('adds classPrefix when setClasses is true as well', function() {
    var query = buildQuery({
      classPrefix: 'TEST_PREFIX',
      options: ['setClasses'],
      globalVar: false
    }, metadata);
    expect(query).to.be.equal('?setclasses-dontmin-cssclassprefix:TEST_PREFIX');
  });

  it('builds a query from a feature-detect', function() {
    var query = buildQuery({
      'feature-detects': ['css/boxsizing'],
      globalVar: false
    }, metadata);
    expect(query).to.be.equal('?boxsizing-dontmin');
  });

  it('properly formats detects with multiple properties', function() {
    var query = buildQuery({
      'feature-detects': ['dom/createElement-attrs'],
      globalVar: false
    }, metadata);
    expect(query).to.be.equal('?createelementattrs_createelement_attrs-dontmin');
  });

  it('adds options to the query', function() {
    var query = buildQuery({
      options: ['mq'],
      globalVar: false
    }, metadata);
    expect(query).to.be.equal('?mq-dontmin');
  });

  it('uses Modernizr as the default globalVar', function() {
    var query = buildQuery({ globalVar: true }, metadata);
    expect(query).to.be.equal('?-dontmin&global=Modernizr');
  });

  it('throws if your build has feature-detects but does not provide metadata', function() {
    var query = function() { buildQuery({ 'feature-detects': ['test/css/boxsizing'] }) }

    expect(query).to.throw(/You must provide metadata to buildQuery/);
  });
});
