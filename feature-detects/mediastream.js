/*
METADATA
*/

define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest('mediastream', typeof MediaRecorder !== "undefined" );
});
