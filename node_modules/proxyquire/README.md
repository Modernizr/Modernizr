# proxyquire [![Build Status](https://secure.travis-ci.org/thlorenz/proxyquire.svg)](http://travis-ci.org/thlorenz/proxyquire)

[![NPM](https://nodei.co/npm/proxyquire.png?downloads=true&stars=true)](https://nodei.co/npm/proxyquire/)

Proxies nodejs's require in order to make overriding dependencies during testing easy while staying **totally unobstrusive**.

If you want to stub dependencies for your client side modules, try
[proxyquireify](https://github.com/thlorenz/proxyquireify), a proxyquire for [browserify
v2](https://github.com/substack/browserify) or [proxyquire-universal](https://github.com/bendrucker/proxyquire-universal) 
to test in both Node and the browser.

# Features

- **no changes to your code** are necessary
- non overridden methods of a module behave like the original
- mocking framework agnostic, if it can stub a function then it works with proxyquire
- "use strict" compliant

# Example

**foo.js:**

```javascript
var path = require('path');

module.exports.extnameAllCaps = function (file) {
  return path.extname(file).toUpperCase();
};

module.exports.basenameAllCaps = function (file) {
  return path.basename(file).toUpperCase();
};
```

**foo.test.js:**

```javascript
var proxyquire =  require('proxyquire')
  , assert     =  require('assert')
  , pathStub   =  { };

// when no overrides are specified, path.extname behaves normally
var foo = proxyquire('./foo', { 'path': pathStub });
assert.equal(foo.extnameAllCaps('file.txt'), '.TXT');

// override path.extname
pathStub.extname = function (file) { return 'Exterminate, exterminate the ' + file; };

// path.extname now behaves as we told it to
assert.equal(foo.extnameAllCaps('file.txt'), 'EXTERMINATE, EXTERMINATE THE FILE.TXT');

// path.basename and all other path module methods still function as before
assert.equal(foo.basenameAllCaps('/a/b/file.txt'), 'FILE.TXT');
```

You can also replace functions directly:

```js
var get    = require('simple-get');
var assert = require('assert');

module.exports = function fetch (callback) {
  get('https://api/users', callback);
};
```

```js
var proxyquire = require('proxyquire');
var fetch = proxyquire('./get', {
  'simple-get': function (url, callback) {
    process.nextTick(function () {
      callback(null, fakeResponse)
    })
  }
});

fetch(function (err, res) {
  assert(res.statusCode, 200)
});
```


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Usage](#usage)
- [API](#api)
  - [Preventing call thru to original dependency](#preventing-call-thru-to-original-dependency)
    - [Prevent call thru for all future stubs resolved by a proxyquire instance](#prevent-call-thru-for-all-future-stubs-resolved-by-a-proxyquire-instance)
    - [Re-enable call thru for all future stubs resolved by a proxyquire instance](#re-enable-call-thru-for-all-future-stubs-resolved-by-a-proxyquire-instance)
      - [All together, now](#all-together-now)
  - [Using proxyquire to simulate the absence of Modules](#using-proxyquire-to-simulate-the-absence-of-modules)
  - [Forcing proxyquire to reload modules](#forcing-proxyquire-to-reload-modules)
  - [Globally override require](#globally-override-require)
    - [Caveat](#caveat)
    - [Globally override require during module initialization](#globally-override-require-during-module-initialization)
    - [Why is proxyquire messing with my `require` cache?](#why-is-proxyquire-messing-with-my-require-cache)
    - [Globally override require during module runtime](#globally-override-require-during-module-runtime)
  - [Configuring proxyquire by setting stub properties](#configuring-proxyquire-by-setting-stub-properties)
- [Backwards Compatibility for proxyquire v0.3.x](#backwards-compatibility-for-proxyquire-v03x)
- [Examples](#examples)
- [More Examples](#more-examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Usage

Two simple steps to override require in your tests:

- add `var proxyquire = require('proxyquire');` to top level of your test file
- `proxyquire(...)` the module you want to test and pass along stubs for modules you want to override

# API

***proxyquire({string} request, {Object} stubs)***

- **request**: path to the module to be tested e.g., `../lib/foo`
- **stubs**: key/value pairs of the form `{ modulePath: stub, ... }`
    - module paths are relative to the tested module **not** the test file
    - therefore specify it exactly as in the require statement inside the tested file
    - values themselves are key/value pairs of functions/properties and the appropriate override

## Preventing call thru to original dependency

By default proxyquire calls the function defined on the *original* dependency whenever it is not found on the stub.

If you prefer a more strict behavior you can prevent *callThru* on a per module or contextual basis.

If *callThru* is disabled, you can stub out modules that don't even exist on the machine that your tests are running on.
While I wouldn't recommend this in general, I have seen cases where it is legitimately useful (e.g., when requiring
global environment configs in json format that may not be available on all machines).

**Prevent call thru on path stub:**

```javascript
var foo = proxyquire('./foo', {
  path: {
      extname: function (file) { ... }
    , '@noCallThru': true
  }
});
```

### Prevent call thru for all future stubs resolved by a proxyquire instance

```javascript
// all stubs resolved by proxyquireStrict will not call through by default
var proxyquireStrict = require('proxyquire').noCallThru();

// all stubs resolved by proxyquireNonStrict will call through by default
var proxyquireNonStrict = require('proxyquire');
```

### Re-enable call thru for all future stubs resolved by a proxyquire instance

```javascript
proxyquire.callThru();
```

**Call thru configurations per module override `callThru()`:**

Passing `@noCallThru: false` when configuring modules will override `noCallThru()`:

```javascript
var foo = proxyquire
    .noCallThru()
    .load('./foo', {

        // no calls to original './bar' methods will be made
        './bar' : { toAtm: function (val) { ... } }

        // for 'path' module they will be made
      , path: {
          extname: function (file) { ... }
        , '@noCallThru': false
        }
    });
```

#### All together, now

```javascript
var proxyquire = require('proxyquire').noCallThru();

// all methods for foo's dependencies will have to be stubbed out since proxyquire will not call through
var foo = proxyquire('./foo', stubs);

proxyquire.callThru();

// only some methods for foo's dependencies will have to be stubbed out here since proxyquire will now call through
var foo2 = proxyquire('./foo', stubs);
```

## Using proxyquire to simulate the absence of Modules

Some libraries may behave differently in the presence or absence of a
package, for example:

```javascript
var cluster;
try {
  cluster = require('cluster');
} catch(e) {
  // cluster module is not present.
  cluster = null
}
if (cluster) {
  // Then provide some functionality for a cluster-aware version of Node.js
} else {
  // and some alternative for a cluster-unaware version.
}
```

To exercise the second branch of the `if` statement, you can make proxyquire pretend the package isn't present by
setting the stub for it to `null`. This works even if a `cluster` module is actually present.

```javascript
var foo = proxyquire('./foo', { cluster: null });
```

## Forcing proxyquire to reload modules

In most situations it is fine to have proxyquire behave exactly like nodejs `require`, i.e. modules that are loaded once
get pulled from the cache the next time.

For some tests however you need to ensure that the module gets loaded fresh everytime, i.e. if that causes initializing
some dependency or some module state.

For this purpose proxyquire exposes the `noPreserveCache` function.

```js
// ensure we don't get any module from the cache, but to load it fresh every time
var proxyquire = require('proxyquire').noPreserveCache();

var foo1 = proxyquire('./foo', stubs);
var foo2 = proxyquire('./foo', stubs);
var foo3 = require('./foo');

// foo1, foo2 and foo3 are different instances of the same module
assert.notEqual(foo1, foo2);
assert.notEqual(foo1, foo3);
```

`require.preserveCache` allows you to restore the behavior to match nodejs's `require` again.

```js
proxyquire.preserveCache();

var foo1 = proxyquire('./foo', stubs);
var foo2 = proxyquire('./foo', stubs);
var foo3 = require('./foo');

// foo1, foo2 and foo3 are the same instance
assert.equal(foo1, foo2);
assert.equal(foo1, foo3);
```


## Globally override require

Use the `@global` property to override every `require` of a module, even transitively.

### Caveat

You should **think very hard about alternatives before using this feature**. Why, because it's intrusive and as you'll
see if you read on it changes the default behavior of module initialization which means that code runs differently
during testing than it does normally.

Additionally it **makes it harder to reason about how your tests work**. 

> Yeah, we are mocking `fs` three levels down in `bar`, so that's why we have to set it up when testing `foo`

**WAAAT???**

If you write proper unit tests you should never have a need for this. So here are some techniques to consider:

- test each module in isolation
- make sure your modules are small enough and do only one thing
- stub out dependencies directly instead of stubbing something inside your dependencies
- if you are testing `bar` and `bar` calls `foo.read` and `foo.read` calls `fs.readFile` proceed as follows
  - **do not** stub out `fs.readFile` globally
  - instead stub out `foo` so you can control what `foo.read` returns without ever even hitting `fs`

OK, made it past the warnings and still feel like you need this? Read on then but you are on your own now, this is as
far as I'll go ;)

Watch out for more warnings below.

### Globally override require during module initialization

```javascript
// foo.js
var bar = require('bar');

module.exports = function() {
  bar();
}

// bar.js
var baz = require('baz');

module.exports = function() {
  baz.method();
}

// baz.js
module.exports = {
  method: function() {
    console.info('hello');
  }
}

// test.js
var stubs = {
  'baz': {
    method: function(val) {
      console.info('goodbye');
    },
    '@global': true
  }
};

var proxyquire = require('proxyquire');

var foo = proxyquire('foo', stubs);
foo();  // 'goodbye' is printed to stdout
```

Be aware that when using global overrides **any module initialization code will be re-executed for each require.**

This is not normally the case since node.js caches the return value of `require`, however to make global overrides work ,
`proxyquire` bypasses the module cache. This may cause **unexpected behaviour if a module's initialization causes side effects**.

As an example consider this module which opens a file during its initialization:

```javascript
var fs = require('fs')
  , C = require('C');

// will get executed twice
var file = fs.openSync('/tmp/foo.txt', 'w');

module.exports = function() {
  return new C(file);
};
```

The file at `/tmp/foo.txt` could be created and/or truncated more than once.

### Why is proxyquire messing with my `require` cache?

Say you have a module, C, that you wish to stub.  You require module A which contains `require('B')`. Module B in turn
contains `require('C')`. If module B has already been required elsewhere then when module A receives the cached version
of module B and proxyquire would have no opportunity to inject the stub for C.

Therefore when using the `@global` flag, `proxyquire` will bypass the `require` cache.

### Globally override require during module runtime

Say you have a module that looks like this:

```javascript
module.exports = function() {
  var d = require('d');
  d.method();
};
```
The invocation of `require('d')` will happen at runtime and not when the containing module is requested via `require`.
If you want to globally override `d` above, use the `@runtimeGlobal` property:

```javascript
var stubs = {
  'd': {
    method: function(val) {
      console.info('hello world');
    },
    '@runtimeGlobal': true
  }
};
```

This will cause module setup code to be re-excuted just like `@global`, but with the difference that it will happen
every time the module is requested via `require` at runtime as no module will ever be cached.

This can cause subtle bugs so if you can guarantee that your modules will not vary their `require` behaviour at runtime,
use `@global` instead.

## Configuring proxyquire by setting stub properties

Even if you want to override a module that exports a function directly, you can still set special properties like `@global`. You can use a named function or assign your stub function to a variable to add properties:

```js
foo['@global'] = true;
function foo () {}
proxyquire('./bar', {
  foo: foo
});
```

And if your stub is in a separate module where `module.exports = foo`:

```js
var foostub = require('../stubs/foostub');
foostub['@global'] = true;
proxyquire('bar', {
  foo: foostub
});
```

# Backwards Compatibility for proxyquire v0.3.x

Compatibility mode with proxyquire v0.3.x **has been removed**.

You should update your code to use the newer API but if you can't, pin the version of proxyquire in your package.json file to ~0.6 in order to continue using the older style.

# Examples

**We are testing foo which depends on bar:**

```javascript
// bar.js module
module.exports = {
    toAtm: function (val) { return  0.986923267 * val; }
};

// foo.js module
// requires bar which we will stub out in tests
var bar = require('./bar');
[ ... ]

```

**Tests:**

```javascript
// foo-test.js module which is one folder below foo.js (e.g., in ./tests/)

/*
 *   Option a) Resolve and override in one step:
 */
var foo = proxyquire('../foo', {
  './bar': { toAtm: function (val) { return 0; /* wonder what happens now */ } }
});

// [ .. run some tests .. ]

/*
 *   Option b) Resolve with empty stub and add overrides later
 */
var barStub = { };

var foo =  proxyquire('../foo', { './bar': barStub });

// Add override
barStub.toAtm = function (val) { return 0; /* wonder what happens now */ };

[ .. run some tests .. ]

// Change override
barStub.toAtm = function (val) { return -1 * val; /* or now */ };

[ .. run some tests .. ]

// Resolve foo and override multiple of its dependencies in one step - oh my!
var foo = proxyquire('./foo', {
    './bar' : {
      toAtm: function (val) { return 0; /* wonder what happens now */ }
    }
  , path    : {
      extname: function (file) { return 'exterminate the name of ' + file; }
    }
});
```

# More Examples

For more examples look inside the [examples folder](https://github.com/thlorenz/proxyquire/tree/master/examples/) or
look through the [tests](https://github.com/thlorenz/proxyquire/blob/master/test/proxyquire.js)

**Specific Examples:**

- test async APIs synchronously: [examples/async](https://github.com/thlorenz/proxyquire/tree/master/examples/async).
- using proxyquire with [Sinon.JS](http://sinonjs.org/): [examples/sinon](https://github.com/thlorenz/proxyquire/tree/master/examples/sinon).
