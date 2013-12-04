/*!
{
  "name": "Window device independent pixels",
  "property": "windowdip",
  "tags": ["window", "dimensions"]
}
!*/
/* DOC

On high resolution devices with a device pixel ratio greater than 1, detects if the window's dimensions
(outerWidth etc.) are given in device independent pixels (`true`) or in physical pixels (`false`).
Defaults to `true` for devices with normal resolution.

Something like the following will give measurements in device independent pixels

```javascript
var trueWindowWidth = window.outerWidth / (Modernizr.windowdip ? 1 : window.devicePixelRatio);
```

*/
define(['Modernizr', 'mq'], function( Modernizr, mq ) {
  Modernizr.addTest('windowdip', function () {
    var dpr = window.devicePixelRatio;
    return (dpr && dpr > 1) ? !mq('only all and (max-width:'+ window.outerWidth +'px)') : true;
  });
});
