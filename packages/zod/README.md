# @jsonforms/zod

[Zod](https://zod.dev/) integration for JSON Forms 4.x — a `SchemaSource` and a
`FormValidator` derived from the same zod schema. No JSON Schema and no AJV involved.

```ts
import { createFormEngine } from '@jsonforms/core';
import { zodSchemaSource, zodValidator } from '@jsonforms/zod';

const schema = z.object({
  name: z.string().min(2),
  age: z.int().min(0).optional(),
});

const engine = createFormEngine({
  schemaSource: zodSchemaSource(schema),
  validator: zodValidator(schema),
  data,
});
```

- **Scopes are plain JSON Pointers** (`/name`, `/address/city`): zod has no schema-tree
  indirection, so scope and data path coincide. UI schemas keep their structure — only the
  scope notation differs from JSON Schema sources.
- **The schema is the validator**: `zodValidator` maps `safeParse` issues onto controls,
  including cross-field rules via `.refine(..., { path })` — something JSON Schema cannot
  express.
- Facets are introspected natively from the zod type tree: optionality → `required`,
  `.default()` → default value, `.min()`/`.max()` → constraints, `.describe()`/`.meta()` →
  description and title.

MVP scope: object schemas with primitive properties (matching the current renderer sets).
