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

`core` → `react`/`angular`/`vue` → renderer packages.
Lerna automatically respects the build order dependencies.

## Running Example Applications for UI Testing

Each renderer set has its own example application with a dev server. Before starting any dev server, you **must** first install dependencies and build all packages:

```bash
pnpm install                  # Install dependencies (run from repo root)
pnpm run build                # Build all packages (required before dev servers work)
```

All renderer sets share the same set of examples from `packages/examples/`.

### Individual Dev Servers

Start dev servers from the **repo root** using `cd` into the package directory.
Each renderer set example application can be started by executing `pnpm run dev`.

### Combined Examples App (All Renderer Sets)

The combined examples app aggregates all 5 renderer sets into a single static app at `packages/examples-app/dist/`.
It has an index page with links to each renderer set's sub-app.

**Full build (first time or after `clean`):**

```bash
pnpm install                          # Install dependencies
pnpm run build                        # Build all packages (required first)
pnpm run build:examples-app           # Build all example bundles + aggregate into dist
```

**Rebuild after code changes to a specific renderer set:**

```bash
# 1. Rebuild the changed package (and any dependencies that changed)
pnpm lerna run build --scope=@jsonforms/material-renderers

# 2. Rebuild only that renderer set's example bundle
pnpm lerna run build:examples-app --scope=@jsonforms/material-renderers

# 3. Re-aggregate into the combined app
node packages/examples-app/prepare-examples-app.js
```

**Serving the combined app:**

```bash
# No built-in serve script exists - use any static file server:
python3 -m http.server 9090 --directory packages/examples-app/dist
```
