var generateBanner;
var projectRoot;
var metadata
var domain;

if (typeof self === "undefined") {
  // node land
  var expect = require('chai').expect;
  projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
  generateBanner = require(`${projectRoot}/lib/generateBanner.esm`).default
  metadata = require(`${projectRoot}/lib/metadataStatic.js`)
  domain = 'modernizr.com';
} else {
  // browser land
  var _generateBanner = makeIIFE({file: "./lib/generateBanner.esm.js", func: 'generateBanner'})
  // metadata.js is huge and has a lot of file handeling. metadataStatic provides just the data
  // but since it is already wrapped, we don't want to use makeIIFE
  eval($.get({ url: '../lib/metadataStatic.js', async: false }).responseText);
  domain = location.host

  eval(_generateBanner)
}

describe('generateBanner', function() {

  it('should produce a compact banner when requested', function() {
    var banner = generateBanner('compact', {}, metadata);
    var compactTest = '(Custom Build)'
    var fullTest = 'Modernizr tests which native CSS3 and HTML5 features are available';
    expect(banner).to.contain(compactTest);
    expect(banner).to.not.contain(fullTest);
  });

  it('should produce a full banner when requested', function() {
    var banner = generateBanner('full');
    var compactTest = '(Custom Build)'
    var fullTest = 'Modernizr tests which native CSS3 and HTML5 features are available';
    expect(banner).to.not.contain(compactTest);
    expect(banner).to.contain(fullTest);
  });

  it('should include a build url', function() {
    var banner = generateBanner();
    var test = ' * https://' + domain + '/download/?-dontmin';
    expect(banner).to.contain(test);
  });

  it('should only accept "full" and "compact" as type arguments', function() {
    expect(function() {generateBanner('sup');}).to.throw('banners() must be passed "compact" or "full" as an argument.');
  });

});
