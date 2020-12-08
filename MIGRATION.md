# Migrating to JSON Forms 2.5 for Angular users
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

# Migrating to JSON Forms 2.5 for React users

In version 2.5 we made the `redux` dependency within the `react` package optional.
Users of the JSON Forms React standalone version (i.e. without Redux) don't need to change anything.
In contrary you no longer need to install 'redux' and 'react-redux' to use JSON Forms.

Users of the JSON Forms Redux variant need to perform some changes.

Basically there are two different approaches:
1. Migrate your app to the standalone variant
2. Keep using the Redux variant of JSON Forms

Below you can find some guidance about each approach.

## Case 1: Migrate to the standalone variant (recommended)

The standalone JSON Forms variant is the new default and the main focus for new features and bug fixes.
We definitely recommend migrating to this version as soon as possible.
All current Redux functionally can also be achieved with the standalone version.

### Example 1: Init action
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

### Example 2: Register a custom renderer
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
### Example 3: Listen to data and validation changes
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

## Case 2: Use the Redux fallback

If you want to keep using the Redux variant of JSON Forms for now (which is not recommended), you have to change a few import paths.

The new imports are available at `@jsonforms/react/lib/redux`, i.e.

```ts
import { jsonformsReducer, JsonFormsReduxProvider } from '@jsonforms/react/lib/redux';
```

# Migrating from JSON Forms 1.x (AngularJS 1.x)
The complexity of the migration of an existing JSON Forms 1.x application, which is based on AngularJS, to JSON Forms 2.x depends on the feature set you use.

## Architectural changes in JSON Forms 2.x
There are two big changes between JSON Forms 1 and JSON Forms 2 you need to understand when migrating your existing application.

1. JSON Forms 2.x does not rely on any specific UI framework [or library]. The `2.0.0` initial release featured renderers based on [React](https://reactjs.org). An [Angular](https://angular.io) based renderer set was released with `2.1.0`.

2. Since JSON Forms 2.x maintains its internal state via [redux](https://redux.js.org/), you will need to add it as a dependency to your application.

## Steps for upgrading your application to JSON Forms 2.x

### Step 1: Update your UI schemata
There is only one minor change in the UI schemata. The UI Schema for controls was simplified and the bulky `ref` object inside `scope` was removed.

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

### Step 2: Use JSON Forms 2.x in your application
As JSON Forms 2 does not rely on any specific UI framework or library you can choose which renderer set you want to use. The React Material renderer set is the most polished one at the moment, followed by Angular Material and the Vanilla renderer sets.

#### Use with React
Please refer to the React [Tutorial](http://jsonforms.io/docs/tutorial).

### Step 3: Migrate Custom Renderers
Any custom renderer needs to be re-factored to conform to the new custom renderer style in JSON Forms 2.x. You can find instructions how to implement Custom controls based on React [here](http://jsonforms.io/docs/custom-renderers). While you need to change a lot except for the template, the good news it that writing custom renderers became much simpler in JSON Forms 2 since the framework will trigger rendering and re-rendering in case of changes to the data or other state. In many cases this means you will be able to streamline your code for custom renderers significantly.
