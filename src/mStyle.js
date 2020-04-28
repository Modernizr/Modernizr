import {ModernizrProto} from './Modernizr.js';
import modElem from './modElem.js';
var mStyle = {
  style: modElem.elem.style
};

// kill ref for gc, must happen before mod.elem is removed, so we unshift on to
// the front of the queue.
ModernizrProto._q.unshift(function() {
  delete mStyle.style;
});

export default mStyle;
