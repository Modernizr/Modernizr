Modernizr.addTest('emoji', function() {
  var node = document.createElement('canvas');
  if (!node.getContext) return false;
  var ctx = node.getContext('2d');
  ctx.textBaseline = "top";
  ctx.font = "32px Arial";
  ctx.fillText("😃", 0, 0);
  return ctx.getImageData(16, 16, 1, 1).data[0] != 0;
});
