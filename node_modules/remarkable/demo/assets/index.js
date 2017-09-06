(function () {
  'use strict';

  var mdHtml, mdSrc, permalink, scrollMap;

  var defaults = {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      true,         // autoconvert URL-like texts to links
    linkTarget:   '',           // set target to open link in
    typographer:  true,         // Enable smartypants and other sweet transforms

    // options below are for demo only
    _highlight: true,
    _strict: false,
    _view: 'html'               // html / src / debug
  };

  defaults.highlight = function (str, lang) {
    if (!defaults._highlight || !window.hljs) { return ''; }

    var hljs = window.hljs;
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return '';
  };

  function setOptionClass(name, val) {
    if (val) {
      $('body').addClass('opt_' + name);
    } else {
      $('body').removeClass('opt_' + name);
    }
  }

  function setResultView(val) {
    $('body').removeClass('result-as-html');
    $('body').removeClass('result-as-src');
    $('body').removeClass('result-as-debug');
    $('body').addClass('result-as-' + val);
    defaults._view = val;
  }

  function mdInit() {
    if (defaults._strict) {
      mdHtml = new window.Remarkable('commonmark');
      mdSrc = new window.Remarkable('commonmark');
    } else {
      mdHtml = new window.Remarkable('full', defaults);
      mdSrc = new window.Remarkable('full', defaults);
    }

    // Beautify output of parser for html content
    mdHtml.renderer.rules.table_open = function () {
      return '<table class="table table-striped">\n';
    };

    //
    // Inject line numbers for sync scroll. Notes:
    //
    // - We track only headings and paragraphs on first level. That's enougth.
    // - Footnotes content causes jumps. Level limit filter it automatically.
    //

    mdHtml.renderer.rules.paragraph_open = function (tokens, idx) {
      var line;
      if (tokens[idx].lines && tokens[idx].level === 0) {
        line = tokens[idx].lines[0];
        return '<p class="line" data-line="' + line + '">';
      }
      return '<p>';
    };

    mdHtml.renderer.rules.heading_open = function (tokens, idx) {
      var line;
      if (tokens[idx].lines && tokens[idx].level === 0) {
        line = tokens[idx].lines[0];
        return '<h' + tokens[idx].hLevel + ' class="line" data-line="' + line + '">';
      }
      return '<h' + tokens[idx].hLevel + '>';
    };
  }

  function setHighlightedlContent(selector, content, lang) {
    if (window.hljs) {
      $(selector).html(window.hljs.highlight(lang, content).value);
    } else {
      $(selector).text(content);
    }
  }

  function updateResult() {
    var source = $('.source').val();

    // Update only active view to avoid slowdowns
    // (debug & src view with highlighting are a bit slow)
    if (defaults._view === 'src') {
      setHighlightedlContent('.result-src-content', mdSrc.render(source), 'html');

    } else if (defaults._view === 'debug') {
      setHighlightedlContent(
        '.result-debug-content',
        JSON.stringify(mdSrc.parse(source, { references: {} }), null, 2),
        'json'
      );

    } else { /*defaults._view === 'html'*/
      $('.result-html').html(mdHtml.render(source));
    }

    // reset lines mapping cache on content update
    scrollMap = null;

    try {
      if (source) {
        // serialize state - source and options
        permalink.href = '#md64=' + window.btoa(encodeURI(JSON.stringify({
          source: source,
          defaults: _.omit(defaults, 'highlight')
        })));
      } else {
        permalink.href = '';
      }
    } catch (__) {
      permalink.href = '';
    }
  }

  // Build offsets for each line (lines can be wrapped)
  // That's a bit dirty to process each line everytime, but ok for demo.
  // Optimizations are required only for big texts.
  function buildScrollMap() {
    var i, offset, nonEmptyList, pos, a, b, lineHeightMap, linesCount,
        acc, sourceLikeDiv, textarea = $('.source'),
        _scrollMap;

    sourceLikeDiv = $('<div />').css({
      position: 'absolute',
      visibility: 'hidden',
      height: 'auto',
      width: textarea[0].clientWidth,
      'font-size': textarea.css('font-size'),
      'font-family': textarea.css('font-family'),
      'line-height': textarea.css('line-height'),
      'white-space': textarea.css('white-space')
    }).appendTo('body');

    offset = $('.result-html').scrollTop() - $('.result-html').offset().top;
    _scrollMap = [];
    nonEmptyList = [];
    lineHeightMap = [];

    acc = 0;
    textarea.val().split('\n').forEach(function(str) {
      var h, lh;

      lineHeightMap.push(acc);

      if (str.length === 0) {
        acc++;
        return;
      }

      sourceLikeDiv.text(str);
      h = parseFloat(sourceLikeDiv.css('height'));
      lh = parseFloat(sourceLikeDiv.css('line-height'));
      acc += Math.round(h / lh);
    });
    sourceLikeDiv.remove();
    lineHeightMap.push(acc);
    linesCount = acc;

    for (i = 0; i < linesCount; i++) { _scrollMap.push(-1); }

    nonEmptyList.push(0);
    _scrollMap[0] = 0;

    $('.line').each(function(n, el) {
      var $el = $(el), t = $el.data('line');
      if (t === '') { return; }
      t = lineHeightMap[t];
      if (t !== 0) { nonEmptyList.push(t); }
      _scrollMap[t] = Math.round($el.offset().top + offset);
    });

    nonEmptyList.push(linesCount);
    _scrollMap[linesCount] = $('.result-html')[0].scrollHeight;

    pos = 0;
    for (i = 1; i < linesCount; i++) {
      if (_scrollMap[i] !== -1) {
        pos++;
        continue;
      }

      a = nonEmptyList[pos];
      b = nonEmptyList[pos + 1];
      _scrollMap[i] = Math.round((_scrollMap[b] * (i - a) + _scrollMap[a] * (b - i)) / (b - a));
    }

    return _scrollMap;
  }

  function syncScroll() {
    var textarea   = $('.source'),
        lineHeight = parseFloat(textarea.css('line-height')),
        lineNo, posTo;

    lineNo = Math.floor(textarea.scrollTop() / lineHeight);
    if (!scrollMap) { scrollMap = buildScrollMap(); }
    posTo = scrollMap[lineNo];
    $('.result-html').stop(true).animate({
      scrollTop: posTo
    }, 100, 'linear');
  }

  //////////////////////////////////////////////////////////////////////////////
  // Init on page load
  //
  $(function() {
    // highlight snippet
    if (window.hljs) {
      $('pre.code-example code').each(function(i, block) {
        window.hljs.highlightBlock(block);
      });
    }

    // Restore content if opened by permalink
    if (location.hash && /^(#md=|#md64=)/.test(location.hash)) {
      try {
        var cfg;

        if (/^#md64=/.test(location.hash)) {
          cfg = JSON.parse(decodeURI(window.atob(location.hash.slice(6))));
        } else {
          // Legacy mode for old links. Those become broken in github posts,
          // so we switched to base64 encoding.
          cfg = JSON.parse(decodeURIComponent(location.hash.slice(4)));
        }

        if (_.isString(cfg.source)) {
          $('.source').val(cfg.source);
        }

        var opts = _.isObject(cfg.defaults) ? cfg.defaults : {};

        // copy config to defaults, but only if key exists
        // and value has the same type
        _.forOwn(opts, function (val, key) {
          if (!_.has(defaults, key)) { return; }

          // Legacy, for old links
          if (key === '_src') {
            defaults._view = val ? 'src' : 'html';
            return;
          }

          if ((_.isBoolean(defaults[key]) && _.isBoolean(val)) ||
              (_.isString(defaults[key]) && _.isString(val))) {
            defaults[key] = val;
          }
        });

        // sanitize for sure
        if ([ 'html', 'src', 'debug' ].indexOf(defaults._view) === -1) {
          defaults._view = 'html';
        }
      } catch (__) {}
    }

    // Activate tooltips
    $('._tip').tooltip({ container: 'body' });

    // Set default option values and option listeners
    _.forOwn(defaults, function (val, key) {
      if (key === 'highlight') { return; }

      var el = document.getElementById(key);

      if (!el) { return; }

      var $el = $(el);

      if (_.isBoolean(val)) {
        $el.prop('checked', val);
        $el.on('change', function () {
          var value = Boolean($el.prop('checked'));
          setOptionClass(key, value);
          defaults[key] = value;
          mdInit();
          updateResult();
        });
        setOptionClass(key, val);

      } else {
        $(el).val(val);
        $el.on('change update keyup', function () {
          defaults[key] = String($(el).val());
          mdInit();
          updateResult();
        });
      }
    });

    setResultView(defaults._view);

    mdInit();
    permalink = document.getElementById('permalink');

    // Setup listeners
    $('.source').on('keyup paste cut mouseup', _.debounce(updateResult, 300, { maxWait: 500 }));
    $('.source').on('scroll', _.debounce(syncScroll, 50, { maxWait: 50 }));

    $('.source-clear').on('click', function (event) {
      $('.source').val('');
      updateResult();
      event.preventDefault();
    });

    $(document).on('click', '[data-result-as]', function (event) {
      var view = $(this).data('resultAs');
      if (view) {
        setResultView(view);
        // only to update permalink
        updateResult();
        event.preventDefault();
      }
    });

    // Need to recalculate line positions on window resize
    $(window).on('resize', function () {
      scrollMap = null;
    });

    updateResult();
  });
})();
