<p align="center">
    <img src="https://raw.githubusercontent.com/faisalman/ua-parser-js/gh-pages/images/logo.png" width="256" height="256"> 
</p>

<p align="center">
<a href="https://travis-ci.org/faisalman/ua-parser-js"><img src="https://travis-ci.org/faisalman/ua-parser-js.svg?branch=master"></a>
<a href="https://www.npmjs.com/package/ua-parser-js"><img src="https://img.shields.io/npm/v/ua-parser-js.svg"></a>
<a href="https://www.npmjs.com/package/ua-parser-js"><img src="https://img.shields.io/npm/dw/ua-parser-js.svg"></a>
<a href="https://www.jsdelivr.com/package/npm/ua-parser-js"><img src="https://data.jsdelivr.com/v1/package/npm/ua-parser-js/badge"></a>
<a href="https://cdnjs.com/libraries/UAParser.js"><img src="https://img.shields.io/cdnjs/v/UAParser.js.svg"></a>
</p>

# UAParser.js

JavaScript library to detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data with relatively small footprint (~17KB minified, ~6KB gzipped) that can be used either in browser (client-side) or node.js (server-side).

* Author    : Faisal Salman <<f@faisalman.com>>
* Demo      : https://faisalman.github.io/ua-parser-js
* Source    : https://github.com/faisalman/ua-parser-js

# Documentation

## Constructor

* `new UAParser([uastring][,extensions])`
    * returns new instance

* `UAParser([uastring][,extensions])`
    * returns result object `{ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} }`

## Methods

* `getBrowser()`
    * returns `{ name: '', version: '' }`

```sh
# Possible 'browser.name':
2345Explorer, 360 Browser, Amaya, Android Browser, Arora, Avant, Avast, AVG,
BIDUBrowser, Baidu, Basilisk, Blazer, Bolt, Brave, Bowser, Camino, Chimera,
Chrome Headless, Chrome WebView, Chrome, Chromium, Comodo Dragon, Dillo,
Dolphin, Doris, Edge, Electron, Epiphany, Facebook, Falkon, Fennec, Firebird,
Firefox [Reality], Flock, Flow, GSA, GoBrowser, ICE Browser, IE, IEMobile, IceApe, 
IceCat, IceDragon, Iceweasel, Instagram, Iridium, Iron, Jasmine, K-Meleon,
Kindle, Klar, Konqueror, LBBROWSER, Line, Links, Lunascape, Lynx, MIUI Browser,
Maemo Browser, Maemo, Maxthon, MetaSr Midori, Minimo, Mobile Safari, Mosaic,
Mozilla, NetFront, NetSurf, Netfront, Netscape, NokiaBrowser, Obigo, Oculus Browser,
OmniWeb, Opera Coast, Opera [Mini/Mobi/Tablet], PaleMoon, PhantomJS, Phoenix, 
Polaris, Puffin, QQ, QQBrowser, QQBrowserLite, Quark, QupZilla, RockMelt, Safari, 
Sailfish Browser, Samsung Browser, SeaMonkey, Silk, Skyfire, Sleipnir, Slim, 
SlimBrowser, Swiftfox, Tesla, Tizen Browser, UCBrowser, UP.Browser, Vivaldi, 
Waterfox, WeChat, Weibo, Yandex, baidu, iCab, w3m, Whale Browser...

# 'browser.version' determined dynamically
```

* `getDevice()`
    * returns `{ model: '', type: '', vendor: '' }`

```sh
# Possible 'device.type':
console, mobile, tablet, smarttv, wearable, embedded

# Possible 'device.vendor':
Acer, Alcatel, Amazon, Apple, Archos, ASUS, AT&T, BenQ, BlackBerry, Dell,
Essential, Fairphone, GeeksPhone, Google, HP, HTC, Huawei, Jolla, Lenovo, LG, 
Meizu, Microsoft, Motorola, Nexian, Nintendo, Nokia, Nvidia, OnePlus, OPPO, Ouya,
Palm, Panasonic, Pebble, Polytron, Realme, RIM, Roku, Samsung, Sharp, Siemens,
Sony[Ericsson], Sprint, Tesla, Vivo, Vodafone, Xbox, Xiaomi, Zebra, ZTE, ...

# 'device.model' determined dynamically
```

