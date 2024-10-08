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
    // Create a flex container with row-gap set
    var flex = createElement('div');
    flex.style.display = 'flex';
    flex.style.flexDirection = 'column';
    flex.style.rowGap = '1px';

    // Create two child elements inside it
    flex.appendChild(createElement('div'));
    flex.appendChild(createElement('div'));

    // Append the flex container to the DOM (required to calculate scrollHeight)
    docElement.appendChild(flex);

    // Measure the height of the flex container
    var flexHeight = flex.scrollHeight;

    // Determine if flex-gap is supported, accounting for Safari's bug
    var isSupported = flexHeight === 1 || flexHeight === 2;

    // Clean up: Remove the flex container from the DOM
    flex.parentNode.removeChild(flex);

    return isSupported;
  });
});
