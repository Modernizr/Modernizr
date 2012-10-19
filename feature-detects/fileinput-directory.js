// Directory
// By Alexander Farennikov

// Detects `webkitdirectory` or `directory` attributes on <input type="file">

Modernizr.addTest('fileinputdirectory', function() {
  var el = document.createElement('input');
  el.type = 'file';
  return typeof el.webkitdirectory !== 'undefined' || typeof el.mozdirectory !== 'undefined' || typeof el.directory !== 'undefined';
});