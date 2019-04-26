#!/usr/bin/env bash
WEBSITE_REPO=$( dirname "${BASH_SOURCE[0]}" )
JSONFORMS_REPO=$1
declare -a PACKAGES=(core react material vanilla angular-material material-tree-renderer ionic)

if [[ -z $JSONFORMS_REPO || ! -d $JSONFORMS_REPO ]]; then
  echo "Error: please specify JSONForms source repo location."
  echo "Example: $0 /path/to/jsonforms"
  exit 1
fi

for package in "${PACKAGES[@]}"; do
  rm -rf $WEBSITE_REPO/public/api/$package
  cp -r $JSONFORMS_REPO/packages/$package/docs $WEBSITE_REPO/public/api/$package
  echo "Package $package copied."
done

exit 0
