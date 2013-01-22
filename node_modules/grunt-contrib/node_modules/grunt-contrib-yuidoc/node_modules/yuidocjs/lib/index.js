/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
/**
Module creates the YUI instance with the required modules, uses them and exports the **Y** to be used
by the _CLI class_ or by extenders: `require('yuidocjs');`  
You can use it like this:  

    var options = {
        paths: [ './lib' ],
        outdir: './out'
    };

    var Y = require('yuidocjs');
    var json = (new Y.YUIDoc(options)).run();

@class Main
@exports {YUI} Y A YUI instance
@module yuidoc
*/
//Hacking in debug support
var args = process.argv.slice(2);
var debug = false;

args.forEach(function(item) {
    if (item.toLowerCase() === '--debug') {
        debug = true;
    }
});

var YUI = require('yui' + (debug ? '/debug' : '')).YUI,
    path = require('path'),
    fs = require('graceful-fs'),
    metaPath = path.join(__dirname, '../', 'package.json');


process.on('uncaughtException', function(msg) {
    var meta = JSON.parse(fs.readFileSync(metaPath)),
        inst = YUI(),
        useColor = (Y ? Y.config.useColor : false);

    inst.applyConfig({
        debug: true,
        useColor: useColor
    }); 

    inst.log('--------------------------------------------------------------------------', 'error');
    inst.log('An uncaught YUIDoc error has occurred, stack trace given below', 'error');
    inst.log('--------------------------------------------------------------------------', 'error');
    inst.log(msg.stack || msg.message || msg, 'error');
    inst.log('--------------------------------------------------------------------------', 'error');
    inst.log('Node.js version: ' + process.version, 'error');
    inst.log('YUI version: ' + YUI.version, 'error');
    inst.log('YUIDoc version: ' + meta.version, 'error');
    inst.log('Please file all tickets here: ' + meta.bugs.url, 'error');
    inst.log('--------------------------------------------------------------------------', 'error');

    process.exit(1);
});

var Y = YUI({
    modules: {
        help: {
            fullpath: path.join(__dirname, 'help.js')
        },
        options: {
            fullpath: path.join(__dirname, 'options.js')
        },
        docparser: {
            fullpath: path.join(__dirname, 'docparser.js'),
            requires: ['base-base', 'json-stringify']
        },
        yuidoc: {
            fullpath: path.join(__dirname, 'yuidoc.js')
        },
        'doc-builder': {
            fullpath: path.join(__dirname, 'builder.js'),
            requires: ['parallel', 'handlebars']
        },
        utils: {
            fullpath: path.join(__dirname, 'utils.js')
        },
        files: {
            fullpath: path.join(__dirname, 'files.js')
        },
        docview: {
            fullpath: path.join(__dirname, 'docview.js')
        },
        server: {
            fullpath: path.join(__dirname, 'server.js')
        },
        project: {
            fullpath: path.join(__dirname, 'project.js')
        }
    },
    logExclude: {
        attribute: true,
        handlebars: true
    },
    useSync: true
}).use('utils', 'docparser', 'yuidoc', 'doc-builder', 'docview', 'files', 'help', 'options', 'server', 'project');

Y.packageInfo = Y.Files.getJSON(metaPath);

module.exports = Y;
