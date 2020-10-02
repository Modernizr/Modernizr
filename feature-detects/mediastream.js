define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest('mediarecorder', typeof MediaRecorder);
    typeof MediaRecorder !== undefined;


    if (MediaRecorder) {
        return true;
    }
    else {
        return false;
    }
})