# @jsonforms/demo-shared

> Private workspace package — not published.

Shared modules for the JSON Forms demo applications. Everything here is an axis
**orthogonal to the example data** — every demo app offers these choices for every example.

## Validation axis (`ValidationChoice`)

Demonstrates the pluggable `FormValidator` seam of `@jsonforms/core`:

- **AJV** — schema-based validation; the AJV build (draft-07 / 2020-12) is picked from the
  schema's declared `$schema` dialect, via the per-draft subpath entries of
  `@jsonforms/validator-ajv`.
- **AJV (async, simulated server)** — the same, wrapped with artificial latency to
  demonstrate asynchronous (server-side) validation.
- **Handwritten (no AJV)** — a naive, dependency-free validator interpreting basic schema
  constraints; proves that no validation framework is required.
- **None** — validation disabled.

## Engine axis (`EngineChoice`)

Demonstrates location independence (deployment "Mode C" of the architecture):

- **Local (browser)** — the engine runs on the UI thread (today's default setup).
- **Web Worker (server simulation)** — a real engine runs inside a Web Worker
  (`createEngineHost`); the UI thread holds only a thin `FormEngine` facade
  (`createRemoteFormEngine`) and exchanges **serialized commands and deltas** — no schema
  source, no validator, no builder on the UI thread. Deltas are applied with core's
  `applyDelta`, preserving node identities so node-granular re-rendering keeps working.
  A real network server merely swaps the transport; the protocol is identical — which is
  also why the whole demo remains statically hostable.
