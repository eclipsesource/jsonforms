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

Each example is plain data (`JsonSchemaExample`); the package has no runtime dependencies.
A test guards that every example builds a presentation model without configuration issues.
