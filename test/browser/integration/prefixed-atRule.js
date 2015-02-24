describe('prefixed @rule', function() {
  it('Everyone supports import', function() {
    expect(Modernizr.prefixed('@import')).to.equal('@import');
  });

  it('Nobody supports @penguin', function() {
    expect(Modernizr.prefixed('@penguin')).to.equal(false);
  });
});
