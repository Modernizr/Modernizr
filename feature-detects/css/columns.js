/*!
{
  "name": "CSS Columns",
  "property": "csscolumns",
  "caniuse": "multicolumn",
  "tags": ["css"]
}
!*/
import Modernizr from '../../src/Modernizr.js';
import testAllProps from '../../src/testAllProps.js';
import isBrowser from '../../src/isBrowser.js';

var result;

(function() {

  Modernizr.addTest('csscolumns', function() {
    var bool = false;
    if  (isBrowser) {
      var test = testAllProps('columnCount');
      try {
        bool = !!test;
        if (bool) {
          bool = new Boolean(bool);
        }
      } catch (e) {}
    }

    return bool;
  });

  var props = ['Width', 'Span', 'Fill', 'Gap', 'Rule', 'RuleColor', 'RuleStyle', 'RuleWidth', 'BreakBefore', 'BreakAfter', 'BreakInside'];
  var tests = {}

  for (var i = 0; i < props.length; i++) {
    var name = props[i].toLowerCase();
    var test = testAllProps('column' + props[i]);

    // break-before, break-after & break-inside are not "column"-prefixed in spec
    if (name === 'breakbefore' || name === 'breakafter' || name === 'breakinside') {
      test = test || testAllProps(props[i]);
    }

    tests[name] = test

    Modernizr.addTest('csscolumns.' + name, test);
  }

  result = !Modernizr.csscolumns ? Modernizr.csscolumns : tests
})();

export default result
