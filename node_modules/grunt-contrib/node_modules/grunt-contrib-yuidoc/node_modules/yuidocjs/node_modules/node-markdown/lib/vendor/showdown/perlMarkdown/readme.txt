Reference Implementation
------------------------

This directory contains John Gruber's original Perl implementation of Markdown.  Smart diff programs like Araxis Merge will be able to match up this file with markdown.pl.

A little tweaking helps.  In markdown.pl:

  - replace `#` with `//`
  - replace `$text` with `text`

Be sure to ignore whitespace and line endings.

Note: This release of Showdown is based on `markdown1.0.2b7.pl`, but uses the HTML parser from `markdown1.0.2b2.pl`.
