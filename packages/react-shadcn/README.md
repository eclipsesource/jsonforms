# JSON Forms - shadcn/ui Renderers

This package provides a set of renderers for [JSON Forms](https://jsonforms.io) using [shadcn/ui](https://ui.shadcn.com/) components and Tailwind CSS v4.

## Features

- 🎨 Modern, accessible UI components based on Radix UI primitives
- 🌓 Built-in support for light and dark modes
- 🎯 Full JSON Forms feature support (controls, cells, layouts, arrays, categorization)
- ⚡ Tailwind CSS v4 with OKLCH color format
- 🔧 Extensible styling system via context
- 📱 Responsive layouts
- ♿ WCAG compliant components

## Installation

```bash
npm install @jsonforms/react-shadcn @jsonforms/core @jsonforms/react
# or
pnpm add @jsonforms/react-shadcn @jsonforms/core @jsonforms/react
# or
yarn add @jsonforms/react-shadcn @jsonforms/core @jsonforms/react
```

### Peer Dependencies

This package requires the following peer dependencies:

- `@jsonforms/core` ^3.7.0
- `@jsonforms/react` ^3.7.0
- `react` ^16.12.0 || ^17.0.0 || ^18.0.0 || ^19.0.0
- `tailwindcss` ^4.0.0

## Setup

### 1. CSS Configuration

Create a CSS file with the required CSS variables. shadcn/ui uses OKLCH color format for better color handling:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Light mode colors */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.27 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.964 0 0);
  --color-secondary-foreground: oklch(0.145 0 0);
  --color-muted: oklch(0.964 0 0);
  --color-muted-foreground: oklch(0.455 0 0);
  --color-accent: oklch(0.964 0 0);
  --color-accent-foreground: oklch(0.145 0 0);
  --color-destructive: oklch(0.576 0.214 25.096);
  --color-destructive-foreground: oklch(0.985 0 0);
  --color-border: oklch(0.898 0 0);
  --color-input: oklch(0.898 0 0);
  --color-ring: oklch(0.145 0 0);
  --radius: 0.5rem;

  /* Dark mode colors */
  @media (prefers-color-scheme: dark) {
    --color-background: oklch(0.145 0 0);
    --color-foreground: oklch(0.985 0 0);
    --color-card: oklch(0.145 0 0);
    --color-card-foreground: oklch(0.985 0 0);
    --color-popover: oklch(0.145 0 0);
    --color-popover-foreground: oklch(0.985 0 0);
    --color-primary: oklch(0.985 0 0);
    --color-primary-foreground: oklch(0.145 0 0);
    --color-secondary: oklch(0.237 0 0);
    --color-secondary-foreground: oklch(0.985 0 0);
    --color-muted: oklch(0.237 0 0);
    --color-muted-foreground: oklch(0.636 0 0);
    --color-accent: oklch(0.237 0 0);
    --color-accent-foreground: oklch(0.985 0 0);
    --color-destructive: oklch(0.628 0.258 25.823);
    --color-destructive-foreground: oklch(0.985 0 0);
    --color-border: oklch(0.237 0 0);
    --color-input: oklch(0.237 0 0);
    --color-ring: oklch(0.832 0 0);
  }
}
```

### 2. Basic Usage

```tsx
import { JsonForms } from '@jsonforms/react';
import { shadcnRenderers, shadcnCells } from '@jsonforms/react-shadcn';
import '@jsonforms/react-shadcn/dist/jsonforms-react-shadcn.css'; // Optional: includes base styles
import './globals.css'; // Your CSS with theme variables

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Enter your name',
    },
    age: {
      type: 'number',
      minimum: 0,
    },
    active: {
      type: 'boolean',
    },
  },
  required: ['name'],
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name',
    },
    {
      type: 'Control',
      scope: '#/properties/age',
    },
    {
      type: 'Control',
      scope: '#/properties/active',
    },
  ],
};

const initialData = {};

