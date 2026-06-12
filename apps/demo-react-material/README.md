# @jsonforms/demo-react-material

Vite + React 19 + Material UI v9 demo application for the JSON Forms 4.x
presentation-model MVP. Renders the shared examples from `@jsonforms/examples`
(selectable, grouped by schema format) with the `@jsonforms/react-material`
renderer set, next to live views of the form data, the JSON Schema, and the
UI schema.

```bash
pnpm install && pnpm build   # from the repo root, once
pnpm --filter @jsonforms/demo-react-material dev
```

Then open <http://localhost:5173>.
