


test("globals set up",2, function() {
  
	ok(window.Modernizr, 'global modernizr object created');
	
	var remainingGlobals = getMembers(window);
	
	// thx opera for globalizing IDs...
	for (var len = remainingGlobals.length; len-- ;){
	  if (document.getElementById(remainingGlobals[len])){
	    remainingGlobals.splice(len,1);
	  }
	}
	
	var count = remainingGlobals.length - window.__globals.length 
	    // jQuery and $ are included before the first globals are grabbed, so not included here.
	     - (window.TEST   ? 1 : 0) 
       - (window.backuphtml      ? 1 : 0)
       - (window.cbfunc ? 1 : 0)
       
       // couldnt tell why you why gecko has this exposed so peculiarly.. 
       - ($.inArray('onhashchange',remainingGlobals) > -1 && $.inArray('onhashchange',remainingGlobals) == -1 &&
          'onhashchange' in window && !window.onhashchange ? 1 : 0); 
   
	ok( ! (count > 1) , 'no more than one global object created'); 
	      
	/*  * /    
	var arr = [];
	var x = $.each(remainingGlobals,function(k,v){
	  if ( $.inArray(v,window.__globals) === -1) arr.push(v);
	});
	
	alert(remainingGlobals.length + ', ' + window.__globals.length + ' : ('+arr.length+') '+  arr.join(', '));
  /* */
  
});





test("document.documentElement is valid and correct",1, function() {
	equals(document.documentElement,document.getElementsByTagName('html')[0]); 
});


test("no-js class is gone.", function() {
  
	equals(document.documentElement.className.indexOf('no-js') , -1,
	       'no-js is gone.'); 
	       
	ok(/\bjs /.test(document.documentElement.className),
	   'html.js class is present')
	
	if (document.querySelector){
	  ok(document.querySelector('html.js') == document.documentElement, 
	     "document.querySelector('html.js') matches.");
	}
});




test('html classes are looking good',function(){
  
  var classes = TEST.trim(document.documentElement.className).split(/\s+/);
  
  var modprops = getMembers(Modernizr).length, 
      newprops = modprops;

  // decrement for the properties that are private
  for (var i = -1, len = TEST.privates.length; ++i < len;){
    if (Modernizr[TEST.privates[i]] != undefined) newprops--;
  }
  
  // decrement for the non-boolean objects
  for (var i = -1, len = TEST.inputs.length; ++i < len;){
    if (Modernizr[TEST.inputs[i]] != undefined) newprops--;
  }
  
  
  equals(classes.length,newprops,'equal number of classes and global object props');
  
  
  for (var i = 0, len = classes.length, aclass; i <len; i++){
    aclass = classes[i];
    
    if (aclass === 'js') continue;
    
    if (aclass.indexOf('no-') === 0){
      aclass = aclass.replace('no-','');
    
      equals(Modernizr[aclass], false, 
            aclass + ' is correctly false in the classes and object')
            
    } else {
      equals(Modernizr[aclass], true, 
             aclass + ' is correctly true in the classes and object')
    }
  }
  
  
  for (var i = 0, len = classes.length, aclass; i <len; i++){
    equals(classes[i],classes[i].toLowerCase(),'all classes are lowerCase.');
  }
  
  equals(/[^\s]no-/.test(document.documentElement.className),false,
         'whitespace between all classes.');
  
  
})


test('Modernizr properties are looking good',function(){
  
  var count = 0,
      nobool = TEST.API.concat(TEST.inputs)
                .concat(TEST.audvid).concat(TEST.privates);
      
  for (var prop in window.Modernizr){
    if (window.Modernizr.hasOwnProperty(prop)){
      
      if (TEST.inArray(prop,nobool) >= 0) continue;
      
      ok(Modernizr[prop] === true || Modernizr[prop] === false,
        'Modernizr.'+prop+' is a straight up boolean');
        
        
      equals(prop,prop.toLowerCase(),'all properties are lowerCase.')
    }
  }
})



test('Modernizr.addTest()',9,function(){
  Modernizr.addTest('testtrue',function(){
    return true;
  });
  
  Modernizr.addTest('testtruthy',function(){
    return 100;
  });
  
  Modernizr.addTest('testfalse',function(){
    return false;
  });
  
  Modernizr.addTest('testfalsy',function(){
    return undefined;
  });
  
  ok(document.documentElement.className.indexOf(' testtrue') >= 0,'positive class added');
  equals(Modernizr.testtrue,true,'positive prop added');
  
  ok(document.documentElement.className.indexOf(' testtruthy') >= 0,'positive class added');
  equals(Modernizr.testtruthy,true,'positive prop added');
  
  ok(document.documentElement.className.indexOf(' no-testfalse') >= 0,'negative class added');
  equals(Modernizr.testfalse,false,'negative prop added');
  
  ok(document.documentElement.className.indexOf(' no-testfalsy') >= 0,'negative class added');
  equals(Modernizr.testfalsy,false,'negative prop added');
  
  
  
  Modernizr.addTest('camelCase',function(){
     return true;
   });
   
  ok(document.documentElement.className.indexOf(' camelCase') === -1,
     'camelCase test name toLowerCase()\'d');

})


