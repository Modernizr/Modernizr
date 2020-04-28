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
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';
import isBrowser from '../../src/isBrowser.js';

var results = {};

(function() {

  Modernizr.addTest('textdecoration', function() {
    var bool = false;
    if (isBrowser) {
      var test = testAllProps('textDecoration');
      try {
        bool = !!test;
        if (bool) {
          bool = new Boolean(bool);
        }
      } catch (e) {}

      return bool;
    }
  });

  var props = ['Line', 'Style', 'Color', 'Skip', 'SkipInk'];
  var name, test;

  for (var i = 0; i < props.length; i++) {
    name = props[i].toLowerCase();
    test = testAllProps('textDecoration' + props[i]);

    results[name] = test
    Modernizr.addTest('textdecoration.' + name, test);
  }

  results = !Modernizr.textdecoration ? Modernizr.textdecoration : results
})();

export default results
