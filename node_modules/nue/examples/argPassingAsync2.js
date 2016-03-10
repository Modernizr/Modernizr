var flow = require('../index').flow;
var as = require('../index').as;
var fs = require('fs');

var myFlow = flow('myFlow')(
  function readFiles(file1, file2) {
    fs.readFile(file1, 'utf8', this.async({name: file1, data: as(1)}));
    fs.readFile(file2, 'utf8', this.async({name: file2, data: as(1)}));
  },
  function end(f1, f2) {
    if (this.err) throw this.err;
    console.log(f1.name + ' and ' + f2.name + ' have been read.'); // file1 and file2 have been read.
    console.log(f1.data + f2.data); // FILE1FILE2
    console.log('done');
    this.next();
  }
);

myFlow('file1', 'file2');