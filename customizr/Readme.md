# Customizr

Modernizr custom build tool utility written with nodejs.

## Installation

   $ npm install -g customizr

## Usage

```bash

Usage: customizr [options]

Options:

  -h, --help                       Output usage information
  -v, --version                    Output the version number
  -c, --config [fileName]          The name of a conifguration file containing a JSON object that has properties for any of the following options. If no name is provided, uses modernizr-config.json
  -o, --output <fileName>          Write generated Modernizr build to this output file
  -a, --all                        Include all tests
  -e, --extras <items>             Include extras
  -g, --groups <groups>            Include tests by group (html5, css3, misc)
  -t, --tests <tests>              Include tests explicitly
  -n, --not <groups|tests|extras>  Exclude specific groups, tests, or extras

```

## Examples

All (except .load + .respond)
   customizr --all -o output.js

All + extras
   customizr --all --extras load,respond

Groups
   customizr --groups html5,css3 >> output.js

Explicit
   customizr --tests svg,fontface -o output.js

Subtractive
   customizr --all --not svg,css3 >> output.js

Config
   customizr --config modernizr-config.json

Where `modernizr-config.json` contains:
   {
     "tests": [ "svg", "websockets" ],
     "extras": [ "load" ],
     "output": "./output.js"
   }