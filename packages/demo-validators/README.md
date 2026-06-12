# @jsonforms/demo-validators

> Private workspace package — not published.

Selectable validators for the JSON Forms demo applications. Validation is an axis
**orthogonal to the example data**: every demo app offers these choices for every example,
demonstrating the pluggable `FormValidator` seam of `@jsonforms/core`:

- **AJV** — schema-based validation; the AJV build (draft-07 / 2020-12) is picked from the
  schema's declared `$schema` dialect, via the per-draft subpath entries of
  `@jsonforms/validator-ajv`.
- **AJV (async, simulated server)** — the same, wrapped with artificial latency to
  demonstrate asynchronous (server-side) validation.
- **Handwritten (no AJV)** — a naive, dependency-free validator interpreting basic schema
  constraints; proves that no validation framework is required.
- **None** — validation disabled.
