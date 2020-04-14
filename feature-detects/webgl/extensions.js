/*!
{
  "name": "WebGL Extensions",
  "property": "webglextensions",
  "tags": ["webgl", "graphics"],
  "builderAliases": ["webgl_extensions"],
  "async": true,
  "authors": ["Ilmari Heikkinen"],
  "notes": [{
    "name": "Kronos extensions registry",
    "href": "https://www.khronos.org/registry/webgl/extensions/"
  }]
}
!*/
/* DOC
Detects support for OpenGL extensions in WebGL. It's `true` if the [WebGL extensions API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Using_Extensions) is supported, then exposes the supported extensions as subproperties, e.g.:

```javascript
if (Modernizr.webglextensions) {
  // WebGL extensions API supported
}
if ('OES_vertex_array_object' in Modernizr.webglextensions) {
  // Vertex Array Objects extension supported
}
```
*/
import Modernizr, { addTest } from '../../src/Modernizr.js';
import createElement from '../../src/createElement.js';
import webgl from '../webgl.js';
var results = {};

(function() {
  // based on code from ilmari heikkinen
  // code.google.com/p/graphics-detect/source/browse/js/detect.js
  var canvas
  var ctx;
  var exts;

  if (!webgl) {
    addTest('webglextensions', false);
    return;
  }

  try {
    canvas = createElement('canvas');
    ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    exts = ctx.getSupportedExtensions();
  }
  catch (e) {
    addTest('webglextensions', false);
    return;
  }

  Modernizr.addTest('webglextensions', new Boolean(ctx !== undefined))

  for (var i = -1, len = exts.length; ++i < len;) {
    results[exts[i]] = true;
    Modernizr.webglextensions[exts[i]] = true;
  }

  canvas = undefined;
})()

export default results
