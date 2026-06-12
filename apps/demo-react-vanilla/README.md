# @jsonforms/demo-react-vanilla

Vite + React 19 demo application for the JSON Forms 4.x presentation-model MVP,
using the plain-HTML `@jsonforms/react-vanilla` renderer set. Renders the shared
examples from `@jsonforms/examples` (selectable, grouped by schema format) next to
live views of the form data, the JSON Schema, and the UI schema. The `jf-` renderer
class names are styled in `src/app.css`.

```bash
pnpm install && pnpm build   # from the repo root, once
pnpm --filter @jsonforms/demo-react-vanilla dev
```

Then open <http://localhost:5174>.
