// display: table and table-cell test. (both are tested under one name "table-cell" )
// By @scottjehl

// all additional table display values are here: http://pastebin.com/Gk9PeVaQ though Scott has seen some IE false positives with that sort of weak detection.
// more testing neccessary perhaps.
// If a document is in rtl mode this test will fail so we force ltr mode on the injeced element https://github.com/Modernizr/Modernizr/issues/716

Modernizr.addTest("display-table", function() {
  var ret;

  Modernizr.testStyles("#modernizr{display: table; direction: ltr}#modernizr div{display: table-cell; padding: 10px}", function(elem) {
    var child = elem.children;

    ret = child[0].offsetLeft < child[1].offsetLeft;
  },2);

  return ret;
});
