define(['Modernizr', 'addTest'], function( Modernizr, addTest ) {
  // data uri test.
  // https://github.com/Modernizr/Modernizr/issues/14

  // This test is asynchronous. Watch out.

  // in IE7 in HTTPS this can cause a Mixed Content security popup.
  // github.com/Modernizr/Modernizr/issues/362
  // To avoid that you can create a new iframe and inject this.. perhaps..

  Modernizr.addAsyncTest(function() {
    var datauri 		= new Image();
    var datauri5k 		= new Image();
    var datauri33k 		= new Image();
    var imgstr 			= "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    
    datauri.src 		= "data:image/gif;base64,"+imgstr;
    
    while (imgstr.length < 5000) {
        imgstr 			= "\r\n" + imgstr;
    }
    datauri5k.src		= "data:image/gif;base64,"+imgstr;
    
    while (imgstr.length < 33000) {
        imgstr 			= "\r\n" + imgstr;
    }
    datauri33k.src		= "data:image/gif;base64,"+imgstr;

    datauri.onerror		= function() {
      addTest('datauri', false);
    };
    datauri.onload 		= function() {
      addTest('datauri', datauri.width == 1 && datauri.height == 1);
    };
    
    datauri5k.onerror	= function() {
	    addTest('datauri5k', false);
	};
	datauri5k.onload 	= function() {
		addTest('datauri5k', datauri5k.width == 1 && datauri5k.height == 1);
	};

	datauri33k.onerror	= function() {
	    addTest('datauri33k', false);
	};
	datauri33k.onload	= function() {
		addTest('datauri33k', datauri33k.width == 1 && datauri33k.height == 1);
	};
    
  });
});
