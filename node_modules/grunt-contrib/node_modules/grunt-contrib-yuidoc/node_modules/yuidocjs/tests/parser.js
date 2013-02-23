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
    name: 'Parser Test Suite',
    setUp: function() {
        var json = (new Y.YUIDoc({
            quiet: true,
            paths: [ 'input/' ],
            outdir: './out'
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
    'test: out directory': function() {
        Assert.isTrue(existsSync(path.join(__dirname, 'out')), 'Out directory was not created');
    },
    'test: data.json creation': function() {
        Assert.isTrue(existsSync(path.join(__dirname, 'out', 'data.json')), 'data.json file was not created');
    },
    'test: parser': function() {
        var keys = Object.keys(this.data);
        Assert.areEqual(6, keys.length, 'Failed to populate all fields');
        ArrayAssert.itemsAreSame([ 'project', 'files', 'modules', 'classes', 'classitems', 'warnings' ], keys, 'Object keys are wrong');
    },
    'test: project data': function() {
        Assert.areSame('input/test/test.js', this.project.file, 'Project data loaded from wrong file');
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
    },
    'test: files parsing': function() {
        var files = this.data.files;
        
        // 1 module, 3 classes
        var one = files['input/test/anim.js'];
        Assert.isObject(one, 'Failed to parse input/test/anim.js');
        Assert.areSame(1, Object.keys(one.modules).length, '1 module should be found');
        Assert.areSame(3, Object.keys(one.classes).length, '3 classes should be found');

        // 2 modules, 3 classes
        var two = files['input/test/test.js'];
        Assert.isObject(two, 'Failed to parse input/test/test.js');
        Assert.areSame(2, Object.keys(two.modules).length, '2 modules should be found');
        Assert.areSame(3, Object.keys(two.classes).length, '3 classes should be found');

        //Module -> class association
        var three = files['input/test2/dump/dump.js'];
        Assert.isObject(three, 'Failed to parse input/test2/dump/dump.js');
        Assert.areSame(1, three.modules.dump, 'dump module not found');
        Assert.areSame(1, three.classes['YUI~dump'], 'YUI~dump class not found');

        //Module -> class association
        var four = files['input/test2/oop/oop.js'];
        Assert.isObject(four, 'Failed to parse input/test2/oop/oop.js');
        Assert.areSame(1, four.modules.oop, 'oop module not found');
        Assert.areSame(1, four.classes['YUI~oop'], 'YUI~oop class not found');

    },
    'test: namespace parsing': function() {
        var item = this.data.files['input/test2/namespace.js'];
        Assert.isObject(item, 'Failed to parse input/test2/namespace.js');
        Assert.areSame(3, Object.keys(item.classes).length, 'Failed to parse all classes');

        ArrayAssert.itemsAreSame(['P.storage', 'P'], Object.keys(item.namespaces), 'Namespace failed to parse');
        ArrayAssert.itemsAreSame(['P.storage.Store', 'P.storage.LocalStore', 'P.storage'], Object.keys(item.classes), 'Classes failed to parse');
    },
    'test: module parsing': function() {
        var mods = this.data.modules;

        //anim Module
        Assert.isObject(mods.anim, 'Failed to parse Anim module');
        Assert.areSame(2, Object.keys(mods.anim.submodules).length, 'Should have 2 submodules');
        Assert.areSame(3, Object.keys(mods.anim.classes).length, 'Should have 3 classes');
        Assert.areSame('This is the Anim MODULE description', mods.anim.description, 'Description parse');
        Assert.areSame('main', mods.anim.itemtype, 'Failed to parse @main itemtype');
        Assert.areSame('module', mods.anim.tag, 'Tag parse failed');
    },
    'test: main module association': function() {
        var mod = this.data.modules.charts,
            d = 'The Charts widget provides an api for displaying data\ngraphically.';

        Assert.isObject(mod, 'Failed to parse charts module');
        Assert.areSame(d, mod.description, 'Incorrect description for charts module');
        Assert.areSame('main', mod.tag, 'Tagname is not main');
        Assert.areSame('main', mod.itemtype, 'ItemType should be main');
    },
    'test: submodule parsing': function() {
        var mods = this.data.modules;

        //anim-easing submodule
        var m = mods['anim-easing'];
        Assert.isObject(m, 'Failed to parse anim-easing module');
        var desc = 'The easing module provides methods for customizing\nhow an animation behaves during each run.';
        Assert.areSame(desc, m.description, 'Failed to parse submodule description');
        Assert.areSame(0, Object.keys(m.submodules).length, 'Should have 0 submodules');
        Assert.areSame(1, Object.keys(m.classes).length, 'Should have 1 class');
        Assert.areSame(1, m['is_submodule'], 'Submodule association failed');
        Assert.areSame('anim', m.module, 'Failed to associate module');

        //anim-easing-foo submodule
        var m = mods['anim-easing-foo'];
        Assert.isObject(m, 'Failed to parse anim-easing-foo module');
        var desc = 'FOO FOO FOO FOO FOO The easing module provides methods for customizing';
        Assert.areSame(desc, m.description, 'Failed to parse submodule description');
        Assert.areSame(0, Object.keys(m.submodules).length, 'Should have 0 submodules');
        Assert.areSame(1, Object.keys(m.classes).length, 'Should have 1 class');
        Assert.areSame(1, m['is_submodule'], 'Submodule association failed');
        Assert.areSame('anim', m.module, 'Failed to associate module');

    },
    'test: extra module data parsing': function() {
        var mods = this.data.modules;
        
        var m = mods.mymodule;
        Assert.isObject(m, 'Failed to parse mymodule module');
        Assert.areSame(1, Object.keys(m.submodules).length, 'Should have 1 submodules');
        Assert.areSame(3, Object.keys(m.classes).length, 'Should have 3 class');
        Assert.areSame('The module', m.description, 'Description parse failed');
        ArrayAssert.itemsAreSame(['one', 'two', 'three'], m.category, 'Category parsing failed');
        ArrayAssert.itemsAreSame(['one', 'two'], m.requires, 'Requires parsing failed');
        ArrayAssert.itemsAreSame(['three', 'four'], m.uses, 'Uses parsing failed');

        var m = mods.mysubmodule;
        Assert.isObject(m, 'Failed to parse mysubmodule module');
        Assert.areSame(0, Object.keys(m.submodules).length, 'Should have 0 submodules');
        Assert.areSame(3, Object.keys(m.classes).length, 'Should have 3 class');
        Assert.areSame(1, m['is_submodule'], 'Submodule association failed');
        ArrayAssert.itemsAreSame(['three', 'four'], m.category, 'Category parsing failed');

        //Testing modules with slashes in them
        var m = mods['myapp/views/index'];
        Assert.isObject(m, 'Failed to parse myapp/views/index module');
        Assert.areSame(1, Object.keys(m.classes).length, 'Should have 1 class');
        
        var m = mods['P.storage'];
        Assert.isObject(m, 'Failed to parse P.storage module');
        ArrayAssert.itemsAreSame(['P.storage.Store', 'P.storage.LocalStore', 'P.storage'], Object.keys(m.classes), 'Failed to parse classes');
        ArrayAssert.itemsAreSame(['P.storage', 'P'], Object.keys(m.namespaces), 'Namespace failed to parse');
        
    },
    'test: class parsing': function() {
        var cl = this.data.classes;

        var anim = cl.Anim;
        Assert.isObject(anim, 'Failed to find Anim class');
        Assert.areSame('Anim', anim.name, 'Failed to set name');
        Assert.areSame('Anim', anim.shortname, 'Failed to set shortname');
        Assert.areSame('anim', anim.module, 'Failed to test module.');

        var easing = cl.Easing;
        Assert.isObject(easing, 'Failed to find Easing class');
        Assert.areSame('Easing', easing.name, 'Failed to set name');
        Assert.areSame('Easing', easing.shortname, 'Failed to set shortname');
        Assert.areSame('anim', easing.module, 'Failed to test module.');
        Assert.areSame('anim-easing', easing.submodule, 'Failed to test submodule.');

        var my = cl.myclass;
        Assert.isObject(my, 'Failed to find myclass class');
        Assert.areSame('myclass', my.name, 'Failed to set name');
        Assert.areSame('myclass', my.shortname, 'Failed to set shortname');
        Assert.areSame('mymodule', my.module, 'Failed to test module.');
        Assert.areSame('mysubmodule', my.submodule, 'Failed to test submodule.');
        Assert.areSame(1, my['is_constructor'], 'Failed to register constructor.');

        var other = cl.OtherClass;
        Assert.isObject(other, 'Failed to find myclass class');
        Assert.areSame('OtherClass', other.name, 'Failed to set name');
        Assert.areSame('OtherClass', other.shortname, 'Failed to set shortname');
        Assert.areSame('mymodule', other.module, 'Failed to test module.');
        Assert.areSame('mysubmodule', other.submodule, 'Failed to test submodule.');
        Assert.areSame(1, Object.keys(other['extension_for']).length, 'Failed to assign extension_for');
        Assert.areSame('myclass', other['extension_for'][0], 'Failed to assign extension_for');
        
        var m = cl['P.storage.P.storage'];
        Assert.isUndefined(m, 'Should not have double namespaces');

        Assert.isNotUndefined(cl['P.storage'], 'Should not have double namespaces');
        Assert.isNotUndefined(cl['P.storage.Store'], 'Should not have double namespaces');
        Assert.isNotUndefined(cl['P.storage.LocalStore'], 'Should not have double namespaces');
    },
    'test: classitems parsing': function() {
        Assert.isArray(this.data.classitems, 'Failed to populate classitems array');
        
        var item = this.findByName('testoptional', 'myclass');
        Assert.areSame('testoptional', item.name, 'Failed to find item: testoptional');
        Assert.areSame('myclass', item.class, 'Failed to find class: testoptional');
        Assert.areSame('mymodule', item.module, 'Failed to find module: testoptional');
        Assert.areSame('mysubmodule', item.submodule, 'Failed to find submodule: testoptional');
        Assert.areSame('method', item.itemtype, 'Should be a method');

        var keys = [ 'file', 'line', 'description', 'itemtype', 'name', 'params', 'evil', 'injects', 'return', 'example', 'class', 'module', 'submodule' ];
        
        ArrayAssert.itemsAreSame(keys, Object.keys(item), 'Item missing from output');

        Assert.areSame('', item.evil, 'Single tag not found');
        Assert.areSame('HTML', item.injects.type, 'Injection type not found');

        Assert.isUndefined(item.return.type, 'Type should be missing');
        Assert.areSame(2, item.example.length, 'Should have 2 example snippets');

        var item2 = this.findByName('testobjectparam', 'myclass');
        Assert.areSame('String', item2.return.type, 'Type should not be missing');
    },
    'test: parameter parsing': function() {
        var item = this.findByName('testoptional', 'myclass');
        Assert.isArray(item.params, 'Params should be an array');
        Assert.areSame(5, item.params.length, 'Failed to parse all 5 parameters');

        Assert.areSame('notype', item.params[0].name, 'Name missing');
        Assert.isUndefined(item.params[0].type, 'Type should be missing');

        Assert.areSame('namesecond', item.params[1].name, 'Name missing');
        Assert.areSame('Int', item.params[1].type, 'Type should be Int');

        Assert.areSame('optionalvar', item.params[3].name, 'Name missing');
        Assert.isTrue(item.params[3].optional, 'Parameter should be optional');
        Assert.isUndefined(item.params[3].optdefault, 'Optional Default value should be undefined');


        Assert.areSame('optionalwithdefault', item.params[4].name, 'Name missing');
        Assert.isTrue(item.params[4].optional, 'Parameter should be optional');
        Assert.areSame('"defaultval"', item.params[4].optdefault, 'Optional Default value is incorrect');

        var item2 = this.findByName('test0ton', 'myclass');
        Assert.isArray(item2.params, 'Params should be an array');
        Assert.areSame(1, item2.params.length, 'Failed to parse all 5 parameters');
        Assert.isTrue(item2.params[0].optional, 'Optional not set');
        Assert.isTrue(item2.params[0].multiple, 'Multiple not set');
        Assert.isUndefined(item2.return.type, 'Type should be missing');

        var item2 = this.findByName('test1ton', 'myclass');
        Assert.isArray(item2.params, 'Params should be an array');
        Assert.areSame(1, item2.params.length, 'Failed to parse all 5 parameters');
        Assert.isUndefined(item2.params[0].optional, 'Optional should not be set');
        Assert.isTrue(item2.params[0].multiple, 'Multiple not set');
        Assert.isUndefined(item2.return.type, 'Type should be missing');

    },
    'test: object parameters': function() {
        var item = this.findByName('testobjectparam', 'myclass');

        Assert.areSame('testobjectparam', item.name, 'Failed to find item: testobjectparam');
        Assert.areSame('myclass', item.class, 'Failed to find class: testobjectparam');
        Assert.areSame('mymodule', item.module, 'Failed to find module: testobjectparam');
        Assert.areSame('mysubmodule', item.submodule, 'Failed to find submodule: testobjectparam');
        Assert.areSame('method', item.itemtype, 'Should be a method');
        Assert.areSame(1, item.params.length, 'More than one param found');

        var props = item.params[0].props;
        Assert.areSame(2, props.length, 'First param should have props');
        Assert.areSame('prop1', props[0].name, 'Invalid item');
        Assert.areSame('prop1', props[0].description, 'Invalid item');
        Assert.areSame('String', props[0].type, 'Invalid item');

        Assert.areSame('prop2', props[1].name, 'Invalid item');
        Assert.areSame('prop2', props[1].description, 'Invalid item');
        Assert.areSame('Bool', props[1].type, 'Invalid item');
    },
    'test: tag fixing': function() {
        var item = this.findByName('testoptional', 'myclass');
        
        Assert.isObject(item, 'failed to find item');
        Assert.isNotUndefined(item.return, 'Failed to replace returns with return');

        item = this.findByName('_positionChangeHandler', 'Axis');
        Assert.isObject(item, 'failed to find item');
        Assert.areEqual(1, item.params.length, 'Failed to replace parma with param');

        item = this.findByName('crashTest', 'OtherClass2');
        Assert.isObject(item, 'failed to find item');
        Assert.areEqual(1, item.params.length, 'Failed to replace params with param');

        
    },
    'test: double namespaces': function() {
        var cls = this.data.classes;
        var mod_bad = cls['Foo.Bar.Foo.Bar'];
        var mod_good = cls['Foo.Bar'];
        Assert.isUndefined(mod_bad, 'Found class Foo.Bar.Foo.Bar');
        Assert.isObject(mod_good, 'Failed to parse Foo.Bar namespace');
    },
    'test: inherited methods': function() {
        var item = this.findByName('myMethod', 'mywidget.SubWidget');
        Assert.isObject(item, 'Failed to parse second method');
    },
    'test: case tags': function() {
        var item = this.findByName('testMethod', 'OtherClass2');
        Assert.isObject(item, 'Failed to parse second method');
        Assert.areSame('method', item.itemtype, 'Failed to parse Cased Method tag');
        Assert.isArray(item.params, 'Failed to parse Cased Params');
        Assert.areSame(1, item.params.length, 'Failed to parse number of cased params');
    },
    'test: required attribute': function() {
        var item = this.findByName('requiredAttr', 'OtherClass2');
        Assert.isObject(item, 'Failed to parse attribute');
        Assert.areSame('attribute', item.itemtype, 'Failed to parse itemtype');
        Assert.areSame(1, item.required, 'Failed to find required short tag');
    },
    'test: optional attribute': function() {
        var item = this.findByName('optionalAttr', 'OtherClass2');
        Assert.isObject(item, 'Failed to parse attribute');
        Assert.areSame('attribute', item.itemtype, 'Failed to parse itemtype');
        Assert.areSame(1, item.optional, 'Failed to find optional short tag');
    },
    'test: module with example meta': function() {
        var item = this.data.modules.ExampleModule;
        Assert.isObject(item, 'Failed to parse module');
        Assert.isArray(item.example, 'Failed to parse module example data');
    },
    'test: class with example meta': function() {
        var item = this.data.classes['mywidget.SuperWidget'];
        Assert.isObject(item, 'Failed to parse class');
        Assert.isArray(item.example, 'Failed to parse class example data');
    },
    'test: event with optional items': function() {
        var item = this.findByName('changeWithOptional', 'OtherClass2');
        Assert.isObject(item, 'Failed to locate event object');
        var params = item.params;
        Assert.isArray(params);
        var ev = params[0];
        Assert.areSame(ev.name, 'ev');
        Assert.areSame(ev.type, 'EventFacade');
        var props = ev.props;
        Assert.isArray(props);
        Assert.areSame(props[0].name, 'name');
        Assert.isTrue(props[0].optional);
        
    }
}));

YUITest.TestRunner.add(suite);
