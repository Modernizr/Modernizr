define(['docElement'], function(docElement) {
  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  return isSVG;
});
