define(['Modernizr'], function (Modernizr) {
    Modernizr.addTest('mediarecorder', function(){
        var isMediaRecorderSupported = false;

        try {
            MediaRecorder;
            isMediaRecorderSupported = true;
        } catch (err) {
            console.log("no MediaRecorder");
        }
        console.log(isMediaRecorderSupported);
    })
});
