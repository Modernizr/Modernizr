var expect = require('chai').expect;
var util = require('./util');

var endpoint = require('../lib/protocol/endpoint');
var Endpoint = endpoint.Endpoint;

var settings = {
  SETTINGS_MAX_CONCURRENT_STREAMS: 100,
  SETTINGS_INITIAL_WINDOW_SIZE: 100000
};

describe('endpoint.js', function() {
  describe('scenario', function() {
    describe('connection setup', function() {
      it('should work as expected', function(done) {
        var c = new Endpoint(util.log.child({ role: 'client' }), 'CLIENT', settings);
        var s = new Endpoint(util.log.child({ role: 'client' }), 'SERVER', settings);

        util.log.debug('Test initialization over, starting piping.');
        c.pipe(s).pipe(c);

        setTimeout(function() {
          // If there are no exception until this, then we're done
          done();
        }, 10);
      });
    });
  });
  describe('bunyan serializer', function() {
    describe('`e`', function() {
      var format = endpoint.serializers.e;
      it('should assign a unique ID to each endpoint', function() {
        var c = new Endpoint(util.log.child({ role: 'client' }), 'CLIENT', settings);
        var s = new Endpoint(util.log.child({ role: 'client' }), 'SERVER', settings);
        expect(format(c)).to.not.equal(format(s));
        expect(format(c)).to.equal(format(c));
        expect(format(s)).to.equal(format(s));
      });
    });
  });
});
