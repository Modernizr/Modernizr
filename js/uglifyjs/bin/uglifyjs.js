//>> Start Uglifui
// #! /usr/bin/env node
// -*- js2 -*-
(function ( global ) {
global.uglify = function ( code, flags ) {
  
//global.sys = require(/^v0\.[012]/.test(process.version) ? "sys" : "util");
//var fs = require("fs");
var uglify = {
      parser : global.parsejs,
      uglify : global.process
    },//require("uglify-js"), // symlink ~/.node_libraries/uglify-js.js to ../uglify-js.js
//>> End Uglifui
    jsp = uglify.parser,
    pro = uglify.uglify;


pro.set_logger(function(msg){
//>> Start Uglifui
        //global.console.log(msg); // TODO:: Wrap this so there is visual output as well
//>> End Uglifui
});

var options = {
        ast: false,
        mangle: true,
        mangle_toplevel: false,
        squeeze: true,
        make_seqs: true,
        dead_code: true,
        beautify: false,
        verbose: false,
        show_copyright: true,
        out_same_file: false,
        max_line_length: 32 * 1024,
        extra: false,
        unsafe: false,            // XXX: extra & unsafe?  but maybe we don't want both, so....
        beautify_options: {
                indent_level: 4,
                indent_start: 0,
                quote_keys: false,
                space_colon: false
        },
        output: true            // stdout
};
//>> Start Uglifui
var args = flags;
//>> End Uglifui
var filename;

out: while (args.length > 0) {
        var v = args.shift();
        switch (v) {
            case "-b":
            case "--beautify":
                options.beautify = true;
                break;
            case "-i":
            case "--indent":
                options.beautify_options.indent_level = args.shift();
                break;
            case "-q":
            case "--quote-keys":
                options.beautify_options.quote_keys = true;
                break;
            case "-mt":
            case "--mangle-toplevel":
                options.mangle_toplevel = true;
                break;
            case "--no-mangle":
            case "-nm":
                options.mangle = false;
                break;
            case "--no-squeeze":
            case "-ns":
                options.squeeze = false;
                break;
            case "--no-seqs":
                options.make_seqs = false;
                break;
            case "--no-dead-code":
                options.dead_code = false;
                break;
            case "--no-copyright":
            case "-nc":
                options.show_copyright = false;
                break;
            case "-o":
            case "--output":
                options.output = args.shift();
                break;
            case "--overwrite":
                options.out_same_file = true;
                break;
            case "-v":
            case "--verbose":
                options.verbose = true;
                break;
            case "--ast":
                options.ast = true;
                break;
            case "--extra":
                options.extra = true;
                break;
            case "--unsafe":
                options.unsafe = true;
                break;
            case "--max-line-len":
                options.max_line_length = args.shift();
                break;
            default:
                filename = v;
                break out;
        }
}
//>> Start Uglifui
/*
if (filename) {
        fs.readFile(filename, "utf8", function(err, text){
                output(squeeze_it(text));
        });
} else {
        var stdin = process.openStdin();
        stdin.setEncoding("utf8");
        var text = "";
        stdin.on("data", function(chunk){
                text += chunk;
        });
        stdin.on("end", function() {
                output(squeeze_it(text));
        });
}*/
return squeeze_it( code );

/*
function output(text) {
        var out;
        if (options.out_same_file && filename)
                options.output = filename;
        if (options.output === true) {
                out = process.stdout;
        } else {
                out = fs.createWriteStream(options.output, {
                        flags: "w",
                        encoding: "utf8",
                        mode: 0644
                });
        }
        out.write(text);
        out.end();
};
*/
//>> End Uglifui

// --------- main ends here.

function show_copyright(comments) {
        var ret = "";
        for (var i = 0; i < comments.length; ++i) {
                var c = comments[i];
                if (c.type == "comment1") {
                        ret += "//" + c.value + "\n";
                } else {
                        ret += "/*" + c.value + "*/";
                }
        }
        return ret;
};

function squeeze_it(code) {
        var result = "";
        if (options.show_copyright) {
                var initial_comments = [];
                // keep first comment
                var tok = jsp.tokenizer(code, false), c;
                c = tok();
                var prev = null;
                while (/^comment/.test(c.type) && (!prev || prev == c.type)) {
                        initial_comments.push(c);
                        prev = c.type;
                        c = tok();
                }
                result += show_copyright(initial_comments);
        }
        try {
                var ast = time_it("parse", function(){ return jsp.parse(code); });
                if (options.mangle)
                        ast = time_it("mangle", function(){ return pro.ast_mangle(ast, options.mangle_toplevel); });
                if (options.squeeze)
                        ast = time_it("squeeze", function(){
                                ast = pro.ast_squeeze(ast, {
                                        make_seqs : options.make_seqs,
                                        dead_code : options.dead_code,
                                        extra     : options.extra
                                });
                                if (options.unsafe)
                                        ast = pro.ast_squeeze_more(ast);
                                return ast;
                        });
                if (options.ast)
                        return sys.inspect(ast, null, null);
                result += time_it("generate", function(){ return pro.gen_code(ast, options.beautify && options.beautify_options) });
                if (!options.beautify && options.max_line_length) {
                        result = time_it("split", function(){ return pro.split_lines(result, options.max_line_length) });
                }
                return result;
        } catch(ex) {
          //>> Start Uglifui
/*
                sys.debug(ex.stack);
                sys.debug(sys.inspect(ex));
                sys.debug(JSON.stringify(ex));
*/
          //>> End Uglifui

        }
};

function time_it(name, cont) {
        if (!options.verbose)
                return cont();
        var t1 = new Date().getTime();
        try { return cont(); }
        //>> Start Uglifui
        catch(e){}
        //finally { sys.debug("// " + name + ": " + ((new Date().getTime() - t1) / 1000).toFixed(3) + " sec."); }
        //>> End Uglifui

};


//>> Start Uglifui
};

})( this );
//>> End Uglifui
