// Device Pixel Density	
// High res devices should have devicePixelRatio and a pixel density around 2, otherwise assume low res
// http://www.robertprice.co.uk/robblog/archive/2011/5/Detecting_Retina_Displays_From_JavaScript_And_CSS.shtml
// http://bradbirdsall.com/mobile-web-in-high-resolution
// by @matthewlein

Modernizr.addTest('highres', function() {
    
    if ( window.devicePixelRatio ) {
        return !!( window.devicePixelRatio > 1.5 );
    } else {
        // vendor names are all over the board
        var vendors = [   
            'min--moz-device-pixel-ratio',
            '-webkit-min-device-pixel-ratio',
            'min-device-pixel-ratio'
        ];
        var isHighRes = false;
        
        // loop through vendors, checking non-prefixed first
        for (var i = vendors.length - 1; i >= 0; i--) {
            isHighRes = Modernizr.mq( 'only screen and ('+ vendors[i] + ':1.5)' )
            if ( isHighRes ) {
                break;
            }
        }
        return isHighRes;
    }
    
})