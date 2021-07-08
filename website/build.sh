#!/usr/bin/env bash

function next() {
    NEXTVERSION=$(curl --silent "https://api.github.com/repos/eclipsesource/jsonforms/tags" | grep '"name":' | head -1 | sed -E 's/.*"([^"]+)".*/\1/')
    if [[ ${NEXTVERSION:0:1} == "v" ]] ; then NEXTVERSION="${NEXTVERSION:1}"; fi
    echo -e "NEXTVERSION = $NEXTVERSION" >> .env
}

function current() {
    CURRENTVERSION=$(curl --silent "https://api.github.com/repos/eclipsesource/jsonforms/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    echo -e "CURRENTVERSION = $CURRENTVERSION" >> .env
}

WITH_NEXT=$1

rm -f .env
if [[ $WITH_NEXT = "next" ]]; then
    current
    next
else
    current
fi
