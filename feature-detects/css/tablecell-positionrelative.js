/*!
{
  "name": "table cell elements support `position: relative`",
  "authors": ["Ron Waldon (@jokeyrhyme)"],
  "property": "tablecellpositionrelative",
  "tags": ["css"],
  "notes": [{
    "name": "W3C Spec",
    "href": "http://www.w3.org/TR/CSS21/visuren.html#relative-positioning"
  },{
    "name": "Mozilla Bug: relative positioning of tables cells doesn't work",
    "href": "https://bugzilla.mozilla.org/show_bug.cgi?id=35168"
  }]
}
!*/
define(['Modernizr', 'createElement', 'testStyles'], function (Modernizr, createElement, testStyles) {
  Modernizr.addTest('tablecellpositionrelative', function () {
    var css, result;
    css = '#modernizr td { position: relative; left: 10px }';
    css += '#modernizr td > div { position: absolute; left: 10px }';

    testStyles(css, function (node) {
      var table, tbody, tr, td, div;

      // create a div in a td in a table
      table = createElement('table');
      tbody = createElement('tbody');
      table.appendChild(tbody);
      tr = createElement('tr');
      tbody.appendChild(tr);
      td = createElement('td');
      tr.appendChild(td);
      div = createElement('div');
      td.appendChild(div);

      node.appendChild(table);
      result = div.offsetParent === td;
    });

    return result;
  });
});
