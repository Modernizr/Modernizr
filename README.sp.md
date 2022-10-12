<p align="center">
   <a href="https://www.npmjs.com/package/modernizr" rel="noopener" target="_blank"><img alt="Modernizr" src="./media/Modernizr-2-Logo-vertical-medium.png" width="250" /></a>
</p>

<div align="center">
  
##### Modernizr es una libreria de JavaScript la cual detecta características de HTML5 y CSS3 en el navegador del usuario.
  
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://github.com/Modernizr/Modernizr/workflows/Testing/badge.svg)](https://github.com/Modernizr/Modernizr/actions)
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)

</div>

- Nuestro Website está desactualizado y dañado, por favor NO usarlo (https://modernizr.com) en su lugar cree su versión de modernizr a partir de npm.
- [Documentation](https://modernizr.com/docs/)
- [Integration tests](https://modernizr.github.io/Modernizr/test/integration.html)
- [Unit tests](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr testea cuales características nativas de CSS3 y HTML5 están disponibles en el actual UA y le devuelve los resultados de dos formas: como propiedades de un objeto global `Modernizr`, y como clases en el elemento `<html>`. Esta información le permite mejorar progresivamente sus páginas con un nivel de control granular sobre las experiencias.

## Breaking changes with v4

- Sin soporte para versiones de Node <= 10, por favor actualizar por lo menos a la versión 12

- Los siguientes tests fueron renombrados:
  
  - `class` a `es6class` para mantenerse en linea con el resto de los es-tests

- Los siguientes tests fueron movidos a subdirectorios:

  - `cookies`, `indexeddb`, `indexedblob`, `quota-management-api`, `userdata` movidos al subdirectorio storage
  - `audio` movido al subdirectorio audio
  - `battery` movido al subdirectorio battery
  - `canvas`, `canvastext` movidos al subdirectorio canvas
  - `customevent`, `eventlistener`, `forcetouch`, `hashchange`, `pointerevents`, `proximity` movidos al subdirectorio event
  - `exiforientation` movidos al subdirectorio image
  - `capture`, `fileinput`, `fileinputdirectory`, `formatattribute`, `input`, `inputnumber-l10n`, `inputsearchevent`, `inputtypes`, `placeholder`, `requestautocomplete`, `validation` movidos al subdirectorio input
  - `svg` movido al subdirectorio svg
  - `webgl` movido al subdirectorio webgl
    
- Los siguientes tests fueron removidos:
  
  - `touchevents`: [discusión](https://github.com/Modernizr/Modernizr/pull/2432)
  - `unicode`: [discusión](https://github.com/Modernizr/Modernizr/issues/2468)
  - `templatestrings`: duplicado de la detección es6 `stringtemplate`
  - `contains`: duplicado de la detección es6 `es6string`
  - `datalistelem`: Una replica de Modernizr.input.list

## New Asynchronous Event Listeners

A menudo las personas quieren saber cuando un test asíncrono se ha realizado y de esta forma permitir que la aplicación reaccione a esto.
En el pasado, usted ha tenido que verificar las propiedades o clases de `<html>`. Solo los enventos en los tests **asynchronous** están soportados.
Tests síncronos deberían ser manejados sincrónicamente para mejorar la velocidad y mantener la consistencia.

La nueva API se ve así:

```js
// Escuchando un test, dar un callback
Modernizr.on('testname', function( result ) {
  if (result) {
    console.log('Test exitoso!');
  }
  else {
    console.log('El test ha fallado!');
  }
});
```

Garantizamos que solo invocaremos tu función una vez (por cada vez que llames a `on`). Actualmente no estamos exponiendo
un metodo para exponer la funcionalidad de `trigger`. En cambio, si quisiera tener el control sobre los tests asíncronos, use la
característica `src/addTest`, y cualquier test que establezca automáticamente expondrá y encenderá la funcionalidad `on`.

## Getting Started

- Clone o descargue el repositorio
- Instale las dependencias del proyecto con `npm install`

## Building Modernizr 

### From javascript

Modernizr puede ser usado programáticamente via npm:

```js
var modernizr = require("modernizr");
```

Un método `build` está expuesto para generar builds personalizadas. Ejemplo:

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // la build
});
```

El primer parámetro toma un objeto JSON de opciones y feature-detects a incluir. Ver [`lib/config-all.json`](lib/config-all.json) para todas las opciones disponibles.

El segundo parámetro es una función invocada cuando la tarea se ha completado.

### From the command-line

También proveemos una CLI para building modernizr. 
Para ver todas las opciones disponibles, ejecutar:

```shell
./bin/modernizr
```

O generar todo en 'config-all.json' ejecutar esto con npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testing Modernizr

Para ejecutar los tests usando mocha-headless-chrome en la consola, ejecutar:

```shell
npm test
```

También se pueden correr en el navegador de su elección usando:

```shell
npm run serve-gh-pages
```

y navegando a estas dos URLs:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Code of Conduct

Este proyecto se adhiere al [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md). 
Al participar, se espera que honre este código.


## License

[MIT License](https://opensource.org/licenses/MIT)
