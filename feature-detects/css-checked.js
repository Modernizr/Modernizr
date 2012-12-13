Modernizr.addTest('csschecked', function () {

  return Modernizr.testStyles("#modernizr input {margin-left:0px;} #modernizr input:checked {margin-left: 20px;}", function (elem) {

    var chx = document.createElement('input');
    chx.type = "checkbox";
    chx.checked = "checked";

    elem.appendChild(chx);

    return elem.lastChild.offsetLeft >= 20;

  });

});