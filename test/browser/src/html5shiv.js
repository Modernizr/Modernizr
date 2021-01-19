describe('html5shiv', function() {
  this.timeout(30000);
  var iframeWindow;
  var $iframe;

  before(function(done) {
    var url = './iframe.html?id=shiv';
    $iframe = $('<iframe>');

    $(document.body).append($iframe);

    $iframe
      .css({
        'height': 10,
        'width': 10,
        'position': 'absolute',
        'top': 0,
        'left': 0
      })
      .attr({
        'src': url,
        'id': 'shiv'
      })
      .on('lockedAndLoaded', function() {
        iframeWindow = $(this)[0].contentWindow;
        done();
      });

  });

  it('shivs the document', function(done) {
    try {
      var html5shiv = makeIIFE({file: "./src/html5shiv.js", func: 'html5shiv'}) 
      iframeWindow.eval(html5shiv)
      expect('html5' in iframeWindow).to.be.equal(true);
      expect(iframeWindow.html5.type).to.be.equal('default');
      done();
    }
    catch (e) {
      done(e);
    }
  });

  after(function() {
    $iframe.remove();
    iframeWindow = $iframe = undefined;
  });

});
