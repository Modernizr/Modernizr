describe('globalThis', function() {
  var ModernizrsGlobalThis
  /* global globalThis */

  if (typeof self === "undefined") {
    // node land
    var expect = require('chai').expect;
    var projectRoot = require('find-parent-dir').sync(__dirname, 'package.json');
    ModernizrsGlobalThis = require(`${projectRoot}/src/globalThis`).default
  } else {
    // browser land
    // eslint-disable-next-line no-redeclare
    var expect = chai.expect
    eval(makeIIFE({file: "./src/globalThis.js", func: 'ModernizrsGlobalThis'}))
  }


  it('should be equal to this contexts global variable', function() {
    if (typeof globalThis !== "undefined") {
      // modern, universal global variable
      return expect(ModernizrsGlobalThis).to.equal(globalThis);
    }
    if (typeof window !== "undefined") {
      // browser UI thread global variable
      return expect(ModernizrsGlobalThis).to.equal(window);
    }
    if (typeof self !== "undefined") {
      // browser global, in UI and workers
      return expect(ModernizrsGlobalThis).to.equal(self);
    }
    if (typeof global !== "undefined") {
      // nodejs global variable
      return expect(ModernizrsGlobalThis).to.equal(global);
    } else {
      return expect(ModernizrsGlobalThis).to.equal('we should never get to this point');
    }
  });

});
