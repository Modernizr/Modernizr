const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');
const licensePath = path.resolve(__dirname, '../LICENSE');

const license = fs.readFileSync(licensePath, 'utf8');
const data = license.replace(/Modernizr\s(.+?)\s\|/, 'Modernizr ' + pkg.version + ' |');

fs.writeFileSync(licensePath, data, 'utf8');