function App() {
  const [data, setData] = useState(initialData);

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

## Customizing Styles

The shadcn renderer set provides a context-based styling system that allows you to customize the appearance of components without modifying the source code.

### Using ShadcnStyleContext

```tsx
import { JsonForms } from '@jsonforms/react';
import { shadcnRenderers, shadcnCells, ShadcnStyleContext } from '@jsonforms/react-shadcn';

const customStyles = {
  wrapperClasses: 'p-4 border border-gray-200 rounded-lg',
  labelClasses: 'font-semibold text-lg',
  inputClasses: 'bg-gray-50',
  errorClasses: 'text-red-600 font-medium',
  descriptionClasses: 'text-sm italic',
};

function App() {
  return (
    <ShadcnStyleContext.Provider value={customStyles}>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={shadcnRenderers}
        cells={shadcnCells}
      />
    </ShadcnStyleContext.Provider>
  );
}
```

### Available Style Overrides

- `wrapperClasses`: Applied to the outer wrapper of controls and layouts
- `labelClasses`: Applied to form labels
- `inputClasses`: Applied to input elements
- `errorClasses`: Applied to validation error messages
- `descriptionClasses`: Applied to field descriptions

## Supported Renderers

### Controls

- **TextControl**: String inputs with support for password, email, etc.
- **NumberControl**: Number inputs with step control
- **BooleanControl**: Checkbox for boolean values
- **EnumControl**: Select dropdown for enum values
- **TextAreaControl**: Multi-line text input
- **RadioGroupControl**: Radio buttons for single selection
- **OneOfRadioGroupControl**: Radio buttons for oneOf schemas
- **InputControl**: Fallback control using DispatchCell

### Cells (for tables/arrays)

- **TextCell**: String cell renderer
- **NumberCell**: Number cell renderer
- **IntegerCell**: Integer cell renderer
- **BooleanCell**: Checkbox cell renderer
- **EnumCell**: Select cell renderer
- **OneOfEnumCell**: OneOf enum cell renderer
- **DateCell**: Date picker cell
- **DateTimeCell**: Date and time picker cell
- **TimeCell**: Time picker cell
- **TextAreaCell**: Multi-line text cell
- **SliderCell**: Slider for numeric values
- **NumberFormatCell**: Formatted number display

### Layouts

- **VerticalLayout**: Stacks elements vertically
- **HorizontalLayout**: Arranges elements horizontally
- **GroupLayout**: Groups elements with an optional title

### Complex Renderers

- **ArrayControlRenderer**: Renders arrays with add/remove buttons
- **TableArrayControl**: Renders arrays as tables
- **CategorizationRenderer**: Tab-based categorization
- **ObjectRenderer**: Renders nested objects
- **ListWithDetailRenderer**: Master-detail view for arrays
- **AllOfRenderer**: Handles allOf schema combinations
- **AnyOfRenderer**: Handles anyOf schema combinations
- **OneOfRenderer**: Handles oneOf schema combinations
- **LabelRenderer**: Renders labels/text

## UI Schema Options

The shadcn renderers support various options that can be set in the UI schema:

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "focus": true,
    "placeholder": "Enter your name",
    "format": "password",
    "restrict": true,
    "trim": true
  }
}
```

### Common Options

- `focus`: Auto-focus the input when rendered
- `placeholder`: Placeholder text for inputs
- `format`: For string controls, can be "password" to mask input
- `restrict`: Apply schema maxLength to input maxLength attribute
- `trim`: Apply schema maxLength to input size attribute

## TypeScript Support

This package includes TypeScript type definitions. All renderers and utilities are fully typed.

```tsx
import type { ShadcnRendererProps, ShadcnStyleOverrides } from '@jsonforms/react-shadcn';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

The JSON Forms project is licensed under the MIT License. See the [LICENSE](https://github.com/eclipsesource/jsonforms/blob/master/LICENSE) file for more information.

## More Information

- [JSON Forms Documentation](https://jsonforms.io)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [GitHub Repository](https://github.com/eclipsesource/jsonforms)
