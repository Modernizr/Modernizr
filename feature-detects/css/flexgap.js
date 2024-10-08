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
  Modernizr.addTest('flexgap', function() {
    // Create flex container with row-gap set
    var flex = createElement('div');
    flex.style.display = 'flex';
    flex.style.flexDirection = 'column';
    flex.style.rowGap = '1px';

    // Create two elements inside it
    flex.appendChild(createElement('div'));
    flex.appendChild(createElement('div'));

    // Append to the DOM (needed to obtain scrollHeight)
    docElement.appendChild(flex);

    // Account for possible scroll height discrepancies due to zoom levels
    var expectedScrollHeight = 2; // Safari may return 2 due to zoom levels
    var isSupported = flex.scrollHeight === expectedScrollHeight;

    // Remove the element from the DOM
    flex.parentNode.removeChild(flex);

    return isSupported;
  });
});
