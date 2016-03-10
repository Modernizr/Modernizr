var path = require('path');

function FooSingleton() { }

var instance = null;
exports.getInstance = function() {
    if (instance === null) {
        instance = new FooSingleton();
    }

    return instance;
};
