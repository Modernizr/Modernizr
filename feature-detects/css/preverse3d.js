/*!
{
  "name": "CSS Transform Style preserve-3d",
  "property": "preserve3d",
  "tags": ["css"]
}
!*/
define(['Modernizr', 'testStyles', 'prefixed'], function (Modernizr, testStyles, prefixed) {
    Modernizr.addTest('preserve3d', function () {
        var prefixedProperty = prefixed('transformStyle');

        if (!prefixedProperty)
            return false;

        var transformStyleProperty = prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        return testStyles('#modernizr { ' + transformStyleProperty + ': preserve-3d; }', function (elem, rule) {
            // Check against computed value
            return window.getComputedStyle ? getComputedStyle(elem, null).getPropertyValue(transformStyleProperty) === 'preserve-3d' : false;
        });
    });
});