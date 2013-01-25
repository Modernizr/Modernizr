var path = require('path'),
    sys = require('util'),
    fs = require('fs');

var less = {
    version: [1, 3, 0],
    Parser: require('./parser').Parser,
    importer: require('./parser').importer,
    tree: require('./tree'),
    render: function (input, options, callback) {
        options = options || {};

        if (typeof(options) === 'function') {
            callback = options, options = {};
        }

        var parser = new(less.Parser)(options),
            ee;

        if (callback) {
            parser.parse(input, function (e, root) {
                callback(e, root && root.toCSS && root.toCSS(options));
            });
        } else {
            ee = new(require('events').EventEmitter);

            process.nextTick(function () {
                parser.parse(input, function (e, root) {
                    if (e) { ee.emit('error', e) }
                    else   { ee.emit('success', root.toCSS(options)) }
                });
            });
            return ee;
        }
    },
    formatError: function(ctx, options) {
        options = options || {};

        var message = "";
        var extract = ctx.extract;
        var error = [];
        var stylize = options.color ? require('./lessc_helper').stylize : function (str) { return str };

        if (ctx.stack) { return stylize(ctx.stack, 'red') }

        if (!ctx.hasOwnProperty('index')) {
            return ctx.stack || ctx.message;
        }

        if (typeof(extract[0]) === 'string') {
            error.push(stylize((ctx.line - 1) + ' ' + extract[0], 'grey'));
        }

        if (extract[1]) {
            error.push(ctx.line + ' ' + extract[1].slice(0, ctx.column)
                                + stylize(stylize(stylize(extract[1][ctx.column], 'bold')
                                + extract[1].slice(ctx.column + 1), 'red'), 'inverse'));
        }

        if (typeof(extract[2]) === 'string') {
            error.push(stylize((ctx.line + 1) + ' ' + extract[2], 'grey'));
        }
        error = error.join('\n') + stylize('', 'reset') + '\n';

        message += stylize(ctx.type + 'Error: ' + ctx.message, 'red');
        ctx.filename && (message += stylize(' in ', 'red') + ctx.filename +
                stylize(':' + ctx.line + ':' + ctx.column, 'grey'));

        message += '\n' + error;

        if (ctx.callLine) {
            message += stylize('from ', 'red') + (ctx.filename || '') + '/n';
            message += stylize(ctx.callLine, 'grey') + ' ' + ctx.callExtract + '/n';
        }

        return message;
    },
    writeError: function (ctx, options) {
        options = options || {};
        if (options.silent) { return }
        sys.error(less.formatError(ctx, options));
    }
};

['color',      'directive',  'operation',  'dimension',
 'keyword',    'variable',   'ruleset',    'element',
 'selector',   'quoted',     'expression', 'rule',
 'call',       'url',        'alpha',      'import',
 'mixin',      'comment',    'anonymous',  'value',
 'javascript', 'assignment', 'condition',  'paren',
 'media', 'ratio'
].forEach(function (n) {
    require('./tree/' + n);
});

less.Parser.importer = function (file, paths, callback, env) {
    var pathname;

    // TODO: Undo this at some point,
    // or use different approach.
    var paths = [].concat(paths); // Avoid passing paths by reference down the import tree...
    paths.unshift('.');           // ...which results on a lot of repeated '.' paths.

    for (var i = 0; i < paths.length; i++) {
        try {
            pathname = path.join(paths[i], file);
            fs.statSync(pathname);
            break;
        } catch (e) {
            pathname = null;
        }
    }

    if (pathname) {
        fs.readFile(pathname, 'utf-8', function(e, data) {
            if (e) return callback(e);

            env.contents[pathname] = data;      // Updating top importing parser content cache.
            new(less.Parser)({
                paths: [path.dirname(pathname)].concat(paths),
                filename: pathname,
                contents: env.contents,
                dumpLineNumbers: env.dumpLineNumbers
            }).parse(data, function (e, root) {
                callback(e, root);
            });
        });
    } else {
        if (typeof(env.errback) === "function") {
            env.errback(file, paths, callback);
        } else {
            callback({ type: 'File', message: "'" + file + "' wasn't found.\n" });
        }
    }
}

require('./functions');
require('./colors');

for (var k in less) { exports[k] = less[k] }
