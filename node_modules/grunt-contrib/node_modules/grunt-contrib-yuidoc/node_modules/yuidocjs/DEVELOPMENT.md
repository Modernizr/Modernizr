YUIDoc Development
==================

If you want to work on the default theme or need to work on the parser/builder, here's the steps:

   * git clone git://github.com/yui/yuidoc.git (or your fork)
   * cd yuidoc
   * sudo npm link

This will link `yuidoc` into the global `/usr/local/lib/node_modules` folder.
    This basically installs it globally as a link to this source directory.

Now all changes you make to the current source tree are available in the global `yuidoc` executable.
No need to reinstall the app to test your changes.

Server Mode
-----------

For performance, the handlbars templates are cached from the first request. So you will have to 
terminate the server and relaunch it before you can see your changes.

Assets should not be cached, so they should still serve new files on each request. This way you can
modify the JS/CSS files on the fly.
