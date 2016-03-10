var assert = require("assert");
var util = require("util");
var mocha = require("mocha");
var file = require("../lib/file");
var fs = require("fs");
var path = require("path");

var madeDirs = [];
fs.mkdir = function (dir, mode, callback) {
  madeDirs.push(dir);
  callback();
};

fs.mkdirSync = function (dir, mode) {
  madeDirs.push(dir);
};

global.fs = fs;

describe("file#mkdirs", function () {
  beforeEach(function (done) {
    madeDirs = [];
    done();
  });

  it("should make all the directories in the tree", function (done) {
    file.mkdirs("/test/test/test/test", 0755, function(err) {
      if (err) throw new Error(err);
      assert.equal(madeDirs[0], "/test");
      assert.equal(madeDirs[1], "/test/test");
      assert.equal(madeDirs[2], "/test/test/test");
      assert.equal(madeDirs[3], "/test/test/test/test");
      done();
    });
  });
});

describe("file#mkdirsSync", function () {
  beforeEach(function (done) {
    madeDirs = [];
    done();
  });

  it("should make all the directories in the tree", function (done) {
    file.mkdirsSync("/test/test/test/test", 0755, function(err) {
      if (err) throw new Error(err);
    });
    assert.equal(madeDirs[0], "/test");
    assert.equal(madeDirs[1], "/test/test");
    assert.equal(madeDirs[2], "/test/test/test");
    assert.equal(madeDirs[3], "/test/test/test/test");
    done();
  });
});

// TODO: File walk tests are obviously not really working
describe("file#walk", function () {
  it("should call \"callback\" for ever file in the tree", function (done) {
    file.walk("./tests", function(start, dirs, names) {});
    done();
  });
});

describe("file#walkSync", function () {
  it("should call \"callback\" for ever file in the tree", function (done) {
    file.walkSync("./tests", function(start, dirs, names) {});
    done();
  });
});

describe("file.path#abspath", function () {
  it("should convert . to the current directory", function (done) {
    assert.equal(file.path.abspath("."), process.cwd());
    assert.equal(file.path.abspath("./test/dir"), file.path.join(process.cwd(), "test/dir"));
    done();
  });

  it("should convert .. to the parrent directory", function (done) {
    assert.equal(file.path.abspath(".."), path.dirname(process.cwd()));
    assert.equal(file.path.abspath("../test/dir"), file.path.join(path.dirname(process.cwd()), "test/dir"));
    done();
  });

  it("should convert ~ to the home directory", function (done) {
    assert.equal(file.path.abspath("~"), file.path.join(process.env.HOME, ""));
    assert.equal(file.path.abspath("~/test/dir"), file.path.join(process.env.HOME, "test/dir"));
    done();
  });

  it("should not convert paths begining with /", function (done) {
    assert.equal(file.path.abspath("/x/y/z"), "/x/y/z");
    done();
  });
});


describe("file.path#relativePath", function () {
  it("should return the relative path", function (done) {
    var rel = file.path.relativePath("/", "/test.js");
    assert.equal(rel, "test.js");

    var rel = file.path.relativePath("/test/loc", "/test/loc/test.js");
    assert.equal(rel, "test.js");

    done();
  });

  it("should take two equal paths and return \"\"", function (done) {
    var rel = file.path.relativePath("/test.js", "/test.js");
    assert.equal(rel, "");
    done();
  });
});
