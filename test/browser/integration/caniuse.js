/* global uaparse */
window.caniusecb = function(caniuse) {
  // So Phantom doesn't kill the caniuse.com matching exit out as it's useless anyway within PhantomJS
  if (window._phantom) {
    return;
  }
  describe('caniuse', function() {

    var ua = uaparse(navigator.userAgent);
    var unusedModernizr = [];
    var unusedCaniuse = _.keys(caniuse.data);
    var map = {
      adownload: 'download',
      ambientlight: 'ambient-light',
      apng: 'apng',
      appearance: 'css-appearance',
      applicationcache: 'offline-apps',
      audio: 'audio',
      backgroundblendmode: 'css-backgroundblendmode',
      blobconstructor: 'blobbuilder',
      bloburls: 'bloburls',
      borderimage: 'border-image',
      borderradius: 'border-radius',
      boxshadow: 'css-boxshadow',
      boxsizing: 'css3-boxsizing',
      canvas: 'canvas',
      canvasblending: 'canvas-blending',
      canvastext: 'canvas-text',
      checked: 'css-sel3',
      classlist: 'classlist',
      contenteditable: 'contenteditable',
      contextmenu: 'menu',
      cors: 'cors',
      cssanimations: 'css-animation',
      csscalc: 'calc',
      csscolumns: 'multicolumn',
      cssfilters: 'css-filters',
      cssgradients: 'css-gradients',
      csspointerevents: 'pointer-events',
      csspositionsticky: 'css-sticky',
      cssreflections: 'css-reflections',
      cssremunit: 'rem',
      cssresize: 'css-resize',
      csstransforms3d: 'transforms3d',
      csstransforms: 'transforms2d',
      csstransitions: 'css-transitions',
      cssvhunit: 'viewport-units',
      cssvmaxunit: 'viewport-units',
      cssvminunit: 'viewport-units',
      cssvwunit: 'viewport-units',
      datalistelem: 'datalist',
      dataset: 'dataset',
      datauri: 'datauri',
      details: 'details',
      deviceorientation: 'deviceorientation',
      displaytable: 'css-table',
      draganddrop: 'dragndrop',
      eventsource: 'eventsource',
      exiforientation: 'css-image-orientation',
      fileinput: 'forms',
      filereader: 'fileapi',
      filesystem: 'filesystem',
      flexbox: 'flexbox',
      fontface: 'fontface',
      formvalidation: 'form-validation',
      fullscreen: 'fullscreen',
      gamepads: 'gamepad',
      geolocation: 'geolocation',
      getrandomvalues: 'getrandomvalues',
      getusermedia: 'stream',
      hashchange: 'hashchange',
      hidden: 'hidden',
      history: 'history',
      hsla: 'css3-colors',
      htmlimports: 'imports',
      indexeddb: 'indexeddb',
      inlinesvg: 'svg-html5',
      inputtypes: 'forms',
      jpegxr: 'jpegxr',
      json: 'json',
      lastchild: 'css-sel3',
      localstorage: 'namevalue-storage',
      mathml: 'mathml',
      mediaqueries: 'css-mediaqueries',
      meter: 'progressmeter',
      multiplebgs: 'multibackgrounds',
      mutationobserver: 'mutationobserver',
      notification: 'notifications',
      objectfit: 'object-fit',
      opacity: 'css-opacity',
      pagevisibility: 'pagevisibility',
      performance: 'nav-timing',
      picture: 'picture',
      postmessage: 'x-doc-messaging',
      progressbar: 'progressmeter',
      promises: 'promises',
      queryselector: 'queryselector',
      regions: 'css-regions',
      requestanimationframe: 'requestanimationframe',
      rgba: 'css3-colors',
      ruby: 'ruby',
      sandbox: 'iframe-sandbox',
      scriptasync: 'script-async',
      scriptdefer: 'script-defer',
      seamless: 'iframe-seamless',
      shapes: 'css-shapes',
      sharedworkers: 'sharedworkers',
      smil: 'svg-smil',
      strictmode: 'use-strict',
      stylescoped: 'style-scoped',
      supports: 'css-featurequeries',
      svg: 'svg',
      svgasimg: 'svg-img',
      svgfilters: 'svg-filters',
      template: 'template',
      textalignlast: 'css-text-align-last',
      textshadow: 'css-textshadow',
      typedarrays: 'typedarrays',
      unicoderange: 'font-unicode-range',
      userselect: 'user-select-none',
      vibrate: 'vibration',
      video: 'video',
      webanimations: 'web-animation',
      webaudio: 'audio-api',
      webgl: 'webgl',
      webp: 'webp',
      websockets: 'websockets',
      websqldatabase: 'sql-storage',
      webworkers: 'webworkers',
      willchange: 'will-change',
      xhr2: 'xhr2'
    };

    // translate 'y' 'n' or 'a' into a boolean that Modernizr uses
    function bool(result) {
      // To handle correctly things like 'y #1' or 'a #2'
      if (result.indexOf('y') === 0 || result.indexOf('a') === 0) {
        return true;
      }
      // 'p' is for polyfill
      if (result.indexOf('n') === 0 || result.indexOf('p') === 0) {
        return false;
      }
      throw 'unknown return value from can i use - ' + result;
    }

    function testify(o) {

      var ciubool = bool(o.caniuseResult);

      // caniuse says audio/video are yes/no, Modernizr has more detail which we'll dumb down.
      if (_.contains(['video', 'audio', 'webglextensions'], o.feature)) {
        o.result = o.result.valueOf();
      }

      // if caniuse gave us a 'partial', lets let it pass with a note.
      if (o.caniuseResult.indexOf('a') === 0) {
        return it(o.browser + o.version + ': Caniuse reported partial support for ' + o.ciufeature, function() {
          expect(ciubool).to.equal(o.result.valueOf());
        });
      }


      // change the *documented* false positives
      if (!ciubool && (o.feature == 'textshadow' && o.browser == 'firefox' && o.version == 3)) {
        ciubool = o.fp = true;
      }

      // where we actually do most our assertions
      it(o.browser + o.version + ': Caniuse result for ' + o.ciufeature + ' matches Modernizr\'s ' + (o.fp ? '*false positive*' : 'result') + ' for ' + o.feature, function() {
        expect(ciubool).to.equal(o.result.valueOf());
      });
    }

    _.forEach(Modernizr, function(result, feature) {

      var caniuseFeatureName = map[feature];

      if (_.isUndefined(caniuseFeatureName)) {
        return unusedModernizr.push(feature);
      }

      var caniuseFeatureData = caniuse.data[caniuseFeatureName];

      if (caniuseFeatureData === undefined) {
        throw 'unknown key of caniusedata - ' + caniuseFeatureName;
      }

      unusedCaniuse = _.without(unusedCaniuse, caniuseFeatureName);

      // get results for this feature for all versions of this browser
      var browserResults = caniuseFeatureData.stats[ua.family.toLowerCase()];

      // let's get our versions in order..
      var minorver   = ua.minor &&                                  // caniuse doesn't use two digit minors
        ua.minor.toString().replace(/(\d)\d$/,'$1'); // but opera does.


      var majorminor = (ua.major + '.' + minorver)
        // opera gets grouped in some cases by caniuse
        .replace(/(9\.(6|5))/ , ua.family == 'opera' ? '9.5-9.6'   : '$1')
        .replace(/(10\.(0|1))/, ua.family == 'opera' ? '10.0-10.1' : '$1');

      var mmResult   = browserResults[majorminor];
      var mResult    = browserResults[ua.major];


      // check it against the major.minor: eg. FF 3.6
      if (mmResult && mmResult != 'u') { // 'y' 'n' or 'a'

        // data ends w/ ` x` if its still prefixed in the imp
        mmResult = mmResult.replace(' x','');

        // match it against our data.
        testify({
          feature: feature,
          ciufeature: caniuseFeatureName,
          result: Modernizr[feature],
          caniuseResult: mmResult,
          browser: ua.family,
          version: majorminor
        });

        return; // don't check the major version
      }

      // check it against just the major version: eg. FF 3
      if (mResult) {

        // unknown support from caniuse... He would probably like to know our data, though!
        if (mResult == 'u') {
          return;
        }

        // data ends w/ ` x` if its still prefixed in the imp
        mResult = mResult.replace(' x','');

        testify({
          feature: feature,
          ciufeature: caniuseFeatureName,
          result: Modernizr[feature],
          caniuseResult: mResult,
          browser: ua.family,
          version: ua.major
        });
      }
    });

  });
};
