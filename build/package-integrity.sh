#!/bin/bash
set -euxo pipefail

PACKAGE_FILENAME=$(ls -t *.tgz | head -1)
PACKEGE_CONTENT=$(tar -ztvf $PACKAGE_FILENAME)

if [[ $PACKEGE_CONTENT != *"package/lib/index.js"* ]]; then
  echo "Package does not contain a root index JavaScript file!"
  exit 1
fi

if [[ $PACKEGE_CONTENT != *"package/lib/index.d.ts"* ]]; then
  echo "Package does not contain a root TypeScript definition file!"
  exit 1
fi
