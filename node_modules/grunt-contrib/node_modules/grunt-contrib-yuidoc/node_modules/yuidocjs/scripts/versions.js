#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    package = require(path.join(__dirname, '../', 'package.json')),
    version = package.version,
    doc = path.join(__dirname, '../', 'conf', 'docs', 'project.json');

console.log('[version]', version);
console.log('[doc]', doc);

var docJSON = require(doc);

docJSON.version = version;

fs.writeFileSync(doc, JSON.stringify(docJSON, null, 2));
console.log('[done]');
