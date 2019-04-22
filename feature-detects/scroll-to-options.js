/*!
{
  "name": "scrollToOptions dictionary",
  "property": "scrolltooptions"
}
!*/
define(['Modernizr'], function (Modernizr) {
  Modernizr.addTest('scrolltooptions', function () {
    var returnTo = window.pageYOffset;
    var needsFill = document.body.clientHeight <= window.innerHeight;
    if (needsFill) {
      var div = document.createElement('div');
      div.style.height = (window.innerHeight - document.body.clientHeight + 1) + 'px';
      div.style.display = 'block';
      document.body.appendChild(div);
    }
    window.scrollTo({
      top: 1
    });
    var result = window.pageYOffset !== 0;
    if (needsFill) {
      document.body.removeChild(div);
    }
    window.scrollTo(0, returnTo);
    return result;
  });
});
