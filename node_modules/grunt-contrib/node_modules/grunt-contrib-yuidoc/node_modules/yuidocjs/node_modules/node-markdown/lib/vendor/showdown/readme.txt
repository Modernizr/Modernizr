
Showdown -- A JavaScript port of Markdown
=========================================

Showdown Copyright (c) 2007 John Fraser.
<http://www.attacklab.net/>

Original Markdown Copyright (c) 2004-2005 John Gruber
<http://daringfireball.net/projects/markdown/>

Redistributable under a BSD-style open source license.
See license.txt for more information.


What's it for?
--------------

Developers can use Showdown to:

 * Add in-browser preview to existing Markdown apps

    Showdown's output is (almost always) identical to
    markdown.pl's, so the server can reproduce exactly
    the output that the user saw.  (See below for
    exceptions.)

 * Add Markdown input to programs that don't support it

    Any app that accepts HTML input can now be made to speak
    Markdown by modifying the input pages's HTML.  If your
    application lets users edit documents again later,
    then they won't have access to the original Markdown
    text.  But this should be good enough for many
    uses -- and you can do it with just a two-line
    `onsubmit` function!

 * Add Markdown input to closed-source web apps

    You can write bookmarklets or userscripts to extend
    any standard textarea on the web so that it accepts
    Markdown instead of HTML.  With a little more hacking,
    the same can probably be done with  many rich edit
    controls.

 * Build new web apps from scratch

    A Showdown front-end can send back text in Markdown,
    HTML or both, so you can trade bandwidth for server
    load to reduce your cost of operation.  If your app
    requires JavaScript, you won't need to do any
    Markdown processing on the server at all.  (For most
    uses, you'll still need to sanitize the HTML before
    showing it to other users -- but you'd need to do
    that anyway if you're allowing raw HTML in your
    Markdown.)


Browser Compatibility
---------------------

Showdown has been tested successfully with:

 - Firefox 1.5 and 2.0
 - Internet Explorer 6 and 7
 - Safari 2.0.4
 - Opera 8.54 and 9.10
 - Netscape 8.1.2
 - Konqueror 3.5.4

In theory, Showdown will work in any browser that supports ECMA 262 3rd Edition (JavaScript 1.5).  The converter itself might even work in things that aren't web browsers, like Acrobat.  No promises.


Known Differences in Output
---------------------------

In most cases, Showdown's output is identical to that of Perl Markdown v1.0.2b7.  What follows is a list of all known deviations.  Please email me if you find more.


 *  This release uses the HTML parser from Markdown 1.0.2b2,
    which means it fails `Inline HTML (Advanced).text` from
    the Markdown test suite:

        <div>
        <div>
        unindented == broken
        </div>
        </div>


 *  Showdown doesn't support the markdown="1" attribute:

        <div markdown="1">
             Markdown does *not* work in here.
        </div>

    This is half laziness on my part and half stubbornness.
    Markdown is smart enough to process the contents of span-
    level tags without screwing things up; shouldn't it be
    able to do the same inside block elements?  Let's find a
    way to make markdown="1" the default.


 *  You can only nest square brackets in link titles to a
    depth of two levels:

        [[fine]](http://www.attacklab.net/)
        [[[broken]]](http://www.attacklab.net/)

    If you need more, you can escape them with backslashes.


 *  When sublists have paragraphs, Showdown produces equivalent
    HTML with a slightly different arrangement of newlines:

        + item

             - subitem

               The HTML has a superfluous newline before this
               paragraph.

             - subitem

               The HTML here is unchanged.

             - subitem

               The HTML is missing a newline after this
               list subitem.



 *  Markdown.pl creates empty title attributes for
    inline-style images:

        Here's an empty title on an inline-style
        ![image](http://w3.org/Icons/valid-xhtml10).

    I tried to replicate this to clean up my diffs during
    testing, but I went too far: now Showdown also makes
    empty titles for reference-style images:

        Showdown  makes an empty title for
        reference-style ![images][] too.

        [images]: http://w3.org/Icons/valid-xhtml10


 *  With crazy input, Markdown will mistakenly put
    `<strong>` or `<em>` tags in URLs:

        <a href="<*Markdown adds em tags in here*>">
           improbable URL
        </a>

    Showdown won't.  But still, don't do that.
