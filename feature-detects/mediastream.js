define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest('mediarecorder', typeof MediaRecorder);
})