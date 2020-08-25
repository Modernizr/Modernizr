/*!
{
  "name": "Flex Gap",
  "property": "flexgap",
  "caniuse": "flexbox-gap",
  "tags": ["css", "flexbox"],
  "notes": [{
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/css-align-3/#gaps"
  }],
  "authors": ["Chris Smith (@chris13524)"]
}
!*/
define(['Modernizr', 'createElement', 'docElement'], function(Modernizr, createElement, docElement) {
  Modernizr.addAsyncTest(function() {
    function doWork() {
      Modernizr.addTest('flexgap', function() {
        // create flex container with row-gap set
        var flex = createElement('div');
        flex.style.display = 'flex';
        flex.style.flexDirection = 'column';
        flex.style.rowGap = '1px';

        // create two elements inside it
        flex.appendChild(createElement('div'));
        flex.appendChild(createElement('div'));

        // append to the DOM (needed to obtain scrollHeight)
        docElement.appendChild(flex);
        var isSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
        flex.parentNode.removeChild(flex);

        return isSupported;
      });
    }

    if (getComputedStyle(docElement).height != "") {
      setTimeout(() => doWork()); // seems Modernizr requires the addTest() call to actually be async
    } else {
      // no styles, we must be inside a display:none iframe
      window.addEventListener('resize', function() {
        doWork();
      });
    }
  });
});
