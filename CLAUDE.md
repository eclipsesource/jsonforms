# General project information

For information on project setup, architecture, and core principles refer to @.prompts/project-info.prompttemplate

## Build Commands

### Full Repository

```bash
pnpm install                  # Install dependencies
pnpm run build                # Build all packages
pnpm run lint                 # Lint all packages
pnpm run lint:fix             # Lint and auto-fix
pnpm run test                 # Test all packages
pnpm run clean                # Clean build artifacts
```

### Single Package (Preferred for Iterative Development)

```bash
# Build
pnpm lerna run build --scope=@jsonforms/core

# Lint
pnpm lerna run lint --scope=@jsonforms/core

# Test
pnpm lerna run test --scope=@jsonforms/core
```

### Package Names

- `@jsonforms/core` - Core utilities (UI-framework independent)
- `@jsonforms/react`, `@jsonforms/angular`, `@jsonforms/vue` - Framework bindings
- `@jsonforms/material-renderers`, `@jsonforms/vanilla-renderers` - React renderer sets
- `@jsonforms/angular-material` - Angular renderer set
- `@jsonforms/vue-vanilla`, `@jsonforms/vue-vuetify` - Vue renderer sets

### Build Order Dependencies

`core` → `react`/`angular`/`vue` → renderer packages