* `getEngine()`
    * returns `{ name: '', version: '' }`

```sh
# Possible 'engine.name'
Amaya, Blink, EdgeHTML, Flow, Gecko, Goanna, iCab, KHTML, Links, Lynx, NetFront,
NetSurf, Presto, Tasman, Trident, w3m, WebKit

# 'engine.version' determined dynamically
```

* `getOS()`
    * returns `{ name: '', version: '' }`

```sh
# Possible 'os.name'
AIX, Amiga OS, Android[-x86], Arch, Bada, BeOS, BlackBerry, CentOS, Chromium OS,
Contiki, Fedora, Firefox OS, FreeBSD, Debian, Deepin, DragonFly, elementary OS, 
Fuchsia, Gentoo, GhostBSD, GNU, Haiku, HP-UX, Hurd, iOS, Joli, KaiOS, Linpus, Linspire,
Linux, Mac OS, Maemo, Mageia, Mandriva, Manjaro, MeeGo, Minix, Mint, Morph OS, NetBSD,
Nintendo, OpenBSD, OpenVMS, OS/2, Palm, PC-BSD, PCLinuxOS, Plan9, PlayStation, QNX, 
Raspbian, RedHat, RIM Tablet OS, RISC OS, Sabayon, Sailfish, Series40, Slackware, Solaris, 
SUSE, Symbian, Tizen, Ubuntu, Unix, VectorLinux, WebOS, Windows [Phone/Mobile], Zenwalk, ...

# 'os.version' determined dynamically
```

* `getCPU()`
    * returns `{ architecture: '' }`

```sh
# Possible 'cpu.architecture'
68k, amd64, arm[64/hf], avr, ia[32/64], irix[64], mips[64], pa-risc, ppc, sparc[64]
```

* `getResult()`
    * returns `{ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} }`

* `getUA()`
    * returns UA string of current instance

* `setUA(uastring)`
    * set UA string to be parsed
    * returns current instance

# Usage

## Using HTML

```html
<!doctype html>
<html>
<head>
<script src="ua-parser.min.js"></script>
<script>

    var parser = new UAParser();
    console.log(parser.getResult());
    /*
        /// This will print an object structured like this:
        {
            ua: "",
            browser: {
                name: "",
                version: "",
                major: "" //@deprecated
            },
            engine: {
                name: "",
                version: ""
            },
            os: {
                name: "",
                version: ""
            },
            device: {
                model: "",
                type: "",
                vendor: ""
            },
            cpu: {
                architecture: ""
            }
        }
    */
    // Default result depends on current window.navigator.userAgent value

    // Now let's try a custom user-agent string as an example
    var uastring1 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.2 (KHTML, like Gecko) Ubuntu/11.10 Chromium/15.0.874.106 Chrome/15.0.874.106 Safari/535.2";
    parser.setUA(uastring1);
    var result = parser.getResult();
    // You can also use UAParser constructor directly without having to create an instance:
    // var result = UAParser(uastring1);

    console.log(result.browser);        // {name: "Chromium", version: "15.0.874.106"}
    console.log(result.device);         // {model: undefined, type: undefined, vendor: undefined}
    console.log(result.os);             // {name: "Ubuntu", version: "11.10"}
    console.log(result.os.version);     // "11.10"
    console.log(result.engine.name);    // "WebKit"
    console.log(result.cpu.architecture);   // "amd64"

    // Do some other tests
    var uastring2 = "Mozilla/5.0 (compatible; Konqueror/4.1; OpenBSD) KHTML/4.1.4 (like Gecko)";
    console.log(parser.setUA(uastring2).getBrowser().name); // "Konqueror"
    console.log(parser.getOS());                            // {name: "OpenBSD", version: undefined}
    console.log(parser.getEngine());                        // {name: "KHTML", version: "4.1.4"}

    var uastring3 = 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.11 (KHTML, like Gecko) Version/7.1.0.7 Safari/534.11';
    console.log(parser.setUA(uastring3).getDevice().model); // "PlayBook"
    console.log(parser.getOS())                             // {name: "RIM Tablet OS", version: "1.0.0"}
    console.log(parser.getBrowser().name);                  // "Safari"

</script>
</head>
<body>
</body>
</html>
```

