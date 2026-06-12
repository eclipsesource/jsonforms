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
label, description, value, validation issues, visibility, enablement, constraints. The model is
produced by a pluggable builder pipeline (`SchemaSource` abstracts the schema format,
`FormValidator` abstracts validation, `NodeProcessor`s enable cross-cutting customization) and
owned by a `FormEngine` that processes serializable commands and notifies subscribers with
node-granular deltas. Renderers are thin views; framework bindings subscribe per node.

## Packages

| Package                         | Status      | Description                                                                         |
| ------------------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `@jsonforms/core`               | **MVP**     | Framework-agnostic presentation model, builder, engine, testers. Zero dependencies. |
| `@jsonforms/validator-ajv`      | **MVP**     | `FormValidator` implementation backed by AJV.                                       |
| `@jsonforms/react`              | **MVP**     | React 19 binding: `<JsonForms>`, `useNode`, `NodeDispatch`.                         |
| `@jsonforms/react-material`     | **MVP**     | Material UI (v9) renderer set.                                                      |
| `@jsonforms/demo` (`apps/demo`) | **MVP**     | Vite demo app showcasing the MVP.                                                   |
| `@jsonforms/react-vanilla`      | placeholder | Plain-HTML React renderer set (successor of `vanilla-renderers`).                   |
| `@jsonforms/angular`            | placeholder | Angular binding.                                                                    |
| `@jsonforms/angular-material`   | placeholder | Angular Material renderer set.                                                      |
| `@jsonforms/vue`                | placeholder | Vue binding.                                                                        |
| `@jsonforms/vue-vanilla`        | placeholder | Plain-HTML Vue renderer set.                                                        |
| `@jsonforms/vue-vuetify`        | placeholder | Vuetify renderer set.                                                               |

The former `material-renderers` package continues as `react-material`, `vanilla-renderers` as
`react-vanilla`; the former `examples*` packages are replaced by `apps/demo`.

## MVP scope

- JSON Schema as the first `SchemaSource` (objects with primitive properties, no `$ref`).
- `VerticalLayout` / `HorizontalLayout`, string / number / integer / boolean controls.
- AJV-based validation via `@jsonforms/validator-ajv` (optional — core has no validator
  dependency), with `touched`-based error display.
- Identity-preserving full rebuild on every command: unchanged nodes keep their object
  identity, so only views of changed nodes re-render.

## Development

Requires Node ≥ 22.12 and pnpm 11 (via [corepack](https://nodejs.org/api/corepack.html)).

```bash
pnpm install
pnpm build         # build all packages (turborepo, topological + cached)
pnpm dev           # watch mode: rebuild libraries + run the demo app dev server
pnpm test          # vitest across all packages
pnpm typecheck     # tsc --noEmit across all packages
pnpm lint          # eslint (flat config, repo-wide)
pnpm format        # prettier
```

Single package: `pnpm --filter @jsonforms/core test` or `turbo run build --filter @jsonforms/react...`

The demo app: `pnpm --filter @jsonforms/demo dev` (after `pnpm build`), then open
<http://localhost:5173>.

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
