this["JST"] = this["JST"] || {};

this["JST"]["test/fixtures/it's-a-bad-filename.html"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='never name your file like this.';
}
return __p;
};