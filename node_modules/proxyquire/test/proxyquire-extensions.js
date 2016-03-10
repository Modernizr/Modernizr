'use strict';
/*jshint asi:true */
/*global describe, before, beforeEach, it */

var proxyquire = require('..').noCallThru()

describe('when I require stubs with different extensions', function () {
  var res;
  before(function () {
    res = proxyquire('./samples/extensions', { 
        fs : 'fs.export' 
      , fn :  function () { return 'fn.result' }
      , '/fs.json': 'fs.json.export'
      , '/fn.node': 'fn.node.export'
    })
  })
  
  it('intercepts [] object', function () {
    res.fs.should.equal('fs.export')  
  })

  it('intercepts [] function', function () {
    res.fn().should.equal('fn.result');
  })

  it('intercepts [.json] object', function () {
    res['/fs.json'].should.equal('fs.json.export')  
  })

  it('intercepts [.node] object', function () {
    res['/fn.node'].should.equal('fn.node.export')  
  })
})
