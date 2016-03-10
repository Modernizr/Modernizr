'use strict';

var fileSyncCmp = require('../');

var assert = require('assert');
var fs = require('fs');

var tmp = require('tmp');
tmp.setGracefulCleanup();

var Q = require('q');

var fsWrite = Q.nfbind(fs.write);
var tmpFile = Q.nfbind(tmp.file);

function write (fd, buf) {
    return fsWrite(fd, buf, 0, buf.length, null);
}


describe('equalFiles', function () {
    var pathA, pathB;
    var fdA, fdB;

    beforeEach(function () {
        return Q.all([tmpFile(), tmpFile()]).spread(function (a, b) {
            pathA = a[0];
            pathB = b[0];
            fdA = a[1];
            fdB = b[1];
        });
    });

    it('should handle empty files', function () {
        assert(fileSyncCmp.equalFiles(pathA, pathB));
    });

    it('should handle equal content', function () {
        var buf = new Buffer('File content\n');
        var writes = [write(fdA, buf), write(fdB, buf)];
        return Q.all(writes).then(function () {
            assert(fileSyncCmp.equalFiles(pathA, pathB));
        });
    });

    it('should handle non-equal content', function () {
        var bufA = new Buffer('Some text\n');
        var bufB = new Buffer('Other text\n');
        var writes = [write(fdA, bufA), write(fdB, bufB)];
        return Q.all(writes).then(function () {
            assert(!fileSyncCmp.equalFiles(pathA, pathB));
        });
    });
});
