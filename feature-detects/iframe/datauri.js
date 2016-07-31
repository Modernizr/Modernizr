/*!
{
  "name": "DataURI based iframe",
  "property": "datauriiframe",
  "notes": [{
    "name": "Internet Explorer reference on the data Protocol",
    "href": "https://msdn.microsoft.com/en-us/library/cc848897(v=vs.85).aspx"
  }]
}
!*/
/* DOC
Detects support for using a data uri for iframes
*/
define(['Modernizr', 'createElement', 'docElement', 'getBody'], function(Modernizr, createElement, docElement, getBody) {
  Modernizr.addTest('datauriiframe', function() {
    var iframe = createElement('iframe');
    var body = getBody();
    var support;

    iframe.style.display = 'none';
    iframe.src = 'data:text/html;base64,Kg==';

    try {
      if (!docElement.contains(body)) {
        docElement.appendChild(body);
      }
      body.appendChild(iframe);
      support = !!iframe.contentDocument;
    } catch (e) {
    } finally {
      body.removeChild(iframe);

      if (body.fake && body.parentNode) {
        body.parentNode.removeChild(body);
      }
    }

    return support;
  });
});
