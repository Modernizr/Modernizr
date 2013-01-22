#!/bin/bash

cd "$(dirname "$0")"

../lib/cli.js --help 2> ../docs/args/partials/help.mustache
