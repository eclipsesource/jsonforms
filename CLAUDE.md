# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JSON Forms is a declarative framework for automatically generating web forms from JSON Schema. It provides a framework-agnostic core with bindings for React, Angular, and Vue, plus multiple renderer sets (Material-UI, Angular Material, Vuetify, and vanilla HTML/CSS).

Website: https://jsonforms.io

## Setup and Prerequisites

- Node.js v22+ (< 23)
- pnpm 10.4.1+ (managed via corepack or direct install)
- Install dependencies: `pnpm i --frozen-lockfile`

## Common Commands

### Building
- `pnpm run build` - Build all packages in the monorepo
- `pnpm run clean` - Delete all dist folders
- `cd packages/<package-name> && pnpm run build` - Build a specific package

### Testing
- `pnpm run test` - Run tests for all packages
- `pnpm run test-cov` - Run tests with coverage for all packages
- `cd packages/core && pnpm run test` - Run core tests (uses AVA)
- `cd packages/react && pnpm run test` - Run React tests (uses Jest)
- `cd packages/angular && pnpm run test` - Run Angular tests (uses AVA)
- `cd packages/vue && pnpm run test` - Run Vue tests (uses Jest)

### Linting
- `pnpm run lint` - Lint all packages
- `pnpm run lint:fix` - Auto-fix linting issues in all packages

### Development Servers
Each renderer package has example apps you can run:
- `cd packages/vanilla-renderers && pnpm run dev` - React with vanilla renderers
- `cd packages/material-renderers && pnpm run dev` - React with Material-UI renderers
- `cd packages/angular-material && pnpm run dev` - Angular with Material renderers
- `cd packages/vue-vanilla && pnpm run serve` - Vue with vanilla renderers
- `cd packages/vue-vuetify && pnpm run dev` - Vue with Vuetify renderers

### Documentation
- `pnpm run doc` - Generate TypeDoc documentation for all packages

## Architecture

### Monorepo Structure

This is a Lerna-managed pnpm workspace monorepo with three types of packages:

1. **Core Package** (`@jsonforms/core`)
   - Framework-agnostic core functionality
   - JSON Schema validation (using AJV)
   - State management via reducers
   - Tester system for renderer dispatch
   - UI Schema and JSON Schema type definitions

2. **Framework Integration Packages**
   - `@jsonforms/react` - React Context API integration
   - `@jsonforms/angular` - Angular services and directives with RxJS
   - `@jsonforms/vue` - Vue 3 Composition API integration

3. **Renderer Packages**
   - `@jsonforms/vanilla-renderers` - Basic HTML/CSS renderers for React
   - `@jsonforms/material-renderers` - Material-UI renderers for React
   - `@jsonforms/angular-material` - Angular Material renderers
   - `@jsonforms/vue-vanilla` - Basic renderers for Vue
   - `@jsonforms/vue-vuetify` - Vuetify renderers for Vue

4. **Support Packages**
   - `@jsonforms/examples` - Shared example data, schemas, and UI schemas for testing

### Key Concepts

#### UI Schema
Declarative JSON structure that describes form layout and controls:
- `ControlElement` - Binds to data via `scope` (JSON Pointer path like `#/properties/name`)
- Layout elements - `VerticalLayout`, `HorizontalLayout`, `GroupLayout`
- `Categorization` & `Category` - For tabbed/stepped layouts
- `rules` - Dynamic show/hide/enable/disable conditions
- `options` - Customization per control

#### Testers
Functions that determine which renderer handles which UI schema + JSON schema combination:
```typescript
type RankedTester = (
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext
) => number;
```
- Returns `-1` (NOT_APPLICABLE) if renderer cannot handle
- Returns positive number indicating priority (higher = more specific)
- Common testers: `isStringControl`, `isBooleanControl`, `isDateControl`
- Combine with `and()`, `or()`, `rankWith(priority, tester)`

Example:
```typescript
const myTester = rankWith(
  2, // priority
  and(
    uiTypeIs('Control'),
    schemaTypeIs('string'),
    formatIs('email')
  )
);
```

