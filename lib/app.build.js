({
  'appDir' : '.',  // take all the scripts from this dir
  'dir'    :  'build/', // and copy them to this dir, then optimize
  'baseUrl' : 'src/',
  'optimize'    : 'none',
  'optimizeCss' : 'none',
  'paths' : {
    'test' : '../feature-detects'
  },
  modules : [
    {
    'name' : 'modernizr-build',
    'include' : ['modernizr-init'],
    'create' : true
  }
  ],
  onBuildWrite: function (id, path, contents) {
    if ((/define\(.*?\{/).test(contents)) {
      //Remove AMD ceremony for use without require.js or almond.js
      contents = contents.replace(/define\(.*?\{/, '');

      contents = contents.replace(/\}\);\s*?$/,'');

      if ( !contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/) ) {
        //remove last return statement and trailing })
        contents = contents.replace(/return.*[^return]*$/,'');
      }
    }
    else if ((/require\([^\{]*?\{/).test(contents)) {
      contents = contents.replace(/require[^\{]+\{/, '');
      contents = contents.replace(/\}\);\s*$/,'');
    }
    return contents;
  }
});
