/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
YUI.add('help', function(Y) {
    
    /**
    * Shows the help text
    * @module yuidoc
    * @class Help
    */

    /**
    * The help text to display
    * @private
    * @property help
    * @type Array
    */
    var help = [
        "",
        "YUI Doc generates API documentation from a modified JavaDoc syntax.",
        "",
        "Current version ({VERSION})",
        "",
        "Usage: yuidoc <options> <input path>",
        "",
        "Common Options:",
        "  -c, --config, --configfile <filename>  A JSON config file to provide configuration data.",
        "           You can also create a yuidoc.json file and place it",
        "           anywhere under your source tree and YUI Doc will find it",
        "           and use it.",
        "  -e, --extension <comma sep list of file extensions> The list of file extensions to parse ",
        "           for api documentation. (defaults to .js)",
        "  -x, --exclude <comma sep list of directories> Directories to exclude from parsing ",
        "           (defaults to '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp')",
        "  -v, --version Show the current YUIDoc version",
        "  --project-version Set the doc version for the template",
        "  -N, --no-color Turn off terminal colors (for automation)",
        "  -C, --no-code Turn off code generation (don't include source files in output)",
        "  -n, --norecurse Do not recurse directories (default is to recurse)",
        "  -S, --selleck Look for Selleck component data and attach to API meta data",
        "  -V, --view Dump the Handlebars.js view data instead of writing template files",
        "  -p, --parse-only Only parse the API docs and create the JSON data, do not render templates",
        "  -o, --out <directory path> Path to put the generated files (defaults to ./out)",
        "  -t, --themedir <directory path> Path to a custom theme directory containing Handlebars templates",
        "  -H, --helpers <comma separated list of paths to files> Require these file and add Handlebars helpers. See docs for more information",
        "  --charset CHARSET Use this as the default charset for all file operations. Defaults to 'utf8'",
        "  -h, --help Show this help",
        "  -q, --quiet Supress logging output",
        "  -T, --theme <simple|default> Choose one of the built in themes (default is default)",
        "  --syntaxtype <js|coffee> Choose comment syntax type (default is js)",
        "  --server <port> Fire up the YUIDoc server for faster API doc developement. Pass optional port to listen on. (default is 3000)",
        "  --lint Lint your docs, will print parser warnings and exit code 1 if there are any",
        "",
        "  <input path> Supply a list of paths (shell globbing is handy here)",
        "",
    ].join('\n');
    
    /**
    * Render the help message as a string
    * @method renderHelp
    * @return {String} The help screen to display
    */
    Y.renderHelp = function() {
        return Y.Lang.sub(help, {
            VERSION: Y.packageInfo.version
        });
    };
    /**
    * Display the help message, write it to the screen and exit
    * @method showHelp
    */
    Y.showHelp = function() {
        console.error(Y.renderHelp());
        process.exit(0); //Shouldn't exit one on help
    }
});
