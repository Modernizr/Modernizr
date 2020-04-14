var root = require('find-parent-dir').sync(__dirname, 'package.json');
var expect = require('chai').expect;

describe('polyfills.json', function() {
  it('is valid json', function() {
    var parse = () => {
      require(root + 'lib/polyfills.json');
    }
    expect(parse).to.not.throw()
  })
});
