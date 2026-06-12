# JSON Forms 4.x — Presentation Model Rewrite

> **Status: early MVP.** This branch is a ground-up rewrite of JSON Forms around the
> **presentation model** architecture proposed in
> [eclipsesource/jsonforms#2571](https://github.com/eclipsesource/jsonforms/issues/2571).
> It is a clean cut: no code is shared with 3.x and there is **no backward compatibility**.
> The full architecture design lives in
> [`docs/presentation-model/architecture.html`](docs/presentation-model/architecture.html).

## The architecture in one paragraph

`@jsonforms/core` builds and maintains a **presentation model**: a serializable collection of
nodes that mirrors the rendered form. Every node carries _everything_ a renderer needs — final
label, description, value, validation issues, constraints. The model is produced by a pluggable
builder pipeline (`SchemaSource` abstracts the schema format, `FormValidator` abstracts
validation, `IssueDisplayPolicy` decides which issues show, `NodeProcessor`s enable
cross-cutting customization) and owned by a `FormEngine` that processes serializable commands
and notifies subscribers with node-granular deltas. Renderers are thin views; framework
bindings subscribe per node.

## Packages

| Package                                    | Status      | Description                                                                                       |
| ------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `@jsonforms/core`                          | **MVP**     | Framework-agnostic presentation model, builder, engine, testers. Zero dependencies.               |
| `@jsonforms/validator-ajv`                 | **MVP**     | `FormValidator` implementation backed by AJV.                                                     |
| `@jsonforms/zod`                           | **MVP**     | Zod `SchemaSource` + `FormValidator` — forms without JSON Schema or AJV.                          |
| `@jsonforms/react`                         | **MVP**     | React 19 binding: `<JsonForms>`, `useNode`, `useControlDispatch`, `NodeDispatch`.                 |
| `@jsonforms/react-material`                | **MVP**     | Material UI (v9) renderer set.                                                                    |
| `@jsonforms/react-vanilla`                 | **MVP**     | Plain-HTML renderer set (successor of `vanilla-renderers`).                                       |
| `@jsonforms/examples`                      | **MVP**     | Shared example forms, grouped by schema format (JSON Schema, zod) with subpath exports per group. |
| `@jsonforms/demo-react-material` (`apps/`) | **MVP**     | Vite demo app for the Material renderer set.                                                      |
| `@jsonforms/demo-react-vanilla` (`apps/`)  | **MVP**     | Vite demo app for the plain-HTML renderer set.                                                    |
| `@jsonforms/demo-all` (`apps/`)            | **MVP**     | Combined static app: landing page + all demo apps under one roof.                                 |
| `@jsonforms/angular`                       | placeholder | Angular binding.                                                                                  |
| `@jsonforms/angular-material`              | placeholder | Angular Material renderer set.                                                                    |
| `@jsonforms/vue`                           | placeholder | Vue binding.                                                                                      |
| `@jsonforms/vue-vanilla`                   | placeholder | Plain-HTML Vue renderer set.                                                                      |
| `@jsonforms/vue-vuetify`                   | placeholder | Vuetify renderer set.                                                                             |

The former `material-renderers` package continues as `react-material`, `vanilla-renderers` as
`react-vanilla`; the former `examples*` packages continue as `packages/examples` (shared
example definitions) plus the per-renderer-set demo apps and the combined `demo-all` app
under `apps/`.

## MVP scope

- Two `SchemaSource`s — JSON Schema (objects with primitive properties, no `$ref`) and zod
  (`@jsonforms/zod`) — proving the schema-format abstraction.
- `VerticalLayout` / `HorizontalLayout`, string / number / integer / boolean controls.
- AJV-based validation via `@jsonforms/validator-ajv` (optional — core has no validator
  dependency). Issues show immediately by default; `config: { showIssuesOnTouch: true }`
  defers them until a field was touched.
- Identity-preserving full rebuild on every command: unchanged nodes keep their object
  identity, so only views of changed nodes re-render.

## Development

Requires Node ≥ 22.12 and pnpm 11 (via [corepack](https://nodejs.org/api/corepack.html)).

```bash
pnpm install
pnpm build         # build all packages (turborepo, topological + cached)
pnpm dev           # combined demo app (landing page + all renderer sets) at http://localhost:5170
pnpm test          # vitest across all packages
pnpm typecheck     # tsc --noEmit across all packages
pnpm lint          # eslint (flat config, repo-wide)
pnpm format        # prettier
```

Single package: `pnpm --filter @jsonforms/core test` or `turbo run build --filter @jsonforms/react...`

### Demo applications

All demo apps render the same shared examples from `@jsonforms/examples`:

```bash
pnpm dev                  # combined app with all renderer sets — http://localhost:5170
pnpm dev:react-material   # single app — http://localhost:5173
pnpm dev:react-vanilla    # single app — http://localhost:5174
```

In dev, the demo apps alias all `@jsonforms/*` packages to their `src/` entry points —
editing any library hot-reloads the running app instantly, without library watchers or
rebuilds. Production builds (and `vite build`) resolve the built `dist/` entry points,
exactly like an external consumer.

### Combined demo app

Aggregates every renderer-set demo into one app with a landing page for selecting the
renderer set (Vue, Angular, … join later as further sub-apps). It is deployed at
<https://jsonforms-4-demo.netlify.app> (see `netlify.toml`). `pnpm dev` serves it in dev
mode — every demo app mounted as Vite middleware on a single port, with HMR. The static
production build:

```bash
pnpm --filter @jsonforms/demo-all build
pnpm --filter @jsonforms/demo-all preview      # http://localhost:4173
```

## Releases

Versioning and publishing use [changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset           # record a change (per PR)
pnpm version-packages    # bump versions + changelogs (release PR)
pnpm release             # build + publish to npm
```

All publishable packages are versioned in lockstep and ship **ESM only** with type
declarations, source maps, and an `exports` map.

## License

MIT — see [LICENSE](LICENSE).
