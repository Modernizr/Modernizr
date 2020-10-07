# Modernizr 
[![npm version](https://badge.fury.io/js/modernizr.svg)](https://badge.fury.io/js/modernizr)
[![Build Status](https://api.travis-ci.org/Modernizr/Modernizr.svg?branch=master)](https://travis-ci.org/Modernizr/Modernizr) 
[![Build Status](https://ci.appveyor.com/api/projects/status/github/Modernizr/modernizr?branch=master&svg=true)](https://ci.appveyor.com/project/rejas/modernizr) 
[![codecov](https://codecov.io/gh/Modernizr/Modernizr/branch/master/graph/badge.svg)](https://codecov.io/gh/Modernizr/Modernizr)
[![Inline docs](https://inch-ci.org/github/Modernizr/Modernizr.svg?branch=master)](https://inch-ci.org/github/Modernizr/Modernizr)


- Read this file in Portuguese-BR [here](#portuguese-br)

##### Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.

- [Website](https://modernizr.com)
- [Documentation](https://modernizr.com/docs/)
- [Integration tests](https://modernizr.github.io/Modernizr/test/integration.html)
- [Unit tests](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr tests which native CSS3 and HTML5 features are available in the current UA and makes the results available to you in two ways: as properties on a global `Modernizr` object, and as classes on the `<html>` element. This information allows you to progressively enhance your pages with a granular level of control over the experience.

## Breaking changes with v4

- Dropped Node 8 Support, please upgrade to Node v10

- These tests got removed:

    - `touchevents`: [discussion](https://github.com/Modernizr/Modernizr/pull/2432) 
    - `unicode`: [discussion](https://github.com/Modernizr/Modernizr/issues/2468) 
    - `templatestrings`: duplicate of the es6 detect `stringtemplate`
    - `contains`: duplicate of the es6 detect `es6string`
    - `datalistelem`: A dupe of Modernizr.input.list

## New Asynchronous Event Listeners

Often times people want to know when an asynchronous test is done so they can allow their application to react to it.
In the past, you've had to rely on watching properties or `<html>` classes. Only events on **asynchronous** tests are
supported. Synchronous tests should be handled synchronously to improve speed and to maintain consistency.

The new API looks like this:

```js
// Listen to a test, give it a callback
Modernizr.on('testname', function( result ) {
  if (result) {
    console.log('The test passed!');
  }
  else {
    console.log('The test failed!');
  }
});
```

We guarantee that we'll only invoke your function once (per time that you call `on`). We are currently not exposing
a method for exposing the `trigger` functionality. Instead, if you'd like to have control over async tests, use the
`src/addTest` feature, and any test that you set will automatically expose and trigger the `on` functionality.

## Getting Started

- Clone or download the repository
- Install project dependencies with `npm install`

## Building Modernizr 

### From javascript

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

The first parameter takes a JSON object of options and feature-detects to include. See [`lib/config-all.json`](lib/config-all.json) for all available options.

The second parameter is a function invoked on task completion.

### From the command-line

We also provide a command line interface for building modernizr. 
To see all available options run:

```shell
./bin/modernizr
```

Or to generate everything in 'config-all.json' run this with npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testing Modernizr

To execute the tests using mocha-headless-chrome on the console run:

```shell
npm test
```

You can also run tests in the browser of your choice with this command:

```shell
npm run serve-gh-pages
```

and navigating to these two URLs:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Code of Conduct

This project adheres to the [Open Code of Conduct](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md). 
By participating, you are expected to honor this code.


## License

[MIT License](https://opensource.org/licenses/MIT)



# Portuguese BR

##### Modernizr é uma biblioteca de JavaScript que detecta recursos HTML5 e CSS3 no navegador do usuário.

- [Website](https://modernizr.com)
- [Documentação](https://modernizr.com/docs/)
- [Teste de integração](https://modernizr.github.io/Modernizr/test/integration.html)
- [Teste de unit](https://modernizr.github.io/Modernizr/test/unit.html)

Modernizr testa quais recursos nativos de HTML5 e CSS3 estão disponíveis na UA atual, e deixa os recursos disponíveis para você em duas maneiras: como propriedades num objeto global `Modernizr`, e como classes no elemento `<html>`. Essa informação permite que você melhore progressivamente suas páginas com um nível granular de controle sobre a experiência.

## Mudanças com a v4

- Fechou o suporte para Node 8, por favor atualize para Node v10

- Esses testes foram removidos:

    - `touchevents`: [discussion](https://github.com/Modernizr/Modernizr/pull/2432) 
    - `unicode`: [discussion](https://github.com/Modernizr/Modernizr/issues/2468) 
    - `templatestrings`: duplicate of the es6 detect `stringtemplate`
    - `contains`: duplicate of the es6 detect `es6string`
    - `datalistelem`: A dupe of Modernizr.input.list

## Novos Event Listeners Assíncronos

Várias vezes as pessoas querem saber quando um teste assíncrono é feito pra que eles possam autorizar suas aplicações a reagir com ele. No passado, tinha que confiar em ficar monitorando propriedades ou em classes `<html>`. Apenas eventos em testes **asynchronous** possuem suporte. Testes síncronos devem ser manipulados sincronamente para aumentar velocidade e manter consistência.

A API nova está assim:

```js
// Listen to a test, give it a callback
Modernizr.on('testname', function( result ) {
  if (result) {
    console.log('O teste passou!');
  }
  else {
    console.log('O teste falhou!');
  }
});
```

Nós garantimos que só vamos invocar sua função uma vez (por vezes que você chame `on`). Atualmente não estamos expondo um método para expôr a funcionalidade `trigger`. Em vez disso, se você gostaria de ter controle sobre testes assíncronos, use o recurso `src/addTest`, e qualquer teste que você faça vai automaticamente expôr e ativar a funcionalidade `on`.

## Começando

- Clone ou baixe o repositório
- Instale as dependências do projeto com `npm install`

## Construindo Modernizr 

### Pelo JavaScript

Modernizr pode ser usado programaticamente via npm:

```js
var modernizr = require("modernizr");
```

Um método `build` é exposto para gerar builds customizadas do Modernizr. Exemplo: 

```javascript
var modernizr = require("modernizr");

modernizr.build({}, function (result) {
  console.log(result); // a build
});
```

O primeiro parâmetro pega um objeto JSON de opções e detector de recursos para incluir. Veja [`lib/config-all.json`](lib/config-all.json) para todas opções disponíveis.

O segundo parâmetro é uma função invocada pela conclusão de tarefa.

### Pela linha de comando

Nós também disponibilizamos uma interface na linha de comando para a construção do Modernizr. Para ver todas opções disponíveis digite:

```shell
./bin/modernizr
```

Ou para gerar tudo no 'config-all.json' digite isso com o npm:

```shell
npm start
//outputs to ./dist/modernizr-build.js
```

## Testando Modernizr

Para executar os testes usando mocha-headless-chrome no console, use:

```shell
npm test
```

Também tem como fazer testes no navegador de sua escolha com esse comando:

```shell
npm run serve-gh-pages
```

e navegando para essas duas URLs:

```shell
http://localhost:8080/test/unit.html
http://localhost:8080/test/integration.html
```

## Código de Conduta

Este projeto adere ao [Código Aberto de Conduta](https://github.com/Modernizr/Modernizr/blob/master/.github/CODE_OF_CONDUCT.md). 
Participando deste projeto, é esperado que você honre esse código.


## Licensa

[Licensa MIT](https://opensource.org/licenses/MIT)