# 1.3.0

2012-03-10

- @media bubbling
- Support arbitrary entities as selectors
- [Variadic argument support](https://gist.github.com/1933613)
- Behaviour of zero-arity mixins has [changed](https://gist.github.com/1933613)
- Allow `@import` directives in any selector
- Media-query features can now be a variable
- Automatic merging of media-query conditions
- Fix global variable leaks
- Fix error message on wrong-arity call
- Fix an `@arguments` behaviour bug
- Fix `::` selector output
- Fix a bug when using @media with mixins


# 1.2.1

2012-01-15

- Fix imports in browser
- Improve error reporting in browser
- Fix Runtime error reports from imported files
- Fix `File not found` import error reporting


# 1.2.0

2012-01-07

- Mixin guards
- New function `percentage`
- New `color` function to parse hex color strings
- New type-checking stylesheet functions
- Fix Rhino support
- Fix bug in string arguments to mixin call
- Fix error reporting when index is 0
- Fix browser support in WebKit and IE
- Fix string interpolation bug when var is empty
- Support `!important` after mixin calls
- Support vanilla @keyframes directive
- Support variables in certain css selectors, like `nth-child`
- Support @media and @import features properly
- Improve @import support with media features
- Improve error reports from imported files
- Improve function call error reporting
- Improve error-reporting