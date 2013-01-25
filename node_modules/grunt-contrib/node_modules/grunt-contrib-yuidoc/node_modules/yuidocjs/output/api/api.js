YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CLI",
        "DocBuilder",
        "DocParser",
        "DocView",
        "Files",
        "Help",
        "Main",
        "Options",
        "Server",
        "Utils",
        "YUIDoc"
    ],
    "modules": [
        "yuidoc"
    ],
    "allModules": [
        {
            "displayName": "yuidoc",
            "name": "yuidoc",
            "description": "This is the __module__ description for the `YUIDoc` module.\n\n    var options = {\n        paths: [ './lib' ],\n        outdir: './out'\n    };\n\n    var Y = require('yuidocjs');\n    var json = (new Y.YUIDoc(options)).run();"
        }
    ]
} };
});