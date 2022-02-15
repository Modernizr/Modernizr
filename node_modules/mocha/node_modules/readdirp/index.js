'use strict';

const fs = require('fs');
const { Readable } = require('stream');
const sysPath = require('path');
const picomatch = require('picomatch');
const { promisify } = require('util');
const [readdir, stat, lstat] = [promisify(fs.readdir), promisify(fs.stat), promisify(fs.lstat)];
const supportsDirent = 'Dirent' in fs;

/**
 * @typedef {Object} EntryInfo
 * @property {String} path
 * @property {String} fullPath
 * @property {fs.Stats=} stats
 * @property {fs.Dirent=} dirent
 * @property {String} basename
 */

const isWindows = process.platform === 'win32';
const supportsBigint = typeof BigInt === 'function';
const BANG = '!';
const NORMAL_FLOW_ERRORS = new Set(['ENOENT', 'EPERM', 'EACCES', 'ELOOP']);
const STAT_OPTIONS_SUPPORT_LENGTH = 3;
const FILE_TYPE = 'files';
const DIR_TYPE = 'directories';
const FILE_DIR_TYPE = 'files_directories';
const EVERYTHING_TYPE = 'all';
const FILE_TYPES = new Set([FILE_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE]);
const DIR_TYPES = new Set([DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE]);
const ALL_TYPES = [FILE_TYPE, DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE];

const isNormalFlowError = errorCode => NORMAL_FLOW_ERRORS.has(errorCode);

const checkBasename = f => f(entry.basename);

const normalizeFilter = filter => {
  if (filter === undefined) return;
  if (typeof filter === 'function') return filter;

  if (typeof filter === 'string') {
    const glob = picomatch(filter.trim());
    return entry => glob(entry.basename);
  }

  if (Array.isArray(filter)) {
    const positive = [];
    const negative = [];
    for (const item of filter) {
      const trimmed = item.trim();
      if (trimmed.charAt(0) === BANG) {
        negative.push(picomatch(trimmed.slice(1)));
      } else {
        positive.push(picomatch(trimmed));
      }
    }

    if (negative.length > 0) {
      if (positive.length > 0) {
        return entry =>
          positive.some(f => f(entry.basename)) && !negative.some(f => f(entry.basename));
      } else {
        return entry => !negative.some(f => f(entry.basename));
      }
    } else {
      return entry => positive.some(f => f(entry.basename));
    }
  }
};

class ExploringDir {
  constructor(path, depth) {
    this.path = path;
    this.depth = depth;
  }
}

class ReaddirpStream extends Readable {
  static get defaultOptions() {
    return {
      root: '.',
      fileFilter: path => true,
      directoryFilter: path => true,
      type: 'files',
      lstat: false,
      depth: 2147483648,
      alwaysStat: false
    };
  }

  constructor(options = {}) {
    super({ objectMode: true, highWaterMark: 1, autoDestroy: true });
    const opts = Object.assign({}, ReaddirpStream.defaultOptions, options);
    const { root } = opts;

    this._fileFilter = normalizeFilter(opts.fileFilter);
    this._directoryFilter = normalizeFilter(opts.directoryFilter);
    this._statMethod = opts.lstat ? lstat : stat;
    this._statOpts = { bigint: isWindows };
    this._maxDepth = opts.depth;
    this._entryType = opts.type;
    this._root = sysPath.resolve(root);
    this._isDirent = !opts.alwaysStat && supportsDirent;
    this._statsProp = this._isDirent ? 'dirent' : 'stats';
    this._readdir_options = { encoding: 'utf8', withFileTypes: this._isDirent };

    // Launch stream with one parent, the root dir.
    /** @type Array<[string, number]>  */
    this.parents = [new ExploringDir(root, 0)];
    this.filesToRead = 0;
  }

  async _read() {
    do {
      // If the stream was destroyed, we must not proceed.
      if (this.destroyed) return;

      const parent = this.parents.pop();
      if (!parent) {
        // ...we have files to process; but not directories.
        // hence, parent is undefined; and we cannot execute fs.readdir().
        // The files are being processed anywhere.
        break;
      }
      await this._exploreDirectory(parent);
    } while (!this.isPaused() && !this._isQueueEmpty());

    this._endStreamIfQueueIsEmpty();
  }

