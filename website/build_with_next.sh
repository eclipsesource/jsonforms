#!/usr/bin/env bash

NEXTVERSION=$(curl --silent "https://api.github.com/repos/eclipsesource/jsonforms/releases" | grep '"tag_name":' | head -1 | sed -E 's/.*"([^"]+)".*/\1/')

if [[ ${NEXTVERSION:0:1} == "v" ]] ; then NEXTVERSION="${NEXTVERSION:1}"; fi

DOCZ_NEXTVERSION=$NEXTVERSION npm run build:docz
