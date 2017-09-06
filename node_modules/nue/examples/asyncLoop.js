var flow = require('../index').flow;
var as = require('../index').as;
var fs = require('fs');

var myFlow = flow('myFlow')(
  function readFiles(files) {
    this.asyncEach(files, function (file, group) {
      fs.readFile(file, 'utf8', group.async({name: file, data: as(1)}));
    });
  },
  function end(files) {
    if (this.err) throw this.err;
    var names = files.map(function (f) { return f.name; });
    var contents = files.map(function (f) { return f.data});
    console.log(names.join(' and ') + ' have been read.'); // file1 and file2 have been read.
    console.log(contents.join('')); // FILE1FILE2
    this.next();
  }
);

myFlow(['file1', 'file2']);