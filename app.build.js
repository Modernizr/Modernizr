({
  "appDir" : ".",  // take all the scripts from this dir
  "dir"    :  "build/", // and copy them to this dir, then optimize
  "baseUrl" : "src/",
  "optimize"    : "none",
  "paths" : {
    "test" : "../feature-detects"
  },
  modules : [
    {
      "name" : "modernizr-build",
      "include" : ["modernizr-init"],
      "create" : true
    }
  ]
})
