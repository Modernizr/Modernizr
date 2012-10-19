function dumpModernizr(){
  var str = '';
  dumpModernizr.old = dumpModernizr.old || {};

    for (var prop in Modernizr) {

      // skip previously done ones.
      if (dumpModernizr.old[prop]) continue;
      else dumpModernizr.old[prop] = true;

      if (typeof Modernizr[prop] === 'function') continue;
      // skip unit test items
      if (/^test/.test(prop)) continue;

      if (~TEST.inputs.indexOf(prop)) {
        str += '<li><b>'+prop+'{}</b><ul>';
        for (var field in Modernizr[prop]) {
          str += '<li class="' + (Modernizr[prop][field] ? 'yes' : '') + '">' + field + ': ' + Modernizr[prop][field] + '</li>';
        }
        str += '</ul></li>';
      } else {
        str += '<li  id="'+prop+'" class="' + (Modernizr[prop] ? 'yes' : '') + '">' + prop + ': ' + Modernizr[prop] + '</li>';
      }
  }
  return str;
}


function grabFeatDetects(){

  var tests20120926 = ["a-download", "applicationcache", "audio-audiodata-api", "audio-webaudio-api", "audio", "battery-api", "battery-level", "blob-constructor", "canvas-todataurl-type", "canvas", "canvastext", "contenteditable", "contentsecuritypolicy", "contextmenu", "cookies", "cors", "css-animations", "css-backgroundposition-shorthand", "css-backgroundposition-xy", "css-backgroundrepeat", "css-backgroundsize", "css-backgroundsizecover", "css-borderimage", "css-borderradius", "css-boxshadow", "css-boxsizing", "css-calc", "css-columns", "css-cubicbezierrange", "css-displayrunin", "css-displaytable", "css-filters", "css-flexbox", "css-flexboxlegacy", "css-fontface", "css-generatedcontent", "css-gradients", "css-hsla", "css-hyphens", "css-lastchild", "css-mask", "css-mediaqueries", "css-multiplebgs", "css-objectfit", "css-opacity", "css-overflow-scrolling", "css-pointerevents", "css-positionsticky", "css-reflections", "css-regions", "css-remunit", "css-resize", "css-rgba", "css-scrollbars", "css-subpixelfont", "css-supports", "css-textshadow", "css-transforms", "css-transforms3d", "css-transitions", "css-userselect", "css-vhunit", "css-vmaxunit", "css-vminunit", "css-vwunit", "custom-protocol-handler", "dart", "dataview-api", "dom-classlist", "dom-createElement-attrs", "dom-dataset", "dom-microdata", "draganddrop", "elem-datalist", "elem-details", "elem-output", "elem-progress-meter", "elem-ruby", "elem-time", "elem-track", "emoji", "es5-strictmode", "event-deviceorientation-motion", "exif-orientation", "file-api", "file-filesystem", "forms-fileinput", "forms-formattribute", "forms-inputnumber-l10n", "forms-placeholder", "forms-speechinput", "forms-validation", "fullscreen-api", "gamepad", "geolocation", "getusermedia", "hashchange", "history", "ie8compat", "iframe-sandbox", "iframe-seamless", "iframe-srcdoc", "img-apng", "img-webp-lossless", "img-webp", "indexedDB", "json", "lists-reversed", "mathml", "network-connection", "network-eventsource", "network-xhr2", "notification", "performance", "pointerlock-api", "postmessage", "quota-management-api", "requestanimationframe", "script-async", "script-defer", "storage-localstorage", "storage-sessionstorage", "style-scoped", "svg-clippaths", "svg-filters", "svg-inline", "svg-smil", "svg-svg", "touch", "unicode", "url-data-uri", "userdata", "vibration", "video", "web-intents", "webgl-extensions", "webgl", "websockets-binary", "websockets", "websqldatabase", "window-framed", "workers-blobworkers", "workers-dataworkers", "workers-sharedworkers", "workers-webworkers"];

  if (location.protocol == 'file:'){
    for (var i = 0; i < tests20120926.length; i++){
      var test = tests20120926[i];
      document.write('<script src="../feature-detects/' + test + '.js"><\/script>');
    }
    return;
  }

  // thx github.js
  $.getScript('https://api.github.com/repos/Modernizr/Modernizr/git/trees/master?recursive=1&callback=processTree');
}


function processTree(data){
  var filenames = [];

  for (var i = 0; i < data.data.tree.length; i++){
    var file = data.data.tree[i];
    var match = file.path.match(/^feature-detects\/(.*)/);
    if (!match) continue;

    var relpath = location.host == "modernizr.github.com" ?
                    '../modernizr-git/' : '../';

    filenames.push(relpath + match[0]);
  }

  var jqxhrs = filenames.map(function(filename){
    return jQuery.getScript(filename);
  });

  jQuery.when.apply(jQuery, jqxhrs).done(function(){
    QUnit.start();
    resultsToDOM();
  });

}
function resultsToDOM(){
  var modOutput = document.createElement('div'),
      ref = document.getElementById('qunit-testresult') || document.getElementById('qunit-tests');

  modOutput.className = 'output';
  modOutput.innerHTML = dumpModernizr();

  ref.parentNode.insertBefore(modOutput, ref);

  // Modernizr object as text
  document.getElementsByTagName('textarea')[0].innerHTML = JSON.stringify(Modernizr);
}

/* uno    */ resultsToDOM();
/* dos    */ grabFeatDetects();
/* tres   */ setTimeout(resultsToDOM,  5e3);
/* quatro */ setTimeout(resultsToDOM, 15e3);
