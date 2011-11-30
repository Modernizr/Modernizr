// Web Audio API
// https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
// By Addy Osmani
Modernizr.addTest('webAudioApi', !!(window.webkitAudioContext || window.AudioContext));
