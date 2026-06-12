# @jsonforms/core

Framework-agnostic core of JSON Forms 4.x. Builds and maintains a **presentation model** —
a serializable collection of nodes mirroring the rendered form, where every node carries
everything a renderer needs (label, value, validation issues, constraints, …).

- `createFormEngine` — stateful runtime: owns data + model, processes serializable commands
  (`set-value`, `touch`), notifies subscribers with node-granular deltas.
- `SchemaSource` — abstracts the schema format; `jsonSchemaSource` is the JSON Schema
  implementation.
- `FormValidator` — abstracts validation; see `@jsonforms/validator-ajv` for the AJV
  implementation. Core itself has **zero dependencies**.
- `NodeProcessor` — cross-cutting customization hook applied to every node during builds.
- Node testers (`rankWith`, `isStringControl`, …) — rank renderers against presentation nodes.

See `docs/presentation-model/architecture.html` in the repository root for the full design.
