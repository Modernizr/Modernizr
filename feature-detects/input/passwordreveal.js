/*!
{
  "name": "Password reveal button",
  "property": "passwordreveal",
  "notes": [{
    "name": "::-ms-reveal pseudo-element",
    "href": "http://msdn.microsoft.com/en-gb/library/hh465773.aspx"
  }],
  "authors": ["Sam Greenhalgh - https://www.radicalresearch.co.uk/"]
}
!*/
/* DOC
Detects support for password reveal button in password input boxes.
*/
define(["Modernizr"], function( Modernizr ) {
    Modernizr.addTest("passwordreveal", function() {
        // Wrap in try-catch because other browsers don't understand the psudo selector
        try{
            document.styleSheets[0].addRule("#test-ms-reveal-input-pre::-ms-reveal","height: 0px");
            document.styleSheets[0].addRule("#test-ms-reveal-input-post::-ms-reveal","height: 1000px");
        }catch(e){}
        
        var input = document.createElement("input");
        input.type="password";
        input.id = "test-ms-reveal-input-pre";
        document.body.appendChild(input);
        var computedStyle = window.getComputedStyle(input);
        var height = computedStyle.getPropertyValue("height");
        input.id = "test-ms-reveal-input-post";
        var result = false;
        if(height !== computedStyle.getPropertyValue("height")){
            result = true;
        }
        input.parentNode.removeChild(input);
        return result;
    });
});