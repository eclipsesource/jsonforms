# @jsonforms/examples

Shared example forms for the JSON Forms demo applications. Every renderer-set demo app
renders the same examples, so renderer sets can be compared side by side.

Examples are grouped by **schema format**, with a subpath export per group so consumers
bundle only the formats they use:

```ts
import { exampleGroups, allExamples, findExample } from '@jsonforms/examples';
import { jsonSchemaExamples } from '@jsonforms/examples/json-schema'; // no zod in the bundle
import { zodExamples } from '@jsonforms/examples/zod';
```

- `./json-schema` — examples driven by a JSON Schema: **pure, serializable data**
  (`JsonSchemaExample`). A schema's dialect is part of the data via its standard `$schema`
  declaration.
- `./zod` — examples driven by a [zod](https://zod.dev/) schema (`ZodExample`). Zod schemas
  are code, not data; each example carries a `schemaText` snippet so the demo apps can
  display the definition. Note the scopes in their UI schemas: plain data pointers
  (`/name`), no `#/properties` indirection — scope semantics belong to the `SchemaSource`.

Orthogonal topics — which validator runs, server-side building, etc. — deliberately do not
leak into the examples; the demo apps offer those as separate selectors (see
`@jsonforms/demo-shared`).

A test guards that every example builds a presentation model without configuration issues.
