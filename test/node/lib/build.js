var root = require('find-parent-dir').sync(__dirname, 'package.json');
var build = require(root + 'lib/build');
var expect = require('expect.js');

describe('cli/build', function() {

  it('should build without error', function() {
    expect(function(){build();}).to.not.throwError();
  });

  describe('custom builds', function(done) {

    it('should build without errors when using a custom build', function() {
      expect(function() {
        build({'feature-detects': ['css/boxsizing']}, done);
      }).to.not.throwError();
    });

    it('should include the requested options', function(done) {
      build({'feature-detects': ['css/boxsizing']}, function(file) {
        expect(file).to.contain('boxsizing');
        done();
      });
    });

    it('should exclude options that are not requested', function(done) {
      build({'feature-detects': ['dom/classlist']}, function(file) {
        expect(file).to.contain('classlist');
        expect(file).to.not.contain('boxsizing');
        done();
      });
    });

    it('should strip out DOC comments when `uglify`ing', function(done) {
      var config = {
        minify: true,
        'feature-detects': ['css/boxsizing']
      };

      build(config, function(file) {
        expect(file).to.not.contain('Box Sizing');
        done();
      });
    });

    it('should inject the proper classPath when configured', function(done) {
      var prefix = 'TEST_PREFIX';
      var config = {
        classPrefix: prefix,
        setClasses: true
      };
      var configRE = /_config:\s*?({[^}]*})/m;

      build(config, function(file) {
        var parsedConfig = file.match(configRE);
        parsedConfig = JSON.parse(parsedConfig[1].replace(/'/g, '"'));
        expect(parsedConfig.classPrefix).to.be(prefix);
        done();
      });
    });
  });

});
