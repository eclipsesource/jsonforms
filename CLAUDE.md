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
- `@jsonforms/react-vanilla`: plain-HTML renderers (`jf-` class names, no styling) — same
  thin-view rules.
- `@jsonforms/examples`: shared example definitions (schema + uischema + data), grouped by
  schema format (`src/json-schema/` now; other formats become sibling groups). All demo apps
  render these examples.
- `apps/demo-react-material` (port 5173), `apps/demo-react-vanilla` (port 5174): per-renderer-
  set Vite demo apps with an example selector. `apps/demo-all` aggregates all demo apps:
  its `build.js` builds each sub-app with `--base=/<id>/` into `dist/<id>/` behind a landing
  page, and its `dev.js` mounts each sub-app as Vite dev-server middleware on one port
  (5170) — new renderer sets are added in `build.js`, `dev.js`, and `index.html`.
- Other packages (`angular*`, `vue*`) are placeholders for later phases.

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
pnpm dev          # combined demo app (demo-all) on :5170; libs aliased to src — no watchers
pnpm dev:react-material / pnpm dev:react-vanilla   # a single demo app (:5173 / :5174)
pnpm test         # vitest (turbo run test)
pnpm typecheck    # tsc --noEmit per package
pnpm lint         # eslint flat config at repo root
pnpm format       # prettier
```

Single package: `pnpm --filter @jsonforms/core test`, `turbo run build --filter @jsonforms/react...`

## Conventions

- Libraries build with `tsdown` (ESM + d.ts + sourcemaps into `dist/`) and have no watch
  scripts: the demo apps alias `@jsonforms/*` to the package `src/` entry points during dev
  (see their `vite.config.ts`), so library edits hot-reload instantly. Builds and tests
  resolve `dist/` like external consumers.
- Tests live in `test/` per package, written with Vitest; React tests use jsdom +
  Testing Library.
- Prefer arrow functions; type-only imports must use `import type`
  (`verbatimModuleSyntax` is on).
- Releases via changesets (`pnpm changeset`); all packages versioned in lockstep.
- Lint/format configs live only at the repo root (single flat ESLint config, single
  Prettier config) — do not add per-package configs.
