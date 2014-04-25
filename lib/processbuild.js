var fs = require('fs');

var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

var mod = fs.readFileSync(__dirname + '/dist/modernizr-build.js', 'utf8');
var license = fs.readFileSync(__dirname + '/LICENSE', 'utf8');
var prefix = fs.readFileSync(__dirname + '/lib/umd.prefix', 'utf8');
var suffix = fs.readFileSync(__dirname + '/lib/umd.suffix', 'utf8');

mod = mod.replace('define("modernizr-init",[], function(){});', '');
mod = [license, prefix, mod, suffix].join('\n');

fs.writeFileSync(__dirname + '/dist/modernizr-build.js', mod, 'utf8');

var ast = jsp.parse(mod); // parse code and get the initial AST
ast = pro.ast_lift_variables(ast);
ast = pro.ast_mangle(ast, {except : ['Modernizr']}); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
var final_code = pro.gen_code(ast);

fs.writeFileSync(__dirname + '/dist/modernizr-build.min.js', license + ';' + final_code, 'utf8');
