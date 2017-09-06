Version history
===============

### 3.3.6 (2016-09-16) ###
* We were not appropriately sending HPACK context updates when receiving SETTINGS_HEADER_TABLE_SIZE. This release fixes that bug.

### 3.3.5 (2016-09-06) ###
* Fix issues with large DATA frames (https://github.com/molnarg/node-http2/issues/207)

### 3.3.4 (2016-04-22) ###
* More PR bugfixes (https://github.com/molnarg/node-http2/issues?q=milestone%3Av3.3.4)

### 3.3.3 (2016-04-21) ###

* Bugfixes from pull requests (https://github.com/molnarg/node-http2/search?q=milestone%3Av3.3.3&type=Issues&utf8=%E2%9C%93)

### 3.3.2 (2016-01-11) ###

* Fix an incompatibility with Firefox (issue 167)

### 3.3.1 (2016-01-11) ###

* Fix some DoS bugs (issues 145, 146, 147, and 148)

### 3.3.0 (2016-01-10) ###

* Bugfix updates from pull requests

### 3.2.0 (2015-02-19) ###

* Update ALPN token to final RFC version (h2).
* Update altsvc implementation to draft 06: [draft-ietf-httpbis-alt-svc-06]

[draft-ietf-httpbis-altsvc-06]: http://tools.ietf.org/html/draft-ietf-httpbis-alt-svc-06

### 3.1.2 (2015-02-17) ###

* Update the example server to have a safe push example.

### 3.1.1 (2015-01-29) ###

* Bugfix release.
* Fixes an issue sending a push promise that is large enough to fill the frame (#93).

### 3.1.0 (2014-12-11) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-16]
 * This involves some state transition changes that are technically incompatible with draft-14. If you need to be assured to interop on -14, continue using 3.0.1

[draft-ietf-httpbis-http2-16]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-16

### 3.0.1 (2014-11-20) ###

* Bugfix release.
* Fixed #81 and #87
* Fixed a bug in flow control (without GitHub issue)

### 3.0.0 (2014-08-25) ###

* Re-join node-http2 and node-http2-protocol into one repository
* API Changes
 * The default versions of createServer, request, and get now enforce TLS-only
 * The raw versions of createServer, request, and get are now under http2.raw instead of http2
 * What was previously in the http2-protocol repository/module is now available under http2.protocol from this repo/module
 * http2-protocol.ImplementedVersion is now http2.protocol.VERSION (the ALPN token)

### 2.7.1 (2014-08-01) ###

* Require protocol 0.14.1 (bugfix release)

### 2.7.0 (2014-07-31) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-14]

[draft-ietf-httpbis-http2-14]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-14

### 2.6.0 (2014-06-18) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-13]

[draft-ietf-httpbis-http2-13]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-13

### 2.5.3 (2014-06-15) ###

* Exposing API to send ALTSVC frames

### 2.5.2 (2014-05-25) ###

* Fix a bug that occurs when the ALPN negotiation is unsuccessful

### 2.5.1 (2014-05-25) ###

* Support for node 0.11.x
* New cipher suite priority list with comformant ciphers on the top (only available in node >=0.11.x)

### 2.5.0 (2014-04-24) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-12]

[draft-ietf-httpbis-http2-12]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-12

### 2.4.0 (2014-04-16) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-11]

[draft-ietf-httpbis-http2-11]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-11

### 2.3.0 (2014-03-12) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-10]

[draft-ietf-httpbis-http2-10]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-10

### 2.2.0 (2013-12-25) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-09]
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-2.2.0.tar.gz)

[draft-ietf-httpbis-http2-09]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-09

### 2.1.1 (2013-12-21) ###

* Minor bugfix
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-2.1.1.tar.gz)

### 2.1.0 (2013-11-10) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-07][draft-07]
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-2.1.0.tar.gz)

[draft-07]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-07

### 2.0.0 (2013-11-09) ###

* Splitting out everything that is not related to negotiating HTTP2 or the node-like HTTP API.
  These live in separate module from now on:
  [http2-protocol](https://github.com/molnarg/node-http2-protocol).
* The only backwards incompatible change: the `Endpoint` class is not exported anymore. Use the
  http2-protocol module if you want to use this low level interface.
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-2.0.0.tar.gz)

### 1.0.1 (2013-10-14) ###

* Support for ALPN if node supports it (currently needs a custom build)
* Fix for a few small issues
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-1.0.1.tar.gz)

