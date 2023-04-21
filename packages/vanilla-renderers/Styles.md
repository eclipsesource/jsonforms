# Style handling in the Vanilla Renderer Set

## List of all Style Ids and hardcoded classNames

### ArrayRenderer

#### Hardcoded ClassNames

- control

#### Ids

- array.layout &rightarrow; id for the whole control
- array.button &rightarrow; id for the add button
- array.children &rightarrow; id for the area of the children

### CategorizationRenderer

#### Ids

- categorization &rightarrow; id for the whole control
- categorization.master &rightarrow; id for the master part
- categorization.detail &rightarrow; id for the detail part
- category.subcategories &rightarrow; id for a new list in the master
- category.group &rightarrow; id for a categorization in the master list

### LabelRenderer

#### Ids

- label-control &rightarrow; id for the label

### TableArrayRenderer

#### Ids

- array.table &rightarrow; id for the whole control
- array.table.table &rightarrow; id for the table
- array.table.label &rightarrow; id for the label in the header
- array.table.button &rightarrow; id for the add button
- array.table.validation &rightarrow; id for the validation field
- array.table.validation.error &rightarrow; id for the validation error field
- array.validation.error &rightarrow; id for the validation column if activated

### GroupRenderer

#### Hardcoded ClassNames

- group-layout-item &rightarrow; class for a child

#### Ids

- group.layout &rightarrow; id for the group
- group.label &rightarrow; id for the group label
- group.layout.item &rightarrow; id for each wrapper of the children of the group

### HorizontalLayoutRenderer

#### Hardcoded ClassNames

- horizontal-layout-item &rightarrow; class for a child

#### Ids

- horizontal.layout &rightarrow; id for the horizontal layout
- horizontal.layout.item &rightarrow; id for each wrapper of the children of the horizontal layout

### VerticalLayoutRenderer

#### Hardcoded ClassNames

- vertical-layout-item &rightarrow; class for a child

#### Ids

- vertical.layout &rightarrow; id for the vertical layout
- vertical.layout.item &rightarrow; id for each wrapper of the children of the vertical layout

### Controls

#### Hardcoded ClassNames

- validate valid/invalid &rightarrow; id for the input of control indicating whether it is valid or not

#### Ids

- control &rightarrow; id for the whole control
- control.label &rightarrow; id for the label of control
- control.validation &rightarrow; id for the validation of control
- control.validation.error &rightarrow; id for the validation error of control
- input.description &rightarrow; id for the description of control

## Example of styling id contributions

By default, the `vanillaStyles` defined in [src/styles/styles.ts](./src/styles/styles.ts) are applied.
These can be overwritten via the `JsonFormsStyleContext`.
The following example will completely replace the default styles.

```typescript
import { JsonFormsStyleContext } from '@jsonforms/vanilla-renderers';

const styleContextValue = { styles: [
  {
    name: 'control.input',
    classNames: ['custom-input']
  },
  {
    name: 'array.button',
    classNames: ['custom-array-button']
  }
]};

<JsonFormsStyleContext.Provider value={styleContextValue}>
  <JsonForms
    data={data}
    schema={schema}
    uischema={uischema}
    ...
  />
</JsonFormsStyleContext.Provider>
```

You can also extend the existing default styles.
Thereby, the existing style classes as well as your custom ones will be applied.
This is the case because all style definitions for an ID are merged.

```typescript
import { JsonFormsStyleContext, vanillaStyles } from '@jsonforms/vanilla-renderers';

const styleContextValue = { styles: [
  ...vanillaStyles,
  {
    name: 'control.input',
    classNames: ['custom-input']
  },
  {
    name: 'array.button',
    classNames: ['custom-array-button']
  }
]};

<JsonFormsStyleContext.Provider value={styleContextValue}>
  <JsonForms
    data={data}
    schema={schema}
    uischema={uischema}
    ...
  />
</JsonFormsStyleContext.Provider>
```
