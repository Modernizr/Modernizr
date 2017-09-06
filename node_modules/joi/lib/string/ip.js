var RFC3986 = require('./rfc3986');

var internals = {
    Ip: {
        cidrs: {
            required: '\\/(?:' + RFC3986.cidr + ')',
            optional: '(?:\\/(?:' + RFC3986.cidr + '))?',
            forbidden: ''
        },
        versions: {
            ipv4: RFC3986.IPv4address,
            ipv6: RFC3986.IPv6address,
            ipvfuture: RFC3986.IPvFuture
        }
    }
};

internals.Ip.createIpRegex = function (versions, cidr) {

    var regex;
    for (var i = 0, il = versions.length; i < il; ++i) {
        var version = versions[i];
        if (!regex) {
            regex = '^(?:' + internals.Ip.versions[version];
        }
        regex += '|' + internals.Ip.versions[version];
    }

    return new RegExp(regex + ')' + internals.Ip.cidrs[cidr] + '$');
};

module.exports = internals.Ip;
