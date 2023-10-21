<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### ಮಾಡ್ರನ್ ನೈಜರ್  ಎಂಬುದು ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್  ಲೈಬ್ರರಿಯಾಗಿದ್ದು ಅದು ಬಳಕೆದಾರರ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಹೆಚ್ ಟಿಮೆಲ್5  ಮತ್ತು ಸಿಸ್ ಸ್ 3 ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ.
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- ಈ ಫೈಲ್ ಅನ್ನು ಪೋರ್ಚುಗೀಸ್-BR ನಲ್ಲಿ ಓದಿ [here](/README.pt_br.md)
- ಈ ಫೈಲ್ ಅನ್ನು ಇಂಡೋನೇಷಿಯನ್ ಭಾಷೆಯಲ್ಲಿ ಓದಿ [here](/README.id.md)
- ಈ ಫೈಲ್ ಅನ್ನು ಸ್ಪ್ಯಾನಿಷ್ ಭಾಷೆಯಲ್ಲಿ ಓದಿ [here](/README.sp.md)
- ಈ ಫೈಲ್ ಅನ್ನು ಸ್ವೀಡಿಷ್ ಭಾಷೆಯಲ್ಲಿ [here](/README.sv.md)
- ಈ ಫೈಲ್ ಅನ್ನು ತಮಿಳಿನಲ್ಲಿ ಓದಿ [here](/README.ta.md)
- ಈ ಫೈಲ್ ಅನ್ನು ಕನ್ನಡದಲ್ಲಿ ಓದಿ [here](/README.ka.md)
- ಈ ಫೈಲ್ ಅನ್ನು ಹಿಂದಿಯಲ್ಲಿ ಓದಿ [here](/README.hi.md)

- ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಹಳೆಯದಾಗಿದೆ ಮತ್ತು ಮುರಿದುಹೋಗಿದೆ, ದಯವಿಟ್ಟು ಅದನ್ನು ಬಳಸಬೇಡಿ (https://modernizr.com) ಬದಲಿಗೆ npm ನಿಂದ ನಿಮ್ಮ modernizr ಆವೃತ್ತಿಯನ್ನು ನಿರ್ಮಿಸಿ.

- [Documentation](https://modernizr.com/docs/)
- [Integration tests](https://modernizr.github.io/Modernizr/test/integration.html)
- [Unit tests](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr ಪ್ರಸ್ತುತ UA ಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಸ್ಥಳೀಯ CSS3 ಮತ್ತು HTML5 ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ ಮತ್ತು ಫಲಿತಾಂಶಗಳನ್ನು ನಿಮಗೆ ಎರಡು ರೀತಿಯಲ್ಲಿ ಲಭ್ಯವಾಗುವಂತೆ ಮಾಡುತ್ತದೆ: ಜಾಗತಿಕ `Modernizr` ವಸ್ತುವಿನ ಗುಣಲಕ್ಷಣಗಳಾಗಿ ಮತ್ತು `<html>` ಅಂಶದ ಮೇಲೆ ವರ್ಗಗಳಾಗಿವೇ . ಅನುಭವದ ಮೇಲೆ ಹರಳಿನ ಮಟ್ಟದ ನಿಯಂತ್ರಣದೊಂದಿಗೆ ನಿಮ್ಮ ಪುಟಗಳನ್ನು ಹಂತಹಂತವಾಗಿ ವರ್ಧಿಸಲು ಈ ಮಾಹಿತಿಯು ನಿಮಗೆ ಅನುಮತಿಸುತ್ತದೆ.

## Breaking changes with v4

- ನೋಡ್ ಆವೃತ್ತಿಗಳಿಗೆ ಬೆಂಬಲವನ್ನು ಕೈಬಿಡಲಾಗಿದೆ <= 10, ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಆವೃತ್ತಿ 12 ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ

- ಕೆಳಗಿನ ಪರೀಕ್ಷೆಗಳನ್ನು ಮರುಹೆಸರಿಸಲಾಗಿದೆ:

  - ಉಳಿದ ಈಸ್-ಟೆಸ್ಟ್‌ಗಳಿಗೆ ಅನುಗುಣವಾಗಿರಲು 'ಕ್ಲಾಸ್' ದಿಂದ ಈಸ್ ೬ಕ್ಲಾಸ್

- ಕೆಳಗಿನ ಪರೀಕ್ಷೆಗಳನ್ನು ಉಪ ಡೈರೆಕ್ಟರಿಗಳಲ್ಲಿ ಸ್ಥಳಾಂತರಿಸಲಾಗಿದೆ:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` **ಸ್ಟೋರೇಜ್** ಸಬ್ ಫೋಲ್ಡರ್ ಸೇರಿಸಲಾಗಿದೆ.
  - `audio` **ಆಡಿಯೊ** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `battery` **ಬ್ಯಾಟರಿ** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `canvas`, `canvastext` **ಕ್ಯಾನ್ವಾಸ್** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` **ಇವೆಂಟ್** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `exiforientation` **ಇಮೇಜ್** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` **ಇನ್ ಪುಟ್** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `svg` **ಸ್ ವಿಜಿ** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ
  - `webgl` **ವೆಬ್ ಜಿಲ್** ಸಬ್ ಫೋಲ್ಡರ್ ಗೆ ಸರಿಸಲಾಗಿದೆ

- ಕೆಳಗಿನ ಪರೀಕ್ಷೆಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ:

  - `touchevents`: [discussion](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [discussion](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: es6 ನ ನಕಲು `stringtemplate` ಪತ್ತೆ
  - `contains`: es6 ನ ನಕಲು `es6string` ಪತ್ತೆ
  - `datalistelem`: Modernizr.input.list ನ ಡ್ಯೂಪ್

## New Asynchronous Event Listeners

ಆಗಾಗ್ಗೆ ಜನರು ಅಸಮಕಾಲಿಕ ಪರೀಕ್ಷೆಯನ್ನು ಮಾಡಿದಾಗ ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತಾರೆ ಆದ್ದರಿಂದ ಅವರು ತಮ್ಮ ಅಪ್ಲಿಕೇಶನ್‌ಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಲು ಅನುಮತಿಸಬಹುದು.
ಹಿಂದೆ, ನೀವು ಗುಣಲಕ್ಷಣಗಳನ್ನು ಅಥವಾ `<html>` ಕ್ಲಾಸ್ ಗಳನ್ನೂ ವೀಕ್ಷಿಸಲು ಅವಲಂಬಿಸಬೇಕಾಗಿತ್ತು. **ಅಸಿಂಕ್ರೊನಸ್** ಟೆಸ್ಟ್ ಗಳಲ್ಲಿನ ಈವೆಂಟ್‌ಗಳು ಮಾತ್ರ
ಬೆಂಬಲಿಸಿದರು. ವೇಗವನ್ನು ಸುಧಾರಿಸಲು ಮತ್ತು ಸ್ಥಿರತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಸಿಂಕ್ರೊನಸ್ ಪರೀಕ್ಷೆಗಳನ್ನು ಸಿಂಕ್ರೊನಸ್ ಆಗಿ ನಿರ್ವಹಿಸಬೇಕು.

ಹೊಸ API ಈ ರೀತಿ ಕಾಣುತ್ತದೆ:

```js
// Listen to a test, give it a callback
Modernizr.on("testname", function (result) {
  if (result) {
    console.log("The test passed!");
  } else {
    console.log("The test failed!");
  }
});
```

ನಾವು ನಿಮ್ಮ ಕಾರ್ಯವನ್ನು ಒಮ್ಮೆ ಮಾತ್ರ ಆಹ್ವಾನಿಸುತ್ತೇವೆ ಎಂದು ನಾವು ಖಾತರಿಪಡಿಸುತ್ತೇವೆ (ನೀವು `ಆನ್` ಎಂದು ಕರೆಯುವ ಪ್ರತಿ ಬಾರಿ). ನಾವು ಪ್ರಸ್ತುತ ಬಹಿರಂಗಪಡಿಸುತ್ತಿಲ್ಲ
`ಟ್ರಿಗರ್' ಕಾರ್ಯವನ್ನು ಬಹಿರಂಗಪಡಿಸುವ ವಿಧಾನ. ಬದಲಿಗೆ, ನೀವು ಅಸಿಂಕ್ ಪರೀಕ್ಷೆಗಳ ಮೇಲೆ ನಿಯಂತ್ರಣವನ್ನು ಹೊಂದಲು ಬಯಸಿದರೆ, ಬಳಸಿ
`src/addTest`ವೈಶಿಷ್ಟ್ಯ, ಮತ್ತು ನೀವು ಹೊಂದಿಸುವ ಯಾವುದೇ ಪರೀಕ್ಷೆಯು ಸ್ವಯಂಚಾಲಿತವಾಗಿ`ಆನ್` ಕಾರ್ಯವನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತದೆ ಮತ್ತು ಪ್ರಚೋದಿಸುತ್ತದೆ.

## Getting Started

- ರೆಪೊಸಿಟರಿಯನ್ನು ಕ್ಲೋನ್ ಮಾಡಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ
- `npm install` ನೊಂದಿಗೆ ಪ್ರಾಜೆಕ್ಟ್ ಅವಲಂಬನೆಗಳನ್ನು ಸ್ಥಾಪಿಸಿ

## Building Modernizr

### From javascript

Modernizr ಅನ್ನು npm ಮೂಲಕ ಪ್ರೋಗ್ರಾಮಿಕ್ ಆಗಿ ಬಳಸಬಹುದು:

```js
var modernizr = require("modernizr");
```

ಕಸ್ಟಮ್ ಮಾಡರ್ನಿಜರ್ ಬಿಲ್ಡ್‌ಗಳನ್ನು ಉತ್ಪಾದಿಸಲು `ಬಿಲ್ಡ್` ವಿಧಾನವನ್ನು ಬಹಿರಂಗಪಡಿಸಲಾಗಿದೆ. ಉದಾಹರಣೆ:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // the build
});
```

ಮೊದಲ ಪ್ಯಾರಾಮೀಟರ್ JSON ಆಯ್ಕೆಗಳ ಆಬ್ಜೆಕ್ಟ್ ಅನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ ಮತ್ತು ಸೇರಿಸಲು ವೈಶಿಷ್ಟ್ಯ-ಪತ್ತೆಹಚ್ಚುತ್ತದೆ. ಲಭ್ಯವಿರುವ ಎಲ್ಲಾ ಆಯ್ಕೆಗಳಿಗಾಗಿ [`lib/config-all.json`](lib/config-all.json) ನೋಡಿ.

ಎರಡನೇ ಪ್ಯಾರಾಮೀಟರ್ ಕಾರ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ ಮೇಲೆ ಕಾರ್ಯವನ್ನು ಹೊಂದಿದೆ.

### From the command-line

ಮೊವೆರ್ನೈಜ್ರ್ ನಿರ್ಮಿಸಲು ನಾವು ಆಜ್ಞಾ ಸಾಲಿನ ಇಂಟರ್ಫೇಸ್ ಅನ್ನು ಸಹ ಒದಗಿಸುತ್ತೇವೆ.
ಲಭ್ಯವಿರುವ ಎಲ್ಲಾ ಆಯ್ಕೆಗಳನ್ನು ನೋಡಲು ರನ್ ಮಾಡಿ:

```shell
./bin/modernizr
```

Or 'config-all.json' ನಲ್ಲಿ ಎಲ್ಲವನ್ನೂ ಉತ್ಪಾದಿಸಲು ಇದನ್ನು npm ನೊಂದಿಗೆ ರನ್ ಮಾಡಿ:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testing Modernizr

ಕನ್ಸೋಲ್ ರನ್‌ನಲ್ಲಿ ಮೋಚಾ-ಹೆಡ್‌ಲೆಸ್-ಕ್ರೋಮ್ ಬಳಸಿ ಪರೀಕ್ಷೆಗಳನ್ನು ಕಾರ್ಯಗತಗೊಳಿಸಲು:

```shell
npm test
```

ನೀವು ಕೂಡ ಟೆಸ್ಟ್ ಮಾಡ್ಬಹೌದು ಬ್ರೌಸರ್ ನಲ್ಲಿ ಈ ಕಮ್ಮಂಡ್ ದಿಂದ:

```shell
npm run serve-gh-pages
```

ಮತ್ತು ಈ ಎರಡು URL ಗಳಿಗೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Code of Conduct

This project adheres to the [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md).
ಭಾಗವಹಿಸುವ ಮೂಲಕ, ನೀವು ಈ ಕೋಡ್ ಅನ್ನು ಗೌರವಿಸುವ ನಿರೀಕ್ಷೆಯಿದೆ.

## License

[MIT License](https://opensource.org/licenses/MIT)