test('Modernizr.audio and Modernizr.video',function(){
  
  for (var i = -1, len = TEST.audvid.length; ++i < len;){
    var prop = TEST.audvid[i];
  
    if (Modernizr[prop].toString() == 'true'){
      
      ok(Modernizr[prop],                             'Modernizr.'+prop+' is truthy.');
      equals(Modernizr[prop] == true,true,            'Modernizr.'+prop+' is == true')
      equals(typeof Modernizr[prop] === 'object',true,'Moderizr.'+prop+' is truly an object');
      equals(Modernizr[prop] !== true,true,           'Modernizr.'+prop+' is !== true')
      
    } else {
      
      equals(Modernizr[prop] != true,true,            'Modernizr.'+prop+' is != true')
    }
  }
  
  
})

asyncTest('async @font-face test',4,function(){
  
  // we do this to verify our callback indeed will run.
  start();
  ok(Modernizr._fontfaceready,'passing a method to Modernizr._fontfaceready')
  stop();
  
  Modernizr._fontfaceready(function(bool){
    
    ok(bool === true || bool === false,'passed argument is a boolean');
    equals(bool,Modernizr.fontface,'Modernizr prop matches passed arg');
    
    var expectedclass = (Modernizr.fontface ? '' : 'no-') + 'fontface';
    
    ok(document.documentElement.className.indexOf(' '+expectedclass) >= 0,
       'correct class added to documentElement');
       
       
    start();
  });
  
  
})


test('Modernizr results match expected values',function(){
  
  // i'm bringing over a few tests from inside Modernizr.js
  equals(!!document.createElement('canvas').getContext,Modernizr.canvas,'canvas test consistent');
  
  equals(!!window.Worker,Modernizr.webworkers,'web workers test consistent')
  
});







/**
 * We're going to test the current browser results against the www.findmebyip.com data tables
 * These tables are originaly sourced from Modernizr results but get enough eyeballs to perhaps 
 * trust them more.
 * However, as testing has shown, there are many inconsistencies in their results.
 
 * Regardless, having *a* baseline to test feature detection results against is worthwhile, 
 * even if its flawed.
 * In the future, I'd like to test against the whencaniuse.com tables.
*/

