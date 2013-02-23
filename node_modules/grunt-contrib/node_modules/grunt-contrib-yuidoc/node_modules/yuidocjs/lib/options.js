YUI.add('options', function(Y) {
    
    var path = require('path');

    /**
    * Handles argument parsing
    * @module yuidoc
    * @class Options
    */

    /**
    * Parses arguments and returns an Object of config options
    * @method Options
    * @param {Array} args Arguments to parse
    * @return {Object} The config object
    */
    Y.Options = function(args) {
    
        var options = {
            port: 3000,
            nocode: false
        };

        while (args.length > 0) {
            var v = args.shift();
            // options.* defined in ./builder.js
            switch (v) {
                case '--lint':
                    options.lint = true;
                    options.parseOnly = true;
                    options.writeJSON = false;
                    options.quiet = true;
                    break;
                case "--debug":
                    Y.applyConfig({ debug: true, filter: 'debug' });
                    break;
                case "--charset":
                    Y.charset = args.shift() || 'utf8';
                    Y.log('Setting default charset to ' + Y.charset, 'yuidoc', 'warn');
                    break;
                case "-c":
                case "--config":
                case "--configfile":
                    options.configfile = args.shift();
                    break;
                case "-e":
                case "--extension":
                    options.extension = args.shift();
                    break;
                case "-x":
                case "--exclude":
                    options.exclude = args.shift();
                    break;
                case "-v":
                case "--version":
                    console.error(Y.packageInfo.version);
                    process.exit(1);
                    break;
                case "--project-version":
                    options.version = args.shift();
                    break;
                case "-N":
                case "--no-color":
                    Y.config.useColor = false;
                    options.nocolor = true;
                    break;
                case "-D":
                case "--no-delete-out":
                    options.nodeleteout = true;
                    break;
                case "-C":
                case "--no-code":
                    options.nocode = true;
                    break;
                case "-n":
                case "--norecurse":
                    options.norecurse = true;
                    break;
                case "-S":
                case "--selleck":
                    options.selleck = true;
                    break;
                case "-V":
                case "--view":
                    options.dumpview = true;
                    break;
                case "-p":
                case "--parse-only":
                    options.parseOnly = true;
                    break;
                case "-o":
                case "--outdir":
                    options.outdir = args.shift();
                    break;
                case "-t":
                case "--themedir":
                    options.themedir = args.shift();
                    break;
                case "--server":
                    options.server = true;
                    var a = args.shift();
                    var p = parseInt(a, 10);
                    if (isNaN(p) || !p) {
                        if (a) {
                            args.unshift(a);
                        }
                        Y.log('Failed to extract port, setting to the default :3000', 'warn', 'yuidoc');
                    } else {
                        options.port = p;
                    }
                    break;
                case "-h":
                case "--help":
                    Y.showHelp();
                    break;
                case "-H":
                case "--helpers":
                    var list = args.shift();
                    if (list) {
                        options.helpers = list.split(',');
                    } else {
                        throw('Failed to pass a helper file.');
                    }
                    break;
                case "-T":
                case "--theme":
                    var theme = args.shift();
                    options.themedir = path.join(__dirname, '../', 'themes', theme);
                    break;
                case "-q":
                case "--quiet":
                    options.quiet = true;
                    break;
                case "--syntaxtype":
                    options.syntaxtype = args.shift();
                    break;
                default:
                    if (!options.paths) {
                        options.paths = [];
                    }
                    if (v && v.indexOf('-') === 0) {
                        throw('Unknown option: ' + v);
                    }
                    options.paths.push(v);
            }
        }

        if (options.quiet) {
            Y.applyConfig({ debug: false });
        }
    
        return options;

    };

});
