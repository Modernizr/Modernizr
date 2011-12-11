
// we can probably retire testing all prefixes for this one soon
// https://developer.mozilla.org/en/CSS/background-clip

// http://css-tricks.com/7423-transparent-borders-with-background-clip/

Modernizr.addTest('backgroundcliptext', function(){

  var div = document.createElement('div');
  div.style.cssText = Modernizr._prefixes.join('background-clip:text;');
  return !!div.style.cssText.replace(/\s/g,'').length;

});
