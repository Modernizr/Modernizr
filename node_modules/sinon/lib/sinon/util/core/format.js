"use strict";

var inspect = require("util").inspect;
var customFormatter;

function format() {
    if (customFormatter) {
        return customFormatter.apply(null, arguments);
    }

    return inspect.apply(inspect, arguments);
}

format.setFormatter = function(aCustomFormatter) {
    if (typeof aCustomFormatter !== "function") {
        throw new Error("format.setFormatter must be called with a function");
    }

    customFormatter = aCustomFormatter;
};

module.exports = format;
