# @jsonforms/react

React 19 bindings for the JSON Forms 4.x presentation model.

```tsx
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/react-material';
import { ajvValidator } from '@jsonforms/validator-ajv';

<JsonForms
  schema={schema}
  uischema={uischema}
  data={data}
  validator={ajvValidator(schema)}
  renderers={materialRenderers}
  onChange={({ data }) => console.log(data)}
/>;
```

- `<JsonForms>` owns (or receives) a `FormEngine` from `@jsonforms/core`.
- `useNode(id)` / `useControlNode(id)` / `useLayoutNode(id)` subscribe to a single
  presentation node via `useSyncExternalStore` — only views of changed nodes re-render.
- `NodeDispatch` resolves the highest-ranking renderer for a node; container renderers
  recurse by rendering a `NodeDispatch` per child id.
- Renderers are thin views: they read the node and use `useControlDispatch(node)` for value
  edits and touch — no paths or ids involved. All commands dispatched this way carry the node
  as `sourceNodeId` provenance. `useFormDispatch` remains the low-level fallback for
  customizations.
