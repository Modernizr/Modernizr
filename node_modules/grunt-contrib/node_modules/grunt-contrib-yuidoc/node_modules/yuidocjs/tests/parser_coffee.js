var YUITest = require('yuitest'),
    Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    path = require('path'),
    fs = require('fs'),
    Y = require(path.join(__dirname, '../', 'lib', 'index'));

//Move to the test dir before running the tests.
process.chdir(__dirname);

var existsSync = fs.existsSync || path.existsSync;

var suite = new YUITest.TestSuite({
    name: 'Coffee Parser Test Suite',
    setUp: function() {
        var json = (new Y.YUIDoc({
            quiet: true,
            paths: [ 'input/' ],
            outdir: './out',
            extension: '.coffee',
            syntaxtype: 'coffee'
        })).run();

        this.project = json.project;
        this.data = json;
    }
});

suite.add(new YUITest.TestCase({
    name: "Project Data",
    setUp: function() {
        this.project = suite.project;
        this.data = suite.data;
    },
    findByName: function(name, cl) {
        var items = this.data.classitems,
            ret;

        items.forEach(function(i) {
            if (i.name === name && i.class === cl) {
                ret = i;
            }
        });

        return ret;
    },
    'test: project data': function() {
        Assert.areSame('input/coffee/test.coffee', this.project.file, 'Project data loaded from wrong file');
        Assert.areSame(2, this.project.line, 'Line number is off');
        Assert.areSame('The test project', this.project.description, 'Description not set properly');
        Assert.areSame('The Tester', this.project.title, 'Title not set');
        Assert.areSame('admo', this.project.author, 'Author not set');
        Assert.areSame('entropy', this.project.contributor, 'Contributor not set');
        Assert.areSame('http://a.img', this.project.icon[0], 'Icon not set');
        Assert.areSame(1, this.project.icon.length, 'Found wring number of icons');
        Assert.areSame(2, this.project.url.length, 'Found wrong number of urls');
        Assert.areSame('http://one.url', this.project.url[0], 'URL #1 is wrong');
        Assert.areSame('http://two.url', this.project.url[1], 'URL #2 is wrong');
    }
}));

YUITest.TestRunner.add(suite);
