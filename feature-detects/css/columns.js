/*!
{
  "name": "CSS Columns",
  "property": "csscolumns",
  "caniuse": "multicolumn",
  "polyfills": ["css3multicolumnjs"],
  "tags": ["css"]
}
!*/
/* DOC
Detects support for CSS3 column long hand properties and exposes Boolean subproperties with the results:

```javascript
Modernizr.csscolumns.width
Modernizr.csscolumns.span
Modernizr.csscolumns.fill
Modernizr.csscolumns.gap
Modernizr.csscolumns.rule
Modernizr.csscolumns.rulecolor
Modernizr.csscolumns.rulestyle
Modernizr.csscolumns.rulewidth
Modernizr.csscolumns.breakbefore
Modernizr.csscolumns.breakafter
Modernizr.csscolumns.breakinside
```
*/
define(['Modernizr', 'testAllProps'], function( Modernizr, testAllProps ) {

  (function() {

    /* jshint -W053 */
    Modernizr.addTest('csscolumns', function(){
      var bool = false;
      var test = testAllProps('columnCount');
      try {
        if ( bool = !!test ) {
          bool = new Boolean(bool);
        }
      } catch(e){}

      return bool;
    });

    var props = ['Width', 'Span', 'Fill', 'Gap', 'Rule', 'RuleColor', 'RuleStyle', 'RuleWidth', 'BreakBefore', 'BreakAfter', 'BreakInside'];
    var name, test;

    for (var i = 0; i < props.length; i++) {
      name = props[i].toLowerCase();
      test = testAllProps('column' + props[i]);

      // break-before, break-after & break-inside are not "column"-prefixed in spec
      if (name === 'breakbefore' || name === 'breakafter' || name == 'breakinside') {
        test = test || testAllProps(props[i]);
      }

      Modernizr.addTest('csscolumns.' + name, test);
    }


  })();

});
