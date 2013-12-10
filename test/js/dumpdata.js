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

function resultsToDOM(){
  var modOutput = document.createElement('div'),
      ref = document.getElementById('qunit-testresult') || document.getElementById('qunit-tests');

  modOutput.className = 'output';
  modOutput.innerHTML = dumpModernizr();

  ref.parentNode.insertBefore(modOutput, ref);

  // Modernizr object as text
  document.getElementsByTagName('textarea')[0].innerHTML = JSON.stringify(Modernizr);
}

/* uno  */ resultsToDOM();
/* dos  */ setTimeout(resultsToDOM,  5e3);
/* tres */ setTimeout(resultsToDOM, 15e3);
