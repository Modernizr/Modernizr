#! /usr/bin/env bash
rm -rf build
node r.js -o app.build.js
rm -rf dist
mkdir dist
cp build/src/modernizr-build.js dist/modernizr-build.js
rm -rf build
