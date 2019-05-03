var fs = require('fs');
var path = require('path');
var pkg = require('../package.json');
var licensePath = path.resolve(__dirname, '../LICENSE');

var license = fs.readFileSync(licensePath, 'utf8');
var data = license.replace(/Modernizr\s(.+?)\s\|/, 'Modernizr ' + pkg.version + ' |');

fs.writeFileSync(licensePath, data, 'utf8');
