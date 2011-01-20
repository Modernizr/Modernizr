//>> Start Uglifui
(function ( global ) {

var jsp = global.parsejs, //require("./parse-js"),
    pro = global.process, //require("./process"),
//>> End Uglifui

    slice = jsp.slice,
    member = jsp.member,
    PRECEDENCE = jsp.PRECEDENCE,
    OPERATORS = jsp.OPERATORS;

function ast_squeeze_more(ast) {
        var w = pro.ast_walker(), walk = w.walk;
        return w.with_walkers({
                "call": function(expr, args) {
                        if (expr[0] == "dot" && expr[2] == "toString" && args.length == 0) {
                                // foo.toString()  ==>  foo+""
                                return [ "binary", "+", expr[1], [ "string", "" ]];
                        }
                }
        }, function() {
                return walk(ast);
        });
};

//>> Start Uglifui
var squeezemore = {};
(function ( exports ) {
//>> End Uglifui

exports.ast_squeeze_more = ast_squeeze_more;

//>> Start Uglifui
})( squeezemore );

//global.squeezemore = squeezemore;
global.process.ast_squeeze_more = squeezemore.ast_squeeze_more;

})( this );
//>> End Uglifui
