var root = require('find-parent-dir').sync(__dirname, 'package.json');
var build = require(root + 'lib/build').default;
var chai = require('chai');
var expect = chai.expect;

describe('cli/build', function() {

  it('should build without error', function() {
    expect(function() {build({});}).to.not.throw();
  });

  describe('custom builds', function(done) {

    it('should build without errors when using a custom build', function() {
      expect(function() {
        build({'feature-detects': ['css/boxsizing']}, done);
      }).to.not.throw();
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
          expect(parsedConfig.classPrefix).to.be.equal(prefix);
          done();
        });
    });

    it('should inject the proper classPath when configured and minified', function(done) {
      var prefix = 'TEST_PREFIX';
      var config = {
        classPrefix: prefix,
        setClasses: true,
        minify: true
      };
      var configRE = /_config:\s*?({[^}]*})/m;

      build(config, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          expect(parsedConfig.classPrefix).to.be.equal(prefix);
          done();
        });
    });

    it('should set enableClasses when configured to do so', function(done) {
      var configRE = /_config:\s*?({[^}]*})/m;

      build({ enableClasses: false }, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          expect(parsedConfig.enableClasses).to.be.equal(false);
          done();
        });
    });

    it('should set enableClasses when configured with  minify to do so', function(done) {
      var configRE = /_config:\s*?({[^}]*})/m;

      build({ enableClasses: true, minify: true }, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          // minification changes booleans to ints
          expect(parsedConfig.enableClasses).to.be.equal(1);
          done();
        });
    });

    it('should set enableJSClass when configured to do so', function(done) {
      var configRE = /_config:\s*?({[^}]*})/m;

      build({ enableJSClass: false }, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          expect(parsedConfig.enableJSClass).to.be.equal(false);
          done();
        });
    });

    it('should set enableJSClass when configured with  minify to do so', function(done) {
      var configRE = /_config:\s*?({[^}]*})/m;

      build({ enableJSClass: true, minify: true }, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          // minification changes booleans to ints
          expect(parsedConfig.enableJSClass).to.be.equal(1);
          done();
        });
    });

    it('should set usePrefixes when configured to do so', function(done) {
      var configRE = /_config:\s*?({[^}]*})/m;

      build({ usePrefixes: false }, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          expect(parsedConfig.usePrefixes).to.be.equal(false);
          done();
        });
    });

    it('should set usePrefixes when configured with minify to do so', function(done) {
      var configRE = /_config:\s*?({[^}]*})/m;

      build({ usePrefixes: true, minify: true }, function(file) {
        var parsedConfig = file.match(configRE);
        //use eval because the minified code creates non valid JSON.
        // eslint-disable-next-line
        parsedConfig = eval('(' + parsedConfig[1].replace(/'/g, '"') + ')');
          // minification changes booleans to ints
          expect(parsedConfig.usePrefixes).to.be.equal(1);
          done();
        });
    });


    describe('unminified', function() {
      var output;

      before(function(done) {
        var config = {
          'feature-detects': ['css/boxsizing']
        };

        build(config, function(file) {
          output = file;
          done();
        });
      });

      it('replaces __VERSION__ ', function() {
        expect(output).to.not.contain('__VERSION__');
      });
    });

    describe('minified', function() {
      var output;

      before(function(done) {
        var config = {
          'feature-detects': ['css/boxsizing'],
          minify: true
        };

        build(config, function(file) {
          output = file;
          done();
        });
      });

      it('replaces __VERSION__ ', function() {
        expect(output).to.not.contain('__VERSION__');
      });
    });
  });
});
