// https://developer.mozilla.org/en/DOM/window.navigator.mozVibrate

Modernizr.addTest('vibrate',function(){
    for (p in Modernizr._domPrefixes){
        if( window.navigator[Modernizr._domPrefixes[p].toLowerCase()+'Vibrate'])
            return true;
    }
    return !!window.navigator['vibrate'] || false;
});