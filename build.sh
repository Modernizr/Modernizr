#! /usr/bin/env bash
rm -rf build
node r.js -o app.build.js
rm -rf dist
mkdir dist
cp build/src/modernizr-build.js dist/modernizr-build.js
rm -rf build
node processbuild.js
m=$(stat -f "%z" dist/modernizr-build.min.js)
gzip -nfc --best dist/modernizr-build.min.js > dist/modernizr-build.min.js.gz
g=$(stat -f "%z" dist/modernizr-build.min.js.gz)
rm -f dist/modernizr-build.min.js.gz
echo "$m bytes minified, $g bytes gzipped"
