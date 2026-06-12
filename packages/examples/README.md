# @jsonforms/examples

Shared example forms for the JSON Forms demo applications. Every renderer-set demo app
renders the same examples, so renderer sets can be compared side by side.

Examples are grouped by **schema format**:

- `src/json-schema/` — examples driven by a JSON Schema (`schema` + optional `uischema` +
  `data`).
- Other schema formats (zod, plain definitions, …) become sibling groups once their
  `SchemaSource` implementations exist.

```ts
import { exampleGroups, allExamples, findExample } from '@jsonforms/examples';
```

Examples are **pure data** (`JsonSchemaExample`): schema, optional UI schema, and data.
Orthogonal topics — which validator runs, server-side building, etc. — deliberately do not
leak into them; the demo apps offer those as separate selectors (see
`@jsonforms/demo-validators`). A schema's dialect is part of the data via its standard
`$schema` declaration.

A test guards that every example builds a presentation model without configuration issues.
