describe('hasEvent', function() {
  var hasEvent;

  eval(makeIIFE({file: "./src/hasEvent.js", func: 'hasEvent'}))

  it('allows you to pass an element to test against', function() {
    expect(hasEvent('click'), document.createElement('a')).to.be.equal(true);
  });

  it('allows you to pass an string name for an element to test against', function() {
    expect(hasEvent('click', 'a')).to.be.equal(true);
  });

  it('allows you to pass something other then a DOM element or string', function() {
    expect(hasEvent('click', document)).to.be.equal(true);
  });

  it('returns false when no event name is provided', function() {
    expect(hasEvent()).to.be.equal(false);
  });

  it('returns true when the event exists', function() {
    expect(hasEvent('click')).to.be.equal(true);
  });

  it('returns false when the event does not exists', function() {
    expect(hasEvent('fart')).to.be.equal(false);
  });

});
