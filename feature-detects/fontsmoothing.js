/*!
{
  "name": "Font-Smoothing",
  "property": "fontsmoothing",
  "authors": ["Jasper Palfree @wellcaffeinated", "Zoltan Du Lac @zoltandulac"],
  "tags": ["font", "cleartype", "typeface"],
  "notes": [{
    "name": "Original Code",
    "href": "http://www.useragentman.com/blog/2009/11/29/how-to-detect-font-smoothing-using-javascript/"
  },{
    "name": "Modernizr Adaptation",
    "href": "http://wellcaffeinated.net/articles/2012/01/25/font-smoothing-detection-modernizr-style"
  }]
}
!*/
/* DOC

Some @font-face fonts look bad when font-smoothing is turned off. This test detects whether font-smoothing is enabled on the page.

*/
/*
 * Adapted by Jasper Palfree <wellcaffeinated.net> from:
 * TypeHelpers version 1.0
 * Zoltan Hawryluk, Nov 24 2009.  
 * 
 * Released under the MIT License. http://www.opensource.org/licenses/mit-license.php
 * 
 */
define(['Modernizr', 'createElement', 'docElement', 'getBody'], function( Modernizr, createElement, docElement, getBody ) {
    Modernizr.addTest('fontsmoothing', function() {

        var test = false;

        // IE has screen.fontSmoothingEnabled - sweet!      
        if ('fontSmoothingEnabled' in screen) {
            test = screen.fontSmoothingEnabled;
        } else {
            // Create a 35x35 Canvas block.
            var canvasNode = createElement("canvas")
              , fake = false
              , body = getBody()
              , docOverflow
              , ctx
              ;

            try {
                
                canvasNode.height = canvasNode.width = "35";

                // We must put this node into the body, otherwise 
                // Safari Windows does not report correctly.
                canvasNode.style.display = "none";
                body.appendChild(canvasNode);

                if ( body.fake ){

                    //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
                    body.style.overflow = 'hidden';
                    docOverflow = docElement.style.overflow;
                    docElement.style.overflow = 'hidden';
                    docElement.appendChild(body);
                }

                ctx = canvasNode.getContext("2d");

                // draw a black letter "O", 32px Arial.
                ctx.textBaseline = "top";
                ctx.font = "32px Arial";
                ctx.strokeStyle = ctx.fillStyle = "black";
                ctx.fillText("O", 0, 0);

                // start at (8,1) and search the canvas from left to right,
                // top to bottom to see if we can find a non-black pixel.  If
                // so we return true.
                for (var j = 8; j <= 32; j++) {
                    for (var i = 1; i <= 32; i++) {
                        var imageData = ctx.getImageData(i, j, 1, 1).data;
                        var alpha = imageData[3];

                        if (alpha !== 255 && alpha !== 0) {
                            test = true; // font-smoothing must be on.
                            break;
                        }
                    }
                }
            } catch (ex) {
                
                // Something went wrong (for example, Opera cannot use the
                // canvas fillText() method.  Return false.
            }

            // clean up
            if ( body.fake ) {
                body.parentNode.removeChild(body);
                docElement.style.overflow = docOverflow;
            } else {
                canvasNode.parentNode.removeChild(canvasNode);
            }
        }

        return test;
    });
});