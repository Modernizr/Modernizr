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
Detects support for the `column-count` CSS property for creating multi-column layouts, plus various related properties:

```javascript
Modernizr.csscolumns                  // `column-count` supported
Modernizr.csscolumns.columnwidth      // `column-width` supported
Modernizr.csscolumns.columnspan       // `column-span` supported
Modernizr.csscolumns.columnfill       // `column-fill` supported
Modernizr.csscolumns.columngap        // `column-gap` supported
Modernizr.csscolumns.columnrule       // `column-rule` supported
Modernizr.csscolumns.columnrulecolor  // `column-rule-color` supported
Modernizr.csscolumns.columnrulestyle  // `column-rule-style` supported
Modernizr.csscolumns.columnrulewidth  // `column-rule-width` supported
Modernizr.csscolumns.breakbefore      // `break-before` supported
Modernizr.csscolumns.breakafter       // `break-after` supported
Modernizr.csscolumns.breakinside      // `break-inside` supported
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