$(function fmbip() {
  
  var isDataAdded = false;
  var testbed = document.getElementById('testbed');

  // return 0-based column number, considering colspans and such
  $.fn.getColNum = function () {
    var spans = this.eq(0).prevAll().map(function () {
      return $(this).attr('colspan') || 1
    }).get().join('+');

    return eval('(' + spans + ')');
  };

  $.fn.grabColNum = function (n, wid) {
    var elem = $(this).is('td,th') ? $(this).siblings().andSelf().eq(0) : $(this).find('td,th').eq(0);
    wid = wid || 0;

    //console.log('inside grabcol',elem,wid, elem.nextAll().andSelf().slice(n,n+1 + wid))
    return elem.nextAll().andSelf().slice(n, n + 1 + wid);
  };

  // takes a given table cell and removes the entire column associated with it
  $.fn.removeColumn = function(){
    return this.each(function () {
      var span = $(this).attr('colspan');
      var skip = $(this).getColNum();
      var rows = $(this).closest('table').find('thead,tbody').find('tr');
      rows.each(function () {
        var counter = span; // 4
        var elem = $(this).children().eq(skip);

        (function loop() {
          var elemspan = $(elem).attr('colspan') || 1;
          elem = elem.next();
          elem.prev().remove();

          if (counter - elemspan == 0) return;
          else {
            counter--;
            loop();
          }
        })()
      })
    })
  };

  // determine the modernizr property we're testing. 
  // also we'll handle video/audio/input here
  function getModernizrProperty(testname) {
    var splitz = testname.split(':');
    splitz[0] = dict[splitz[0]] || splitz[0];
    var modresult = Modernizr[splitz[0]];

    if (splitz[1] !== undefined) {
      if (Modernizr.inputtypes[splitz[1]] !== undefined) {
        modresult = Modernizr.inputtypes;
      }
      modresult = modresult[splitz[1]];
    }
    return modresult;
  }


  // hacky translation lookup when replace(/\s+/g, '').toLowerCase() isnt good enough
  var dict = {
    'postmessage': 'crosswindowmessaging',
    'cssfontface': 'fontface',
    'multiplebackgrounds': 'multiplebgs',
    'webdatabase': 'websqldatabase',
    'workers': 'webworkers',
    'form': 'input'
  }


  function testAgainstTables() {
    
    if (testAgainstTables.isRun) return;
    testAgainstTables.isRun = true;
    
    // remove css3 selectors
    $('#css3-selectors').next().andSelf().remove();


    // remove the mac columns.. kinda useless to us.
    $('thead th:contains(MAC)').removeColumn();



    test('Results match fmbip data', function () {



      // find the matching browser..
      $('thead').each(function () {
        var elem = $(this).find('th:contains(' + sniff.browser.toUpperCase() + ')'),
            pos = elem.getColNum(),
            wid = elem.attr('colspan'),

            // ver is an array of the browser versions of this matching browser.
            ver = elem.closest('tr').next().grabColNum(pos, wid - 1).map(function () {
              return $.trim($(this).text());
            }).get(),

            rows = $(this).closest('table').find('tbody tr');


        rows.each(function () {
          var thistest = $(this).find('td,th').eq(0).text().replace(/\s+/g, '').toLowerCase();
              thistest = dict[test] || thistest;


          var modresult = getModernizrProperty(thistest),
              that = this;


          // insert a loop here to loop over the versions.
          $.each(ver, function (k, v) {

            // add one on each iteration
            var start = $(that).grabColNum(pos + k),
                bool = $.trim(start.text()) == 'Y',
                thisver = v;

            // chrome 6 should succeed on everything chrome 5 did
            if (sniff.version > thisver && modresult !== undefined) {

              if (bool === true) {
                ok( !! modresult === true, thistest + ' matches expected result for ' + sniff.browser + ' on ' + sniff.version + ' vs ' + thisver);
                if (( !! modresult === true) !== bool) start.addClass('wrong');
              }
            }

            // ie6 should fail on everything ie7 does.       
            if (sniff.version < thisver && modresult !== undefined) {

              if (bool === false) {
                ok( !! modresult === false, thistest + ' matches expected result for ' + sniff.browser + ' on ' + sniff.version + ' vs ' + thisver)
                if (( !! modresult !== true) !== false) start.addClass('wrong');
              }
            }

            // if ff3.5 is being tested. it should match every result in the table here.
            if (parseFloat(sniff.version) == thisver && modresult !== undefined) {
              ok( !! modresult === bool, thistest + ' matches expected result for ' + sniff.browser + ' on ' + sniff.version + ' vs ' + thisver);


              if (( !! modresult === bool) !== true) start.addClass('wrong');
            }


          }); // version each loop
        }) // eo rows each
      }) // eo thead each
    }); // test!

  } // eo testAgainstTables();



  // thx jquery
  function uaMatch(ua) {
    ua = ua.toLowerCase();

    var match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];

    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  }

  // e.g. sniff.browser == 'webkit' && sniff.version == '534.0'
  var sniff = uaMatch(navigator.userAgent);


  // browser version
  // this gnarly code is exactly the reason why Modernizr exists.
  if (sniff.browser == 'webkit') {
    var chrome = navigator.userAgent.match(/Chrome\/(.*?)(\s|$)/);
    var safari = navigator.userAgent.match(/Safari\/(.*?)(\s|$)/);

    if (chrome) {
      sniff = {
        browser: 'chrome',
        version: chrome[1]
      }
    } else if (safari) {
      sniff = {
        browser: 'safari',
        version: safari[1]
      }
    }
  } else if (sniff.browser == 'mozilla') {
    var firefox = navigator.userAgent.match(/(?:firefox|minefield)\/(.*?)(?:\s|$)/i);
    sniff.browser = 'firefox';
    sniff.version = firefox[1];
  }



  // fire it off
  $('#testbed button').click(function() {
    $(this).hide().next().show();
    var script = document.createElement('script');
    script.onerror = function () {
      isDataAdded = true;
      testbed.innerHTML += backuphtml;
      testAgainstTables();
    }
    script.src = 'http://jsonpify.com/api?url=http://www.findmebyip.com/litmus/&format=string&jsonp=cbfunc';
    document.body.appendChild(script);
    
    // opera is weak with script onerror
    setTimeout(function(){
      if ( isDataAdded) return;
      script.onerror();
    },1200);
  });


 

  window.cbfunc = function (data) {
    isDataAdded = true;
    
    var html = data.replace(/\s+|\n/g, ' ').match(/(<h2 id="css3-properties.*)<div class="data-notes/)[1];
    testbed.innerHTML += html;

    testAgainstTables();
  };

})
