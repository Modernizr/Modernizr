describe('atRule', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "omPrefixes"
    }]
  */
  var omPrefixes = 'Modernizr';
  var atRule;

  eval(makeIIFE({file: "./src/atRule.js", func: 'atRule', external: ['./omPrefixes.js']}))

  if (self.CSSRule) {
    self.CSSRule.MODERNIZR_FAKE_RULE = 999;
  }

  it('returns undefined when the browser does not support CSSRule', function() {
    var ref = self.CSSRule;
    self.CSSRule = undefined;

    expect(atRule('charset')).to.be.equal(undefined);

    self.CSSRule = ref;
  });

  if (self.CSSRule) {
    it('detects `@rule`s', function() {
      expect(atRule('charset')).to.be.equal('@charset');
    });

    it('returns false when a property is not given', function() {
      expect(atRule()).to.be.equal(false);
    });

    it('returns false when a property is not found', function() {
      expect(atRule('fart')).to.be.equal(false);
    });

    it('detects prefixed properties', function() {
      expect(atRule('fake')).to.be.equal('@-modernizr-fake');
    });
  }

  after(function() {
    if (self.CSSRule) {
      delete self.CSSRule.MODERNIZR_FAKE_RULE;
    }
  });
});
