# @jsonforms/react-shadcn

shadcn/ui renderer set for JSON Forms (React).

This package provides form renderers built with [shadcn/ui](https://ui.shadcn.com/) components and styled with Tailwind CSS. It follows the shadcn philosophy of providing copy-pasteable components while respecting your application's design system through CSS variables.

## Installation

```bash
npm install @jsonforms/react-shadcn @jsonforms/react @jsonforms/core
```

## Prerequisites

- React 16.12.0 or higher
- **Tailwind CSS 4.0.0 or higher** (required)
- Node.js 22+ (< 23)

## Setup

### 1. Install Tailwind CSS 4

If you haven't already, install Tailwind CSS 4 and the Vite plugin in your project:

```bash
npm install -D tailwindcss@latest @tailwindcss/vite
```

**Note:** This package requires Tailwind CSS v4 and the `@tailwindcss/vite` plugin. If you're using v3, please upgrade to v4 first.

### 2. Add CSS Variables

Add the following CSS variables to your global CSS file (e.g., `globals.css`, `index.css`, or `App.css`):

```css
@import "tailwindcss";

@theme {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(9.8% 0.006 285.8);
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(9.8% 0.006 285.8);
  --color-popover: oklch(100% 0 0);
  --color-popover-foreground: oklch(9.8% 0.006 285.8);
  --color-primary: oklch(11.2% 0.012 285.8);
  --color-primary-foreground: oklch(98% 0.002 285.8);
  --color-secondary: oklch(96.1% 0 0);
  --color-secondary-foreground: oklch(11.2% 0.012 285.8);
  --color-muted: oklch(96.1% 0 0);
  --color-muted-foreground: oklch(46.9% 0.004 285.8);
  --color-accent: oklch(96.1% 0 0);
  --color-accent-foreground: oklch(11.2% 0.012 285.8);
  --color-destructive: oklch(60.2% 0.177 29.2);
  --color-destructive-foreground: oklch(98% 0.002 285.8);
  --color-border: oklch(91.4% 0.002 285.8);
  --color-input: oklch(91.4% 0.002 285.8);
  --color-ring: oklch(9.8% 0.006 285.8);
  --radius: 0.5rem;
}

/* Dark mode (optional) */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(9.8% 0.006 285.8);
    --color-foreground: oklch(98% 0.002 285.8);
    --color-card: oklch(9.8% 0.006 285.8);
    --color-card-foreground: oklch(98% 0.002 285.8);
    --color-popover: oklch(9.8% 0.006 285.8);
    --color-popover-foreground: oklch(98% 0.002 285.8);
    --color-primary: oklch(98% 0.002 285.8);
    --color-primary-foreground: oklch(11.2% 0.012 285.8);
    --color-secondary: oklch(17.5% 0.009 285.8);
    --color-secondary-foreground: oklch(98% 0.002 285.8);
    --color-muted: oklch(17.5% 0.009 285.8);
    --color-muted-foreground: oklch(65.1% 0.005 285.8);
    --color-accent: oklch(17.5% 0.009 285.8);
    --color-accent-foreground: oklch(98% 0.002 285.8);
    --color-destructive: oklch(30.6% 0.132 29.2);
    --color-destructive-foreground: oklch(98% 0.002 285.8);
    --color-border: oklch(17.5% 0.009 285.8);
    --color-input: oklch(17.5% 0.009 285.8);
    --color-ring: oklch(83.9% 0.007 285.8);
  }
}
```

**Important:** These CSS variables are required for the components to render correctly. Tailwind v4 uses OKLCH color format for better color accuracy and perceptual uniformity. You can customize the colors to match your brand.

### 3. Configure Vite

**Required:** Add the Tailwind CSS Vite plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Important:** The `@tailwindcss/vite` plugin is required for Tailwind CSS v4 to work in Vite projects.

## Usage

### Basic Example

```tsx
import { JsonForms } from '@jsonforms/react';
import { shadcnRenderers, shadcnCells } from '@jsonforms/react-shadcn';
import { useState } from 'react';

const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 3,
    },
    lastName: {
      type: 'string',
    },
  },
  required: ['firstName'],
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/firstName',
    },
    {
      type: 'Control',
      scope: '#/properties/lastName',
    },
  ],
};

function App() {
  const [data, setData] = useState({});

  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={shadcnRenderers}
      cells={shadcnCells}
      onChange={({ data }) => setData(data)}
    />
  );
}
```

## Customization

### Via CSS Variables (Recommended)

The easiest way to customize the appearance is by overriding CSS variables in your global CSS:

```css
@theme {
  --color-primary: 220 90% 56%; /* Custom primary color */
  --color-destructive: 0 100% 50%; /* Custom error color */
  --radius: 0.25rem; /* Smaller border radius */
}
```

### Via Style Context (Advanced)

For component-level customization, use the `ShadcnStyleProvider`:

```tsx
import { JsonForms } from '@jsonforms/react';
import { shadcnRenderers, ShadcnStyleProvider } from '@jsonforms/react-shadcn';

const styleOverrides = {
  inputClasses: 'border-blue-500 focus:ring-blue-500',
  labelClasses: 'text-lg font-bold',
  errorClasses: 'text-red-600',
};

function App() {
  return (
    <ShadcnStyleProvider value={styleOverrides}>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={shadcnRenderers}
        onChange={({ data }) => setData(data)}
      />
    </ShadcnStyleProvider>
  );
}
```

## Dark Mode

Dark mode is supported via CSS `@media (prefers-color-scheme: dark)` or by adding a `.dark` class:

```tsx
// Toggle dark mode by adding/removing class on document element
document.documentElement.classList.toggle('dark');
```

Or use a library like [next-themes](https://github.com/pacocoursey/next-themes) for more advanced dark mode support.

## About shadcn/ui Components

This package includes shadcn/ui components (Input, Label) as internal implementation details. These components follow shadcn's philosophy of being copy-pasteable and customizable through CSS variables.

You don't need to install shadcn/ui separately or run the shadcn CLI - the necessary components are bundled with this package and will work with your existing Tailwind CSS setup.

## Phase 1 - Current Implementation

This is a Phase 1 implementation focusing on establishing the architecture. Currently supported:

- ✅ Text input controls (basic string types)
- ✅ VerticalLayout renderer
- ✅ Basic validation display
- ✅ Error messages with destructive styling
- ✅ Description text display
- ✅ Required field indicators
- ✅ Tailwind CSS 4 support with OKLCH colors
- ✅ Email input control

Not yet implemented (future phases):

- ⏳ Additional controls (number, boolean, enum, textarea, date, time)
- ⏳ More layout renderers (horizontal, group, categorization)
- ⏳ Complex renderers (arrays, objects, combinators)
- ⏳ Enhanced controls (radio groups, checkboxes, select dropdowns)

## Tailwind CSS 4 - What's Different?

This package uses Tailwind CSS v4, which has several improvements:

- **CSS-first configuration** using `@import "tailwindcss"` instead of `@tailwind` directives
- **Theme variables** defined in CSS using `@theme` instead of JavaScript config
- **Simpler setup** with no need for `tailwind.config.js` or `postcss.config.js`
- **Better performance** with faster build times

If you're upgrading from Tailwind v3, see the [Tailwind CSS v4 migration guide](https://tailwindcss.com/docs/upgrade-guide).

## Architecture

This package follows modern best practices:

- **No runtime CSS processing**: Tailwind classes are exported as-is and processed by your build pipeline
- **CSS variables for theming**: Respects your application's design system
- **Copy-paste friendly**: shadcn components are included in the package, not as a peer dependency
- **Modern styling**: Uses Tailwind CSS 4 with `@theme` and CSS-first configuration

## Browser Support

Modern browsers with ES6 support:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Styles not appearing

Make sure you've:
1. ✅ Installed Tailwind CSS v4 and the Vite plugin (`npm install -D tailwindcss@latest @tailwindcss/vite`)
2. ✅ Added the Tailwind Vite plugin to your `vite.config.ts` (`plugins: [react(), tailwindcss()]`)
3. ✅ Added the CSS variables to your global CSS file using `@theme` directive
4. ✅ Imported your global CSS file in your app entry point
5. ✅ Using `@import "tailwindcss"` (not `@tailwind` directives from v3)
6. ✅ Using OKLCH color format in `@theme` (not HSL in `:root`)

### Upgrading from Tailwind v3 to v4

1. Install Tailwind v4 and Vite plugin: `npm install -D tailwindcss@latest @tailwindcss/vite`
2. Add the Vite plugin to your `vite.config.ts`: `import tailwindcss from '@tailwindcss/vite'`
3. Remove `tailwind.config.js` and `postcss.config.js` (optional in v4)
4. Replace `@tailwind` directives with `@import "tailwindcss"`
5. Move CSS variables from `:root {}` to `@theme {}`
6. Update color variable names: `--background` → `--color-background`
7. Convert color values from HSL to OKLCH format (e.g., `0 0% 100%` → `oklch(100% 0 0)`)

See the [Tailwind CSS v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) for full details.

## Contributing

This package is part of the JSON Forms project. See the main [JSON Forms repository](https://github.com/eclipsesource/jsonforms) for contribution guidelines.

## License

MIT

## Links

- [JSON Forms Documentation](https://jsonforms.io)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [GitHub Repository](https://github.com/eclipsesource/jsonforms)
