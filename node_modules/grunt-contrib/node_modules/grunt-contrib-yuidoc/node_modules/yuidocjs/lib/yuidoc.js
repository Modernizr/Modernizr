/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
var fs = require("fs"),
    rimraf = require('rimraf'),
    path = require("path");

/**
This is the __module__ description for the `YUIDoc` module.

    var options = {
        paths: [ './lib' ],
        outdir: './out'
    };

    var Y = require('yuidocjs');
    var json = (new Y.YUIDoc(options)).run();

@class YUIDoc
@main yuidoc
*/


YUI.add('yuidoc', function(Y) {


    /**
     * The default list of configuration options
     * @property OPTIONS
     * @type Object
     * @final
     * @for YUIDoc
     */

    var OPTIONS = {
        quiet: false,
        writeJSON: true,
        outdir: path.join(process.cwd(),  'out'),
        extension: '.js',
        exclude: '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp,node_modules',
        norecurse: false,
        version: '0.1.0',
        paths: [],
        themedir: path.join(__dirname,  'themes', 'default'),
        syntaxtype: 'js'
    };

    /**
     * YUIDoc main class

        var options = {
            paths: [ './lib' ],
            outdir: './out'
        };

        var Y = require('yuidoc');
        var json = (new Y.YUIDoc(options)).run();
     
     * @class YUIDoc
     * @module yuidoc
     * @constructor
     * @param config The config object
     */
    Y.YUIDoc = function(config) {
        /**
         * Holds the number of files that we are processing.
         * @property filecount
         * @type Boolean
         * @private
         */
        this.filecount = 0;
        /**
         * Hash map of dirnames to selleck config options.
         * @property selleck
         * @type Object
         * @private
         */
        this.selleck = {};
        /**
         * Holder for the list of files we are processing.
         * @property filemap
         * @type Object
         * @private
         */
        this.filemap = {};
        /**
         * Holder for the list of directories we are processing.
         * @property dirmap
         * @type Object
         * @private
         */
        this.dirmap = {};

        /**
         * Internal holder for configuration options.
         * @property options
         * @type Object
         * @private
         */
        this.options = Y.merge(OPTIONS, config);

        if (this.options.quiet) {
            Y.applyConfig({
                debug: false
            });
        }

    };

    Y.YUIDoc.prototype = {
        /**
         * Always exclude these directories
         * @method _setDefaultExcludes
         * @private
         */
        _setDefaultExcludes: function() {
            //These should always be excluded
            var excludes = '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp,node_modules'.split(','),
                self = this;

            excludes.forEach(function(item) {
                self.options.excludes[item] = true;
            });
        },
        /**
         * Does post process on self.options.
         * @method _processConfig
         * @private
         */
        _processConfig: function() {
            this.options.extensions = Y.Array.hash(this.options.extension.split(','));
            this.options.excludes = Y.Array.hash(this.options.exclude.split(','));
            this._setDefaultExcludes();
        },
        /**
         * Walks the paths and parses the directory contents
         * @method walk
         * @private
         */
        walk: function() {
            Y.each(this.options.paths, function(dir) {
                this.parsedir(dir);
            }, this);
        },
        /**
         * Walks the passed directory and grabs all the files recursively.
         * @method parsedir
         * @param {String} dir The directory to parse the contents of.
         * @private
         */
        parsedir: function(dir) {
            if (!Y.Files.isDirectory(dir)) {
                throw('Can not find directory: ' + dir);
            }
            var allfiles = fs.readdirSync(dir), stats,
                files = [], fullpath, self = this;
	    
            if (dir in self.options.excludes) {
                return;
            }
            allfiles = allfiles.sort();

            Y.each(allfiles, function(filename) {
                if (!(filename in self.options.excludes)) {
                    fullpath = path.join(dir, filename);

                    stats = fs.statSync(fullpath);

                    if (stats.isDirectory() && !self.options.norecurse) {
                        self.parsedir(fullpath);
                    } else {
                        files.push(filename);
                    }
                }
            });
            if (!(dir in self.options.excludes)) {
                this.parsefiles(dir, files);
            }
        },
        /**
         * Gathers all the file data and populates the filemap and dirmap hashes.
         * @method parsefiles
         * @param {String} dir The directory to start from.
         * @param {Array} files List of files to parse.
         * @private
         */
        parsefiles: function(dir, files) {
            var self = this;
	    files = files.sort();
            Y.each(files, function(filename) {
                var ext = path.extname(filename), text, fullpath;

                if (ext) {
                    if (ext in self.options.extensions) {
                        fullpath = path.join(dir, filename);

                        if (Y.Files.exists(fullpath)) {
                            self.filecount++;
                            text = fs.readFileSync(fullpath, Y.charset);

                            self.filemap[fullpath] = text;
                            self.dirmap[fullpath] = dir;
                            self.getSelleck(fullpath);

                        } else {
                            Y.log('File skipped: ' + fullpath, 'warn', 'yuidoc');
                        }
                    }
                }
            });
        },
        getSelleck: function(fullpath) {
            var self = this,
                base, comp, json;

            if (self.options.selleck) {
                base = path.dirname(fullpath);
                comp = path.join(base, '../', 'docs', 'component.json');
                //Y.log('Checking for Selleck data: ' + comp, 'info', 'yuidoc');
                if (Y.Files.exists(comp)) {
                    try {
                        var json = JSON.parse(fs.readFileSync(comp, 'utf8'));
                        delete json.examples; //Remove the selleck example data, we only want the comp info
                        self.selleck[fullpath] = json;
                    } catch (e) {
                        Y.log('JSON parse failed on Selleck component.json file: ' + comp, 'error', 'yuidoc');
                    }
                }
            }
        },
        /**
         * Writes the parser JSON data to disk.
         * @method writeJSON
         * @param {Object} parser The DocParser instance to use
         * @private
         * @return {Object} The JSON data returned from the DocParser
         */
        writeJSON: function(parser) {
            var self = this,
            data;

            data = parser.data;

            data.warnings = parser.warnings;

            if (self.selleck && self.options.selleck && data.files && data.modules) {
                Object.keys(self.selleck).forEach(function(file) {
                    Object.keys(data.files).forEach(function(f) {
                        if (file === f) {
                            var mods = data.files[f].modules;
                            if (mods) {
                                Object.keys(mods).forEach(function(mod) {
                                    if (data.modules[mod]) {
                                        if (!data.modules[mod].extra) {
                                            data.modules[mod].extra = {};
                                        }
                                        data.modules[mod].extra.selleck = self.selleck[file];
                                    }
                                });
                            }
                        }
                    });
                });
            }

            if (self.options.project) {
                parser.data.project = self.options.project;
            }

            if (self.options.writeJSON) {
                // Y.log(Y.JSON.stringify(parser.data, null, 4));
                var file = path.join(self.options.outdir, 'data.json'), out;
                if (Y.Files.exists(self.options.outdir) && !self.options.nodeleteout) {
                    Y.log('Found out dir, deleting: ' + self.options.outdir, 'warn', 'yuidoc');
                    rimraf.sync(self.options.outdir);
                }
                if (!Y.Files.exists(self.options.outdir)) {
                    Y.log('Making out dir: ' + self.options.outdir, 'info', 'yuidoc');
                    try {
                        fs.mkdirSync(self.options.outdir, 0777);
                    } catch (e) {
                        Y.log('Outdir creation failed', 'warn', 'yuidoc');
                    }
                }
                
                out = fs.createWriteStream(file, {
                        flags: "w", encoding: Y.charset, mode: 0644
                });
                out.write(JSON.stringify(data, null, 4));
                out.end();
            }

            return data;
        },
        lint: function(warnings) {
            var code = 0,
                count = 0;

            if (warnings && warnings.length) {
                code = 1;
                console.log('YUIDoc found', warnings.length, 'lint errors in your docs');
                warnings.forEach(function(item) {
                    count++;
                    console.log('#' + count, item.message, item.line + '\n');
                });
            }
            process.exit(code);
        },
        /**
         * Process the config, walk the file tree and write out the JSON data.
         * @method run
         * @return {Object} The JSON data returned from the DocParser
         */
        run: function() {
            /**
             * Timestamp holder so we know when YUIDoc started the parse process.
             * @property starttime
             * @type Timestamp
             */
            Y.log('YUIDoc Starting from: ' + this.options.paths.join(','), 'info', 'yuidoc');
            this.starttime = new Date().getTime();

            var self = this;

            this._processConfig();
            this.walk();

            var json = this.writeJSON(new Y.DocParser({
                syntaxtype: self.options.syntaxtype,
                filemap: self.filemap,
                dirmap: self.dirmap
            }).parse());

            if (this.options.lint) {
                this.lint(json.warnings);
            }

            /**
             * Timestamp holder so we know when YUIDoc has finished the parse process.
             * @property endtime
             * @type Timestamp
             */
            this.endtime = new Date().getTime();
            Y.log('Parsed ' + this.filecount + ' files in ' + ((this.endtime - this.starttime) / 1000) + ' seconds', 'info', 'yuidoc');

            return json;
        }
    };

});
