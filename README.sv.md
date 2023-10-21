<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### Modernizr är ett JavaScript-bibliotek som upptäcker HTML5- och CSS3-funktioner i användarens webbläsare.
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- Läs filen på Portugugisiska-BR [här](/README.pt_br.md)
- Läs filen på indonesiska [här](/README.id.md)
- Läs filen på spanska [här](/README.sp.md)
- Läs filen i kannada [här](/README.ka.md)
- Läs filen på hindi [here](/README.hi.md)

- Vår webbplats är föråldrad och trasig, använd rekommenderas inte (https://modernizr.com) utan ladda ned och bygg din modernizr-version med npm.
- [Documentation](https://modernizr.com/docs/)
- [Integration tests](https://modernizr.github.io/Modernizr/test/integration.html)
- [Unit tests](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr testar vilka inbyggda CSS3- och HTML5-funktioner som är tillgängliga i den aktuella UA och gör resultaten tillgängliga för dig på två sätt: som egenskaper på ett globalt `Modernizr`-objekt och som klasser på `<html>`-elementet. Denna information gör att du gradvis kan förbättra dina sidor med detaljerad information över upplevelsen.

## Förändringar med v4

- Avbrutet stöd för node versioner <= 10, uppgradera till minst version 12

- Följande tester har bytt namn:

  - `class` till `es6class` för att vara närmare resten av es-testen

- Följande tester har flyttats till underkataloger:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` flyttade till storage underkatalogen
  - `audio` flyttade till audio underkatalogen
  - `battery` flyttade till battery underkatalogen
  - `canvas`, `canvastext` flyttade till canvas underkatalogen
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` flyttade till event underkatalogen
  - `exiforientation` flyttade till image underkatalogen
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` flyttade till input underkatalogen
  - `svg` flyttade till svg underkatalogen
  - `webgl` flyttade till webgl underkatalogen

- Följande tester har tagits bort:

  - `touchevents`: [diskussion](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [diskussion](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: dubblett av es6 detect `stringtemplate`
  - `contains`: dublett av es6 detect `es6string`
  - `datalistelem`: En dublett av Modernizr.input.list

## Nya asynkrona händelselyssnare

Folk vill ofta veta när ett asynkront test görs så att de kan låta deras applikation reagera på det.
Tidigare har du varit tvungen att lita på att titta på egenskaper eller `<html>`-klasser. Tester stöder ändast **asynkrona** händelser.
Synkrona tester bör hanteras synkront för att förbättra hastigheten och bibehålla konsekvenser.

Det nya API:n ser ut så här:

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

Vi garanterar att vi bara kommer att anropa din funktion en gång (per gång du aktiverar `on` funktionen). Vi förser för närvarande inte
en metod för att exponera "trigger"-funktionen. Istället, om du vill ha kontroll över dina asynkronatester, använd
`src/addTest`-funktionen, och varje test som du ställer in kommer automatiskt att exponera och trigga `on`-funktionen.

## Kom igång

- Klona eller ladda ned arkivet.
- Installera projektberoenden med `npm install`

## Att bygga Modernizr

### Från javascript

Modernizr kan användas via npm:

```js
var modernizr = require("modernizr");
```

En `build` metod är exponerad för att generera anpassade Modernizr-builds. Exempel:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // the build
});
```

Den första parametern tar med ett JSON-objekt med alternativ och funktioner. Se [`lib/config-all.json`](lib/config-all.json) för alla alternativ.

Den andra parametern är en funktion som anropas när uppgiften är klar.

### Från kommandocentralen

Vi tillhandahåller också ett kommando för att bygga modernizr.
För att se alla tillgängliga alternativ körs:

```shell
./bin/modernizr
```

Eller för att generera allt i 'config-all.json' kör detta med npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testa Modernizr

Så här kör du testerna med mocha-headless-chrome på konsolen:

```shell
npm test
```

Du kan också köra tester i den webbläsare du väljer med detta kommando:

```shell
npm run serve-gh-pages
```

och navigera till dessa två webbadresser:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Uppförandekod

Detta projekt följer [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md).
Genom att delta förväntas du respektera detta.

## License

[MIT License](https://opensource.org/licenses/MIT)
