# How to Write Feature Detects
The scope of this file is to help you to create new feature detects or edit existing ones. Here you will find details and guidelines that will help you understand how
Modernizr works.

#### Table of contents
[Metadata](#metadata)

## Metadata
A JSON fragment at the top of every feature detect in Modernizr represents the metadata of the test. This data is used, for example, to build the webpage.
### Schema
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

### Item description
|                  | Necessity |                      Description                     |                                       Notes                                      |
|------------------|:---------:|:----------------------------------------------------:|:--------------------------------------------------------------------------------:|
| `name`           |  required |             Name of the feature detection            |                                                                                  |
| `property`       |  required | The property name established in `Modernizr.addTest` |                   It must be lowercase, without any punctuation                  |
| `tags`           |  optional |    A group that encapsulates many feature detects    |                                                                                  |
| `caniuse`        |  optional |      A conversion table of caniuse and Modernizr     |      Consider adding it to [caniuse.js](test/browser/integration/caniuse.js)     |
| `authors`        |  optional |          List of contributors of the script          |                                                                                  |
| `builderAliases` |  optional |     Used by CI and the web when tests are renamed    |                         Should not be needed in new tests                        |
| `polyfills`      |  optional |     Available polyfills for not working versions     | Any polyfill listed needs to be included in [polyfills.json](lib/polyfills.json) |
| `aliases`        |  optional |   Used if a feature has more than a canonical name   |                             Legacy only - do not use                             |
| `async`          |  optional |       If the test supports async functionality       |                                 Defaults to false                                |
| `warnings`       |  optional |        Notes to the developer using the script       |                          Don't mistake it for knownBugs                          |
| `knownBugs`      |  optional |  Bugs known of the test (e.g.: doesn't work in IE6)  |                                                                                  |
| `notes`          |  optional |                  Links to resources                  |                                                                                  |
