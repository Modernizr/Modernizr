# How to Write Feature Detects

The scope of this file is to help you to create new feature detects or edit existing ones. Here you will find details and guidelines that will help you understand how
Modernizr works. All these sections assume that you have npm, node and Modernizr if that is not the case, check first the [Install the basics](#install-the-basics) section.

## Table of contents

[Metadata](#metadata)

[Polyfills](#polyfills)

[Testing](#testing)

* [General Testing](#general-testing)
* [Caniuse Testing](#caniuse-testing)
* [Verify Your Tests](#verify-your-tests)

[Install the Basics](#install-the-basics)

## Metadata

A JSON fragment at the top of every feature detect in Modernizr represents the metadata of the test. This data is used, for example, to build the webpage.

### Metadata Schema

The following code represents an example of the schema (it does not represent a real test):

```json
/*!
{
  "name": "JPEG 2000",
  "property": "jpeg2000",
  "tags": ["media", "image"],
  "caniuse": "jpeg2000",
  "authors": ["Markel Ferro (@MarkelFe)", "@rejas", "Brandom Aaron"],
  "builderAliases": ["jpeg2"],
  "polyfills": ["jpeg2000js"],
  "aliases": ["jpeg-2000", "jpg2"],
  "async": true,
  "warnings": ["These tests currently require document.body to be present"],
  "knownBugs": ["This will false positive in IE6"],
  "notes": [{
    "name": "Specification",
    "href": "https://www.w3.org/"
  }, {
    "name": "Github issue",
    "href": "https://github.com/Modernizr/"
  }]
}
!*/
/* DOC
Here it would go a description of the feature test. You can use **markdown** here :)
*/
```

> Metadata does no need to appear in a set order, however, it is common to see `name` and `property` at the top while `notes` at the bottom.

### Metadata Item description

|                  | Necessity |                      Description                     |                        Notes                        |
|------------------|:---------:|:----------------------------------------------------:|:---------------------------------------------------:|
| `name`           |  required |             Name of the feature detection            |                                                     |
| `property`       |  required | The property name established in `Modernizr.addTest` |    It must be lowercase, without any punctuation    |
| `tags`           |  optional |    A group that encapsulates many feature detects    |                                                     |
| `caniuse`        |  optional |      A conversion table of caniuse and Modernizr     | Consider adding [caniuse testing](#caniuse-testing) |
| `authors`        |  optional |          List of contributors of the script          |                                                     |
| `builderAliases` |  optional |     Used by CI and the web when tests are renamed    |          Should not be needed in new tests          |
| `polyfills`      |  optional |     Available polyfills for not working versions     |      Check the [polyfills section](#polyfills)      |
| `aliases`        |  optional |   Used if a feature has more than a canonical name   |               Legacy only - do not use              |
| `async`          |  optional |       If the test supports async functionality       |                  Defaults to false                  |
| `warnings`       |  optional |        Notes to the developer using the script       |            Don't mistake it for knownBugs           |
| `knownBugs`      |  optional |  Bugs known of the test (e.g.: doesn't work in IE6)  |                                                     |
| `notes`          |  optional |                  Links to resources                  |                                                     |

## Polyfills

Polyfills can be named in the [metadata](#metadata) with a simple word. In order to do this the [lib/polyfills.json](lib/polyfills.json) must include the description of all polyfills.

### Polyfill Schema

The following example represents the schema in which polyfills must be defined in the [polyfills.json](lib/polyfills.json) file:

```json
"css3pie": {
  "name": "CSS3 PIE",
  "authors": ["Jason Johnston"],
  "href": "http://css3pie.com/",
  "licenses": ["Apache2", "GPL2"],
  "notes": ["CSS3 decoration rendering for IE 6-9. Supports: border-radius, box-shadow, multiple backgrounds, linear gradients, border-image"]
},
```

> Metadata does no need to appear in a set order, however, it is common to follow the order stated above.

### Polyfill Item Description

|            | Necessity |           Description          |
|------------|:---------:|:------------------------------:|
| `name`     |  required |      Name of the polyfill      |
| `authors`  |  optional |  Main authors of the polyfill  |
| `notes`    |  optional |        Extra information       |
| `href`     |  required | Link to the polyfill main page |
| `licenses` |  required |     License of the polyfill    |

## Testing

### General Testing

After creating your feature detect you'll need to add testing. In order to do it you must head to the [lib/config-all.json](lib/config-all.json) and include the relative path with root in the `feature-detects` folder to your test file (without the extension) under the `feature-detects` section. Here are some examples:

```js
// lib/config-all.json
"img/apng", // for "feature-detects/img/apng.js"
"mathml", // for feature-detects/mathml.js
```

> Note that it follows JSON schema in alphabetical order. Also consider adding caniuse testing if possible.

### Caniuse Testing

This testing is optional but highly recommended if a caniuse equivalent exists. Firstly, click on the `#` symbol to the left of the name of the feature in [caniuse.com](https://caniuse.com). Copy everything in the URL following `https://caniuse.com/#feat=`, for example, in `https://caniuse.com/#feat=channel-messaging` copy only `channel-messaging`. Add this information to the [test/browser/integration/caniuse.js](test/browser/integration/caniuse.js) file under the map variable with the Modernizr property value in the left and the caniuse value in the right, for example, the `channel-messaging` corresponds to the `messagechannel` property so it should appear like this:

```js
// test/browser/integration/caniuse.js
messagechannel: 'channel-messaging', // Modernizr left, caniuse right
```

> Note that it follows JSON schema in alphabetical order. Also consider adding caniuse in [the metadata field](#metadata).
> The following situations may cause errors: MDN Data, partial supports, flag only support, unknown support.

### Verify Your Tests

There are 2 main ways you can verify if your test works correctly:

**Basic checking:** If only you want to check that your test returns the correct answer run `npm test` as it will throw an error if something goes wrong.

**Specific checking:** In case you want to check the test in a specific browser run `npm run serve-gh-pages` and navigate to [localhost:8080/test/integration.html](http://localhost:8080/test/integration.html), where you should find the name of your test in case you performed the [General Testing](#general-testing) steps right. You will also find the caniuse comparison of your feature detect under the [caniuse section](http://localhost:8080/test/integration.html?grep=caniuse) (at the bottom) if you performed the [Caniuse Testing](#caniuse-testing) steps right. You may want to use the search function of your browser.

## Install the Basics

### Installing Node and Npm

Firstly you will need to install nodejs on your system. Go to [nodejs.org](https://nodejs.org) and download the latest LTS release.

> In case of being using linux use you may use this [DigitalOcean tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04).

### Downloading the Modernizr Repository

> Note: It is recommended that you set your own git environment, however this is a complicated and diverse task so we won't be explaining it here, we recommend using, for example, [Github Desktop](https://desktop.github.com/) (very beginner friendly), [Sublime Merge](https://www.sublimemerge.com/) or the git command-line tool. We also recommend checking this [tutorial website](https://rogerdudler.github.io/git-guide/) if you never used git before.

To download the code of the repository:

* Head to the main [Modernizr repository](https://github.com/Modernizr/Modernizr)
* Click `Clone or download` and `Download ZIP` afterwards. Optionally you can click [https://github.com/Modernizr/Modernizr/archive/master.zip](https://github.com/Modernizr/Modernizr/archive/master.zip) to download it directly.
* Finally, unzip the file.
