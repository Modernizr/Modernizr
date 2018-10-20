/*!
{
  "name": "CSS textDecoration",
  "property": "textdecoration",
  "caniuse": "text-decoration",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css-text-decor-3/#line-decoration"
  }]
}
!*/
define(['Modernizr', 'testAllProps'], function(Modernizr, testAllProps) {

  (function() {

    Modernizr.addTest('textdecoration', function() {
      var bool = false;
      var test = testAllProps('textDecoration');
      try {
        bool = !!test;
        if (bool) {
          bool = new Boolean(bool);
        }
      } catch (e) {}

      return bool;
    });

    var props = ['Line', 'Style', 'Color', 'Skip', 'SkipInk'];
    var name, test;

    for (var i = 0; i < props.length; i++) {
      name = props[i].toLowerCase();
      test = testAllProps('textDecoration' + props[i]);

      Modernizr.addTest('textdecoration.' + name, test);
    }
  })();

});
