function split(value, separator, includeSeparator, openLevel, closeLevel, firstOnly) {
  var withRegex = typeof separator != 'string';
  var hasSeparator = withRegex ?
    separator.test(value) :
    value.indexOf(separator);

  if (!hasSeparator)
    return [value];

  openLevel = openLevel || '(';
  closeLevel = closeLevel || ')';

  if (value.indexOf(openLevel) == -1 && !includeSeparator && !firstOnly)
    return value.split(separator);

  var BACKSLASH = '\\';
  var isEscaped = false;
  var wasEscaped = false;
  var level = 0;
  var cursor = 0;
  var lastStart = 0;
  var len = value.length;
  var tokens = [];

  while (cursor < len) {
    isEscaped = value[cursor] == BACKSLASH;

    if (wasEscaped) {
      // no-op
    } else
    if (value[cursor] == openLevel) {
      level++;
    } else if (value[cursor] == closeLevel) {
      level--;
    }

    if (!wasEscaped && level === 0 && cursor > 0 && cursor + 1 < len && (withRegex ? separator.test(value[cursor]) : value[cursor] == separator)) {
      tokens.push(value.substring(lastStart, cursor + (includeSeparator ? 1 : 0)));
      lastStart = cursor + 1;

      if (firstOnly && tokens.length == 1) {
        break;
      }
    }

    wasEscaped = isEscaped;
    cursor++;
  }

  if (lastStart < cursor + 1) {
    var lastValue = value.substring(lastStart);
    var lastCharacter = lastValue[lastValue.length - 1];
    if (!includeSeparator && (withRegex ? separator.test(lastCharacter) : lastCharacter == separator))
      lastValue = lastValue.substring(0, lastValue.length - 1);

    tokens.push(lastValue);
  }

  return tokens;
}

module.exports = split;