## Using node.js

```sh
$ npm install ua-parser-js
```

```js
var http = require('http');
var parser = require('ua-parser-js');

http.createServer(function (req, res) {
    // get user-agent header
    var ua = parser(req.headers['user-agent']);
    // write the result as response
    res.end(JSON.stringify(ua, null, '  '));
})
.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

## Using TypeScript

```sh
$ npm install --save @types/ua-parser-js
# Download TS type definition from DefinitelyTyped repository:
# https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ua-parser-js
```

## Using jQuery/Zepto ($.ua)

Although written in vanilla js, this library will automatically detect if jQuery/Zepto is present and create `$.ua` object (with values based on its User-Agent) along with `window.UAParser` constructor. To get/set user-agent you can use: `$.ua.get()` / `$.ua.set(uastring)`.

```js
// Say we are in a browser with default user-agent: 'Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Sprint APA7373KT Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0':

// Get the details
console.log($.ua.device);           // {vendor: "HTC", model: "Evo Shift 4G", type: "mobile"}
console.log($.ua.os);               // {name: "Android", version: "2.3.4"}
console.log($.ua.os.name);          // "Android"
console.log($.ua.get());            // "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Sprint APA7373KT Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0"

// Now lets try to reset to another custom user-agent
$.ua.set('Mozilla/5.0 (Linux; U; Android 3.0.1; en-us; Xoom Build/HWI69) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13');

// Test again
console.log($.ua.browser.name);     // "Safari"
console.log($.ua.engine.name);      // "Webkit"
console.log($.ua.device);           // {vendor: "Motorola", model: "Xoom", type: "tablet"}
console.log(parseInt($.ua.browser.version.split('.')[0], 10));  // 4

// Add class to <body> tag
// <body class="ua-browser-safari ua-devicetype-tablet">
$('body').addClass('ua-browser-' + $.ua.browser.name + ' ua-devicetype-' + $.ua.device.type);
```

## Using Extension

* `UAParser([uastring,] extensions)`

```js
// Example:
var myOwnListOfBrowsers = [
    [/(mybrowser)\/([\w\.]+)/i], [UAParser.BROWSER.NAME, UAParser.BROWSER.VERSION]
];
var myParser = new UAParser({ browser: myOwnListOfBrowsers });
var myUA = 'Mozilla/5.0 MyBrowser/1.3';
console.log(myParser.setUA(myUA).getBrowser());  // {name: "MyBrowser", version: "1.3"}
```

# Development

## Sponsors

<a href="https://opencollective.com/ua-parser-js"><img src="https://opencollective.com/ua-parser-js/tiers/backers.svg?avatarHeight=64" height="80"/></a> <a href="https://opencollective.com/ua-parser-js"><img src="https://opencollective.com/ua-parser-js/tiers/sponsors.svg?avatarHeight=64" height="80"/></a>

<a href="https://www.paypal.me/faisalman/"><img src="https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg" height="40"></a>

## Contributors

<a href="https://github.com/faisalman/ua-parser-js/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=faisalman/ua-parser-js" />
</a>

Made with [contributors-img](https://contrib.rocks).

## How To Contribute

* Fork and clone this repository
* Make some changes as required
* Write unit test to showcase its functionality
* Run the test suites to make sure it's not breaking anything `$ npm test`
* Submit a pull request under `develop` branch

# License

MIT License

Copyright (c) 2012-2021 Faisal Salman <<f@faisalman.com>>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
