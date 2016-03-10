var fooRequires = 0;
module.exports = {
    fooRequires: function () { return fooRequires; }
  , incFooRequires: function () { fooRequires++; }
};
