# Migration guide

## Migrating to JSON Forms 3.0

### Additional parameter for testers

Previously the testers had the following interfaces.

```ts
type Tester = (uischema: UISchemaElement, schema: JsonSchema) => boolean;
type RankedTester = (uischema: UISchemaElement, schema: JsonSchema) => number;
```

Testers may be invoked on arbitrary subschemas of the form-wide schema, for example on nested objects or array items.
Therefore JSON Forms was not able to properly run the testers on schemas containing `$ref`s pointing to a parent element.
The workaround for this was to resolve the JSON Schema by hand before handing it over to JSON Forms.
Only the React renderers did this automatically but we removed this functionality, see the next section for more information.

We now added an additional parameter to the testers, the new `TesterContext`.

```ts
interface TesterContext {
  rootSchema: JsonSchema;
  config: any;
}

type Tester = (uischema: UISchemaElement, schema: JsonSchema, context: TesterContext) => boolean;
type RankedTester = (uischema: UISchemaElement, schema: JsonSchema, context: TesterContext) => number;
```

This allows the testers to resolve any `$ref` they might encounter in their handed over `schema` by using the context's `rootSchema`.
Therefore the manual resolving of JSON Schemas before handing them over to JSON Forms does not need to be performed in those cases.
In addition, testers can now access the form wide `config`.

### Removal of JSON Schema $Ref Parser

We removed the `json-schema-ref-parser` dependency within the core package.
This change only affects users of the React variant, Vue and Angular users are not affected.

`json-schema-ref-parser` was used to resolve external JSON Schema references.
As a side effect it also resolved 'internal' references and therefore simplified the JSON Schema for JSON Forms' processing.
However that resolving was quite slow, the JSON Schema was mutated in place and `json-schema-ref-parser` brought in Node-only dependencies which needed to be polyfilled.
Also all users of JSON Forms React had to pay the resolving effort, whether they needed it or not.

Most React users should be unaffected by this change and don't need to spend any migration efforts.
However when you relied on the resolving of external JSON Schema references via the `refParserOptions` or use complicated references setups which can't yet be handled by JSON Forms' internal processing, you can resolve the JSON Schema before handing it over to JSON Forms.

To restore the old behavior, you can use `json-schema-ref-parser` or other libraries like `json-refs` to resolve references on your own before passing the schema to JSON Forms.

```ts
import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import JsonRefs from 'json-refs';

import mySchemaWithReferences from 'myschema.json';

const refParserOptions = {
  dereference: {
    circular: false
  }
}

function App() {
  const [data, setData] = useState(initialData);
  const [resolvedSchema, setSchema] = useState();

  useEffect(() => {
    $RefParser.dereference(mySchemaWithReferences).then(res => setSchema(res.$schema));
    // or
    JsonRefs.resolveRefs(mySchemaWithReferences).then(res => setSchema(res.resolved));
  },[]);

  if(resolvedSchema === undefined) {
    return <div> Loading... </div>
  }

  return (
    <JsonForms
      schema={resolvedSchema}
      uischema={uischema}
      data={data}
      renderers={materialRenderers}
      cells={materialCells}
      onChange={({ data, _errors }) => setData(data)}
    />
  );
}
```

