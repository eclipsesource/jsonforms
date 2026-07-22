#!/usr/bin/env bash
WEBSITE_REPO=$( dirname "${BASH_SOURCE[0]}" )
# The website lives inside the JSON Forms monorepo, so default the source repo
# to the parent directory. An explicit path can still be passed as $1.
JSONFORMS_REPO=${1:-"$WEBSITE_REPO/.."}
declare -a PACKAGES=(core react material-renderers vanilla-renderers angular angular-material vue vue-vanilla vue-vuetify)

if [[ ! -d $JSONFORMS_REPO ]]; then
  echo "Error: JSONForms source repo not found at '$JSONFORMS_REPO'."
  echo "Example: $0 /path/to/jsonforms"
  exit 1
fi

for package in "${PACKAGES[@]}"; do
  rm -rf $WEBSITE_REPO/static/api/$package
  cp -r $JSONFORMS_REPO/packages/$package/docs $WEBSITE_REPO/static/api/$package
  echo "Package $package copied."
done

# Remove absolute paths (https://github.com/TypeStrong/typedoc/issues/642)
find $WEBSITE_REPO/static/api -type f -name "*.html" -print0 | xargs -0 sed '/Defined in \/home\//d' -i

exit 0
