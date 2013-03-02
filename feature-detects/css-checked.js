define(['Modernizr', 'createElement', 'testStyles'], function (Modernizr, createElement, testStyles) {
  testStyles("#modernizr input {margin-left:0px;} #modernizr input:checked {margin-left: 20px;}", function (elem) {
    var chx = createElement('input');
    chx.type = "checkbox";
    chx.checked = "checked";

    elem.appendChild(chx);
    Modernizr.addTest('csschecked', elem.lastChild.offsetLeft >= 20);
  }, 2);
});