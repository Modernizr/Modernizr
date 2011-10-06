# Modernizr custom build tool

## Installation

   $ npm install -g modernizr

## Usage

```bash

Usage: modernizr [options]

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
   modernizr --all -o output.js

All + extras
   modernizr --all --extras load,respond

Groups
   modernizr --groups html5,css3 >> output.js

Explicit
   modernizr --tests svg,fontface -o output.js

Subtractive
   modernizr --all --not svg,css3 >> output.js

Config
   modernizr --config modernizr-config.json

Where `modernizr-config.json` contains:
   {
     "tests": [ "svg", "websockets" ],
     "extras": [ "load" ],
     "output": "./output.js"
   }