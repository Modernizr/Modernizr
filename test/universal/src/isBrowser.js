describe('isBrowser', function() {
  var isBrowser;

  if (typeof self === "undefined") {
    // node land
    var expect = require('chai').expect;
    var projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
    isBrowser = require(`${projectRoot}/src/isBrowser`).default
  } else {
    // browser land
    eval(makeIIFE({file: "./src/isBrowser.js", func: 'isBrowser'}))
    // eslint-disable-next-line no-redeclare
    var expect = chai.expect
  }


  it('should be accurate', function() {
    if (typeof self !== 'undefined') {
      expect(isBrowser).to.be.true;
    }
    if (typeof window !== 'undefined') {
      expect(isBrowser).to.be.true;
    }
    if (typeof global !== 'undefined') {
      expect(isBrowser).to.be.false;
    }
  })

});
