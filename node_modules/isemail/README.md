isemail
=======

Node email address validation library

[![Build Status](https://travis-ci.org/hapijs/isemail.png)](https://travis-ci.org/hapijs/isemail)
[![Coverage Status](https://coveralls.io/repos/hapijs/isemail/badge.png?branch=master)](https://coveralls.io/r/hapijs/isemail?branch=master)

Lead Maintainer: [Eli Skeggs](https://github.com/skeggse)

This first version of `isemail` is a port of the PHP `is_email` function by Dominic Sayers.

Install
-------

```sh
$ npm install isemail
```

Test
----

The tests were pulled from is_email's extensive [test suite][tests] on October 15, 2013. Many thanks to the contributors! Additional tests have been added to increase code coverage and verify edge-cases.

Run any of the following.

```sh
$ lab
$ npm test
$ make test
```

_remember to_ `npm install`!

API
---

### isEmail(email, [options], [callback])

Determines whether the `email` is valid or not, for various definitions thereof. Optionally accepts an `options` object and a `callback` function. Options may include `errorLevel` and `checkDNS`. The `callback` function will always be called if specified, and the result of the operation supplied as the only parameter to the callback function. If `isEmail` is not asked to check for the existence of the domain (`checkDNS`), it will also synchronously return the result of the operation.

Use `errorLevel` to specify the type of result for `isEmail`. Passing a `false` literal will result in a true or false boolean indicating whether the email address is sufficiently defined for use in sending an email. Passing a `true` literal will result in a more granular numeric status, with zero being a perfectly valid email address. Passing a number will return `0` if the numeric status is below the `errorLevel` and the numeric status otherwise.

The `tldWhitelist` option can be either an object lookup table or an array of valid top-level domains. If the email address has a top-level domain that is not in the whitelist, the email will be marked as invalid.

The `minDomainAtoms` option is an optional positive integer that specifies the minimum number of domain atoms that must be included for the email address to be considered valid. Be careful with the option, as some top-level domains, like `io`, directly support email addresses. To better handle fringe cases like the `io` TLD, use the `checkDNS` parameter, which will only allow email addresses for domains which have an MX record.

#### Examples

```js
$ node
> var isEmail = require('isemail');
undefined
> var log = console.log.bind(console, 'result');
undefined
> isEmail('test@iana.org');
true
> isEmail('test@iana.org', log);
result true
true
> isEmail('test@iana.org', {checkDNS: true});
undefined
> isEmail('test@iana.org', {checkDNS: true}, log);
undefined
result true
> isEmail('test@iana.org', {errorLevel: true});
0
> isEmail('test@iana.org', {errorLevel: true}, log);
result 0
0
> isEmail('test@e.com');
true
> isEmail('test@e.com', {checkDNS: true, errorLevel: true}, log);
undefined
result 6
> isEmail('test@e.com', {checkDNS: true, errorLevel: 7}, log);
undefined
result 0
> isEmail('test@e.com', {checkDNS: true, errorLevel: 6}, log);
undefined
result 6
```

TODO
====

Add tests for library usage, not just functionality comparisons.
Future versions will improve upon the current version, optimizing it for efficient usage and DRYing the code.

License
=======

[BSD License](http://www.opensource.org/licenses/bsd-license.php)

[tests]: http://isemail.info/_system/is_email/test/?all‎ "is_email test suite"