#### Reducers
Core state management (packages/core/src/reducers/):
- `coreReducer` - data, schema, uischema, validation errors
- `renderers` - registry of available renderers
- `cells` - registry of cell renderers (for tables)
- `config` - app-wide configuration
- `i18n` - internationalization state
- `uischemas` - dynamic UI schema registry

#### Mappers
Convert store state into component props:
- `mapStateToControlProps` - For control renderers
- `mapStateToLayoutProps` - For layout renderers
- Handle visibility, enablement, validation, labels

### Framework-Specific Patterns

#### React
```typescript
// 1. Define component
const MyControl = (props: ControlProps) => { /* render */ };

// 2. Create tester
const myControlTester = rankWith(2, isStringControl);

// 3. Connect to state
export default withJsonFormsControlProps(MyControl);

// 4. Register
const renderers = [
  { tester: myControlTester, renderer: MyControl }
];
```

#### Angular
```typescript
// 1. Extend JsonFormsControl
@Component({...})
export class MyControl extends JsonFormsControl {}

// 2. Create tester
export const myControlTester = rankWith(2, isStringControl);

// 3. Register in module
JsonFormsAngularService.setRenderers([
  { tester: myControlTester, renderer: MyControl }
]);
```

#### Vue
```typescript
// 1. Use composables
export default defineComponent({
  props: rendererProps<ControlElement>(),
  setup(props) {
    const control = useJsonFormsControl(props);
    return { control };
  }
});

// 2. Create tester
export const myControlTester = rankWith(2, isStringControl);
```

### Data Flow

```
User Input
  → Renderer Component
  → handleChange callback
  → Framework Integration Layer
  → Core Actions (UPDATE_DATA)
  → Reducer (coreReducer)
  → Validation (AJV)
  → Updated State
  → Mappers
  → Renderer Re-render
```

## Testing

Different packages use different test runners:
- **Core**: AVA (`pnpm run test` in packages/core)
- **React packages**: Jest with ts-jest and Enzyme (`pnpm run test` in packages/react)
- **Angular packages**: AVA (`pnpm run test` in packages/angular)
- **Vue packages**: Jest with Vue Test Utils

Test files are typically in `test/` directory within each package.

## Important Development Notes

### When Creating New Renderers

1. Determine the UI schema element type and JSON schema properties your renderer handles
2. Create a tester with appropriate priority (higher = more specific)
3. Common priorities:
   - 1 = basic type match (e.g., all strings)
   - 2 = format-specific (e.g., email, date)
   - 3 = very specific (e.g., enum with specific values)
   - 10+ = custom overrides
4. Use framework-specific HOC/composable to connect to state
5. Register in the renderers array

### Working with JSON Pointers

Scopes use JSON Pointer notation (RFC 6901):
- `#/properties/firstName` - root level property
- `#/properties/address/properties/street` - nested property
- `#/properties/items/0` - array index

Core utilities in `packages/core/src/util/path.ts` handle path manipulation.

### Validation

Validation uses AJV (JSON Schema validator):
- Custom error messages via `errorMessage` in schema
- Custom formats registered via `ajv.addFormat()`
- Custom keywords via `ajv.addKeyword()`
- Validation errors stored in core state and passed to renderers

### i18n Support

JSON Forms has built-in i18n:
- Register translators via i18n reducer
- Default translator function for labels
- Override via `options.i18n` in UI schema
- Translate error messages from AJV

## Contributing

- All contributors must sign a CLA (checked automatically on PRs)
- Pass all automated checks (tests, linting, formatting)
- Include unit tests for new code
- Add or modify examples to demonstrate new features
- Keep core lean - discuss major features on the [Community Board](https://jsonforms.discourse.group) first

## Key Files and Locations

- `packages/core/src/models/` - TypeScript interfaces for schemas
- `packages/core/src/reducers/` - State management
- `packages/core/src/testers/` - Tester functions
- `packages/core/src/util/` - Helper utilities
- `packages/<framework>/src/` - Framework integration code
- `packages/<framework>-<ui-lib>/src/` - Renderer implementations
