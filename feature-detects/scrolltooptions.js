/*!
{
  "name": "scrollToOptions dictionary",
  "property": "scrolltooptions",
  "caniuse": "mdn-api_scrolltooptions",
  "notes": [{
    "name": "MDN docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo"
  }],
  "authors": ["Oliver Tušla (@asmarcz)", "Chris Smith (@chris13524)"]
}
!*/
define(['Modernizr', 'createElement', 'getBody'], function (Modernizr, createElement, getBody) {
  Modernizr.addTest('scrolltooptions', function () {
    var body = getBody();
    var returnTo = window.pageYOffset;
    var needsFill = body.clientHeight <= window.innerHeight;
    if (needsFill) {
      var div = createElement('div');
      div.style.height = (window.innerHeight - body.clientHeight + 1) + 'px';
      div.style.display = 'block';
      body.appendChild(div);
    }
    window.scrollTo({
      top: 1
    });
    var result = window.pageYOffset !== 0;
    if (needsFill) {
      body.removeChild(div);
    }
    window.scrollTo(0, returnTo);
    return result;
  });
});
