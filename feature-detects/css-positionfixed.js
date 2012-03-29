/*  Tested on iPhone 4, iPhone 5, Android 4.0, and modern browsers  */

Modernizr.addTest('csspositionfixed', function () {
    var elementTop, 
        originalHeight, 
        isSupported, 
        body = document.body,
        el = document.createElement('div'),
        PIXELS_TO_MOVE = 100;
    
    if ( !( "getBoundingClientRect" in body ) ) {return false;}
    
    el.innerHTML = ' ';
    el.style.cssText = 'position:fixed;top:'+PIXELS_TO_MOVE+'px;visibility:visible;-webkit-transform:none;-moz-transform:none;transform:none;';
    
    body.appendChild(el);

    originalHeight = body.style.height;

    body.style.height = '1000px';
    body.scrollTop = 500;

    elementTop = el.getBoundingClientRect().top;
    body.style.height = originalHeight;
    
    body.removeChild(el);
    body.scrollTop = 0;
        
    return (elementTop === PIXELS_TO_MOVE);
});