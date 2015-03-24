'use strict';

module.exports = {
  build: require('./build'),
  metadata: require('./metadata'),
  options: function() {
    return [
      {'name':'Modernizr.addTest()','property':'addTest'},
      {'name':'Modernizr.atRule()','property':'atRule'},
      {'name':'Modernizr.hasEvent()','property':'hasEvent'},
      {'name':'Modernizr.mq()','property':'mq'},
      {'name':'Modernizr.prefixed()','property':'prefixed'},
      {'name':'Modernizr._domPrefixes','property':'domPrefixes'},
      {'name':'Modernizr._prefixes','property':'prefixes'},
      {'name':'Modernizr.prefixedCSS()','property':'prefixedCSS'},
      {'name':'Modernizr.testAllProps()','property':'testAllProps'},
      {'name':'Modernizr.testProp()','property':'testProp'},
      {'name':'Modernizr.testStyles()','property':'testStyles'},
      {'name':'html5printshiv','property':'html5printshiv'},
      {'name':'html5shiv','property':'html5shiv'}
    ];}
};
