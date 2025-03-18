#!/bin/bash

# Function to perform find and replace in files
update_imports() {
    local old_import="$1"
    local new_import="$2"
    local file_pattern="$3"

    echo "Updating imports from $old_import to $new_import in $file_pattern files..."
    
    # Find and replace in TypeScript/JavaScript files
    find . -type f -name "$file_pattern" -not -path "*/node_modules/*" -not -path "*/lib/*" -exec sed -i.bak "s|from '$old_import'|from '$new_import'|g" {} +
    find . -type f -name "$file_pattern" -not -path "*/node_modules/*" -not -path "*/lib/*" -exec sed -i.bak "s|import('$old_import')|import('$new_import')|g" {} +
    
    # Clean up backup files
    find . -name "*.bak" -type f -delete
}

# Update core package imports
update_imports "@jsonforms/core" "@mosaic-avantos/jsonforms-core" "*.ts"
update_imports "@jsonforms/core" "@mosaic-avantos/jsonforms-core" "*.tsx"

# Update react package imports
update_imports "@jsonforms/react" "@mosaic-avantos/jsonforms-react" "*.ts"
update_imports "@jsonforms/react" "@mosaic-avantos/jsonforms-react" "*.tsx"

# Update angular package imports
update_imports "@jsonforms/angular" "@mosaic-avantos/jsonforms-angular" "*.ts"
update_imports "@jsonforms/angular" "@mosaic-avantos/jsonforms-angular" "*.tsx"

# Update material-renderers package imports
update_imports "@jsonforms/material-renderers" "@mosaic-avantos/jsonforms-material-renderers" "*.ts"
update_imports "@jsonforms/material-renderers" "@mosaic-avantos/jsonforms-material-renderers" "*.tsx"

# Update vanilla-renderers package imports
update_imports "@jsonforms/vanilla-renderers" "@mosaic-avantos/jsonforms-vanilla-renderers" "*.ts"
update_imports "@jsonforms/vanilla-renderers" "@mosaic-avantos/jsonforms-vanilla-renderers" "*.tsx"

# Update examples package imports
update_imports "@jsonforms/examples" "@mosaic-avantos/jsonforms-examples" "*.ts"
update_imports "@jsonforms/examples" "@mosaic-avantos/jsonforms-examples" "*.tsx"

# Also update package.json files for dependencies and peerDependencies
find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/lib/*" -exec sed -i.bak 's/"@jsonforms\//"@mosaic-avantos\/jsonforms-/g' {} +
find . -name "*.bak" -type f -delete

echo "Import updates completed!"
