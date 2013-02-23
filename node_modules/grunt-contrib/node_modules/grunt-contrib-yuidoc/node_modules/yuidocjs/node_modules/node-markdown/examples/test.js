var md = require("../lib/markdown.js").Markdown;

var md_text = "**bold** *italic* [link](http://www.neti.ee) `code block`";

console.log("--all");
console.log(md(md_text));

console.log("--only <strong> and <code>")
console.log(md(md_text, true, 'strong|code'));

console.log("--only <a> with _href_")
console.log(md(md_text, true, 'a', {a:'href'}));