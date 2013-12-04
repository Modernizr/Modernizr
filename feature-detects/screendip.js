/*!
{
  "name": "Screen device independent pixels",
  "property": "screendip",
  "tags": ["screen", "dimensions"]
}
!*/
/* DOC

On high resolution devices with a device pixel ratio greater than 1, detects if the screen's dimensions
(availWidth etc.) are given in device independent pixels (`true`) or in physical pixels (`false`).
Defaults to `true` for devices with normal resolution.

Something like the following will give measurements in device independent pixels

```javascript
var trueScreenWidth = screen.availWidth / (Modernizr.screendip ? 1 : window.devicePixelRatio);
```

*/
define(['Modernizr', 'mq'], function( Modernizr, mq ) {
  Modernizr.addTest('screendip', function () {
    var dpr = window.devicePixelRatio;
    return (dpr && dpr > 1) ? !mq('only all and (max-width:'+ screen.availWidth +'px)') : true;
  });
});
