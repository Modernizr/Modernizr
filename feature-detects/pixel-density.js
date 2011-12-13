// Device Pixel Density	
// High res devices should have devicePixelRatio and a pixel density around 2, otherwise assume low res
// http://www.robertprice.co.uk/robblog/archive/2011/5/Detecting_Retina_Displays_From_JavaScript_And_CSS.shtml
// http://bradbirdsall.com/mobile-web-in-high-resolution
// by @matthewlein
Modernizr.addTest('highres', !!(window.devicePixelRatio > 1.5));

