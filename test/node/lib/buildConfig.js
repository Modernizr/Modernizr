var root = require('find-parent-dir').sync(__dirname, 'package.json');
var buildConfig = require(root + 'lib/buildConfig.esm').default;
var expect = require('chai').expect;
var rollup = require('rollup')

describe('cli/buildQuery', function() {

  it('produces a config that doesnt break rollup if you do not provide feature-detects', function() {
    var config = buildConfig({options: ['addTest']});

    var build = () => rollup.rollup(config)

    expect(build).to.not.throw()
  });

  it('produces a config that doesnt break rollup if you do not provide options', function() {
    var config = buildConfig({'feature-detects': ['test/a/download']});

    var build = () => rollup.rollup(config)

    expect(build).to.not.throw()
  });

  it('creates a rollup config that sets the globalVar to Modernizr if set to "true"', function(done) {

    var config = buildConfig({globalVar: true});

    rollup
      .rollup(config)
      .then(b => b.generate({}))
      .then(r => {
         var code = r.output[0].code
         expect(code).to.contain('self["Modernizr"]')
         done()
       })
  });

  it('creates a rollup config that sets the globalVar to Modernizr if set to a truthy value', function(done) {

    var config = buildConfig({globalVar: []});

    rollup
      .rollup(config)
      .then(b => b.generate({}))
      .then(r => {
         var code = r.output[0].code
         expect(code).to.contain('self["Modernizr"]')
         done()
       })
  });

  it('creates a rollup config that sets the globalVar to a customm value if it is a string', function(done) {

    var config = buildConfig({globalVar: 'Potato'});

    rollup
      .rollup(config)
      .then(b => b.generate({}))
      .then(r => {
         var code = r.output[0].code
         expect(code).to.contain('self["Potato"]')
         done()
       })
  });

  it('creates a rollup config that does not srt the globalVar if it is set to false in the config', function(done) {

    var config = buildConfig({globalVar: false});

    rollup
      .rollup(config)
      .then(b => b.generate({}))
      .then(r => {
        var code = r.output[0].code
        expect(code).to.not.contain(/self\[[^\]]*\](\s*)?=(\s*)?Modernizr/)
        done()
      })
  });

});
