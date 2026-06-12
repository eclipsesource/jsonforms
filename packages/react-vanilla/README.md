# @jsonforms/react-vanilla

Plain-HTML renderer set for JSON Forms 4.x (React) — the successor of the 3.x
`@jsonforms/vanilla-renderers` package.

Renderers emit semantic HTML with `jf-` prefixed class names and ship **no styling**
(except the flex direction of layouts). Style them from your application:

```css
.jf-control { … }
.jf-label { … }
.jf-input { … }
.jf-control--invalid .jf-input { border-color: red; }
.jf-issues { color: red; }
```

MVP scope: vertical/horizontal layouts, string, number/integer, and boolean controls.

```tsx
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers } from '@jsonforms/react-vanilla';

<JsonForms
  schema={schema}
  uischema={uischema}
  data={data}
  renderers={vanillaRenderers}
/>;
```
