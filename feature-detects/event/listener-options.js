/*!
{
  "name": "addEventListener options",
  "property": ["eventlistenerpassive", "eventlisteneronce", "eventlisteneroptions"],
  "warnings": [
    "These tests currently require document.body to be present",
    "Currently causes a console warning in browsers which support eventlistenerpassive"
    ],
  "notes": [{
    "name": "MDN article",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener"
  },{
    "name": "WHATWG spec",
    "href": "https://dom.spec.whatwg.org/#dictdef-addeventlisteneroptions"
  }],
  "authors": ["Brook Jordan"],
  "tags": ["event"]
}
!*/
/* DOC
`eventlisteneroptions` tests if the browser supports addeventlistener options
`eventlistenerpassive` tests if the browser's addeventlistener options includes the 'passive' option
`eventlisteneronce` tests if the browser's addeventlistener options includes the 'once' option
*/
define(['Modernizr', 'docElement', 'createElement'], function(Modernizr, docElement, createElement) {
  //  Create a counter button with a value to count its clicks
  var eventRunCount     = 0;
  var testForOnceButton = document.createElement('button');
  testForOnceButton.setAttribute('type', 'button');

  //  Setting once to true means we should only recieve the first click
  testForOnceButton.addEventListener('click', increaseTestForOnce, { once: true, });
  document.body.appendChild(testForOnceButton);
  testForOnceButton.click();
  testForOnceButton.click();

  //  If eventRunCount is 1 then once is supported
  var eventOnce = (eventRunCount === 1);

  //  Clean up the mess we left behind
  testForOnceButton.removeEventListener('click', increaseTestForOnce, { once: true, });
  document.body.removeChild(testForOnceButton);


  // Create a checkbox to test if e.preventDefault works
  var testForPassiveCheckbox = document.createElement('input');
  testForPassiveCheckbox.type = 'checkbox';
  //  This causes a console error which I'm not sure how to prevent.
  testForPassiveCheckbox.addEventListener('click', preventElementDefault, { passive: true, });
  document.body.appendChild(testForPassiveCheckbox);
  testForPassiveCheckbox.click();

  //  If testForPassiveCheckbox checked then passive is supported
  var eventPassive = testForPassiveCheckbox.checked;

  //  Clean up the mess we left behind
  testForPassiveCheckbox.removeEventListener('click', preventElementDefault, { passive: true, });
  document.body.removeChild(testForPassiveCheckbox);


  Modernizr.addTest('eventlisteneronce', eventOnce);
  Modernizr.addTest('eventlistenerpassive', eventPassive);
  Modernizr.addTest('eventlisteneroptions', eventOnce || eventPassive);


  //  For eventlisteneronce test
  function increaseTestForOnce(e) {
    eventRunCount += 1;
  }

  //  For eventlistenerpassive test
  function preventElementDefault(e) {
    e.preventDefault();
  }
});
