var YUITest = require('yuitest'),
    Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    path = require('path'),
    fs = require('fs'),
    Y = require(path.join(__dirname, '../', 'lib', 'index'));

//Move to the test dir before running the tests.
process.chdir(__dirname);

var suite = new YUITest.TestSuite('Options Test Suite');

suite.add(new YUITest.TestCase({
    name: "Server Options",
    'test: server': function() {
        var options = Y.Options([
            '--server'
        ]);

        Assert.isTrue(options.server, 'Failed to set server option');
        Assert.areSame(3000, options.port, 'Failed to set default port');
    },
    'test: server with port': function() {
        var options = Y.Options([
            '--server',
            '5000'
        ]);

        Assert.isTrue(options.server, 'Failed to set server option');
        Assert.areSame(5000, options.port, 'Failed to set port');
    },
    'test: server with default port and following argument': function() {
        var options = Y.Options([
            '--server',
            './foo'
        ]);

        Assert.isTrue(options.server, 'Failed to set server option');
        Assert.areSame(3000, options.port, 'Failed to set default port');
        Assert.isArray(options.paths, 'Failed to set path');
        Assert.areSame('./foo', options.paths[0], 'Failed to set path after empty --server');
    }
}));

suite.add(new YUITest.TestCase({
    name: "Various Options",
    "test: long quiet option": function() {
        var options = Y.Options([
            '--quiet'
        ]);

        Assert.isTrue(options.quiet, 'Failed to set long quiet');
    },
    "test: short quiet option": function() {
        var options = Y.Options([
            '-q'
        ]);

        Assert.isTrue(options.quiet, 'Failed to set short quiet');
    },
    "test: short config": function() {
        var options = Y.Options([
            '-c',
            './foo.json'
        ]);

        Assert.areSame('./foo.json', options.configfile, 'Failed to set config');
    },
    'test: --config': function() {
        var options = Y.Options([
            '--config',
            './foo.json'
        ]);

        Assert.areSame('./foo.json', options.configfile, 'Failed to set config');
    },
    'test: --configfile': function() {
        var options = Y.Options([
            '--configfile',
            './foo.json'
        ]);

        Assert.areSame('./foo.json', options.configfile, 'Failed to set config');
    },
    'test: -e': function() {
        var options = Y.Options([
            '-e',
            '.foo'
        ]);
        
        Assert.areSame('.foo', options.extension, 'Failed to set extension');
    },
    'test: --extension': function() {
        var options = Y.Options([
            '--extension',
            '.foo'
        ]);
        
        Assert.areSame('.foo', options.extension, 'Failed to set extension');
    },
    'test: -x': function() {
        var options = Y.Options([
            '-x',
            'foo,bar,baz'
        ]);
        
        Assert.areSame('foo,bar,baz', options.exclude, 'Failed to set exclude');
    },
    'test: --exclude': function() {
        var options = Y.Options([
            '--exclude',
            'foo,bar,baz'
        ]);
        
        Assert.areSame('foo,bar,baz', options.exclude, 'Failed to set exclude');
    },
    'test: --project-version': function() {
        var options = Y.Options([
            '--project-version',
            '6.6.6'
        ]);
        
        Assert.areSame('6.6.6', options.version, 'Failed to set version');
    },
    'test: --no-color': function() {
        var options = Y.Options([
            '--no-color',
        ]);
        
        Assert.isTrue(options.nocolor, 'Failed to set nocolor');
        Assert.isFalse(Y.config.useColor, 'Failed to set Y.config.useColor');
    },
    'test: -N': function() {
        var options = Y.Options([
            '-N',
        ]);
        
        Assert.isTrue(options.nocolor, 'Failed to set nocolor');
        Assert.isFalse(Y.config.useColor, 'Failed to set Y.config.useColor');
    },
    'test: --no-code': function() {
        var options = Y.Options([
            '--no-code',
        ]);
        
        Assert.isTrue(options.nocode, 'Failed to set nocode');
    },
    'test: -C': function() {
        var options = Y.Options([
            '-C',
        ]);
        
        Assert.isTrue(options.nocode, 'Failed to set nocode');
    },
    'test: --norecurse': function() {
        var options = Y.Options([
            '--norecurse',
        ]);
        
        Assert.isTrue(options.norecurse, 'Failed to set norecurse');
    },
    'test: -n': function() {
        var options = Y.Options([
            '-n',
        ]);
        
        Assert.isTrue(options.norecurse, 'Failed to set norecurse');
    },
    'test: --selleck': function() {
        var options = Y.Options([
            '--selleck',
        ]);
        
        Assert.isTrue(options.selleck, 'Failed to set selleck');
    },
    'test: -S': function() {
        var options = Y.Options([
            '-S',
        ]);
        
        Assert.isTrue(options.selleck, 'Failed to set selleck');
    },
    'test: -T simple': function() {
        var options = Y.Options([
            '-T',
            'simple'
        ]);
        var p = path.join(__dirname, '../themes/simple');
        Assert.areEqual(p, options.themedir);
    },
    'test: --theme simple': function() {
        var options = Y.Options([
            '--theme',
            'simple'
        ]);
        var p = path.join(__dirname, '../themes/simple');
        Assert.areEqual(p, options.themedir);
    },
    'test: --theme foobar': function() {
        var options = Y.Options([
            '--theme',
            'foobar'
        ]);
        var p = path.join(__dirname, '../themes/foobar');
        Assert.areEqual(p, options.themedir);
    },
    'test: --themedir ./foobar': function() {
        var options = Y.Options([
            '--themedir',
            './foobar'
        ]);
        Assert.areEqual('./foobar', options.themedir);
    },
    'test: --syntaxtype coffee': function() {
        var options = Y.Options([
            '--syntaxtype',
            'coffee'
        ]);
        Assert.areEqual('coffee', options.syntaxtype);
    }
}));


YUITest.TestRunner.add(suite);