For more information have a look at our [ref-resolving](https://jsonforms.io/docs/ref-resolving) docs page.

### Update to Material UI v5 in React Material

Material UI was updated from version 4 to version 5 which introduced a lot of breaking changes.
To update your application see the official Material UI [migration guide](https://mui.com/guides/migration-v4/).

### Removal of React Material extended renderer set

Previously we maintained a separate 'extended' renderer set to not force all consumers of JSON Forms to consume the Material UI lab dependency.
With the update to Material UI v5 the lab dependency became more important as it also contains all date and time pickers.
Therefore we now require the lab dependency and removed the no longer needed extended renderer set.

If you consumed the extended renderer set then just revert to the normal renderer set.
There should not be any behavior changes.

### Removal of Class Components in React Material

All React Material class components were refactored to functional components.
Please check whether you extended any of our base renderers in your adaptation.

### Scopable interface change

The `scope` attribute in `Scopable` is now optional.
Use `Scoped` instead for non optional scopes.
The utility function `fromScopable` was renamed to `fromScoped` accordingly.

### Localization of Date Picker in Angular Material

Date Picker in Angular Material will use the global configuration of your Angular Material application.

### React prop mapping functions

Renamed `ctxToJsonFormsDispatchProps` to `ctxToJsonFormsRendererProps` in order to better reflect the function's purpose.

## Migrating to JSON Forms 2.5

### JsonForms Component for Angular

The JsonFormsAngularService is not provided in the root anymore.
To keep the old behavior, you need to provide it manually in the module.

The preferred way is using the new JsonForms Component though.
This component wraps the service and allows the user to interact with it using databinding.

Example:

```ts
import { Component } from '@angular/core';
import { angularMaterialRenderers } from '../../src/index';
export const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  },
  required: ['name']
};
export const data = {name: 'Send email to Adrian'};

@Component({
  selector: 'app-root',
  template: `
    <div>Data: {{ data | json }}</div>
    <jsonforms
      [data]="data"
      [schema]="schema"
      [renderers]="renderers"
      (dataChange)="onDataChange($event)"
    ></jsonforms>
  `
})
export class AppComponent {
  readonly renderers = angularMaterialRenderers;
  data: any;
  onDataChange(data: any) {
    this.data = data;
  }
}
```

### Removal of React Redux integration

In version 2.5 we made the `redux` dependency within the `react` package optional.
Users of the JSON Forms React standalone version (i.e. without Redux) don't need to change anything.
In contrary you no longer need to install 'redux' and 'react-redux' to use JSON Forms.

Users of the JSON Forms Redux variant need to perform some changes.

Basically there are two different approaches:

1. Migrate your app to the standalone variant
2. Keep using the Redux variant of JSON Forms

Below you can find some guidance about each approach.

In any case, users of the vanilla renderers need to migrate style definitions.
Providing style classes via the redux context is no longer supported even when using the redux fallback.
For more information see the [vanilla renderer style guide](./packages/vanilla/Styles.md).

#### Case 1: Migrate to the standalone variant (recommended)

The standalone JSON Forms variant is the new default and the main focus for new features and bug fixes.
We definitely recommend migrating to this version as soon as possible.
All current Redux functionally can also be achieved with the standalone version.

##### Example 1: Init action

Previously the store was initialized like this:

```ts
const store = createStore(
  combineReducers({ jsonforms: jsonformsReducer() }),
  {
    jsonforms: {
      cells: materialCells,
      renderers: materialRenderers
    }
  }
);
store.dispatch(Actions.init(data, schema, uischema));
return (
  <Provider store={store}>
    <JsonFormsReduxContext>
      <JsonFormsDispatch />
    </JsonFormsReduxContext>
  </Provider>
);
```

Instead of creating a store and passing the required information to that store, we rather pass it directly to the `<JsonForms .../>` component:

```ts
return (
  <JsonForms
    schema={schema}
    uischema={uischema}
    data={data}
    renderers={materialRenderers}
    cells={materialCells}
  />
);
```

##### Example 2: Register a custom renderer

Another commonly used action is the 'register renderer' action.

With Redux this could look like this:

```ts
store.dispatch(Actions.registerRenderer(customControlTester, CustomControl));
```

Within the standalone version, the renderer can just be provided to the `<JsonForms .../>` element like this:

```ts
const renderers = [
  ...materialRenderers,
  // register custom renderer
  { tester: customControlTester, renderer: CustomControl }
];

const MyApp = () => (
  <JsonForms
    // other necessary declarations go here...
    renderers={renderers}
  />
);

```

##### Example 3: Listen to data and validation changes

The `JsonForms` component offers to register a listener which is notified whenever `data` and `errors` changes:

```ts
const MyApp = () => {
  const [data, setData] = useState();
  return (
    <JsonForms
      data={data}
      // other necessary declarations go here...
      onChange={({ data, errors }) => setData(data)}
    />
  );
};
```

#### Case 2: Use the Redux fallback

If you want to keep using the Redux variant of JSON Forms for now (which is not recommended), you have to change a few import paths.

The new imports are available at `@jsonforms/react/lib/redux`, i.e.

```ts
import { jsonformsReducer, JsonFormsReduxProvider } from '@jsonforms/react/lib/redux';
```

## Migrating from JSON Forms 1.x (AngularJS 1.x)

The complexity of the migration of an existing JSON Forms 1.x application, which is based on AngularJS, to JSON Forms 2.x depends on the feature set you use.

### Architectural changes in JSON Forms 2.x

There are two big changes between JSON Forms 1 and JSON Forms 2 you need to understand when migrating your existing application.

1. JSON Forms 2.x does not rely on any specific UI framework [or library].
  The `2.0.0` initial release featured renderers based on [React](https://reactjs.org).
  An [Angular](https://angular.io) based renderer set was released with `2.1.0`.

2. Since JSON Forms 2.x maintains its internal state via [redux](https://redux.js.org/), you will need to add it as a dependency to your application.

### Steps for upgrading your application to JSON Forms 2.x

#### Step 1: Update your UI schemata

There is only one minor change in the UI schemata.
The UI Schema for controls was simplified and the bulky `ref` object inside `scope` was removed.

Instead of:

```ts
const uischema = {
    type: 'Control',
    scope: {
        $ref: '#/properties/name'
    }
}
```

simply write:

```ts
const uischema = {
    type: 'Control',
    scope: '#/properties/name'
}
```

Otherwise the UI schema remains unchanged and works like in JSON Forms 1.x.

#### Step 2: Use JSON Forms 2.x in your application

As JSON Forms 2 does not rely on any specific UI framework or library you can choose which renderer set you want to use.
The React Material renderer set is the most polished one at the moment, followed by Angular Material and the Vanilla renderer sets.

##### Use with React

Please refer to the React [tutorial](http://jsonforms.io/docs/tutorial).

#### Step 3: Migrate Custom Renderers

Any custom renderer needs to be refactored to conform to the new custom renderer style in JSON Forms 2.x.
You can find instructions how to implement Custom controls based on React [here](http://jsonforms.io/docs/custom-renderers).
While you need to change a lot except for the template, the good news it that writing custom renderers became much simpler in JSON Forms 2 since the framework will trigger rendering and re-rendering in case of changes to the data or other state.
In many cases this means you will be able to streamline your code for custom renderers significantly.
