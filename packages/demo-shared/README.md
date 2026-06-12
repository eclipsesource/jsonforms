# @jsonforms/demo-shared

> Private workspace package — not published.

Shared modules for the JSON Forms demo applications. Everything here is an axis
**orthogonal to the example data** — every demo app offers these choices for every example.

## Validation axis (`ValidationSettings`)

Demonstrates the pluggable `FormValidator` seam of `@jsonforms/core`:

- **AJV** — schema-based validation via the per-draft subpath entries of
  `@jsonforms/validator-ajv`. Sub-options: the **AJV version** (draft-07 — AJV's default
  build — or `2019-09` / `2020-12`; there is no automatic dialect detection, so a schema
  declaring a newer dialect fails to compile with an older build, and the demo apps surface
  that error) and an **Async** mode that delivers results promise-based without added
  delay, exercising the engine's async validation path.
- **Handwritten (no AJV)** — a naive, dependency-free validator interpreting basic schema
  constraints; proves that no validation framework is required.
- **None** — validation disabled.

The validation settings apply identically to local and worker-hosted engines.

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

  Worker mode offers `ServerSimulationOptions`: an **artificial delay** applied to every
  server response, and a **reject-changes percentage** — rejected value changes produce no
  delta, so the UI visibly snaps back to the authoritative server state.
