var flow = require('../index').flow;
var as = require('../index').as;
var fs = require('fs');

var myFlow = flow('myFlow')(
  function readFiles(file1, file2) {
    this.data.file1 = file1;
    this.data.file2 = file2;
    fs.readFile(file1, 'utf8', this.async(as(1)));
    fs.readFile(file2, 'utf8', this.async(as(1)));
  },
  function concat(data1, data2) {
    this.next(data1 + data2);
  },
  function end(data) {
    if (this.err) throw this.err;
    console.log(data);
    console.log(this.data.file1 + ' and ' + this.data.file2 + ' are concatenated.');
    this.next();
  }
);

myFlow('file1', 'file2');