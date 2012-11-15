#/bin/bash

cd "$(dirname "$0")"

./prep.sh
cd ../tests/
wait
cd ./input
if [ -L ./test-linked ]; then
    rm ./test-linked;
fi
ln -sf ./test2 ./test-linked
wait
cd ../
wait
../node_modules/.bin/yuitest ./parser.js ./parser_coffee.js ./builder.js ./options.js

exit $?