### 1.0.0 (2013-09-23) ###

* Exporting Endpoint class
* Support for 'filters' in Endpoint
* The last time-based release
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-1.0.0.tar.gz)

### 0.4.1 (2013-09-15) ###

* Major performance improvements
* Minor improvements to error handling
* [Blog post](http://gabor.molnar.es/blog/2013/09/15/gsoc-week-number-13/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.4.1.tar.gz)

### 0.4.0 (2013-09-09) ###

* Upgrade to the latest draft: [draft-ietf-httpbis-http2-06][draft-06]
* Support for HTTP trailers
* Support for TLS SNI (Server Name Indication)
* Improved stream scheduling algorithm
* [Blog post](http://gabor.molnar.es/blog/2013/09/09/gsoc-week-number-12/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.4.0.tar.gz)

[draft-06]: http://tools.ietf.org/html/draft-ietf-httpbis-http2-06

### 0.3.1 (2013-09-03) ###

* Lot of testing, bugfixes
* [Blog post](http://gabor.molnar.es/blog/2013/09/03/gsoc-week-number-11/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.3.1.tar.gz)

### 0.3.0 (2013-08-27) ###

* Support for prioritization
* Small API compatibility improvements (compatibility with the standard node.js HTTP API)
* Minor push API change
* Ability to pass an external bunyan logger when creating a Server or Agent
* [Blog post](http://gabor.molnar.es/blog/2013/08/27/gsoc-week-number-10/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.3.0.tar.gz)

### 0.2.1 (2013-08-20) ###

* Fixing a flow control bug
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.2.1.tar.gz)

### 0.2.0 (2013-08-19) ###

* Exposing server push in the public API
* Connection pooling when operating as client
* Much better API compatibility with the standard node.js HTTPS module
* Logging improvements
* [Blog post](http://gabor.molnar.es/blog/2013/08/19/gsoc-week-number-9/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.2.0.tar.gz)

### 0.1.1 (2013-08-12) ###

* Lots of bugfixes
* Proper flow control for outgoing frames
* Basic flow control for incoming frames
* [Blog post](http://gabor.molnar.es/blog/2013/08/12/gsoc-week-number-8/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.1.1.tar.gz)

### 0.1.0 (2013-08-06) ###

* First release with public API (similar to the standard node HTTPS module)
* Support for NPN negotiation (no ALPN or Upgrade yet)
* Stream number limitation is in place
* Push streams works but not exposed yet in the public API
* [Blog post](http://gabor.molnar.es/blog/2013/08/05/gsoc-week-number-6-and-number-7/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.1.0.tar.gz)

### 0.0.6 (2013-07-19) ###

* `Connection` and `Endpoint` classes are usable, but not yet ready
* Addition of an exmaple server and client
* Using [istanbul](https://github.com/gotwarlost/istanbul) for measuring code coverage
* [Blog post](http://gabor.molnar.es/blog/2013/07/19/gsoc-week-number-5/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.0.6.tar.gz)

### 0.0.5 (2013-07-14) ###

* `Stream` class is done
* Public API stubs are in place
* [Blog post](http://gabor.molnar.es/blog/2013/07/14/gsoc-week-number-4/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.0.5.tar.gz)

### 0.0.4 (2013-07-08) ###

* Added logging
* Started `Stream` class implementation
* [Blog post](http://gabor.molnar.es/blog/2013/07/08/gsoc-week-number-3/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.0.4.tar.gz)

### 0.0.3 (2013-07-03) ###

* Header compression is ready
* [Blog post](http://gabor.molnar.es/blog/2013/07/03/the-http-slash-2-header-compression-implementation-of-node-http2/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.0.3.tar.gz)

### 0.0.2 (2013-07-01) ###

* Frame serialization and deserialization ready and updated to match the newest spec
* Header compression implementation started
* [Blog post](http://gabor.molnar.es/blog/2013/07/01/gsoc-week-number-2/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.0.2.tar.gz)

### 0.0.1 (2013-06-23) ###

* Frame serialization and deserialization largely done
* [Blog post](http://gabor.molnar.es/blog/2013/06/23/gsoc-week-number-1/)
* [Tarball](https://github.com/molnarg/node-http2/archive/node-http2-0.0.1.tar.gz)
