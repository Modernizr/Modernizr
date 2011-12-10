#/bin/sh

# sudo npm install -g uglify-js

IN=modernizr.js
OUT=modernizr.min.js

SIZE_MIN=$(uglifyjs "$IN" --extra --unsafe | tee "$OUT" | wc -c)
SIZE_GZIP=$(gzip -nfc --best "$OUT" | wc -c)

echo $SIZE_MIN bytes minified, $SIZE_GZIP bytes gzipped

if [ "$1" == "--test" ]; then
  rm "$OUT"
fi
