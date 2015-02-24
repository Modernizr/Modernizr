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
        'height':10,
        'width':10,
        'position':'absolute',
        'top': 0,
        'left': 0
      })
      .attr({
        'src': url,
        'id': 'shiv'
      })
      .on('lockedAndLoaded', function() {
        iframeWindow = $(this)[0].contentWindow;
        iframeWindow.requirejs.config({
          baseUrl: '../src'
        });
        done();
      });

  });

  it('shivs the document', function(done) {
    iframeWindow.requirejs(['html5shiv'], function() {
      expect('html5' in iframeWindow).to.be(true);
      expect(iframeWindow.html5.type).to.equal('default');
      done();
    });
  });

  after(function() {
    $iframe.remove();
    iframeWindow = $iframe = undefined;
  });

});
