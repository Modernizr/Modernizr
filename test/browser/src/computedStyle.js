describe('computedStyle', function() {
  /*
    eslint no-unused-vars: ["error", {
      "varsIgnorePattern": "_globalThis"
    }]
  */
  var computedStyle;

  eval(makeIIFE({file: "./src/computedStyle.js", func: 'computedStyle'}))

  if ('getComputedStyle' in self) {

    describe('native getComputedStyle', function() {

      before(function() {
        sinon.spy(self, 'getComputedStyle')
      })

      it('works', function() {
        expect(function() {computedStyle(document.documentElement, 0, 'display')}).to.not.throw()
        expect(computedStyle(document.documentElement, 0, 'display')).to.be.equal('block');
      });

      it('delegates to native getComputedStyle if it exists', function() {
        expect(self.getComputedStyle.callCount).to.be.equal(2);
      });

      it('returns the entire style map for invalid styles', function() {
        expect(typeof computedStyle(document.documentElement, 0, 'fake')).to.be.equal('string');
        expect(computedStyle(document.documentElement, 0, 'fake')).to.be.equal('');
      });

      it('returns the entire style map when property is undefined', function() {
        expect(computedStyle(document.documentElement, 0, undefined) instanceof self.CSSStyleDeclaration).to.be.true
      });


      after(function() {
        self.getComputedStyle.restore()
      })
    });


    describe('no console', function() {
      var _globalThis = {getComputedStyle: function() {return null}}

      eval(makeIIFE({file: "./src/computedStyle.js", func: 'computedStyle', external: ['./globalThis.js']}))

      it('does not throw when getComputedStyle is unreliable and console is undefined', function() {
        expect(function() {computedStyle(document.documentElement, 0, 'display')}).to.not.throw()
        expect(computedStyle(document.documentElement, 0, 'display')).to.equal(null)
      });

    })

    describe('no console.error', function() {
      var _globalThis = {getComputedStyle: function() {return null}, console: {log: sinon.spy()}}

      eval(makeIIFE({file: "./src/computedStyle.js", func: 'computedStyle', external: ['./globalThis.js']}))

      it('uses console.log when getComputedStyle is unreliable and console.error is not supported', function() {
        expect(function() {computedStyle(document.documentElement, 0, 'display')}).to.not.throw()
        expect(_globalThis.console.log.called).to.be.true
      });

    })

    describe('console.error fallback', function() {
      var ref;

      before(function() {
        try {
          ref = self.getComputedStyle;
          self.getComputedStyle = function() {return null}
          sinon.spy(console, "log")
          sinon.spy(console, "error")
        } catch (e) {}
      })


      it('logs a message if getComputedStyle returns null', function() {
        computedStyle(document.documentElement, 0, 'fake')
        expect(console.error.callCount).to.be.equal(1);
        expect(console.error.calledWith('getComputedStyle returning null, its possible modernizr test results are inaccurate')).to.be.true;
      });

      after(function() {
        console.log.restore()
        console.error.restore()
        self.getComputedStyle = ref
      })
    });

  }


  it('falls back to a property check when getComputedStyle is not supported', function() {
    var _globalThis = {}

    eval(makeIIFE({file: "./src/computedStyle.js", func: 'computedStyle', external: ['./globalThis.js']}))
    expect(computedStyle({currentStyle: {display: 'MOCKED_VALUE'}}, 0, 'display')).to.equal('MOCKED_VALUE')
  })

});
