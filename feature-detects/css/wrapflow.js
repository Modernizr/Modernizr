define(['Modernizr', 'prefixed', 'docElement'], function( Modernizr, prefixed, docElement ) {
    // http://www.w3.org/TR/css3-exclusions
    // Examples: http://html.adobe.com/webstandards/cssexclusions
    // Separate test for `wrap-flow` property as IE10 has just implemented this alone
    Modernizr.addTest('wrapflow', function () {
        var prefixedProperty = prefixed('wrapFlow');
        if (!prefixedProperty)
            return false;

        var wrapFlowProperty = prefixedProperty.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        var container = createElement('div');
        var exclusion = createElement('div');
        var content = createElement('span');

        exclusion.style.cssText = 'position: absolute; left: 50px; width: 100px; height: 20px;' + wrapFlowProperty + ':end;';
        content.innerText = 'X';

        container.appendChild(exclusion);
        container.appendChild(content);
        docElement.appendChild(container);

        var leftOffset = content.offsetLeft;

        docElement.removeChild(container);
        exclusion = content = container = undefined;

        return (leftOffset == 150);
    });
});
