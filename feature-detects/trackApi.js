// Track element
// http://www.w3.org/TR/html5/video.html#the-track-element
// By Addy Osmani
Modernizr.addTest('trackElement', (typeof (document.createElement('video').addTextTrack) === 'function'));