  async _exploreDirectory(parent) {
    /** @type Array<fs.Dirent|string> */
    let files = [];

    // To prevent race conditions, we increase counter while awaiting readdir.
    this.filesToRead++;
    try {
      files = await readdir(parent.path, this._readdir_options);
    } catch (error) {
      if (isNormalFlowError(error.code)) {
        this._handleError(error);
      } else {
        this._handleFatalError(error);
      }
    }
    this.filesToRead--;

    // If the stream was destroyed, after readdir is completed
    if (this.destroyed) return;

    this.filesToRead += files.length;

    const entries = await Promise.all(files.map(dirent => this._formatEntry(dirent, parent)));

    if (this.destroyed) return;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      this.filesToRead--;
      if (!entry) {
        continue;
      }
      if (this._isDirAndMatchesFilter(entry)) {
        this._pushNewParentIfLessThanMaxDepth(entry.fullPath, parent.depth + 1);
        this._emitPushIfUserWantsDir(entry);
      } else if (this._isFileAndMatchesFilter(entry)) {
        this._emitPushIfUserWantsFile(entry);
      }
    }
  }

  _isStatOptionsSupported() {
    return this._statMethod.length === STAT_OPTIONS_SUPPORT_LENGTH;
  }

  _stat(fullPath) {
    if (isWindows && this._isStatOptionsSupported()) {
      return this._statMethod(fullPath, this._statOpts);
    } else {
      return this._statMethod(fullPath);
    }
  }

  async _formatEntry(dirent, parent) {
    const basename = this._isDirent ? dirent.name : dirent;
    const fullPath = sysPath.resolve(sysPath.join(parent.path, basename));

    let stats;
    if (this._isDirent) {
      stats = dirent;
    } else {
      try {
        stats = await this._stat(fullPath);
      } catch (error) {
        if (isNormalFlowError(error.code)) {
          this._handleError(error);
        } else {
          this._handleFatalError(error);
        }
        return;
      }
    }
    const path = sysPath.relative(this._root, fullPath);

    /** @type {EntryInfo} */
    const entry = { path, fullPath, basename, [this._statsProp]: stats };

    return entry;
  }

  _isQueueEmpty() {
    return this.parents.length === 0 && this.filesToRead === 0 && this.readable;
  }

  _endStreamIfQueueIsEmpty() {
    if (this._isQueueEmpty()) {
      this.push(null);
    }
  }

  _pushNewParentIfLessThanMaxDepth(parentPath, depth) {
    if (depth <= this._maxDepth) {
      this.parents.push(new ExploringDir(parentPath, depth));
      return true;
    } else {
      return false;
    }
  }

  _isDirAndMatchesFilter(entry) {
    return entry[this._statsProp].isDirectory() && this._directoryFilter(entry);
  }

  _isFileAndMatchesFilter(entry) {
    const stats = entry[this._statsProp];
    const isFileType =
      (this._entryType === EVERYTHING_TYPE && !stats.isDirectory()) ||
      (stats.isFile() || stats.isSymbolicLink());
    return isFileType && this._fileFilter(entry);
  }

  _emitPushIfUserWantsDir(entry) {
    if (DIR_TYPES.has(this._entryType)) {
      // TODO: Understand why this happens.
      const fn = () => {
        this.push(entry);
      };
      if (this._isDirent) setImmediate(fn);
      else fn();
    }
  }

  _emitPushIfUserWantsFile(entry) {
    if (FILE_TYPES.has(this._entryType)) {
      this.push(entry);
    }
  }

  _handleError(error) {
    if (!this.destroyed) {
      this.emit('warn', error);
    }
  }

  _handleFatalError(error) {
    this.destroy(error);
  }
}

/**
 * @typedef {Object} ReaddirpArguments
 * @property {Function=} fileFilter
 * @property {Function=} directoryFilter
 * @property {String=} type
 * @property {Number=} depth
 * @property {String=} root
 * @property {Boolean=} lstat
 * @property {Boolean=} bigint
 */

/**
 * Main function which ends up calling readdirRec and reads all files and directories in given root recursively.
 * @param {String} root Root directory
 * @param {ReaddirpArguments=} options Options to specify root (start directory), filters and recursion depth
 */
const readdirp = (root, options = {}) => {
  let type = options['entryType'] || options.type;
  if (type === 'both') type = FILE_DIR_TYPE; // backwards-compatibility
  if (type) options.type = type;
  if (root == null || typeof root === 'undefined') {
    throw new Error('readdirp: root argument is required. Usage: readdirp(root, options)');
  } else if (typeof root !== 'string') {
    throw new Error(`readdirp: root argument must be a string. Usage: readdirp(root, options)`);
  } else if (type && !ALL_TYPES.includes(type)) {
    throw new Error(`readdirp: Invalid type passed. Use one of ${ALL_TYPES.join(', ')}`);
  }

  options.root = root;
  return new ReaddirpStream(options);
};

const readdirpPromise = (root, options = {}) => {
  return new Promise((resolve, reject) => {
    const files = [];
    readdirp(root, options)
      .on('data', entry => files.push(entry))
      .on('end', () => resolve(files))
      .on('error', error => reject(error));
  });
};

readdirp.promise = readdirpPromise;
readdirp.ReaddirpStream = ReaddirpStream;
readdirp.default = readdirp;

module.exports = readdirp;
