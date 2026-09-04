#!/usr/bin/env bash
set -euo pipefail

repository_root=/workspace
output_directory=/workspace/dist

cd "$repository_root"
rm -rf "$output_directory"

rendercv render cv/Harris_Bienn_CV.yaml --quiet

install -d "$output_directory/assets"
cp -R site/assets/. "$output_directory/assets/"
touch "$output_directory/.nojekyll"

test -s "$output_directory/index.html"
test -s "$output_directory/Harris_Bienn_CV.pdf"
test -s "$output_directory/Harris_Bienn_CV.md"
test -s "$output_directory/assets/site.css"
test -s "$output_directory/assets/site.js"
