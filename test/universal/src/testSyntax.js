describe('testSyntax', function() {
  var testSyntax;

  if (typeof self === "undefined") {
    // node land
    var expect = require('chai').expect;
    var projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
    testSyntax = require(`${projectRoot}/src/testSyntax`).default
  } else {
    // browser land
    eval(makeIIFE({file: "./src/testSyntax.js", func: 'testSyntax'}))
    // eslint-disable-next-line no-redeclare
    var expect = chai.expect
  }


  it('returns true with valid syntax', function() {
    expect(testSyntax('var a')).to.be.true;
  })

  it('returns false with invalid syntax', function() {
    expect(testSyntax('-!{@')).to.be.false;
  })

});
