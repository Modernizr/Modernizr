this["JST"] = this["JST"] || {};

this["JST"]["test/fixtures/template.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<head><title>'+
( title )+
'</title></head>';
}
return __p;
};