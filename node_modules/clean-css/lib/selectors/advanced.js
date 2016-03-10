var optimizeProperties = require('../properties/optimizer');

var removeDuplicates = require('./remove-duplicates');
var mergeAdjacent = require('./merge-adjacent');
var reduceNonAdjacent = require('./reduce-non-adjacent');
var mergeNonAdjacentBySelector = require('./merge-non-adjacent-by-selector');
var mergeNonAdjacentByBody = require('./merge-non-adjacent-by-body');
var restructure = require('./restructure');
var removeDuplicateMediaQueries = require('./remove-duplicate-media-queries');
var mergeMediaQueries = require('./merge-media-queries');

function removeEmpty(tokens) {
  for (var i = 0, l = tokens.length; i < l; i++) {
    var token = tokens[i];
    var isEmpty = false;

    switch (token[0]) {
      case 'selector':
        isEmpty = token[1].length === 0 || token[2].length === 0;
        break;
      case 'block':
        removeEmpty(token[2]);
        isEmpty = token[2].length === 0;
    }

    if (isEmpty) {
      tokens.splice(i, 1);
      i--;
      l--;
    }
  }
}

function recursivelyOptimizeBlocks(tokens, options, validator) {
  for (var i = 0, l = tokens.length; i < l; i++) {
    var token = tokens[i];

    if (token[0] == 'block') {
      var isKeyframes = /@(-moz-|-o-|-webkit-)?keyframes/.test(token[1][0]);
      optimize(token[2], options, validator, !isKeyframes);
    }
  }
}

function recursivelyOptimizeProperties(tokens, options, validator) {
  for (var i = 0, l = tokens.length; i < l; i++) {
    var token = tokens[i];

    switch (token[0]) {
      case 'selector':
        optimizeProperties(token[1], token[2], false, true, options, validator);
        break;
      case 'block':
        recursivelyOptimizeProperties(token[2], options, validator);
    }
  }
}

function optimize(tokens, options, validator, withRestructuring) {
  recursivelyOptimizeBlocks(tokens, options, validator);
  recursivelyOptimizeProperties(tokens, options, validator);

  removeDuplicates(tokens);
  mergeAdjacent(tokens, options, validator);
  reduceNonAdjacent(tokens, options, validator);

  mergeNonAdjacentBySelector(tokens, options, validator);
  mergeNonAdjacentByBody(tokens, options);

  if (options.restructuring && withRestructuring) {
    restructure(tokens, options);
    mergeAdjacent(tokens, options, validator);
  }

  if (options.mediaMerging) {
    removeDuplicateMediaQueries(tokens);
    var reduced = mergeMediaQueries(tokens);
    for (var i = reduced.length - 1; i >= 0; i--) {
      optimize(reduced[i][2], options, validator, false);
    }
  }

  removeEmpty(tokens);
}

module.exports = optimize;
