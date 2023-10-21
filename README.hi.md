<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### मॉडर्निज़र एक जावास्क्रिप्ट लाइब्रेरी है जो उपयोगकर्ता के ब्राउज़र में HTML5 और CSS3 सुविधाओं का पता लगाती है।
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- इस फ़ाइल को पुर्तगाली-बीआर में पढ़ें [here](/README.pt_br.md)
- इस फ़ाइल को इंडोनेशियाई में पढ़ें [here](/README.id.md)
- इस फ़ाइल को स्पैनिश में पढ़ें [here](/README.sp.md)
- इस फ़ाइल को स्वीडिश में पढ़ें [here](/README.sv.md)
- इस फ़ाइल को तमिल में पढ़ें [here](/README.ta.md)
- इस फ़ाइल को कन्नड़ में पढ़ें [here](/README.ka.md)
- इस फ़ाइल को हिन्दी भाषा में पढ़ें [here](/README.hi.md)

- हमारी वेबसाइट पुरानी और टूटी हुई है, कृपया इसका उपयोग न करें (https://modernizr.com) बल्कि एनपीएम से अपना मॉडर्निज़र संस्करण बनाएं।
- [दस्तावेज़ीकरण](https://modernizr.com/docs/)
- [एकीकरण परीक्षण](https://modernizr.github.io/Modernizr/test/integration.html)
- [इकाई परीक्षण](https://modernizr.github.io/Modernizr/test/unit.html)

मॉडर्निज़र परीक्षण करता है कि वर्तमान यूए में कौन सी मूल CSS3 और HTML5 सुविधाएँ उपलब्ध हैं और परिणाम आपको दो तरीकों से उपलब्ध कराता है: वैश्विक `मॉडर्निज़र` ऑब्जेक्ट पर गुणों के रूप में, और `<html>` तत्व पर कक्षाओं के रूप में। यह जानकारी आपको अनुभव पर विस्तृत नियंत्रण के साथ अपने पृष्ठों को उत्तरोत्तर बढ़ाने की अनुमति देती है।

## V4 के साथ परिवर्तन तोड़ना

- नोड संस्करण <= 10 के लिए समर्थन हटा दिया गया है, कृपया कम से कम संस्करण 12 में अपग्रेड करें

- निम्नलिखित परीक्षणों का नाम बदल दिया गया:

  - बाकी ईएस-टेस्ट के अनुरूप रखने के लिए `class` से `es6 class`

- निम्नलिखित परीक्षण उपनिर्देशिकाओं में स्थानांतरित हो गए:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` storage subdirectory में ले जाया गया
  - `audio` ऑडियो उपनिर्देशिका में ले जाया गया
  - `battery` moved into the battery subdirectory
  - `canvas`, `canvastext` बैटरी उपनिर्देशिका में ले जाया गया
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` Event subdirectory में शामिल किया गया
  - `exiforientation` छवि उपनिर्देशिका में ले जाया गया
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` इनपुट उपनिर्देशिका में ले जाया गया
  - `svg` svg उपनिर्देशिका में ले जाया गया
  - `webgl` webgl उपनिर्देशिका में ले जाया गया

- निम्नलिखित परीक्षण हटा दिए गए:

  - `touchevents`: [discussion](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [discussion](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: es6 डिटेक्ट का डुप्लिकेट `stringtemplate`
  - `contains`: es6 डिटेक्ट का डुप्लिकेट `es6string`
  - `datalistelem`: Modernizr.input.list का एक डुप्लिकेट

## नए Asynchronous Event Listeners

अक्सर लोग जानना चाहते हैं कि एसिंक्रोनस परीक्षण कब किया जाता है ताकि वे अपने एप्लिकेशन को इस पर प्रतिक्रिया करने की अनुमति दे सकें।
अतीत में, आपको संपत्तियों या `<html>` कक्षाओं को देखने पर निर्भर रहना पड़ता था। केवल **एसिंक्रोनस** परीक्षणों पर घटनाएँ हैं
का समर्थन किया। गति में सुधार और निरंतरता बनाए रखने के लिए सिंक्रोनस परीक्षणों को समकालिक रूप से नियंत्रित किया जाना चाहिए।

नया API इस तरह दिखता है:

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

हम गारंटी देते हैं कि हम आपके फ़ंक्शन को केवल एक बार (प्रत्येक बार जब आप `ऑन` कॉल करते हैं) शुरू करेंगे। फिलहाल हम खुलासा नहीं कर रहे हैं
`ट्रिगर` कार्यक्षमता को उजागर करने की एक विधि। इसके बजाय, यदि आप एसिंक परीक्षणों पर नियंत्रण रखना चाहते हैं, तो इसका उपयोग करें
`src/addTest` सुविधा, और आपके द्वारा सेट किया गया कोई भी परीक्षण स्वचालित रूप से `on` कार्यक्षमता को उजागर और ट्रिगर करेगा।

## शुरू करना

- रिपॉजिटरी को क्लोन करें या डाउनलोड करें
- `npm install` के साथ प्रोजेक्ट निर्भरताएँ स्थापित करें

## मॉडर्निज़र का निर्माण

### जावास्क्रिप्ट से

Modernizr can be used programmatically via npm:

```js
var modernizr = require("modernizr");
```

A `build` method is exposed for generating custom Modernizr builds. Example:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // the build
});
```

पहला पैरामीटर शामिल करने के लिए विकल्पों और फ़ीचर-डिटेक्ट्स का JSON ऑब्जेक्ट लेता है। सभी उपलब्ध विकल्पों के लिए [`lib/config-all.json`](lib/config-all.json) देखें।

दूसरा पैरामीटर कार्य पूरा होने पर लागू किया जाने वाला एक फ़ंक्शन है।

### कमांड-लाइन से

हम modernizr के निर्माण के लिए एक कमांड लाइन इंटरफ़ेस भी प्रदान करते हैं।
सभी उपलब्ध विकल्प देखने के लिए चलाएँ:

```shell
./bin/modernizr
```

या 'config-all.json' में सब कुछ उत्पन्न करने के लिए इसे npm के साथ चलाएँ:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## मॉडर्नाइज़र का परीक्षण

कंसोल रन पर मोचा-हेडलेस-क्रोम का उपयोग करके परीक्षण निष्पादित करने के लिए:

```shell
npm test
```

आप इस कमांड से अपनी पसंद के ब्राउज़र में भी परीक्षण चला सकते हैं:

```shell
npm run serve-gh-pages
```

और इन दो यूआरएल पर नेविगेट करना:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## आचार संहिता

यह प्रोजेक्ट [खुली आचार संहिता](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md) का पालन करता है।
भाग लेकर आपसे इस संहिता का सम्मान करने की अपेक्षा की जाती है।

## लाइसेंस

[MIT License](https://opensource.org/licenses/MIT)
