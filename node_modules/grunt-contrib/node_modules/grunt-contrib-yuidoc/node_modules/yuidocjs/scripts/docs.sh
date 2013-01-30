#!/bin/bash

cd "$(dirname "$0")"

out=../../yuidoc-pages

cd $out

out=`pwd`

cd -

if [ ! -d $out ]; then

    echo "Could not find $out"
    exit;
fi

echo "Deploying Doc Files to Github Pages"

cd ../
wait
make docs
wait
rm -rRf $out/*
wait
cp -R output/* $out/
wait
echo "Doc Deploy Complete, checkin and push now."
