/*!
{
  "name": "Proximity API",
  "property": "proximity",
  "authors": ["Cătălin Mariș"],
  "tags": ["events", "proximity"],
  "caniuse": "proximity",
  "notes": [{
    "name": "MDN Docs",
    "href": "https://developer.mozilla.org/en-US/docs/Web/API/Proximity_Events"
  }, {
    "name": "W3C Spec",
    "href": "https://www.w3.org/TR/proximity/"
  }]
}
!*/
/* DOC
Detects support for an API that allows users to get proximity related information from the device's proximity sensor.
*/
import Modernizr, { addTest, createAsyncTestListener } from "../src/Modernizr.js";
import _globalThis from '../src/globalThis.js';
Modernizr.addAsyncTest(function() {

  var timeout;
  var timeoutTime = 300;

  function advertiseSupport() {

    // Clean up after ourselves
    clearTimeout(timeout);
    _globalThis.removeEventListener('deviceproximity', advertiseSupport);

    // Advertise support as the browser supports
    // the API and the device has a proximity sensor
    addTest('proximity', true);

  }

  // Check if the browser has support for the API
  if ('ondeviceproximity' in _globalThis && 'onuserproximity' in _globalThis) {

    // Check if the device has a proximity sensor
    // ( devices without such a sensor support the events but
    //   will never fire them resulting in a false positive )
    _globalThis.addEventListener('deviceproximity', advertiseSupport);

    // If the event doesn't fire in a reasonable amount of time,
    // it means that the device doesn't have a proximity sensor,
    // thus, we can advertise the "lack" of support
    timeout = setTimeout(function() {
      _globalThis.removeEventListener('deviceproximity', advertiseSupport);
      addTest('proximity', false);
    }, timeoutTime);

  } else {
    addTest('proximity', false);
  }
});

export default createAsyncTestListener("proximity");
