# grunt-lib-contrib [![Build Status](https://secure.travis-ci.org/gruntjs/grunt-lib-contrib.png?branch=master)](http://travis-ci.org/gruntjs/grunt-lib-contrib)

> Common functionality shared across grunt-contrib tasks.

The purpose of grunt-lib-contrib is to explore solutions to common problems task writers encounter, and to ease the upgrade path for contrib tasks.

**These APIs should be considered highly unstable. Depend on them at your own risk!**

_Over time, some of the functionality provided here may be incorporated directly into grunt for mainstream use. Until then, you may require `grunt-lib-contrib` as a dependency in your projects, but be very careful to specify an exact version number instead of a range, as backwards-incompatible changes are likely to be introduced._

### Helper Functions

#### buildIndividualDest(dest, srcFile, basePath, flatten)

This helper is used to build a destination filepath for tasks supporting individual compiling.

#### findBasePath(srcFiles)

This helper is used to take an array of filepaths and find the common base directory.

#### getNamespaceDeclaration(ns)

This helper is used to build JS namespace declarations.

#### isIndividualDest(dest)

This helper is used to detect if a destination filepath triggers individual compiling.

#### normalizeMultiTaskFiles(data, target)

This helper is a (temporary) shim to handle multi-task `files` object in the same way grunt v0.4 does.

#### options(data, defaults)

This helper is on its way out as grunt v0.4 adds an options helper to the task api. This new helper only supports task and target options (no root level options key) so you should start adjusting your tasks now to be ready for the v0.4 release.

Contrib tasks are in the process of being updated to check for the new helper first.

#### optsToArgs(options)

Convert an object to an array of CLI arguments, which can be used with `child_process.spawn()`.

```js
// Example
{
  fooBar: 'a',        // ['--foo-bar', 'a']
  fooBar: 1,          // ['--foo-bar', '1']
  fooBar: true,       // ['--foo-bar']
  fooBar: false,      //
  fooBar: ['a', 'b']  // ['--foo-bar', 'a', '--foo-bar', 'b']
}
```

--

*Lib submitted by [Tyler Kellen](https://goingslowly.com/).*