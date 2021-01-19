describe('buildConfig', function() {
  /* global rollup */
  var _buildConfig;

  // the builder is only for browsers with native module support, so only test there
  if (typeof document !== undefined && 'noModule' in document.createElement('script')) {
    eval(makeIIFE({file: "./lib/buildConfig.esm.js", func: '_buildConfig'}));
    eval($.get({ url: '../node_modules/rollup/dist/rollup.browser.js', async: false }).responseText);

    const buildConfig = _buildConfig.default

    it('has the build version as an export', function() {
      expect(_buildConfig.buildVersion).to.exist.and.to.be.a('string')
    });

    it('exports the config generator function by default', function() {
      expect(_buildConfig.default).to.exist.and.to.be.a('function')
    });

    describe('test out build', function() {
      before(function() {
        const fakeResponse = (a) => {
          // this is being done to test out how the Rollup plugn we provide in buildConfig handles resolution of
          // imports. We need to be able to resolve a sub import, so we stub out fetch(), and fake two imports
          const response = a.includes('Modernizr.js') ? 'import a from "./a.js";export default a' : 'export default "hi"'
          return new Promise(r => r({ text: () => new Promise(r => r(response)) }))
        }
        sinon.stub(window, "fetch").callsFake(fakeResponse)
      })

      it('produces a config that doesnt break rollup if you do not provide options', function(done) {

        const config = buildConfig({'feature-detects': ['test/a/download']});
        // mute potential build warnings, since we aren't actually building
        config.onwarn = function() {}

        const build = () => rollup.rollup(config)

        expect(build).to.not.throw()

        build()
          .then(r => r.generate({}))
          .then(c => {
            expect(c.output[0].code).to.be.a('string')

            done()
          })
          .catch(e => done(e))
      });

      it('does not include addTest if included in the options', function(done) {

        const config = buildConfig({'options': ['addTest', 'mq']});
        // mute potential build warnings, since we aren't actually building
        config.onwarn = function() {}

        const build = () => rollup.rollup(config)

        expect(build).to.not.throw()

        build()
          .then(r => {
            // filter through rollup's cache to find the current build,
            // as opposed to a earlier test's cache version
            const thisBuild = r.cache.modules.find(e=>e.code.includes('mq'))

            expect(thisBuild).to.not.be.undefined

            //`code` represents the code buildConfig generates to create the custom build
            expect(thisBuild.code).to.exist.and.not.contain('addTest')
            done()
          })
          .catch(e => done(e))
      });

      it('does not include load if included in the options', function(done) {

        const config = buildConfig({'options': ['load', 'mq']});
        // mute potential build warnings, since we aren't actually building
        config.onwarn = function() {}

        const build = () => rollup.rollup(config)

        expect(build).to.not.throw()

        build()
          .then(r => {
            // filter through rollup's cache to find the current build,
            // as opposed to a earlier test's cache version
            const thisBuild = r.cache.modules.find(e=>e.code.includes('mq'))

            expect(thisBuild).to.not.be.undefined

            //`code` represents the code buildConfig generates to create the custom build
            expect(thisBuild.code).to.exist.and.not.contain('load')
            done()
          })
          .catch(e => done(e))
      });

      it('uses the provided global variable', function(done) {

        const config = buildConfig({globalVar: "ForcedGlobalTest"});
        // mute potential build warnings, since we aren't actually building
        config.onwarn = function() {}

        const build = () => rollup.rollup(config)

        expect(build).to.not.throw()

        build()
          .then(r => {
            // filter through rollup's cache to find the current build,
            // as opposed to a earlier test's cache version
            const thisBuild = r.cache.modules.find(e=>e.code.includes('ForcedGlobalTest'))
            expect(thisBuild).to.not.be.undefined

            //`code` represents the code buildConfig generates to create the custom build
            expect(thisBuild.code).to.exist.and.to.contain('self["ForcedGlobalTest"] = Modernizr')
            done()
          })
          .catch(e => done(e))
      });

      it('respects a no global configuration', function(done) {

        const config = buildConfig({globalVar: false, options: ['hasEvent']});
        // mute potential build warnings, since we aren't actually building
        config.onwarn = function() {}

        const build = () => rollup.rollup(config)

        expect(build).to.not.throw()

        build()
          .then(r => {
            // filter through rollup's cache to find the current build,
            // as opposed to a earlier test's cache version
            const thisBuild = r.cache.modules.find(e=>e.code.includes('hasEvent'))
            expect(thisBuild).to.not.be.undefined

            //`code` represents the code buildConfig generates to create the custom build
            expect(thisBuild.code).to.exist.and.to.not.contain('self\[').and.to.not.contain('= Modernizr')
            done()
          })
          .catch(e => done(e))
      });

      it('creates a config that allows for module resolution ouside of the project', function() {
        const config = buildConfig({globalVar: false, options: ['hasEvent']});
        const buildPlugin = config.plugins.find(p => p.name === 'modernizr-builder-plugin')

        expect(buildPlugin.resolveId('SOMETHING_THAT_DOESNT_START_WITH_A_PERIOD')).to.equal(null)
        expect(buildPlugin.load('SOMETHING_THAT_IS_NOT_A_URL')).to.equal(null)
      })

      after(function() {
        window.fetch.restore()
      })

    })

  }
});
