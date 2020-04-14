import fs from 'fs';

const globby = require('globby');
const jsdoc = require('doctrine');
const srcRoot = fs.realpathSync(__dirname + '/../src');
const commentRE = /^(\s+)?(\/\*)?\*(\/)?\s?/mg;
const jsdocRE = /[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\//mg;

var stripComments = function(str) {
  return str.replace(commentRE, '');
};

function options(cb, allMetadata) {
  var opts;

  var files = globby.sync(`${srcRoot}/*.js`)
    opts = files
      .map(function(file) {
        var srcFile = fs.readFileSync(file, 'utf8');
        var docs = srcFile.match(jsdocRE);

        if (docs) {
          docs = docs
            .map(stripComments)
            .map(function(str) {
              return jsdoc.parse(str, {
                sloppy: true,
                tags: [
                  'access',
                  'author',
                  'class',
                  'example',
                  'function',
                  'memberOf',
                  'name',
                  'optionName',
                  'optionProp',
                  'param',
                  'params',
                  'preserve',
                 'private',
                  'returns',
                  'type'
                ]
              });
            });

          var option = docs
            .filter(function(doc) {
              if (allMetadata) {
                return true;
              } else {
                return doc && doc.tags.some(d => d.title === 'optionName')
              }
            })
            .map(function(opt) {
              if (allMetadata) {
                return opt;
              } else {
                var tags = opt.tags.filter(function(tag) {
                  return tag.title.indexOf('option') === 0;
                });

                return {
                  name: tags.filter( t => t.title === 'optionName')[0].description,
                  property: tags.filter( t => t.title === 'optionProp')[0].description
                };
              }
            })

          return option;
        }
      })
      .filter(function(doc) {
        return doc && doc.length;
      })
     .flat(Infinity)

  if (cb) {
    cb(opts);
  }

  // alphabetize them, for the site
  return opts.sort((a,b) => a.name < b.name ? -1 : 1);
}

export default options
