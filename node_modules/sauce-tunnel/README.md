#sauce-tunnel
[![NPM version](https://badge.fury.io/js/sauce-tunnel.png)](http://badge.fury.io/js/sauce-tunnel)
[![Build Status](https://travis-ci.org/jmreidy/sauce-tunnel.svg)](https://travis-ci.org/jmreidy/sauce-tunnel)

A Node.js wrapper around the Saucelabs tunnel jar.

This code is extracted from
[grunt-saucelabs](https://github.com/axemclion/grunt-saucelabs) by
[axemclion](https://github.com/axemclion), with the grunt-specific parts
removed.

It was extracted into its own module to avoid duplication between
grunt-saucelabs,
[grunt-mocha-webdriver](https://github.com/grunt-mocha-webdriver), and any
future Node module that may need it.

## Usage
Before starting the tunnel, initialize it first

```
var tunnel = new SauceTunnel(SAUCE_USERNAME, SAUCE_ACCESSKEY, tunnelIdentifier, tunneled, extraFlags);
```

1. `SAUCE_USERNAME` and `SAUCE_ACCESSKEY` are the username and the accesskey for saucelabs. They are usually set as environment variables (specially in continuous integration tools like [travis](http://travis-ci.org) )
2. The `tunnelIdentifier` is a unique identifier for the tunnel. It is optional and is automatically generated when not specified. Note that the tunnel identifier may have to be passed in with the browsers object as a desired capability to enable traffic to use the tunnel. More details [here](https://saucelabs.com/docs/additional-config#tunnel-identifier)
3. The `tunneled` attribute is a boolean value to indicate if the tunnel is to be created or not. This value can be set to `false` to mock a tunnel creation if the site tested is publicly accessible. This value is optional and defaults to `true`.
4. The ``extraFlags`` attribute is an array of options flags (see [here](https://saucelabs.com/docs/connect)). Example: ``['--debug', '--direct-domains', 'www.google.com']``. It is optional.

Once the tunnel is initialized, start it with the following command.

```
tunnel.start(function(status){
  // status === true indicates that the tunnel was successfully created.
});
```

The actual webdriver code to run the test cases can be added inside the callback function. Once the webdriver completes its task, you can shut down the tunnel using

```
tunnel.stop(function(){
  // Tunnel was stopped
});
```

## Full Example
To get started easily, here is the code you can copy paste

```
var SauceTunnel = require('sauce-tunnel');
var tunnel = new SauceTunnel(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESSKEY, 'tunnel', true/* ['--verbose'] */);
tunnel.start(function(status){
  if (status === false){
    throw new Error('Something went wrong with the tunnel');
  }
  /** var wd =  ... Work with the web driver**/
  // Once all webdriver work is done
  tunnel.stop(function(){
    // Tunnel destroyed
  });
});
```

## CHANGELOG

### v1.1
- Remove all the logic surrounding tracking open tunnels, killing existing
tunnels, and tunnel timeouts. (#3)

### v2.0
- Move to new release of Sauce connect (version 4).

### v2.0.1
- Fixing bug where sauce connect was not properly exiting

### v2.0.2
- Fixing issue with flaky tunnel creation recognition on Win

### v2.0.3
- Updating Sauce Tunnel 4 binaries (@saadtazi)

### v2.0.4
- Updating to Sauce Connect 4.1

### v2.0.5
- Switch to using `chalk` instead of duck punching String.

### v2.0.6
- Update to SC 4.2

### v2.1.0
- Update to SC 4.3

### v2.1.1
- Update to SC 4.3.5
- Expose kill method for immediate kill of process

### v2.2.0
- Update binaries to SC 4.3.6
- Make tunneled an optional param that defaults to true
- Fix bug in delete tunnel

### v2.2.1
- Add 32bit binary for Linux

### v2.2.2
- Fix race condition from delete tunnel fix in 2.2.0

### v2.2.3
- Update SC binaries to 4.3.7
- Update Chalk to 1.0

### v2.2.4
- Update SC binaries to 4.3.9
