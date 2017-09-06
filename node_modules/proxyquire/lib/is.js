var is = {};

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function (name) {
  is[name] = function (obj) {
    return Object.prototype.toString.call(obj) == '[object ' + name + ']';
  };
});

is.Object = function (obj) {
  return obj === new Object(obj);
};

module.exports = is;
