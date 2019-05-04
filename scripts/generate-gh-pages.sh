#!/usr/bin/env sh

# abort on errors
set -e

# build and copy gh-pages
grunt gh-pages

# navigate into the build output directory
cd gh-pages

# init git stuff
git init
git add --all
git add --force node_modules
git commit -m 'Hey server, this content is for you! [skip ci]'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:modernizr/Modernizr.git master:gh-pages

# go back
cd -
