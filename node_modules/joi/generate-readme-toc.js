var Toc = require('markdown-toc');
var Fs = require('fs');
var Package = require('./package.json');

var filename = './API.md';

var api = Fs.readFileSync(filename, 'utf8');
var tocOptions = {
    bullets: '-',
    slugify: function (text) {

        return text.toLowerCase()
            .replace(/\s/g, '-')
            .replace(/[^\w-]/g, '');
    }
};

var output = Toc.insert(api, tocOptions)
    .replace(/<!-- version -->(.|\n)*<!-- versionstop -->/, '<!-- version -->\n# ' + Package.version + ' API Reference\n<!-- versionstop -->');

Fs.writeFileSync(filename, output);
