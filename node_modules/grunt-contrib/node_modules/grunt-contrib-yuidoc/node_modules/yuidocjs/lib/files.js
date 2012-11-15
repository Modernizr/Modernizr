YUI.add('files', function(Y) {

/**
* Ported fileutils methods from [Selleck](http://github.com/rgrove/selleck)
* @class Files
* @module yuidoc
*/

Y.Files = {};


/*
Selleck
Copyright (c) 2011 Yahoo! Inc.
Licensed under the BSD License.
*/

var fs = require('graceful-fs');
    fsPath   = require('path'),
    nodeUtil = require('util'),
    useFS = (fs.exists) ? fs : fsPath;




var exists = function(file, cb) {
    if (cb) {
        useFS.exists(file, cb);
    } else {
        return useFS.existsSync(file);
    }
};

Y.Files.exists = exists;


/**
* Copy a directory from one location to another
* @method copyDirectory
* @param {Path} source The source directory
* @param {Path} dest The destination directory
* @param {Boolean} [overwrite=false] Whether or not to overwrite destination files
  if they already exist.
* @param {Function} callback The callback to be executed when complete.
**/
function copyDirectory(source, dest, overwrite, callback) {
    // Allow callback as third arg.
    if (typeof overwrite === 'function') {
        callback = overwrite;
        overwrite = null;
    }

    fs.stat(source, afterSourceStat);

    function afterSourceStat(err, stats) {
        if (err) { return callback(err); }

        if (!stats.isDirectory()) {
            return callback(new Error("Source is not a directory: " + source));
        }

        fs.lstat(dest, afterDestStat);
    }

    function afterDestStat(err, stats) {
        if (err && err.code !== 'ENOENT') { return callback(err); }

        if (stats) {
            // If the destination is a file or a link, either delete it or 
            // bubble an error if overwrite isn't true.
            if (stats.isFile() || stats.isSymbolicLink()) {
                if (overwrite) {
                    deletePath(dest); // TODO: make this async
                } else {
                    callback(new Error("Destination already exists: " + dest));
                    return;
                }
            }

            afterMkDir();
        } else {
            fs.mkdir(dest, 0755, afterMkDir);
        }
    }

    function afterMkDir(err) {
        if (err && err.code !== 'EEXIST') { return callback(err); }
        fs.readdir(source, afterReadDir);
    }

    function afterReadDir(err, files) {
        if (err) { return callback(err); }

        var pending = files.length,
            filename;

        if (!pending) { return callback(); }

        while ((filename = files.shift())) {
            copyPath(fsPath.join(source, filename), fsPath.join(dest, filename), overwrite, function (err) {
                if (err) { return callback(err); }

                pending -= 1;

                if (!pending) {
                    callback();
                }
            });
        }
    }
}
Y.Files.copyDirectory = copyDirectory;

/**
* Copy a file from one location to another
* @method copyFile
* @param {Path} source The source file
* @param {Path} dest The destination file
* @param {Boolean} [overwrite=false] Whether or not to overwrite destination files
  if they already exist.
* @param {Callback} callback The callback to be executed when complete.
* @param {Error} callback.err The Error returned from Node
**/
function copyFile(source, dest, overwrite, callback) {
    // Allow callback as third arg.
    if (typeof overwrite === 'function') {
        callback = overwrite;
        overwrite = null;
    }

    fs.lstat(source, function (err, sourceStats) {
        if (err) { return callback(err); }

        if (!sourceStats.isFile()) {
            return callback(new Error("Source is not a file: " + source));
        }

        fs.lstat(dest, function (err, destStats) {
            if (err && err.code !== 'ENOENT') { return callback(err); }

            if (destStats) {
                if (overwrite) {
                    deletePath(dest); // TODO: make this async
                } else {
                    callback(new Error("Destination already exists: " + dest));
                    return;
                }
            }

            nodeUtil.pump(fs.createReadStream(source),
                    fs.createWriteStream(dest, {mode: 0655}), callback);
        });
    });
}
Y.Files.copyFile = copyFile;

/**
If _source_ is a file, copies it to _dest_. If it's a directory, recursively
copies it and all files and directories it contains to _dest_.

Note that when attempting to copy a file into a directory, you should specify
the full path to the new file (including the new filename). Otherwise, it will
be interpreted as an attempt to copy the _source_ file *over* the _dest_
directory instead of *into* it.

Known issues:
- Doesn't preserve ownership or permissions on copied files/directories.

@method copyPath
@param {String} source Source path.
@param {String} dest Destination path.
@param {Boolean} [overwrite=false] Whether or not to overwrite destination files
if they already exist.
@param {Callback} callback The callback to execute when completed.
@param {Error} callback.err
**/
function copyPath(source, dest, overwrite, callback) {
    var destStats   = statSync(dest),
        sourceStats = statSync(source);

    // Allow callback as third arg.
    if (typeof overwrite === 'function') {
        callback = overwrite;
        overwrite = null;
    }

    if (!sourceStats) {
        callback(new Error("Source not found: " + source));
        return;
    }

    if (sourceStats.isFile()) {
        copyFile(source, dest, overwrite, callback);
    } else if (sourceStats.isDirectory()) {
        copyDirectory(source, dest, overwrite, callback);
    } else {
        callback(new Error("Source is neither a file nor a directory: " + source));
    }
}
Y.Files.copyPath = copyPath;

// TODO: copySymbolicLink()?

/**
If _path_ is a file, deletes it. If _path_ is a directory, recursively deletes
it and all files and directories it contains.

This method is synchronous.

@method deletePath
@param {String} path File or directory to delete.
**/
function deletePath(path) {
    var stats = fs.lstatSync(path);

    if (stats.isFile() || stats.isSymbolicLink()) {
        fs.unlinkSync(path);
    } else if (stats.isDirectory()) {
        fs.readdirSync(path).forEach(function (filename) {
            deletePath(fsPath.join(path, filename));
        });

        fs.rmdirSync(path);
    }
}
Y.Files.deletePath = deletePath;

/**
Check to see if this is a directory
@method isDirectory
@param {Path} path The path to check
@param {Boolean} [link=false] Also validate a symlink
@return {Boolean} True if it is a directory
**/
function isDirectory(path, link) {
    var i = false;
    link = (link === false) ? false : true;
    try {
        var stat = fs.lstatSync(path);
        
        if (stat) {
            if (stat.isSymbolicLink() && link) {
                stat = fs.statSync(path);
            }
            i = stat.isDirectory();
        }
    } catch (e) {
        i = false;
    }

    return i;
};

Y.Files.isDirectory = isDirectory;

/**
Check to see if this is a File
@method isFile
@param {Path} path The path to check
@param {Boolean} [link=false] Also validate a symlink
@return {Boolean} True if it is a file
**/
function isFile(path, link) {
    var i = false;
    try {
        var stat = fs.lstatSync(path);
        
        if (stat) {
            if (stat.isSymbolicLink() && link) {
                stat = fs.statSync(path);
            }
            i = stat.isFile();
        }
    } catch (e) {
        i = false;
    }

    return i;
}
Y.Files.isFile = isFile;

/**
Check to see if this is a SymLink
@method isSymbolicLink
@param {Path} path The path to check
@return {Boolean} True if it is a link
**/
function isSymbolicLink(path) {
    var stats = lstatSync(path);
    return stats ? stats.isSymbolicLink() : false;
}
Y.Files.isSymbolicLink = isSymbolicLink;

/**
Like `fs.lstatSync()`, but returns `null` instead of throwing when _path_
doesn't exist. Will still throw on other types of errors.

@method lstatSync
@param {String} path Path to stat.
@return {fs.Stats|null} `fs.Stats` object, or `null` if _path_ doesn't exist.
**/
function lstatSync(path) {
    try {
        return fs.lstatSync(path);
    } catch (ex) {
        if (ex.code === 'ENOENT') {
            return null;
        }

        throw ex;
    }
}
Y.Files.lstatSync = lstatSync;

/**
Like `fs.statSync()`, but returns `null` instead of throwing when _path_
doesn't exist. Will still throw on other types of errors.

@method statSync
@param {String} path Path to stat.
@return {fs.Stats|null} `fs.Stats` object, or `null` if _path_ doesn't exist.
**/
function statSync(path) {
    try {
        return fs.statSync(path);
    } catch (ex) {
        if (ex.code === 'ENOENT') {
            return null;
        }

        throw ex;
    }
}
Y.Files.statSync = statSync;

/**
Copy the theme assets directory
@method copyAssets
@param {Path} from The source directory
@param {Path} dest The destination directory
@param {Boolean} deleteFirst Should the directory be deleted if it exists
@param {Function} callback The callback to be executed
*/
function copyAssets() {
    var args        = Array.prototype.slice.call(arguments),
        callback    = args.pop(),
        from        = args.shift(),
        to          = args.shift(),
        deleteFirst = args.shift();
    
    if (from[0] === from[1]) {
        if (isDirectory(from[0])) {
            if (deleteFirst && isDirectory(to)) {
                deletePath(to);
            }

            copyPath(from[0], to, true, callback);
        } else {
            callback();
        }
    } else {
        if (isDirectory(from[0])) {
            if (deleteFirst && isDirectory(to)) {
                deletePath(to);
            }

            copyPath(from[0], to, true, function() {
                if (isDirectory(from[1])) {
                    copyPath(from[1], to, true, callback)
                } else {
                    callback();
                }
            });
        } else {
            callback();
        }
        
    }
}

Y.Files.copyAssets = copyAssets;


/**
* Helper method for getting JSON data from a local file
* @method getJSON
* @param {Path} filename The filename to parse JSON from
* @return {Object} The JSON data 
*/
Y.Files.getJSON = function(filename) {
    var data = {};
    if (exists(filename)) {
        data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    };
    return data;
};

/**
* Helper method for writing files to disk. It wraps the NodeJS file API
* @method writeFile
* @param {Path} file The filename to write to
* @param {String} data The data to write
* @param {Callback} callback*
*/

var writeFileTimer = 100,
    readFileTimer = 100;

var writeFile = function(file, data, cb) {
    var flags = {
        flags: "w", encoding: Y.charset, mode: 0644
    }
    var args = arguments;
    if (cb) {
        fs.writeFile(file, data, flags, function(err) {
            if (err && err.message.match(/^EMFILE, Too many open files/)) {
                Y.log('Writefile failed, too many open files (' + args[0] + '). Trying again.', 'warn', 'files');
                writeFileTimer++;
                Y.later(writeFileTimer, Y, writeFile, args);
                return;
            }
            cb();
        });
    } else {
        var out = fs.createWriteStream(file, flags);
        out.write(data);
        out.end();
    }
};

Y.Files.writeFile = writeFile;


var readFile = function(file, enc, cb) {
    var args = arguments;
    fs.readFile(file, enc, function(err, data) {
        if (err && err.message.match(/^EMFILE, Too many open files/)) {
            Y.log('Readfile failed, too many open files (' + args[0] + '). Trying again.', 'warn', 'files');
            readFileTimer++;
            Y.later(readFileTimer, Y, readFile, args);
            return;
        }
        cb(err, data);
    });
};

Y.Files.readFile = readFile;

});
