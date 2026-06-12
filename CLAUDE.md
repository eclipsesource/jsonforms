# JSON Forms 4.x (presentation-model rewrite)

This repository is the ground-up rewrite of JSON Forms around the presentation-model
architecture ([issue #2571](https://github.com/eclipsesource/jsonforms/issues/2571)).
The complete architecture design is in `docs/presentation-model/architecture.html`.
It is a clean cut from 3.x: never reintroduce 3.x concepts (mappers, reducers/actions,
HOC prop chains, AJV-in-state) or compatibility shims.

## Architecture summary

- `@jsonforms/core` (`packages/core`): framework-agnostic and dependency-free.
  A `FormEngine` (`createFormEngine`) owns data + the **presentation model** (serializable
  nodes carrying label, value, issues, constraints, …), processes serializable **commands**
  (`set-value`, `touch`) and notifies subscribers with node-granular deltas. The model is
  produced by a pure builder over pluggable services: `SchemaSource` (JSON Schema impl:
  `jsonSchemaSource`), `FormValidator`, `IssueDisplayPolicy` (which issues land on nodes;
  default: show once touched), `NodeProcessor`s. Testers rank renderers against **nodes**,
  never against schemas. Boolean node flags (`hidden`, `disabled`, `required`, `readonly`,
  `touched`) are optional and default-false. Commands may carry `sourceNodeId` provenance.
- `@jsonforms/validator-ajv`: AJV-backed `FormValidator`. Core must never depend on AJV.
- `@jsonforms/react`: React 19 binding — `<JsonForms>`, `useNode`/`useControlNode` (via
  `useSyncExternalStore`, node-granular subscriptions), `NodeDispatch`, and
  `useControlDispatch` (node-scoped commands with provenance; `useFormDispatch` is the
  low-level fallback).
- `@jsonforms/react-material`: Material UI v9 renderers — thin views over nodes only.
- `apps/demo`: Vite demo app.
- Other packages (`angular*`, `vue*`, `react-vanilla`) are placeholders for later phases.

## Hard design rules

1. Presentation nodes are plain serializable JSON — no functions, no live schema references,
   no escape hatches to raw schemas.
2. Nodes are complete: if a renderer needs information, it goes on the node (or via a
   `NodeProcessor`) — renderers never reach into schema/data/engine internals.
3. Unchanged nodes keep object identity across rebuilds (this is what makes re-renders cheap);
   preserve this invariant in any builder change.
4. The builder is pure; all statefulness lives in the `FormEngine`.
5. Data paths are JSON Pointers (RFC 6901), not lodash dot paths.

## Workspace & commands

pnpm 11 workspaces + Turborepo; Node >= 22.12. All packages are ESM-only, TypeScript strict.

```bash
pnpm install
pnpm build        # turbo run build (topological, cached)
pnpm dev          # watch libs (tsdown --watch) + demo dev server (vite)
pnpm test         # vitest (turbo run test)
pnpm typecheck    # tsc --noEmit per package
pnpm lint         # eslint flat config at repo root
pnpm format       # prettier
```

Single package: `pnpm --filter @jsonforms/core test`, `turbo run build --filter @jsonforms/react...`

## Conventions

- Libraries build with `tsdown` (ESM + d.ts + sourcemaps into `dist/`); the demo uses Vite.
- Tests live in `test/` per package, written with Vitest; React tests use jsdom +
  Testing Library.
- Prefer arrow functions; type-only imports must use `import type`
  (`verbatimModuleSyntax` is on).
- Releases via changesets (`pnpm changeset`); all packages versioned in lockstep.
- Lint/format configs live only at the repo root (single flat ESLint config, single
  Prettier config) — do not add per-package configs.
