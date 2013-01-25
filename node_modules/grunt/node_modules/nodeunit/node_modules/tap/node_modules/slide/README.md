# Slide - a tiny flow control library

Callbacks are simple and easy if you keep the pattern consistent.

Check out the [slide presentation](http://github.com/isaacs/slide-flow-control/raw/master/nodejs-controlling-flow.pdf).

You'll laugh when you see how little code is actually in this thing.
It's so not-enterprisey, you won't believe it.  It does almost nothing,
but it's super handy.

I actually use an earlier version of this util in
[a real world program](http://npmjs.org/).

## Installation

Just copy the files into your project, and use them that way, or
you can do this:

    npm install slide

and then:

    var asyncMap = require("slide").asyncMap
      , chain = require("slide").chain
    // use the power!

Enjoy!
