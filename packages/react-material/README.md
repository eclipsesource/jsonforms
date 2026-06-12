# @jsonforms/react-material

[Material UI](https://mui.com/) (v9) renderer set for JSON Forms 4.x — the successor of the
3.x `@jsonforms/material-renderers` package.

Renderers are thin views over presentation nodes: every renderer reads a single node
(label, value, issues, constraints — all precomputed by `@jsonforms/core`) and dispatches
commands (`setValue`, `touch`). No schema access, no derivation logic.

MVP scope: vertical/horizontal layouts, string, number/integer, and boolean controls.

```tsx
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/react-material';

<JsonForms
  schema={schema}
  uischema={uischema}
  data={data}
  renderers={materialRenderers}
/>;
```
