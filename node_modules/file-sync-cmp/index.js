'use strict';

var fs = require('fs');

var BUF_SIZE = 16 * 1024;

/* Compare two files by content. */
function equalFiles(pathA, pathB) {
    var statA = fs.lstatSync(pathA);
    var statB = fs.lstatSync(pathB);
    if (statA.size !== statB.size) {
        return false;
    }
    var fdA = fs.openSync(pathA, 'r');
    var fdB = fs.openSync(pathB, 'r');
    var bufA = new Buffer(BUF_SIZE);
    var bufB = new Buffer(BUF_SIZE);
    var readA = 1;
    var readB = 1;
    while (readA > 0) {
        readA = fs.readSync(fdA, bufA, 0, bufA.length, null);
        readB = fs.readSync(fdB, bufB, 0, bufB.length, null);
        if (readA !== readB) {
            return false;
        }
        for (var i = 0; i < readA; i++) {
            if (bufA[i] !== bufB[i]) {
                return false;
            }
        }
    }
    fs.closeSync(fdA);
    fs.closeSync(fdB);
    return true;
}

module.exports.equalFiles = equalFiles;
