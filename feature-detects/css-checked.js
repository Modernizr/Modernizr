/*!
{
  "name": "CSS checked",
  "property": ":checked",
  "authors": ["richarcher"],
  "tags": ["css"],
  "notes": [{
    "name": "Related Github Issue",
    "href": "https://github.com/Modernizr/Modernizr/issues/845"
  }]
}
!*/
define(['Modernizr', 'createElement', 'testStyles'], function (Modernizr, createElement, testStyles) {
  Modernizr.addTest('csschecked', function () {
    return testStyles("#modernizr input {margin-left:0px;} #modernizr input:checked {margin-left: 20px;}", function (elem) {
      var chx = createElement('input');
      chx.type = "checkbox";
      chx.checked = "checked";

      elem.appendChild(chx);
      return elem.lastChild.offsetLeft >= 20;
    });
  });
});