var RFC3986 = require('./rfc3986');

var internals = {
    Uri: {
        createUriRegex: function (optionalScheme) {

            var scheme = RFC3986.scheme;

            // If we were passed a scheme, use it instead of the generic one
            if (optionalScheme) {

                // Have to put this in a non-capturing group to handle the OR statements
                scheme = '(?:' + optionalScheme + ')';
            }

            /**
             * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
             */
            return new RegExp('^' + scheme + ':' + RFC3986.hierPart + '(?:\\?' + RFC3986.query + ')?' + '(?:#' + RFC3986.fragment + ')?$');
        }
    }
};

module.exports = internals.Uri;
