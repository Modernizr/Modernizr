# Português-BR

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